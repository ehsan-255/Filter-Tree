# AGENTS.md - CLI Package

> Context for AI agents working in `packages/cli`.

## Module Overview

| File               | Purpose                             |
| ------------------ | ----------------------------------- |
| `src/index.ts`     | CLI entry point (Commander.js)      |
| `src/config.ts`    | YAML config parsing and validation  |
| `src/scanner.ts`   | File system scanning and filtering  |
| `src/formatter.ts` | Tree building and output formatting |
| `src/types.ts`     | TypeScript type definitions         |

## Build & Test

```bash
npm run build    # Compile TypeScript
npm test         # Run Vitest tests
npm run dev      # Watch mode
```

## CLI Commands

```bash
node dist/index.js init           # Create ftree.yaml
node dist/index.js list           # List presets
node dist/index.js run <preset>   # Run preset
node dist/index.js quick -e ts    # Quick filter
```

## Adding New Features

### New CLI Command

1. Add command in `src/index.ts` using Commander.js
2. Implement handler function
3. Add tests in `tests/`

### New Filter Type

1. Add filter property to `Preset` interface in `types.ts`
2. Implement filter logic in `scanner.ts`
3. Update JSON Schema in `schemas/ftree.schema.json`

### New Output Format

1. Add format function in `formatter.ts`
2. Add to `OutputFormat` type in `types.ts`
3. Handle in main `format()` function

## Testing

```bash
npm test                          # All tests
npm test -- --filter config       # Specific file
```

## Dependencies

- `commander` - CLI framework
- `js-yaml` - YAML parsing
- `glob` - File pattern matching
