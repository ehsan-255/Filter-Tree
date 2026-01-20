// packages/vscode/src/codelens.ts
// Code Lens provider for ftree.yaml presets

import * as vscode from 'vscode';

export class FtreeCodeLensProvider implements vscode.CodeLensProvider {
  private _onDidChangeCodeLenses = new vscode.EventEmitter<void>();
  public readonly onDidChangeCodeLenses = this._onDidChangeCodeLenses.event;

  provideCodeLenses(document: vscode.TextDocument): vscode.CodeLens[] {
    const lenses: vscode.CodeLens[] = [];
    const text = document.getText();
    const lines = text.split('\n');

    let inPresetsSection = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Detect presets: section
      if (line.match(/^presets:\s*$/)) {
        inPresetsSection = true;
        continue;
      }

      // Exit presets section if we hit another top-level key
      if (inPresetsSection && line.match(/^[a-zA-Z]/)) {
        inPresetsSection = false;
        continue;
      }

      // Find preset definitions (2-space indented keys under presets:)
      if (inPresetsSection) {
        const presetMatch = line.match(/^ {2}([a-zA-Z][\w-]*):\s*$/);
        if (presetMatch) {
          const presetName = presetMatch[1];
          const range = new vscode.Range(i, 0, i, line.length);

          // Run button
          lenses.push(
            new vscode.CodeLens(range, {
              title: '▶ Run',
              command: 'ftree.runPresetByName',
              arguments: [presetName],
              tooltip: `Run the "${presetName}" preset`,
            })
          );

          // Copy button
          lenses.push(
            new vscode.CodeLens(range, {
              title: '📋 Copy',
              command: 'ftree.copyPresetResult',
              arguments: [presetName],
              tooltip: `Copy "${presetName}" result to clipboard`,
            })
          );

          // Save button
          lenses.push(
            new vscode.CodeLens(range, {
              title: '💾 Save',
              command: 'ftree.savePresetResult',
              arguments: [presetName],
              tooltip: `Save "${presetName}" result to file`,
            })
          );
        }
      }
    }

    return lenses;
  }

  refresh(): void {
    this._onDidChangeCodeLenses.fire();
  }
}
