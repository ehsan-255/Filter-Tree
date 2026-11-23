# AGENTS.md

> Guidelines for AI coding agents working with the ftree codebase.
> Follows the open [AGENTS.md standard](https://agents.md/).

## Project Overview

**ftree** is a config-driven filtered file-tree generator with two packages:

| Package        | Purpose           | Location          |
| -------------- | ----------------- | ----------------- |
| `ftree-cli`    | Node.js CLI tool  | `packages/cli`    |
| `ftree-vscode` | VS Code extension | `packages/vscode` |

## Setup Commands

```bash
# Install all dependencies
npm install

# Build all packages
npm run build

# Optional full workspace test suite; see Testing Guidelines below
npm test

# Lint code
npm run lint

# Format code
npm run format

# Fix linting issues
npm run lint:fix
```

### Package-Specific

```bash
# CLI only
cd packages/cli
npm run build
npm test

# VS Code extension only
cd packages/vscode
npm run build
npm run package  # Creates .vsix
```

## Code Style

- **TypeScript strict mode** enabled
- **ESLint + Prettier** enforced via pre-commit hooks
- **Single quotes**, semicolons
- **Conventional Commits** required

### Naming Conventions

- Files: `kebab-case.ts`
- Types/Interfaces: `PascalCase`
- Functions/Variables: `camelCase`
- Constants: `SCREAMING_SNAKE_CASE`

## Architecture

```
packages/cli/src/
├── index.ts      # CLI entry (Commander.js)
├── config.ts     # YAML parsing + validation
├── scanner.ts    # File filtering logic
├── formatter.ts  # Tree output formatters
└── types.ts      # TypeScript types

packages/vscode/src/
├── extension.ts  # VS Code activation
├── commands.ts   # Command handlers
├── codelens.ts   # Code Lens provider
├── statusbar.ts  # Status bar integration
└── ftree-core.ts # Bundled core ftree logic
```

## Testing Guidelines

- For documentation-only repairs, check only the affected guidance, product
  contract, links, and examples. Do not run runtime checks solely for a
  documentation change.
- For runtime changes, run the lint, build, and test checks that cover the
  affected code.
- `npm test` runs the full workspace test suites. Run it only as a deliberate
  broader check; CI keeps it available through `workflow_dispatch`. It is not
  a commit, push, or merge requirement.
- Write tests for new runtime behavior
- Use Vitest for assertions
- Name tests descriptively: `should filter files by extension`

## Commit Guidelines

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(cli): add --json output flag
fix(vscode): resolve code lens refresh issue
docs: update installation instructions
chore: upgrade dependencies
```

**Allowed types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`

## Decision Framework

When choosing between approaches:

1. **Testability** - Can this be easily tested?
2. **Readability** - Clear in 6 months?
3. **Consistency** - Matches existing patterns?
4. **Simplicity** - Minimal complexity?

## Rules

### Always

- Run affected lint, build, and test checks for runtime changes
- Match existing code patterns
- Write tests for new behavior
- Use TypeScript strict mode

### Never

- Use `--no-verify` to bypass hooks
- Commit code that doesn't build
- Disable tests instead of fixing them
- Use `any` type without justification

## Security

- Never commit secrets or credentials
- Validate all user inputs
- Use parameterized queries if database involved
- Keep dependencies updated

## Related Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - System design
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Contribution process
- [docs/USER_GUIDE.md](./docs/USER_GUIDE.md) - Usage guide
