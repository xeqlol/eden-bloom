#!/usr/bin/env bash
# One-command local deploy: build + test + install extension + wire WezTerm.
# VSCode gets the extension folder; the settings.json overlay is surgically
# removed (backups kept); ~/.wezterm.lua gains the managed dofile block.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
EXT_ROOT="$USERPROFILE/.vscode/extensions"
VERSION="$(node -p 'require(process.argv[1]).version' "$ROOT/package.json")"
DEST="$EXT_ROOT/xeqlol.midnight-lilac-$VERSION"
THEME_LUA="$(cygpath -m "$ROOT/wezterm_theme.lua")"

echo "==> building + testing"
(cd "$ROOT" && npm run-silent build >/dev/null && npm run-silent test >/dev/null)
echo "    tests green"

echo "==> installing extension -> $DEST"
rm -rf "$EXT_ROOT"/xeqlol.midnight-lilac-*
mkdir -p "$DEST/themes"
cp "$ROOT"/package.json "$ROOT"/README.md "$ROOT"/LICENSE "$ROOT"/icon.png "$DEST/"
cp "$ROOT"/themes/midnight-lilac-color-theme.json "$DEST/themes/"

echo "==> migrating settings.json (overlay -> standalone theme)"
node "$ROOT/scripts/apply-settings.mjs" --settings "$APPDATA/Code/User/settings.json" --apply

echo "==> wiring ~/.wezterm.lua (managed dofile block)"
node "$ROOT/scripts/apply-wezterm.mjs" --lua "$USERPROFILE/.wezterm.lua" --theme "$THEME_LUA" --apply

echo ""
echo "Deployed. VSCode: fully restart it (the extension folder is scanned at startup)."
echo "WezTerm: auto-reloads on save; if not, Ctrl+Shift+R."
