export interface Project {
  id: string;
  name: string;
  description: string;
  files: ProjectFile[];
  createdAt: string;
}

export interface ProjectFile {
  id: string;
  name: string;
  path: string;
  content: string;
  language: string;
}

export interface ExecutionStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  timestamp: string;
}

export interface PromptSubmission {
  prompt: string;
  timestamp: string;
}

export interface FileItem {
  name: string;
  type: 'file' | 'folder';
  children?: FileItem[];
  content?: string;
  path: string;
}

export interface FileViewerProps {
  file: FileItem | null;
  onClose: () => void;
}