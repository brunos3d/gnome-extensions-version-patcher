# gnome-extensions-version-patcher

A utility script that automatically adds your current GNOME Shell version to the `shell-version` array in metadata.json files of installed GNOME extensions. This helps make extensions compatible with your current GNOME Shell version.

## What it does

This script:

1. Detects your current GNOME Shell version (e.g., 48 from "GNOME Shell 48.0")
2. Finds all metadata.json files in your GNOME extensions directory
3. Adds your current GNOME Shell version to the `shell-version` array if it's not already there

## ⚠ Warning ⚠

This script will **MODIFY** the metadata.json files of your installed GNOME extensions. Consider backing up your extensions directory before running it.

## Requirements

- GNOME Shell must be installed and accessible in your PATH
- Node.js and npm or npx

## How to use it

Run the script directly:

```sh
npx zx https://raw.githubusercontent.com/brunos3d/gnome-extensions-version-patcher/main/index.mjs
```

### Options

- `--directory=PATH` - Specify a custom GNOME extensions directory path
- `--dry-run` - Run without making any changes (preview mode)

### Environment Variables

- `GNOME_EXTENSIONS_DIRECTORY` - Specify a custom GNOME extensions directory path (optional)

## Examples

Run with a custom directory:

```sh
npx zx https://raw.githubusercontent.com/brunos3d/gnome-extensions-version-patcher/main/index.mjs --directory=/path/to/extensions
```

Preview changes without modifying files:

```sh
npx zx https://raw.githubusercontent.com/brunos3d/gnome-extensions-version-patcher/main/index.mjs --dry-run
```
