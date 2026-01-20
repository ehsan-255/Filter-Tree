// packages/vscode/src/commands.ts
// Command handlers for Filter Tree extension

import * as vscode from 'vscode';
import { loadConfig, findConfigFile, runPreset, getPresetNames } from './ftree-core';

/**
 * Run a preset selected from Quick Pick
 */
export async function runPresetCommand(): Promise<void> {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) {
    vscode.window.showWarningMessage('No workspace folder open');
    return;
  }

  const configPath = await findConfigFile(workspaceFolder.uri.fsPath);
  if (!configPath) {
    const action = await vscode.window.showWarningMessage(
      'No ftree.yaml found. Create one?',
      'Create',
      'Cancel'
    );
    if (action === 'Create') {
      await vscode.commands.executeCommand('ftree.init');
    }
    return;
  }

  try {
    const config = await loadConfig(configPath);
    const presetNames = getPresetNames(config);

    if (presetNames.length === 0) {
      vscode.window.showWarningMessage('No presets defined in ftree.yaml');
      return;
    }

    // Build quick pick items with descriptions
    const items: vscode.QuickPickItem[] = presetNames.map((name) => ({
      label: name,
      description: config.presets[name]?.description || '',
    }));

    const selected = await vscode.window.showQuickPick(items, {
      placeHolder: 'Select a preset to run',
      title: '🌲 Filter Tree',
    });

    if (!selected) return;

    await runPresetByNameCommand(selected.label);
  } catch (error) {
    vscode.window.showErrorMessage(`Error: ${error instanceof Error ? error.message : error}`);
  }
}

/**
 * Run a specific preset by name (called from Code Lens)
 */
export async function runPresetByNameCommand(presetName: string): Promise<void> {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) return;

  try {
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: `Running preset: ${presetName}`,
        cancellable: false,
      },
      async () => {
        const result = await runPreset(workspaceFolder.uri.fsPath, presetName);

        // Create and show the result document
        const doc = await vscode.workspace.openTextDocument({
          content: result,
          language: 'markdown',
        });

        await vscode.window.showTextDocument(doc, {
          preview: true,
          viewColumn: vscode.ViewColumn.Beside,
        });
      }
    );
  } catch (error) {
    vscode.window.showErrorMessage(
      `Failed to run preset: ${error instanceof Error ? error.message : error}`
    );
  }
}

/**
 * Quick filter without config file
 */
export async function quickFilterCommand(): Promise<void> {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) {
    vscode.window.showWarningMessage('No workspace folder open');
    return;
  }

  // Quick pick for filter type
  const filterType = await vscode.window.showQuickPick(
    [
      {
        label: 'By Extension',
        description: 'Filter files by extension (e.g., ts, js, md)',
      },
      {
        label: 'Recent Files',
        description: 'Files modified within time period',
      },
      { label: 'Large Files', description: 'Files over a certain size' },
      { label: 'Custom', description: 'Enter custom filter' },
    ],
    { placeHolder: 'Select filter type' }
  );

  if (!filterType) return;

  let filterValue: string | undefined;

  switch (filterType.label) {
    case 'By Extension':
      filterValue = await vscode.window.showInputBox({
        prompt: 'Enter file extensions (comma-separated)',
        placeHolder: 'ts, js, tsx, jsx',
        value: 'ts, js',
      });
      if (filterValue) {
        await runQuickFilter(workspaceFolder.uri.fsPath, {
          extensions: filterValue.split(',').map((e) => e.trim()),
        });
      }
      break;

    case 'Recent Files': {
      const periods = ['1h', '6h', '1d', '7d', '30d'];
      const period = await vscode.window.showQuickPick(periods, {
        placeHolder: 'Select time period',
      });
      if (period) {
        await runQuickFilter(workspaceFolder.uri.fsPath, {
          modifiedWithin: period,
        });
      }
      break;
    }

    case 'Large Files': {
      const sizes = ['100KB', '500KB', '1MB', '5MB', '10MB'];
      const size = await vscode.window.showQuickPick(sizes, {
        placeHolder: 'Select minimum size',
      });
      if (size) {
        await runQuickFilter(workspaceFolder.uri.fsPath, { minSize: size });
      }
      break;
    }

    case 'Custom':
      filterValue = await vscode.window.showInputBox({
        prompt: 'Enter glob pattern',
        placeHolder: '**/*.config.*',
      });
      if (filterValue) {
        await runQuickFilter(workspaceFolder.uri.fsPath, {
          patterns: [filterValue],
        });
      }
      break;
  }
}

async function runQuickFilter(rootDir: string, preset: Record<string, unknown>): Promise<void> {
  try {
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: 'Running quick filter...',
        cancellable: false,
      },
      async () => {
        const { scanFiles, buildTree, format } = await import('./ftree-core');
        const files = await scanFiles(rootDir, preset);
        const tree = buildTree(files);
        const output = format(tree, files, 'markdown', { showSize: true });

        const result = `## 🌲 Quick Filter (${files.length} items)\n\n\`\`\`\n${output}\n\`\`\`\n\n> Generated by ftree`;

        const doc = await vscode.workspace.openTextDocument({
          content: result,
          language: 'markdown',
        });

        await vscode.window.showTextDocument(doc, {
          preview: true,
          viewColumn: vscode.ViewColumn.Beside,
        });
      }
    );
  } catch (error) {
    vscode.window.showErrorMessage(
      `Quick filter failed: ${error instanceof Error ? error.message : error}`
    );
  }
}

/**
 * Initialize ftree.yaml in workspace
 */
export async function initCommand(): Promise<void> {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) {
    vscode.window.showWarningMessage('No workspace folder open');
    return;
  }

  const configPath = vscode.Uri.joinPath(workspaceFolder.uri, 'ftree.yaml');

  try {
    // Check if already exists
    try {
      await vscode.workspace.fs.stat(configPath);
      const overwrite = await vscode.window.showWarningMessage(
        'ftree.yaml already exists. Overwrite?',
        'Overwrite',
        'Cancel'
      );
      if (overwrite !== 'Overwrite') return;
    } catch {
      // File doesn't exist, proceed
    }

    const template = `# ftree.yaml - Filter Tree Configuration
version: "1.0"

defaults:
  depth: 5
  output: markdown
  showSize: true
  exclude:
    - "**/node_modules/**"
    - "**/.git/**"
    - "**/dist/**"

presets:
  recent-docs:
    description: "Documentation modified in the last 7 days"
    extensions: [md, mdx, txt]
    modifiedWithin: 7d

  source:
    description: "Source code files"
    extensions: [ts, tsx, js, jsx, py, go, rs]
    exclude: ["**/test/**", "**/*.test.*"]

  large-files:
    description: "Files larger than 1MB"
    minSize: 1MB
    sortBy: size-desc

  configs:
    description: "Configuration files"
    patterns:
      - "**/.*rc"
      - "**/*.config.*"
      - "**/tsconfig*.json"
      - "**/package.json"

aliases:
  ts: { extensions: [ts, tsx] }
  docs: { extensions: [md, txt] }
`;

    await vscode.workspace.fs.writeFile(configPath, Buffer.from(template, 'utf-8'));

    // Open the new file
    const doc = await vscode.workspace.openTextDocument(configPath);
    await vscode.window.showTextDocument(doc);

    vscode.window.showInformationMessage('Created ftree.yaml');
  } catch (error) {
    vscode.window.showErrorMessage(
      `Failed to create config: ${error instanceof Error ? error.message : error}`
    );
  }
}

/**
 * Open the ftree.yaml config file
 */
export async function openConfigCommand(): Promise<void> {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) {
    vscode.window.showWarningMessage('No workspace folder open');
    return;
  }

  const configPath = await findConfigFile(workspaceFolder.uri.fsPath);
  if (!configPath) {
    const action = await vscode.window.showWarningMessage(
      'No ftree.yaml found. Create one?',
      'Create',
      'Cancel'
    );
    if (action === 'Create') {
      await vscode.commands.executeCommand('ftree.init');
    }
    return;
  }

  const doc = await vscode.workspace.openTextDocument(configPath);
  await vscode.window.showTextDocument(doc);
}

/**
 * Copy preset result to clipboard (called from Code Lens)
 */
export async function copyPresetResultCommand(presetName: string): Promise<void> {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) return;

  try {
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: `Copying preset: ${presetName}`,
        cancellable: false,
      },
      async () => {
        const result = await runPreset(workspaceFolder.uri.fsPath, presetName);
        await vscode.env.clipboard.writeText(result);
        vscode.window.showInformationMessage(`📋 Copied "${presetName}" result to clipboard`);
      }
    );
  } catch (error) {
    vscode.window.showErrorMessage(
      `Failed to copy: ${error instanceof Error ? error.message : error}`
    );
  }
}

/**
 * Save preset result to file (called from Code Lens)
 */
export async function savePresetResultCommand(presetName: string): Promise<void> {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) return;

  try {
    const saveUri = await vscode.window.showSaveDialog({
      defaultUri: vscode.Uri.joinPath(workspaceFolder.uri, `${presetName}-tree.md`),
      filters: {
        Markdown: ['md'],
        Text: ['txt'],
        JSON: ['json'],
      },
    });

    if (!saveUri) return;

    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: `Saving preset: ${presetName}`,
        cancellable: false,
      },
      async () => {
        const result = await runPreset(workspaceFolder.uri.fsPath, presetName);
        await vscode.workspace.fs.writeFile(saveUri, Buffer.from(result, 'utf-8'));
        vscode.window.showInformationMessage(`💾 Saved to ${saveUri.fsPath}`);
      }
    );
  } catch (error) {
    vscode.window.showErrorMessage(
      `Failed to save: ${error instanceof Error ? error.message : error}`
    );
  }
}
