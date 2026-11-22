#!/usr/bin/env bash
# One-command local deploy: build + test + install extension + wire WezTerm.
# VSCode gets the extension folder (all four Eden Bloom themes); the
# settings.json overlay is surgically removed (backups kept); ~/.wezterm.lua
# gains the managed eden-bloom block registering every palette as a scheme.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
EXT_ROOT="$USERPROFILE/.vscode/extensions"
VERSION="$(node -p 'require(process.argv[1]).version' "$ROOT/package.json")"
DEST="$EXT_ROOT/xeqlol.eden-bloom-$VERSION"

echo "==> building + testing"
(cd "$ROOT" && npm run --silent build && npm run --silent test)
echo "    tests green"

echo "==> installing extension -> $DEST"
rm -rf "$EXT_ROOT"/xeqlol.eden-bloom-*
mkdir -p "$DEST/themes"
cp "$ROOT"/package.json "$ROOT"/README.md "$ROOT"/LICENSE "$ROOT"/icon.png "$DEST/"
cp "$ROOT"/themes/*-color-theme.json "$DEST/themes/"

echo "==> migrating settings.json (overlay -> standalone theme)"
node "$ROOT/scripts/apply-settings.mjs" --settings "$APPDATA/Code/User/settings.json" --apply

echo "==> wiring ~/.wezterm.lua (managed eden-bloom block)"
ARGS=(--lua "$USERPROFILE/.wezterm.lua")
for lua in "$ROOT"/wezterm/*.lua; do
  ARGS+=(--theme "$(cygpath -m "$lua")")
done
node "$ROOT/scripts/apply-wezterm.mjs" "${ARGS[@]}" --apply

echo ""
echo "Deployed. VSCode: fully restart it (the extension folder is scanned at startup)."
echo "WezTerm: auto-reloads on save; if not, Ctrl+Shift+R. Switch palettes via color_scheme."
echo "Obsidian: node scripts/install-obsidian.mjs --vault <path> --apply"
