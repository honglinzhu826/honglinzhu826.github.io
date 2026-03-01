import { create } from 'zustand';
import { invoke } from '@tauri-apps/api/core';
import { FileNode, GitStatus, ProjectConfig, NewFileRequest } from '../types';

interface EditorStore {
  // State
  projectPath: string | null;
  currentFile: string | null;
  currentContent: string;
  originalContent: string;
  fileTree: FileNode | null;
  gitStatus: GitStatus | null;
  lastSyncTime: string | null;
  isDirty: boolean;
  isLoading: boolean;
  error: string | null;
  showPreview: boolean;

  // Actions
  setProjectPath: (path: string | null) => void;
  setCurrentFile: (file: string | null) => void;
  setCurrentContent: (content: string) => void;
  setShowPreview: (show: boolean) => void;
  clearError: () => void;

  // Async actions
  loadProjectConfig: () => Promise<void>;
  saveProjectConfig: (path: string) => Promise<void>;
  validateAndSetProject: (path: string) => Promise<boolean>;
  loadFileTree: () => Promise<void>;
  loadFile: (path: string) => Promise<void>;
  saveFile: () => Promise<void>;
  createNewFile: (request: NewFileRequest) => Promise<string | null>;
  refreshGitStatus: () => Promise<void>;
  publishChanges: (message: string) => Promise<void>;
}

export const useEditorStore = create<EditorStore>((set, get) => ({
  // Initial state
  projectPath: null,
  currentFile: null,
  currentContent: '',
  originalContent: '',
  fileTree: null,
  gitStatus: null,
  lastSyncTime: null,
  isDirty: false,
  isLoading: false,
  error: null,
  showPreview: true,

  // Actions
  setProjectPath: (path) => set({ projectPath: path }),

  setCurrentFile: (file) => {
    const { currentFile, isDirty, currentContent, originalContent } = get();

    // If switching from a dirty file, save it first
    if (currentFile && isDirty && currentContent !== originalContent) {
      get().saveFile();
    }

    set({ currentFile: file, currentContent: '', originalContent: '', isDirty: false });

    if (file) {
      get().loadFile(file);
    }
  },

  setCurrentContent: (content) => {
    const { originalContent } = get();
    set({
      currentContent: content,
      isDirty: content !== originalContent,
    });
  },

  setShowPreview: (show) => set({ showPreview: show }),

  clearError: () => set({ error: null }),

  // Async actions
  loadProjectConfig: async () => {
    try {
      const config: ProjectConfig | null = await invoke('load_project_config');
      if (config && config.path) {
        const isValid = await get().validateAndSetProject(config.path);
        if (isValid) {
          await get().loadFileTree();
          await get().refreshGitStatus();
        }
      }
    } catch (err) {
      console.error('Failed to load project config:', err);
    }
  },

  saveProjectConfig: async (path) => {
    try {
      await invoke('save_project_config', { config: { path } });
    } catch (err) {
      console.error('Failed to save project config:', err);
    }
  },

  validateAndSetProject: async (path) => {
    set({ isLoading: true, error: null });
    try {
      const isValid: boolean = await invoke('validate_project', { path });
      if (isValid) {
        set({ projectPath: path });
        await get().saveProjectConfig(path);
        return true;
      } else {
        set({ error: 'Invalid project path. Please select a valid Astro blog project.' });
        return false;
      }
    } catch (err) {
      set({ error: String(err) });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  loadFileTree: async () => {
    const { projectPath } = get();
    if (!projectPath) return;

    set({ isLoading: true });
    try {
      const tree: FileNode = await invoke('get_file_tree', { projectPath });
      set({ fileTree: tree });
    } catch (err) {
      set({ error: String(err) });
    } finally {
      set({ isLoading: false });
    }
  },

  loadFile: async (path) => {
    const { projectPath } = get();
    if (!projectPath) return;

    set({ isLoading: true });
    try {
      const content: string = await invoke('read_file', {
        projectPath,
        relativePath: path,
      });
      set({
        currentContent: content,
        originalContent: content,
        isDirty: false,
      });
    } catch (err) {
      set({ error: String(err) });
    } finally {
      set({ isLoading: false });
    }
  },

  saveFile: async () => {
    const { projectPath, currentFile, currentContent } = get();
    if (!projectPath || !currentFile) return;

    set({ isLoading: true });
    try {
      await invoke('write_file', {
        projectPath,
        relativePath: currentFile,
        content: currentContent,
      });
      set({
        originalContent: currentContent,
        isDirty: false,
      });
      await get().refreshGitStatus();
    } catch (err) {
      set({ error: String(err) });
    } finally {
      set({ isLoading: false });
    }
  },

  createNewFile: async (request) => {
    const { projectPath } = get();
    if (!projectPath) return null;

    set({ isLoading: true });
    try {
      const relativePath: string = await invoke('create_new_file', {
        projectPath,
        request,
      });
      await get().loadFileTree();
      await get().refreshGitStatus();
      return relativePath;
    } catch (err) {
      set({ error: String(err) });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  refreshGitStatus: async () => {
    const { projectPath } = get();
    if (!projectPath) return;

    try {
      const status: GitStatus = await invoke('get_git_status', { projectPath });
      const lastSync: string | null = await invoke('get_last_sync_time', { projectPath });
      set({
        gitStatus: status,
        lastSyncTime: lastSync,
      });
    } catch (err) {
      console.error('Failed to get git status:', err);
    }
  },

  publishChanges: async (message) => {
    const { projectPath } = get();
    if (!projectPath) return;

    // Save current file first if dirty
    const { isDirty } = get();
    if (isDirty) {
      await get().saveFile();
    }

    set({ isLoading: true });
    try {
      await invoke('publish_changes', { projectPath, message });
      await get().refreshGitStatus();
    } catch (err) {
      set({ error: String(err) });
    } finally {
      set({ isLoading: false });
    }
  },
}));
