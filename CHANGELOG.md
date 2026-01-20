# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Upgraded production dependencies (commander 12→14, glob 10→13)

### Pending

- ESLint 9 migration (see [TODO.md](./TODO.md))

## [0.1.1] - 2026-01-20

### Added

- Extension icon for Open VSX and marketplace listings
- `readmes` preset - filters all README files across the project
- `ai-docs` preset - filters AI agent documentation (AGENTS.md, CLAUDE.md, GEMINI.md)

### Fixed

- CI workflow now triggers on `master` branch (was incorrectly set to `main`)
- Disabled `no-console` ESLint rule (appropriate for CLI tools)
- Added placeholder test to prevent CI failure

### Changed

- Bumped extension version to 0.1.1

## [0.1.0] - 2026-01-19

### Added

- **CLI Package (`ftree-cli`)**
  - `ftree init` - Create starter ftree.yaml configuration
  - `ftree run <preset>` - Run a named preset from config
  - `ftree list` - List available presets and aliases
  - `ftree quick` - Ad-hoc filtering without config file
  - Filtering by extension, size, date, glob patterns
  - Multiple output formats: markdown, ASCII, JSON, paths
  - Sorting by name, size, or date

- **VS Code Extension (`ftree-vscode`)**
  - Command Palette integration (`Ctrl+Shift+T`)
  - Quick Filter command (`Ctrl+Alt+T`)
  - Code Lenses in ftree.yaml (Run, Copy, Save)
  - Status bar quick access
  - JSON Schema validation for ftree.yaml

- **Configuration**
  - YAML-based configuration with `ftree.yaml`
  - Named presets for reusable filters
  - Global defaults for common settings
  - Aliases for quick access

### Infrastructure

- Monorepo structure with npm workspaces
- TypeScript strict mode
- ESLint + Prettier code quality
- Husky + lint-staged pre-commit hooks
- Commitlint for Conventional Commits
- GitHub Actions CI/CD pipeline

[Unreleased]: https://github.com/ehsan-255/Filter-Tree/compare/v0.1.1...HEAD
[0.1.1]: https://github.com/ehsan-255/Filter-Tree/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/ehsan-255/Filter-Tree/releases/tag/v0.1.0
