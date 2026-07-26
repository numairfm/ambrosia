# Installing Ambrosia for OpenCode

## Installation

Add Ambrosia to the `plugin` array in your `opencode.json` (global or project-level):

```json
{
  "plugin": ["ambrosia@git+https://github.com/numairfm/ambrosia.git"]
}
```

Restart OpenCode. The plugin installs automatically via OpenCode's plugin manager and registers all Ambrosia skills + tool mappings (`read`, `apply_patch`, `bash`, `task`, `skill`).

## Manual / Local Package Path

If using a local path or custom directory:

```json
{
  "plugin": ["/path/to/ambrosia"]
}
```
