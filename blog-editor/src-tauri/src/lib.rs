use serde::{Deserialize, Serialize};
use std::fs;
use std::path::Path;
use tauri::{AppHandle, Manager};

// Types
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct FileNode {
    pub name: String,
    pub path: String,
    pub is_dir: bool,
    pub children: Option<Vec<FileNode>>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct FileContent {
    pub path: String,
    pub content: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct GitStatus {
    pub modified: Vec<String>,
    pub added: Vec<String>,
    pub deleted: Vec<String>,
    pub untracked: Vec<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ProjectConfig {
    pub path: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct NewFileRequest {
    pub content_type: String, // "blog" or "thoughts"
    pub language: String,     // "zh" or "en"
    pub title: String,
    pub description: Option<String>,
}

// Project validation
#[tauri::command]
async fn validate_project(path: String) -> Result<bool, String> {
    let path = Path::new(&path);

    // Check for astro.config.mjs
    if !path.join("astro.config.mjs").exists() {
        return Ok(false);
    }

    // Check for src/content/ directory
    if !path.join("src/content").exists() {
        return Ok(false);
    }

    // Check package.json for astro dependency
    let package_json_path = path.join("package.json");
    if package_json_path.exists() {
        if let Ok(content) = fs::read_to_string(package_json_path) {
            if content.contains("astro") {
                return Ok(true);
            }
        }
    }

    Ok(false)
}

// Get file tree for blog content
#[tauri::command]
async fn get_file_tree(project_path: String) -> Result<FileNode, String> {
    let content_path = Path::new(&project_path).join("src/content");

    if !content_path.exists() {
        return Err("Content directory not found".to_string());
    }

    fn build_tree(path: &Path, base_path: &Path) -> Result<FileNode, String> {
        let name = path
            .file_name()
            .unwrap_or_default()
            .to_string_lossy()
            .to_string();

        let relative_path = path
            .strip_prefix(base_path.parent().unwrap_or(base_path))
            .unwrap_or(path)
            .to_string_lossy()
            .to_string();

        let metadata = fs::metadata(path).map_err(|e| e.to_string())?;
        let is_dir = metadata.is_dir();

        let children = if is_dir {
            let mut children = Vec::new();
            for entry in fs::read_dir(path).map_err(|e| e.to_string())? {
                let entry = entry.map_err(|e| e.to_string())?;
                let child_path = entry.path();

                // Skip hidden files and node_modules
                if let Some(name) = child_path.file_name() {
                    let name_str = name.to_string_lossy();
                    if name_str.starts_with('.') || name_str == "node_modules" {
                        continue;
                    }
                }

                // Only include .md files and directories
                if child_path.is_dir() || child_path.extension().map(|e| e == "md").unwrap_or(false)
                {
                    if let Ok(child) = build_tree(&child_path, base_path) {
                        children.push(child);
                    }
                }
            }
            children.sort_by(|a, b| {
                // Directories come first
                match (a.is_dir, b.is_dir) {
                    (true, false) => std::cmp::Ordering::Less,
                    (false, true) => std::cmp::Ordering::Greater,
                    _ => a.name.cmp(&b.name),
                }
            });
            Some(children)
        } else {
            None
        };

        Ok(FileNode {
            name,
            path: relative_path,
            is_dir,
            children,
        })
    }

    build_tree(&content_path, &content_path)
}

// Read file content
#[tauri::command]
async fn read_file(project_path: String, relative_path: String) -> Result<String, String> {
    let full_path = Path::new(&project_path).join(&relative_path);

    if !full_path.exists() {
        return Err("File not found".to_string());
    }

    fs::read_to_string(&full_path).map_err(|e| e.to_string())
}

// Write file content
#[tauri::command]
async fn write_file(project_path: String, relative_path: String, content: String) -> Result<(), String> {
    let full_path = Path::new(&project_path).join(&relative_path);

    // Ensure parent directory exists
    if let Some(parent) = full_path.parent() {
        fs::create_dir_all(parent).map_err(|e| e.to_string())?;
    }

    fs::write(&full_path, content).map_err(|e| e.to_string())
}

// Generate slug from title
fn slugify(title: &str) -> String {
    title
        .to_lowercase()
        .replace(|c: char| !c.is_alphanumeric() && c != '-', "-")
        .replace("--", "-")
        .trim_matches('-')
        .to_string()
}

// Create new file with frontmatter
#[tauri::command]
async fn create_new_file(
    project_path: String,
    request: NewFileRequest,
) -> Result<String, String> {
    let today = chrono::Local::now().format("%Y-%m-%d").to_string();
    let slug = slugify(&request.title);

    // Limit slug length
    let slug = if slug.len() > 50 {
        slug[..50].to_string()
    } else {
        slug
    };

    let filename = format!("{}.md", slug);
    let relative_path = format!(
        "src/content/{}/{}/{}",
        request.content_type, request.language, filename
    );
    let full_path = Path::new(&project_path).join(&relative_path);

    // Ensure directory exists
    if let Some(parent) = full_path.parent() {
        fs::create_dir_all(parent).map_err(|e| e.to_string())?;
    }

    // Generate frontmatter based on content type
    let content = match request.content_type.as_str() {
        "blog" => {
            let desc = request.description.unwrap_or_default();
            format!(
                r#"---
title: "{}"
description: "{}"
pubDate: {}
tags: []
draft: true
---

# {}
"#,
                request.title, desc, today, request.title
            )
        }
        "thoughts" => {
            format!(
                r#"---
title: "{}"
pubDate: {}
---

"#,
                request.title, today
            )
        }
        _ => return Err("Invalid content type".to_string()),
    };

    fs::write(&full_path, content).map_err(|e| e.to_string())?;

    Ok(relative_path)
}

// Get Git status
#[tauri::command]
async fn get_git_status(project_path: String) -> Result<GitStatus, String> {
    let repo = git2::Repository::open(&project_path)
        .map_err(|e| format!("Failed to open repository: {}", e))?;

    let mut modified = Vec::new();
    let mut added = Vec::new();
    let mut deleted = Vec::new();
    let mut untracked = Vec::new();

    let statuses = repo
        .statuses(None)
        .map_err(|e| format!("Failed to get status: {}", e))?;

    for entry in statuses.iter() {
        let status = entry.status();
        let path = entry
            .path()
            .map(|p| p.to_string())
            .unwrap_or_default();

        if status.is_index_new() || status.is_wt_new() {
            if status.is_index_new() {
                added.push(path);
            } else {
                untracked.push(path);
            }
        } else if status.is_index_deleted() || status.is_wt_deleted() {
            deleted.push(path);
        } else if status.is_index_modified()
            || status.is_wt_modified()
            || status.is_index_renamed()
            || status.is_wt_renamed()
        {
            modified.push(path);
        }
    }

    Ok(GitStatus {
        modified,
        added,
        deleted,
        untracked,
    })
}

// Publish changes (git add, commit, push)
#[tauri::command]
async fn publish_changes(project_path: String, message: String) -> Result<(), String> {
    let repo = git2::Repository::open(&project_path)
        .map_err(|e| format!("Failed to open repository: {}", e))?;

    // Get signature
    let config = repo.config().map_err(|e| e.to_string())?;
    let name = config
        .get_string("user.name")
        .unwrap_or_else(|_| "Blog Editor".to_string());
    let email = config
        .get_string("user.email")
        .unwrap_or_else(|_| "editor@localhost".to_string());
    let signature = git2::Signature::now(&name, &email).map_err(|e| e.to_string())?;

    // Add all changes
    let mut index = repo.index().map_err(|e| e.to_string())?;
    index
        .add_all(["*"].iter(), git2::IndexAddOption::DEFAULT, None)
        .map_err(|e| format!("Failed to add files: {}", e))?;
    index.write().map_err(|e| e.to_string())?;

    // Create commit
    let tree_id = index.write_tree().map_err(|e| e.to_string())?;
    let tree = repo.find_tree(tree_id).map_err(|e| e.to_string())?;

    let parent_commit = match repo.head() {
        Ok(head) => {
            let oid = head.target().ok_or("No target")?;
            repo.find_commit(oid).map_err(|e| e.to_string())?
        }
        Err(_) => return Err("No HEAD commit found".to_string()),
    };

    repo.commit(
        Some("HEAD"),
        &signature,
        &signature,
        &message,
        &tree,
        &[&parent_commit],
    )
    .map_err(|e| format!("Failed to commit: {}", e))?;

    // Push to origin
    let mut remote = repo
        .find_remote("origin")
        .map_err(|e| format!("No origin remote: {}", e))?;

    let mut callbacks = git2::RemoteCallbacks::new();
    callbacks.credentials(|_url, username_from_url, _allowed_types| {
        git2::Cred::ssh_key_from_agent(username_from_url.unwrap_or("git"))
    });

    let mut push_options = git2::PushOptions::new();
    push_options.remote_callbacks(callbacks);

    remote
        .push(&["refs/heads/main:refs/heads/main"], Some(&mut push_options))
        .map_err(|e| format!("Failed to push: {}", e))?;

    Ok(())
}

// Get last commit time
#[tauri::command]
async fn get_last_sync_time(project_path: String) -> Result<Option<String>, String> {
    let repo = git2::Repository::open(&project_path)
        .map_err(|e| format!("Failed to open repository: {}", e))?;

    // Get the oid first, then drop the head reference
    let oid = match repo.head() {
        Ok(head) => head.target(),
        Err(_) => return Ok(None),
    };

    let oid = match oid {
        Some(oid) => oid,
        None => return Err("No target".to_string()),
    };

    let commit = repo.find_commit(oid).map_err(|e| e.to_string())?;
    let time = commit.time();
    let datetime = chrono::DateTime::from_timestamp(time.seconds(), 0)
        .ok_or("Invalid timestamp")?;
    Ok(Some(datetime.format("%Y-%m-%d %H:%M:%S").to_string()))
}

// Get app data directory
#[tauri::command]
async fn get_app_data_dir(app_handle: AppHandle) -> Result<String, String> {
    let path = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| e.to_string())?;
    Ok(path.to_string_lossy().to_string())
}

// Save project config
#[tauri::command]
async fn save_project_config(
    app_handle: AppHandle,
    config: ProjectConfig,
) -> Result<(), String> {
    let app_data_dir = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| e.to_string())?;

    fs::create_dir_all(&app_data_dir).map_err(|e| e.to_string())?;

    let config_path = app_data_dir.join("config.json");
    let config_json = serde_json::to_string(&config).map_err(|e| e.to_string())?;
    fs::write(config_path, config_json).map_err(|e| e.to_string())?;

    Ok(())
}

// Load project config
#[tauri::command]
async fn load_project_config(app_handle: AppHandle) -> Result<Option<ProjectConfig>, String> {
    let app_data_dir = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| e.to_string())?;

    let config_path = app_data_dir.join("config.json");

    if !config_path.exists() {
        return Ok(None);
    }

    let config_json = fs::read_to_string(config_path).map_err(|e| e.to_string())?;
    let config: ProjectConfig = serde_json::from_str(&config_json).map_err(|e| e.to_string())?;

    Ok(Some(config))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            validate_project,
            get_file_tree,
            read_file,
            write_file,
            create_new_file,
            get_git_status,
            publish_changes,
            get_last_sync_time,
            get_app_data_dir,
            save_project_config,
            load_project_config,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
