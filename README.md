# ftree 🌲

[![CI](https://github.com/ehsan-255/Filter-Tree/actions/workflows/ci.yml/badge.svg)](https://github.com/ehsan-255/Filter-Tree/actions/workflows/ci.yml)
[![npm version](https://badge.fury.io/js/ftree-cli.svg)](https://www.npmjs.com/package/ftree-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Config-driven filtered file-tree generator for AI agent workflows**

Generate focused, filtered file trees from your project. Define reusable presets in `ftree.yaml` and get markdown-ready output perfect for AI context injection.

## Features

- 🎯 **Filter by extension, size, date** - Focus on what matters
- 📁 **YAML configuration** - Reusable presets with IntelliSense
- 🖥️ **CLI & VS Code** - Use from terminal or IDE
- 🤖 **AI-friendly output** - Perfect for context injection
- ⚡ **Fast** - Built on glob for quick scanning

## Quick Start

### CLI

```bash
# Install
npm install -g ftree-cli

# Initialize config
ftree init

# Run a preset
ftree run source
```

### VS Code Extension

1. Install "Filter Tree" from the marketplace
2. Press `Ctrl+Shift+T` to run a preset
3. Or use Code Lenses in `ftree.yaml`

## Configuration

```yaml
# ftree.yaml
version: '1.0'

defaults:
  depth: 5
  exclude:
    - '**/node_modules/**'

presets:
  source:
    description: 'Source code files'
    extensions: [ts, js, tsx, jsx]

  recent-docs:
    description: 'Docs modified this week'
    extensions: [md, txt]
    modifiedWithin: 7d

  large-files:
    minSize: 1MB
    sortBy: size-desc
```

## Example Output

```
## 🌲 Filter: `source` (15 files, 3 dirs)

├── 📁 src
│   ├── 📄 index.ts (2.5 KB)
│   ├── 📄 config.ts (1.8 KB)
│   └── 📄 utils.ts (950 B)
└── 📁 lib
    └── 📄 helpers.ts (1.2 KB)
```

## Filter Options

| Option           | Example           | Description      |
| ---------------- | ----------------- | ---------------- |
| `extensions`     | `[ts, js]`        | File extensions  |
| `minSize`        | `1KB`             | Minimum size     |
| `maxSize`        | `10MB`            | Maximum size     |
| `modifiedWithin` | `7d`              | Recent files     |
| `patterns`       | `["**/*.test.*"]` | Glob patterns    |
| `exclude`        | `["**/dist/**"]`  | Exclude patterns |
| `depth`          | `3`               | Max depth        |
| `sortBy`         | `size-desc`       | Sort order       |

## Documentation

- [User Guide](./docs/USER_GUIDE.md) - Complete usage reference
- [Architecture](./ARCHITECTURE.md) - System design
- [Contributing](./CONTRIBUTING.md) - How to contribute
- [Changelog](./CHANGELOG.md) - Version history

## Packages

| Package                             | Description       |
| ----------------------------------- | ----------------- |
| [`ftree-cli`](./packages/cli)       | Command-line tool |
| [`ftree-vscode`](./packages/vscode) | VS Code extension |

## License

[MIT](./LICENSE)

---

Made with 🌲 by [ehsan-255](https://github.com/ehsan-255)
