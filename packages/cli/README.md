# ftree-cli

[![npm version](https://badge.fury.io/js/ftree-cli.svg)](https://www.npmjs.com/package/ftree-cli)

Command-line tool for config-driven filtered file-tree generation.

## Installation

```bash
npm install -g ftree-cli
```

## Usage

```bash
# Initialize config
ftree init

# List presets
ftree list

# Run a preset
ftree run source

# Quick filter (no config)
ftree quick -e ts,js --since 7d
```

## Commands

| Command              | Description                 |
| -------------------- | --------------------------- |
| `ftree init`         | Create starter `ftree.yaml` |
| `ftree list`         | List available presets      |
| `ftree run <preset>` | Run a named preset          |
| `ftree quick`        | Ad-hoc filtering            |

## Options

```bash
ftree run source -o json       # Output as JSON
ftree run source --save out.md # Save to file
ftree run source --no-size     # Hide file sizes
```

## Configuration

See [ftree.yaml reference](../../docs/USER_GUIDE.md#configuration).

## License

MIT
