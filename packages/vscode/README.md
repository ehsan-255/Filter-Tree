# Filter Tree for VS Code

Config-driven filtered file-tree generator with presets and Code Lenses.

## Features

- 🎯 Run presets from Command Palette (`Ctrl+Shift+T`)
- ⚡ Quick filter by extension/date/size (`Ctrl+Alt+T`)
- 📝 Code Lenses in `ftree.yaml` (Run, Copy, Save)
- 📊 Status bar quick access

## Usage

1. Create `ftree.yaml` with presets
2. Use Command Palette → "Filter Tree: Run Preset"
3. Or click Code Lenses above presets in `ftree.yaml`

## Commands

| Command       | Shortcut       | Description           |
| ------------- | -------------- | --------------------- |
| Run Preset    | `Ctrl+Shift+T` | Pick and run a preset |
| Quick Filter  | `Ctrl+Alt+T`   | Ad-hoc filtering      |
| Create Config | -              | Initialize ftree.yaml |
| Open Config   | -              | Open ftree.yaml       |

## Configuration

Create `ftree.yaml` in your workspace:

```yaml
version: '1.0'

presets:
  source:
    extensions: [ts, js]

  recent:
    modifiedWithin: 7d
```

## Requirements

- VS Code 1.85.0 or higher

## License

MIT
