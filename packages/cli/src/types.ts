// packages/cli/src/types.ts
// Core type definitions for ftree

export interface FtreeConfig {
  version: string;
  defaults?: FilterDefaults;
  presets: Record<string, Preset>;
  aliases?: Record<string, Partial<Preset>>;
}

export interface FilterDefaults {
  depth?: number;
  output?: OutputFormat;
  showSize?: boolean;
  showDate?: boolean;
  exclude?: string[];
}

export interface Preset {
  description?: string;
  include?: string[];
  exclude?: string[];
  extensions?: string[];
  patterns?: string[];
  minSize?: string;
  maxSize?: string;
  modifiedWithin?: string;
  modifiedAfter?: string;
  type?: 'file' | 'directory' | 'any';
  depth?: number;
  output?: OutputFormat;
  sortBy?: SortOption;
  showSize?: boolean;
  showDate?: boolean;
  empty?: boolean;
  gitStatus?: GitStatus[];
}

export type OutputFormat = 'markdown' | 'ascii' | 'json' | 'paths';
export type SortOption = 'name' | 'size-asc' | 'size-desc' | 'date-asc' | 'date-desc';
export type GitStatus = 'modified' | 'added' | 'untracked' | 'deleted';

export interface TreeNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number;
  modified?: Date;
  children?: TreeNode[];
}

export interface FileInfo {
  path: string;
  size: number;
  modified: Date;
  type: 'file' | 'directory';
}

export interface ScanResult {
  preset: string;
  count: number;
  tree: TreeNode;
  files: FileInfo[];
}
