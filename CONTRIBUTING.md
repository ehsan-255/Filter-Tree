# Contributing to ftree

Thank you for your interest in contributing to ftree! This document provides
guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Code Style](#code-style)

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md).
By participating, you are expected to uphold this code.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/Filter-Tree.git`
3. Add upstream remote: `git remote add upstream https://github.com/ehsan-255/Filter-Tree.git`
4. Create a branch: `git checkout -b feature/your-feature-name`

## Development Setup

```bash
# Install dependencies
npm install

# Build all packages
npm run build

# Optional full workspace test suite; see Making Changes below
npm test

# Lint code
npm run lint

# Format code
npm run format
```

### Prerequisites

- Node.js 18 or higher (see `.nvmrc`)
- npm 9 or higher

## Making Changes

1. **Create a branch** from `main`:

   ```bash
   git checkout -b feature/your-feature
   # or
   git checkout -b fix/your-bugfix
   ```

2. **Make your changes** following our code style

3. **Write/update tests** when a runtime change adds or changes behavior

4. **Run checks that cover the change**:

   - For a documentation-only repair, check only the affected guidance,
     product contract, links, and examples.
   - For a runtime change, run the affected lint, build, and test checks.
   - The full `npm test` suite is a deliberate optional check. It is available
     through the CI workflow's `workflow_dispatch` trigger and is not a commit,
     push, or merge requirement.

5. **Commit your changes** following commit guidelines

## Commit Guidelines

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

| Type       | Description                 |
| ---------- | --------------------------- |
| `feat`     | New feature                 |
| `fix`      | Bug fix                     |
| `docs`     | Documentation only          |
| `style`    | Formatting, no code change  |
| `refactor` | Code change, no feature/fix |
| `test`     | Adding/updating tests       |
| `chore`    | Build process, tooling      |
| `perf`     | Performance improvement     |
| `ci`       | CI/CD changes               |

### Examples

```bash
feat(cli): add --json output flag
fix(vscode): resolve code lens refresh issue
docs: update installation instructions
chore: upgrade typescript to 5.4
```

## Pull Request Process

1. **Update documentation** if needed

2. **Run the checks that cover the changed paths**:
   - Documentation-only changes need only the relevant guidance, contract,
     link, and example checks.
   - Runtime changes need the affected lint, build, and test checks.
   - The full `npm test` suite remains optional and can be run by manually
     dispatching the CI workflow; it is not a push or merge requirement.

3. **Fill out the PR template** completely

4. **Request review** from maintainers

5. **Address feedback** promptly

### PR Title Format

Use the same format as commit messages:

```
feat(cli): add new filter option
```

## Code Style

### TypeScript

- Use TypeScript strict mode
- Prefer `const` over `let`
- Use explicit types for function parameters/returns
- Avoid `any` - use `unknown` if needed

### Formatting

- We use Prettier for formatting
- Run `npm run format` before committing
- ESLint enforces additional rules

### File Organization

```
packages/
├── cli/
│   ├── src/          # Source code
│   ├── tests/        # Test files
│   └── dist/         # Build output (gitignored)
└── vscode/
    ├── src/          # Extension source
    └── dist/         # Build output (gitignored)
```

## Questions?

Open a [GitHub Discussion](https://github.com/ehsan-255/Filter-Tree/discussions)
or reach out to the maintainers.

Thank you for contributing! 🌲
