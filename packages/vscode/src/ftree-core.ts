// packages/vscode/src/ftree-core.ts
// Core ftree functionality for VS Code extension
// This module duplicates the CLI logic to avoid bundling issues

import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import * as yaml from 'js-yaml';
import { glob } from 'glob';
import { stat } from 'fs/promises';

// Types
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
  type?: 'file' | 'directory' | 'any';
  depth?: number;
  output?: OutputFormat;
  sortBy?: 'name' | 'size-asc' | 'size-desc' | 'date-asc' | 'date-desc';
  showSize?: boolean;
  showDate?: boolean;
}

export type OutputFormat = 'markdown' | 'ascii' | 'json' | 'paths';

export interface FileInfo {
  path: string;
  size: number;
  modified: Date;
  type: 'file' | 'directory';
}

export interface TreeNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number;
  modified?: Date;
  children?: TreeNode[];
}

// Config functions
const CONFIG_NAMES = ['ftree.yaml', 'ftree.yml', '.ftreerc.yaml', '.ftreerc.yml'];

export async function findConfigFile(startDir: string): Promise<string | null> {
  let current = startDir;

  while (current !== dirname(current)) {
    for (const name of CONFIG_NAMES) {
      const candidate = join(current, name);
      if (existsSync(candidate)) return candidate;
    }
    current = dirname(current);
  }
  return null;
}

export async function loadConfig(path: string): Promise<FtreeConfig> {
  const content = await readFile(path, 'utf-8');
  const parsed = yaml.load(content) as FtreeConfig;

  if (!parsed?.version || !parsed?.presets) {
    throw new Error('Invalid ftree config: missing version or presets');
  }

  return parsed;
}

export function getPresetNames(config: FtreeConfig): string[] {
  return Object.keys(config.presets);
}

// Scanner functions
function parseSize(size: string): number {
  const match = size.match(/^(\d+(?:\.\d+)?)\s*(B|KB|MB|GB)?$/i);
  if (!match) return 0;
  const [, num, unit = 'B'] = match;
  const multipliers: Record<string, number> = {
    B: 1,
    KB: 1024,
    MB: 1024 ** 2,
    GB: 1024 ** 3,
  };
  return parseFloat(num) * multipliers[unit.toUpperCase()];
}

function parseDuration(duration: string): number {
  const match = duration.match(/^(\d+)(h|d|w|m)$/);
  if (!match) return 0;
  const [, num, unit] = match;
  const multipliers: Record<string, number> = {
    h: 3600000,
    d: 86400000,
    w: 604800000,
    m: 2592000000,
  };
  return parseInt(num) * multipliers[unit];
}

export async function scanFiles(rootDir: string, preset: Partial<Preset>): Promise<FileInfo[]> {
  let patterns: string[];
  if (preset.patterns?.length) {
    patterns = preset.patterns;
  } else if (preset.include?.length) {
    patterns = preset.include;
  } else if (preset.extensions?.length) {
    patterns = preset.extensions.map((ext) => `**/*.${ext}`);
  } else {
    patterns = ['**/*'];
  }

  const ignore = [...(preset.exclude ?? []), '**/node_modules/**', '**/.git/**'];

  const allPaths: string[] = [];
  for (const pattern of patterns) {
    const matches = await glob(pattern, {
      cwd: rootDir,
      ignore,
      maxDepth: preset.depth,
      dot: true,
    });
    allPaths.push(...matches);
  }

  const uniquePaths = [...new Set(allPaths)];

  const results = await Promise.all(
    uniquePaths.map(async (p): Promise<FileInfo | null> => {
      try {
        const fullPath = join(rootDir, p);
        const stats = await stat(fullPath);
        return {
          path: p,
          size: stats.size,
          modified: stats.mtime,
          type: stats.isDirectory() ? 'directory' : 'file',
        };
      } catch {
        return null;
      }
    })
  );

  let files = results.filter((r): r is FileInfo => r !== null);

  // Apply filters
  if (preset.type && preset.type !== 'any') files = files.filter((f) => f.type === preset.type);
  if (preset.minSize) {
    const min = parseSize(preset.minSize);
    files = files.filter((f) => f.size >= min);
  }
  if (preset.maxSize) {
    const max = parseSize(preset.maxSize);
    files = files.filter((f) => f.size <= max);
  }
  if (preset.modifiedWithin) {
    const cutoff = new Date(Date.now() - parseDuration(preset.modifiedWithin));
    files = files.filter((f) => f.modified >= cutoff);
  }

  return files;
}

// Formatter functions
export function buildTree(files: FileInfo[]): TreeNode {
  const root: TreeNode = {
    name: '.',
    path: '.',
    type: 'directory',
    children: [],
  };

  for (const file of files.sort((a, b) => a.path.localeCompare(b.path))) {
    const parts = file.path.split(/[/\\]/).filter((p) => p);
    let current = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isLast = i === parts.length - 1;

      let child = current.children?.find((c) => c.name === part);
      if (!child) {
        child = {
          name: part,
          path: parts.slice(0, i + 1).join('/'),
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

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
}

export function format(
  node: TreeNode,
  files: FileInfo[],
  type: OutputFormat = 'markdown',
  opts: { showSize?: boolean; showDate?: boolean } = {}
): string {
  if (type === 'json') return JSON.stringify(node, null, 2);
  if (type === 'paths') return files.map((f) => f.path).join('\n');

  const lines: string[] = [];
  const children = (node.children ?? []).sort((a, b) => {
    if (a.type !== b.type) return a.type === 'directory' ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  function walk(children: TreeNode[], prefix: string) {
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      const isLast = i === children.length - 1;
      const connector = isLast ? '└── ' : '├── ';
      const icon = type === 'ascii' ? '' : child.type === 'directory' ? '📁 ' : '📄 ';

      let line = `${prefix}${connector}${icon}${child.name}`;
      if (opts.showSize && child.size !== undefined) line += ` (${formatSize(child.size)})`;
      lines.push(line);

      if (child.children?.length) {
        walk(
          child.children.sort((a, b) => {
            if (a.type !== b.type) return a.type === 'directory' ? -1 : 1;
            return a.name.localeCompare(b.name);
          }),
          prefix + (isLast ? '    ' : '│   ')
        );
      }
    }
  }

  walk(children, '');
  return lines.join('\n');
}

// Main runner
export async function runPreset(rootDir: string, presetName: string): Promise<string> {
  const configPath = await findConfigFile(rootDir);
  if (!configPath) throw new Error('No ftree.yaml found');

  const config = await loadConfig(configPath);
  const preset = config.presets[presetName];
  if (!preset) throw new Error(`Preset "${presetName}" not found`);

  const merged = { ...config.defaults, ...preset };
  const files = await scanFiles(rootDir, merged);
  const tree = buildTree(files);
  const output = format(tree, files, merged.output ?? 'markdown', {
    showSize: merged.showSize ?? true,
  });

  const fileCount = files.filter((f) => f.type === 'file').length;
  const dirCount = files.filter((f) => f.type === 'directory').length;

  return `## 🌲 Filter: \`${presetName}\` (${fileCount} files, ${dirCount} dirs)\n\n\`\`\`\n${output}\n\`\`\`\n\n> Generated by ftree`;
}
