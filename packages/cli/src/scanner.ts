// packages/cli/src/scanner.ts
// File system scanner with filtering logic

import { glob } from 'glob';
import { stat } from 'fs/promises';
import { join } from 'path';
import type { Preset, FileInfo } from './types.js';

/**
 * Parses a human-readable size string (e.g., "1KB", "500MB") to bytes
 */
export function parseSize(size: string): number {
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

/**
 * Parses a human-readable duration string (e.g., "7d", "2h") to milliseconds
 */
export function parseDuration(duration: string): number {
  const match = duration.match(/^(\d+)(h|d|w|m)$/);
  if (!match) return 0;
  const [, num, unit] = match;
  const multipliers: Record<string, number> = {
    h: 3600000, // hours
    d: 86400000, // days
    w: 604800000, // weeks
    m: 2592000000, // months (30 days)
  };
  return parseInt(num) * multipliers[unit];
}

/**
 * Scans a directory and returns files matching the preset filters
 */
export async function scanFiles(rootDir: string, preset: Partial<Preset>): Promise<FileInfo[]> {
  // Build glob pattern
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

  const ignore = preset.exclude ?? ['**/node_modules/**', '**/.git/**'];

  // Collect all matching paths
  const allPaths: string[] = [];
  for (const pattern of patterns) {
    const matches = await glob(pattern, {
      cwd: rootDir,
      ignore,
      nodir: preset.type === 'file',
      maxDepth: preset.depth,
      dot: true,
    });
    allPaths.push(...matches);
  }

  // Deduplicate
  const uniquePaths = [...new Set(allPaths)];

  // Get file stats
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
        return null; // Skip inaccessible files
      }
    })
  );

  // Filter out nulls and apply additional filters
  const validResults = results.filter((r): r is FileInfo => r !== null);
  return applyFilters(validResults, preset);
}

/**
 * Applies preset filters to a list of files
 */
export function applyFilters(files: FileInfo[], preset: Partial<Preset>): FileInfo[] {
  let result = files;

  // Filter by extension (if not already done via glob)
  if (preset.extensions?.length && !preset.patterns?.length && !preset.include?.length) {
    const exts = preset.extensions.map((e) => `.${e.toLowerCase()}`);
    result = result.filter(
      (f) => f.type === 'directory' || exts.some((ext) => f.path.toLowerCase().endsWith(ext))
    );
  }

  // Filter by file type
  if (preset.type && preset.type !== 'any') {
    result = result.filter((f) => f.type === preset.type);
  }

  // Filter by minimum size
  if (preset.minSize) {
    const min = parseSize(preset.minSize);
    result = result.filter((f) => f.type === 'directory' || f.size >= min);
  }

  // Filter by maximum size
  if (preset.maxSize) {
    const max = parseSize(preset.maxSize);
    result = result.filter((f) => f.type === 'directory' || f.size <= max);
  }

  // Filter by modified within duration
  if (preset.modifiedWithin) {
    const ms = parseDuration(preset.modifiedWithin);
    const cutoff = new Date(Date.now() - ms);
    result = result.filter((f) => f.modified >= cutoff);
  }

  // Sort results
  if (preset.sortBy) {
    result = sortFiles(result, preset.sortBy);
  }

  return result;
}

/**
 * Sorts files by the specified criteria
 */
export function sortFiles(
  files: FileInfo[],
  sortBy: 'name' | 'size-asc' | 'size-desc' | 'date-asc' | 'date-desc'
): FileInfo[] {
  const sorted = [...files];

  switch (sortBy) {
    case 'name':
      sorted.sort((a, b) => a.path.localeCompare(b.path));
      break;
    case 'size-asc':
      sorted.sort((a, b) => a.size - b.size);
      break;
    case 'size-desc':
      sorted.sort((a, b) => b.size - a.size);
      break;
    case 'date-asc':
      sorted.sort((a, b) => a.modified.getTime() - b.modified.getTime());
      break;
    case 'date-desc':
      sorted.sort((a, b) => b.modified.getTime() - a.modified.getTime());
      break;
  }

  return sorted;
}
