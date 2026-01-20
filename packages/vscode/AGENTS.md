# AGENTS.md - VS Code Extension

> Context for AI agents working in `packages/vscode`.

## Module Overview

| File                | Purpose                                       |
| ------------------- | --------------------------------------------- |
| `src/extension.ts`  | Extension activation and command registration |
| `src/commands.ts`   | Command handler implementations               |
| `src/codelens.ts`   | Code Lens provider for ftree.yaml             |
| `src/statusbar.ts`  | Status bar integration                        |
| `src/ftree-core.ts` | Bundled ftree core logic                      |

## Build & Test

```bash
npm run build     # Bundle with esbuild
npm run watch     # Watch mode
npm run package   # Create .vsix file
```

## Testing

1. Open VS Code in this folder
2. Press F5 to launch Extension Development Host
3. Test commands in the new window

## Adding New Features

### New Command

1. Add command definition to `package.json` contributes.commands
2. Register command in `extension.ts`
3. Implement handler in `commands.ts`

### New Code Lens

1. Add detection logic in `codelens.ts`
2. Return new `CodeLens` with command reference

### New UI Element

1. Add to `package.json` contributes section
2. Implement in relevant module

## VS Code API Patterns

```typescript
// Show quick pick
const selected = await vscode.window.showQuickPick(items);

// Progress notification
await vscode.window.withProgress(
  { location: vscode.ProgressLocation.Notification, title: 'Working...' },
  async () => {
    /* work */
  }
);

// Open document
const doc = await vscode.workspace.openTextDocument({ content: text, language: 'markdown' });
await vscode.window.showTextDocument(doc);
```

## Key Files

- `package.json` - Extension manifest (commands, keybindings, contributions)
- `.vscode/launch.json` - Debug configuration
- `schemas/ftree.schema.json` - JSON Schema for YAML IntelliSense

## Dependencies

- `js-yaml` - YAML parsing
- `glob` - File pattern matching
- esbuild for bundling (dev dependency)
