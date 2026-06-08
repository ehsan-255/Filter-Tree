import { describe, it, expect } from 'vitest';
import { resolve } from 'path';
import { loadConfig, getPreset, listPresets } from '../src/config.js';

describe('Configuration & Presets Loader', () => {
  const rootConfigPath = resolve(__dirname, '../../../ftree.yaml');

  it('should load root ftree.yaml without errors', async () => {
    const config = await loadConfig(rootConfigPath);
    expect(config).toBeDefined();
    expect(config.version).toBe('1.0');
    expect(config.presets).toBeDefined();
    expect(config.aliases).toBeDefined();
  });

  it('should list all the new comprehensive presets', async () => {
    const config = await loadConfig(rootConfigPath);
    const presets = Object.keys(config.presets);

    const expectedPresets = [
      'recent-docs',
      'source',
      'frontend',
      'backend',
      'database',
      'tests',
      'large-files',
      'configs',
      'assets',
      'readmes',
      'ai-docs',
      'git-changes',
      'empty-dirs',
      'secrets-leak-risk',
      'license-notice',
      'ci-cd',
      'packages-deps',
    ];

    expectedPresets.forEach((preset) => {
      expect(presets).toContain(preset);
    });
  });

  it('should list all the new comprehensive aliases', async () => {
    const config = await loadConfig(rootConfigPath);
    const aliases = Object.keys(config.aliases ?? {});

    const expectedAliases = [
      'ts',
      'js',
      'py',
      'go',
      'rs',
      'styles',
      'docs',
      'git',
      'env',
      'docker',
    ];

    expectedAliases.forEach((alias) => {
      expect(aliases).toContain(alias);
    });
  });

  it('should return all presets and aliases using listPresets', async () => {
    const config = await loadConfig(rootConfigPath);
    const allList = listPresets(config);
    expect(allList).toContain('source');
    expect(allList).toContain('docker');
  });

  it('should successfully merge presets with global defaults', async () => {
    const config = await loadConfig(rootConfigPath);
    const preset = getPreset(config, 'source');

    expect(preset).not.toBeNull();
    if (preset) {
      expect(preset.depth).toBe(5); // inherited from defaults
      expect(preset.output).toBe('markdown'); // inherited from defaults
      expect(preset.showSize).toBe(true); // inherited from defaults
      expect(preset.showDate).toBe(false); // inherited from defaults
      expect(preset.exclude).toContain('**/node_modules/**'); // inherited from defaults
      expect(preset.extensions).toContain('ts'); // defined in preset
    }
  });

  it('should successfully get and resolve aliases', async () => {
    const config = await loadConfig(rootConfigPath);
    const aliasPreset = getPreset(config, 'docker');

    expect(aliasPreset).not.toBeNull();
    if (aliasPreset) {
      expect(aliasPreset.depth).toBe(5); // inherited from defaults
      expect(aliasPreset.patterns).toContain('**/Dockerfile*'); // defined in alias
    }
  });
});
