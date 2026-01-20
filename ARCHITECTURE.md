# Architecture

This document describes the high-level architecture of the ftree project.

## Overview

ftree is a **config-driven filtered file-tree generator** consisting of two packages:

```
┌─────────────────────────────────────────────────────────────────┐
│                          ftree Monorepo                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────┐     ┌────────────────────────────┐   │
│  │    packages/cli      │     │    packages/vscode          │   │
│  │                      │     │                             │   │
│  │  ┌────────────────┐  │     │  ┌───────────────────────┐ │   │
│  │  │   index.ts     │  │     │  │    extension.ts       │ │   │
│  │  │   (CLI Entry)  │  │     │  │    (VS Code Entry)    │ │   │
│  │  └───────┬────────┘  │     │  └──────────┬────────────┘ │   │
│  │          │           │     │             │              │   │
│  │  ┌───────▼────────┐  │     │  ┌──────────▼────────────┐ │   │
│  │  │   config.ts    │  │     │  │    commands.ts        │ │   │
│  │  │   (YAML Parse) │  │     │  │    (Command Handlers) │ │   │
│  │  └───────┬────────┘  │     │  └──────────┬────────────┘ │   │
│  │          │           │     │             │              │   │
│  │  ┌───────▼────────┐  │     │  ┌──────────▼────────────┐ │   │
│  │  │  scanner.ts    │  │     │  │   ftree-core.ts       │ │   │
│  │  │  (File Filter) │  │     │  │   (Bundled Core)      │ │   │
│  │  └───────┬────────┘  │     │  └──────────┬────────────┘ │   │
│  │          │           │     │             │              │   │
│  │  ┌───────▼────────┐  │     │  ┌──────────▼────────────┐ │   │
│  │  │ formatter.ts   │  │     │  │    codelens.ts        │ │   │
│  │  │ (Tree Output)  │  │     │  │    statusbar.ts       │ │   │
│  │  └────────────────┘  │     │  └───────────────────────┘ │   │
│  │                      │     │                             │   │
│  └──────────────────────┘     └────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    schemas/ftree.schema.json              │   │
│  │                    (JSON Schema for YAML validation)       │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Package Architecture

### CLI Package (`packages/cli`)

**Purpose**: Standalone Node.js command-line tool for filtering and tree generation.

| Module         | Responsibility                                         |
| -------------- | ------------------------------------------------------ |
| `index.ts`     | CLI entry point, command definitions (Commander.js)    |
| `config.ts`    | YAML config parsing, validation, preset resolution     |
| `scanner.ts`   | File system scanning, filtering by extension/size/date |
| `formatter.ts` | Tree building and output formatting (MD/ASCII/JSON)    |
| `types.ts`     | TypeScript type definitions                            |

### VS Code Extension (`packages/vscode`)

**Purpose**: IDE integration with commands, Code Lenses, and status bar.

| Module          | Responsibility                                    |
| --------------- | ------------------------------------------------- |
| `extension.ts`  | Extension activation, command registration        |
| `commands.ts`   | Command handlers (run preset, quick filter, init) |
| `ftree-core.ts` | Bundled core ftree functionality                  |
| `codelens.ts`   | Code Lens provider for ftree.yaml                 |
| `statusbar.ts`  | Status bar integration                            |

## Data Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  ftree.yaml │ ──▶ │   config    │ ──▶ │   scanner   │ ──▶ │  formatter  │
│   (Input)   │     │   (Parse)   │     │   (Filter)  │     │   (Output)  │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                          │                    │                    │
                          ▼                    ▼                    ▼
                    FtreeConfig           FileInfo[]            TreeNode
                    (presets,             (path, size,          (nested
                     defaults)             modified)             structure)
```

## Key Design Decisions

### 1. Monorepo with npm Workspaces

**Why**: Simple setup, no external tooling required, shared dependencies.

### 2. Bundled Core in VS Code Extension

**Why**: VS Code extensions have complex bundling requirements. Bundling the core
ftree logic directly avoids module resolution issues across different environments.

### 3. YAML Configuration

**Why**: Human-readable, easy to edit, supports complex nested structures.
JSON Schema provides IDE IntelliSense.

### 4. Glob-based Filtering

**Why**: Familiar pattern syntax (like .gitignore), powerful and flexible.

## File Locations

```
ftree/
├── packages/
│   ├── cli/
│   │   ├── src/           # CLI source code
│   │   ├── dist/          # Compiled JS (gitignored)
│   │   └── tests/         # Unit tests
│   └── vscode/
│       ├── src/           # Extension source
│       ├── dist/          # Bundled extension (gitignored)
│       └── schemas/       # JSON Schema copy
├── schemas/               # JSON Schema source of truth
├── docs/                  # Documentation
└── .github/workflows/     # CI/CD pipelines
```

## Extension Points

1. **New Output Formats**: Add to `formatter.ts`
2. **New Filter Types**: Add to `scanner.ts` and `types.ts`
3. **New CLI Commands**: Add to `index.ts` with Commander.js
4. **New VS Code Features**: Add to `extension.ts` and register commands
