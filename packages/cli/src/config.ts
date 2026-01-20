// packages/cli/src/config.ts
// YAML config parser and validation

import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import yaml from 'js-yaml';
import type { FtreeConfig, Preset, FilterDefaults } from './types.js';

const CONFIG_NAMES = ['ftree.yaml', 'ftree.yml', '.ftreerc.yaml', '.ftreerc.yml'];

/**
 * Searches for a config file starting from startDir and walking up the directory tree
 */
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

/**
 * Loads and parses an ftree config file
 */
export async function loadConfig(path: string): Promise<FtreeConfig> {
  const content = await readFile(path, 'utf-8');
  const parsed = yaml.load(content) as FtreeConfig;

  // Basic validation
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Invalid config: not a valid YAML object');
  }

  if (!parsed.version) {
    throw new Error('Invalid config: missing version');
  }

  if (!parsed.presets || typeof parsed.presets !== 'object') {
    throw new Error('Invalid config: missing or invalid presets');
  }

  return parsed;
}

/**
 * Merges a preset with global defaults
 */
export function mergeWithDefaults(preset: Preset, defaults?: FilterDefaults): Preset {
  if (!defaults) return preset;

  return {
    depth: preset.depth ?? defaults.depth,
    output: preset.output ?? defaults.output,
    showSize: preset.showSize ?? defaults.showSize,
    showDate: preset.showDate ?? defaults.showDate,
    exclude: [...(defaults.exclude ?? []), ...(preset.exclude ?? [])],
    ...preset,
  };
}

/**
 * Gets a preset by name, resolving aliases
 */
export function getPreset(config: FtreeConfig, name: string): Preset | null {
  if (config.presets[name]) {
    return mergeWithDefaults(config.presets[name], config.defaults);
  }

  if (config.aliases?.[name]) {
    return mergeWithDefaults(config.aliases[name] as Preset, config.defaults);
  }

  return null;
}

/**
 * Lists all available preset names
 */
export function listPresets(config: FtreeConfig): string[] {
  const presets = Object.keys(config.presets);
  const aliases = Object.keys(config.aliases ?? {});
  return [...presets, ...aliases];
}
