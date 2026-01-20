// packages/cli/src/formatter.ts
// Tree output formatters (markdown, ASCII, JSON, paths)

import type { TreeNode, FileInfo, OutputFormat } from './types.js';

/**
 * Builds a tree structure from a flat list of file paths
 */
export function buildTree(files: FileInfo[]): TreeNode {
  const root: TreeNode = {
    name: '.',
    path: '.',
    type: 'directory',
    children: [],
  };

  // Sort files so directories come first, then by path
  const sorted = [...files].sort((a, b) => {
    if (a.type !== b.type) return a.type === 'directory' ? -1 : 1;
    return a.path.localeCompare(b.path);
  });

  for (const file of sorted) {
    const parts = file.path.split(/[/\\]/).filter((p) => p);
    let current = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isLast = i === parts.length - 1;
      const partPath = parts.slice(0, i + 1).join('/');

      let child = current.children?.find((c) => c.name === part);

      if (!child) {
        child = {
          name: part,
          path: partPath,
          type: isLast ? file.type : 'directory',
          size: isLast ? file.size : undefined,
          modified: isLast ? file.modified : undefined,
          children: isLast && file.type === 'file' ? undefined : [],
        };
        current.children = current.children ?? [];
        current.children.push(child);
      }

      current = child;
    }
  }

  return root;
}

/**
 * Formats bytes into human-readable size
 */
export function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
}

/**
 * Formats a date relative to now
 */
export function formatRelativeDate(date: Date): string {
  const now = Date.now();
  const diff = now - date.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;
  return date.toLocaleDateString();
}

interface FormatOptions {
  showSize?: boolean;
  showDate?: boolean;
}

/**
 * Formats tree as markdown with emoji icons
 */
export function formatMarkdown(node: TreeNode, opts: FormatOptions = {}, prefix = ''): string {
  const lines: string[] = [];
  const children = node.children ?? [];

  // Sort: directories first, then files
  const sorted = [...children].sort((a, b) => {
    if (a.type !== b.type) return a.type === 'directory' ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  for (let i = 0; i < sorted.length; i++) {
    const child = sorted[i];
    const isLast = i === sorted.length - 1;
    const connector = isLast ? '└── ' : '├── ';
    const icon = child.type === 'directory' ? '📁' : '📄';

    let line = `${prefix}${connector}${icon} ${child.name}`;

    const meta: string[] = [];
    if (opts.showSize && child.size !== undefined) {
      meta.push(formatSize(child.size));
    }
    if (opts.showDate && child.modified) {
      meta.push(formatRelativeDate(child.modified));
    }
    if (meta.length > 0) {
      line += ` (${meta.join(', ')})`;
    }

    lines.push(line);

    if (child.children?.length) {
      const newPrefix = prefix + (isLast ? '    ' : '│   ');
      lines.push(formatMarkdown(child, opts, newPrefix));
    }
  }

  return lines.join('\n');
}

/**
 * Formats tree as ASCII (no emoji)
 */
export function formatAscii(node: TreeNode, opts: FormatOptions = {}, prefix = ''): string {
  const lines: string[] = [];
  const children = node.children ?? [];

  const sorted = [...children].sort((a, b) => {
    if (a.type !== b.type) return a.type === 'directory' ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  for (let i = 0; i < sorted.length; i++) {
    const child = sorted[i];
    const isLast = i === sorted.length - 1;
    const connector = isLast ? '\\-- ' : '+-- ';
    const typeIndicator = child.type === 'directory' ? '[D] ' : '';

    let line = `${prefix}${connector}${typeIndicator}${child.name}`;

    const meta: string[] = [];
    if (opts.showSize && child.size !== undefined) {
      meta.push(formatSize(child.size));
    }
    if (opts.showDate && child.modified) {
      meta.push(formatRelativeDate(child.modified));
    }
    if (meta.length > 0) {
      line += ` (${meta.join(', ')})`;
    }

    lines.push(line);

    if (child.children?.length) {
      const newPrefix = prefix + (isLast ? '    ' : '|   ');
      lines.push(formatAscii(child, opts, newPrefix));
    }
  }

  return lines.join('\n');
}

/**
 * Formats tree as JSON
 */
export function formatJson(node: TreeNode): string {
  return JSON.stringify(
    node,
    (key, value) => {
      if (key === 'modified' && value instanceof Date) {
        return value.toISOString();
      }
      return value;
    },
    2
  );
}

/**
 * Formats as simple paths list
 */
export function formatPaths(files: FileInfo[]): string {
  return files.map((f) => f.path).join('\n');
}

/**
 * Main format function - dispatches to the appropriate formatter
 */
export function format(
  tree: TreeNode,
  files: FileInfo[],
  type: OutputFormat = 'markdown',
  opts: FormatOptions = {}
): string {
  switch (type) {
    case 'markdown':
      return formatMarkdown(tree, opts);
    case 'ascii':
      return formatAscii(tree, opts);
    case 'json':
      return formatJson(tree);
    case 'paths':
      return formatPaths(files);
    default:
      return formatMarkdown(tree, opts);
  }
}

/**
 * Counts total items in tree
 */
export function countItems(node: TreeNode): {
  files: number;
  directories: number;
} {
  let files = 0;
  let directories = 0;

  function walk(n: TreeNode) {
    if (n.type === 'file') files++;
    else if (n.path !== '.') directories++;
    n.children?.forEach(walk);
  }

  walk(node);
  return { files, directories };
}
