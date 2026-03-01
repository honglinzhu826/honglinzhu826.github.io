export interface FileNode {
  name: string;
  path: string;
  is_dir: boolean;
  children?: FileNode[];
}

export interface GitStatus {
  modified: string[];
  added: string[];
  deleted: string[];
  untracked: string[];
}

export interface ProjectConfig {
  path: string;
}

export interface NewFileRequest {
  content_type: 'blog' | 'thoughts';
  language: 'zh' | 'en';
  title: string;
  description?: string;
}

export type ContentType = 'blog' | 'thoughts' | 'resume';

export interface EditorState {
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
}
