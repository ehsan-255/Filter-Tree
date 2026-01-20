// packages/vscode/src/extension.ts
// VS Code extension entry point for Filter Tree

import * as vscode from 'vscode';
import { FtreeCodeLensProvider } from './codelens';
import {
  runPresetCommand,
  quickFilterCommand,
  initCommand,
  openConfigCommand,
  runPresetByNameCommand,
  copyPresetResultCommand,
  savePresetResultCommand,
} from './commands';
import { FtreeStatusBar } from './statusbar';

let statusBar: FtreeStatusBar | undefined;

export function activate(context: vscode.ExtensionContext) {
  console.log('🌲 Filter Tree extension activating...');

  try {
    // Register all commands
    context.subscriptions.push(
      vscode.commands.registerCommand('ftree.runPreset', runPresetCommand),
      vscode.commands.registerCommand('ftree.quickFilter', quickFilterCommand),
      vscode.commands.registerCommand('ftree.init', initCommand),
      vscode.commands.registerCommand('ftree.openConfig', openConfigCommand),
      vscode.commands.registerCommand('ftree.runPresetByName', runPresetByNameCommand),
      vscode.commands.registerCommand('ftree.copyPresetResult', copyPresetResultCommand),
      vscode.commands.registerCommand('ftree.savePresetResult', savePresetResultCommand),
      vscode.commands.registerCommand('ftree.copyToClipboard', async () => {
        vscode.window.showInformationMessage(
          'Use Code Lens "Copy" button on a preset in ftree.yaml'
        );
      })
    );

    console.log('🌲 Commands registered');

    // Register Code Lens provider for ftree.yaml files
    const codeLensProvider = new FtreeCodeLensProvider();
    context.subscriptions.push(
      vscode.languages.registerCodeLensProvider(
        [
          { pattern: '**/ftree.yaml' },
          { pattern: '**/ftree.yml' },
          { pattern: '**/.ftreerc.yaml' },
          { pattern: '**/.ftreerc.yml' },
        ],
        codeLensProvider
      )
    );

    console.log('🌲 Code Lens provider registered');

    // Initialize status bar
    statusBar = new FtreeStatusBar();
    context.subscriptions.push(statusBar);

    console.log('🌲 Status bar initialized');

    // Watch for ftree.yaml changes
    const watcher = vscode.workspace.createFileSystemWatcher('**/ftree.{yaml,yml}');
    context.subscriptions.push(watcher);

    watcher.onDidChange(() => statusBar?.refresh());
    watcher.onDidCreate(() => statusBar?.refresh());
    watcher.onDidDelete(() => statusBar?.refresh());

    console.log('🌲 Filter Tree extension activated successfully!');
    vscode.window.showInformationMessage('🌲 Filter Tree extension activated!');
  } catch (error) {
    console.error('🌲 Filter Tree activation error:', error);
    vscode.window.showErrorMessage(`Filter Tree activation failed: ${error}`);
  }
}

export function deactivate() {
  console.log('🌲 Filter Tree extension deactivating...');
  if (statusBar) {
    statusBar.dispose();
  }
}
