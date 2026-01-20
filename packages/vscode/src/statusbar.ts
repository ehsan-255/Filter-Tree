// packages/vscode/src/statusbar.ts
// Status bar integration for Filter Tree

import * as vscode from 'vscode';
import { findConfigFile } from './ftree-core';

export class FtreeStatusBar implements vscode.Disposable {
  private statusBarItem: vscode.StatusBarItem;
  private hasConfig: boolean = false;

  constructor() {
    this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);

    this.statusBarItem.command = 'ftree.runPreset';
    this.statusBarItem.tooltip = 'Filter Tree - Click to run a preset';

    this.refresh();
    this.statusBarItem.show();
  }

  async refresh(): Promise<void> {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];

    if (!workspaceFolder) {
      this.statusBarItem.hide();
      return;
    }

    const configPath = await findConfigFile(workspaceFolder.uri.fsPath);
    this.hasConfig = !!configPath;

    if (this.hasConfig) {
      this.statusBarItem.text = '$(list-tree) ftree';
      this.statusBarItem.tooltip = 'Filter Tree - Click to run a preset';
      this.statusBarItem.command = 'ftree.runPreset';
    } else {
      this.statusBarItem.text = '$(list-tree) ftree';
      this.statusBarItem.tooltip = 'Filter Tree - Click to create config';
      this.statusBarItem.command = 'ftree.init';
    }

    this.statusBarItem.show();
  }

  dispose(): void {
    this.statusBarItem.dispose();
  }
}
