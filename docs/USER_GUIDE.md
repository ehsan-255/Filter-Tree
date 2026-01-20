# ftree User Guide

A comprehensive guide to using ftree for filtering files and generating focused file trees.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [CLI Usage](#cli-usage)
- [VS Code Extension](#vs-code-extension)
- [Filtering Reference](#filtering-reference)
- [Use Cases](#use-cases)
- [Tips & Tricks](#tips--tricks)

---

## Installation

### CLI

```bash
# Install globally
npm install -g ftree-cli

# Or use with npx (no install)
npx ftree-cli --help
```

### VS Code Extension

1. Open VS Code
2. Press `Ctrl+Shift+X` to open Extensions
3. Search for "Filter Tree"
4. Click Install

---

## Quick Start

### 1. Initialize Configuration

```bash
ftree init
```

This creates `ftree.yaml` with starter presets:

```yaml
version: '1.0'

presets:
  recent-docs:
    description: 'Docs modified in last 7 days'
    extensions: [md, txt]
    modifiedWithin: 7d

  source:
    description: 'Source code files'
    extensions: [ts, js, tsx, jsx]
```

### 2. Run a Preset

```bash
ftree run source
```

Output:

```
## 🌲 Filter: `source` (15 files, 3 dirs)

├── 📁 src
│   ├── 📄 index.ts (2.5 KB)
│   ├── 📄 config.ts (1.8 KB)
│   └── 📄 utils.ts (950 B)
└── 📁 lib
    └── 📄 helpers.ts (1.2 KB)
```

### 3. Quick Filter (No Config)

```bash
ftree quick -e ts,js --since 7d
```

---

## Configuration

### ftree.yaml Structure

```yaml
version: '1.0'

# Global defaults applied to all presets
defaults:
  depth: 5
  output: markdown
  showSize: true
  exclude:
    - '**/node_modules/**'
    - '**/.git/**'

# Named presets
presets:
  my-preset:
    description: 'Human-readable description'
    extensions: [ts, js]
    # ... filter options

# Quick aliases
aliases:
  ts: { extensions: [ts, tsx] }
```

### Filter Options Reference

| Option           | Type     | Example                 | Description              |
| ---------------- | -------- | ----------------------- | ------------------------ |
| `extensions`     | string[] | `[ts, js, md]`          | File extensions (no dot) |
| `patterns`       | string[] | `["**/*.config.*"]`     | Glob patterns            |
| `include`        | string[] | `["src/**"]`            | Directories to include   |
| `exclude`        | string[] | `["**/test/**"]`        | Directories to exclude   |
| `minSize`        | string   | `1KB`, `5MB`            | Minimum file size        |
| `maxSize`        | string   | `100KB`                 | Maximum file size        |
| `modifiedWithin` | string   | `7d`, `2h`, `1w`        | Recently modified        |
| `depth`          | number   | `3`                     | Max directory depth      |
| `type`           | string   | `file`, `directory`     | Filter by type           |
| `sortBy`         | string   | `size-desc`, `date-asc` | Sort results             |
| `showSize`       | boolean  | `true`                  | Show file sizes          |
| `showDate`       | boolean  | `true`                  | Show modification dates  |

### Size Units

- `B` - Bytes
- `KB` - Kilobytes (1024 bytes)
- `MB` - Megabytes
- `GB` - Gigabytes

### Duration Units

- `h` - Hours
- `d` - Days
- `w` - Weeks
- `m` - Months (30 days)

---

## CLI Usage

### Commands

```bash
# Initialize config
ftree init

# List available presets
ftree list

# Run a preset
ftree run <preset-name>

# Run with options
ftree run source -o json --no-size

# Quick filter (ad-hoc)
ftree quick -e md --since 7d

# Save output to file
ftree run source --save tree.md
```

### Output Formats

```bash
ftree run source -o markdown   # Default: emoji tree
ftree run source -o ascii      # ASCII-only tree
ftree run source -o json       # Full JSON structure
ftree run source -o paths      # Just file paths
```

### Global Options

| Option                  | Description             |
| ----------------------- | ----------------------- |
| `-c, --config <path>`   | Custom config file path |
| `-o, --output <format>` | Output format           |
| `-d, --dir <path>`      | Directory to scan       |
| `--size` / `--no-size`  | Show/hide file sizes    |
| `--date` / `--no-date`  | Show/hide dates         |
| `--save <file>`         | Save output to file     |

---

## VS Code Extension

### Keyboard Shortcuts

| Shortcut       | Action              |
| -------------- | ------------------- |
| `Ctrl+Shift+T` | Run Preset (picker) |
| `Ctrl+Alt+T`   | Quick Filter        |

### Commands (Command Palette)

- **Filter Tree: Run Preset** - Select and run a preset
- **Filter Tree: Quick Filter** - Ad-hoc filtering
- **Filter Tree: Create Config** - Initialize ftree.yaml
- **Filter Tree: Open Config** - Open ftree.yaml

### Code Lenses

When viewing `ftree.yaml`, you'll see action buttons above each preset:

```yaml
presets:
  #   ▶ Run  │  📋 Copy  │  💾 Save
  source:
    extensions: [ts, js]
```

### Status Bar

Click the `🌲 ftree` item in the status bar for quick access.

---

## Filtering Reference

### By Extension

```yaml
extensions: [ts, tsx, js, jsx]
```

### By Glob Pattern

```yaml
patterns:
  - '**/*.config.*'
  - '**/.*rc'
  - '**/*.test.ts'
```

### By Size

```yaml
minSize: 1KB # Files at least 1KB
maxSize: 10MB # Files at most 10MB
```

### By Date

```yaml
modifiedWithin: 7d # Last 7 days
```

### By Directory

```yaml
include:
  - 'src/**'
  - 'lib/**'
exclude:
  - '**/node_modules/**'
  - '**/dist/**'
```

### Combining Filters

All filters are combined with AND logic:

```yaml
large-recent-ts:
  extensions: [ts]
  minSize: 1KB
  modifiedWithin: 30d
  exclude: ['**/test/**']
```

---

## Use Cases

### 1. AI Agent Context Injection

Generate focused file trees for AI coding assistants:

```yaml
agent-context:
  description: 'Core files for AI context'
  extensions: [ts, tsx, js, jsx]
  maxSize: 50KB
  depth: 4
  exclude:
    - '**/test/**'
    - '**/*.test.*'
```

```bash
ftree run agent-context --save context.md
# Then paste context.md into your AI prompt
```

### 2. Code Review Preparation

See what changed recently:

```yaml
recent-changes:
  modifiedWithin: 1d
  extensions: [ts, tsx]
  exclude: ['**/dist/**']
```

### 3. Asset Audit

Find large files that might need optimization:

```yaml
large-assets:
  extensions: [png, jpg, gif, svg]
  minSize: 500KB
  sortBy: size-desc
```

### 4. Documentation Overview

```yaml
all-docs:
  extensions: [md, mdx, txt, rst]
  exclude: ['**/node_modules/**']
```

### 5. Config File Discovery

```yaml
configs:
  patterns:
    - '**/.*rc'
    - '**/.*rc.{js,json,yaml}'
    - '**/*.config.*'
    - '**/tsconfig*.json'
```

### 6. Empty Directory Cleanup

```yaml
empty-dirs:
  type: directory
  empty: true
```

---

## Tips & Tricks

### 1. Use Aliases for Quick Access

```yaml
aliases:
  ts: { extensions: [ts, tsx] }
  docs: { extensions: [md, txt] }
  styles: { extensions: [css, scss] }
```

Then run: `ftree run ts`

### 2. Chain with Other Tools

```bash
# Find then search
ftree run source -o paths | xargs grep "TODO"

# Copy to clipboard (PowerShell)
ftree run source | Set-Clipboard

# Copy to clipboard (bash)
ftree run source | xclip -selection clipboard
```

### 3. Project-Specific Presets

Create presets that match your project structure:

```yaml
# React project
components:
  include: ['src/components/**']
  extensions: [tsx, css]

# API project
endpoints:
  include: ['api/**', 'routes/**']
  extensions: [ts]
```

### 4. Output to Different Formats

```bash
# For documentation
ftree run source -o markdown --save docs/structure.md

# For scripts
ftree run source -o paths | xargs -I {} echo "Processing {}"

# For analysis
ftree run source -o json | jq '.files | length'
```

### 5. Exclude Common Noise

Add these to your defaults:

```yaml
defaults:
  exclude:
    - '**/node_modules/**'
    - '**/.git/**'
    - '**/dist/**'
    - '**/build/**'
    - '**/.cache/**'
    - '**/coverage/**'
```

---

## Troubleshooting

### "No ftree.yaml found"

Run `ftree init` in your project root to create one.

### Preset shows no results

Check your filters - they may be too restrictive. Try relaxing:

- Increase `depth`
- Remove `minSize` to include small files
- Check `exclude` patterns aren't matching too much

### VS Code extension not activating

The extension activates when `ftree.yaml` exists in your workspace.
Create one with `Ctrl+Shift+P` → "Filter Tree: Create Config"

---

## Resources

- [GitHub Repository](https://github.com/ehsan-255/Filter-Tree)
- [Bug Reports](https://github.com/ehsan-255/Filter-Tree/issues)
- [Changelog](../CHANGELOG.md)
