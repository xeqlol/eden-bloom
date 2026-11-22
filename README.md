# Eden Bloom

A family of dark themes, each grown from a 10-color palette — one source of truth
generating **VS Code** themes, **WezTerm** color schemes and **Obsidian** themes.

| Theme | Mood | Signature |
|---|---|---|
| **Eden Lilac** | dark lilac, hand-tuned in a live overlay | `#D4A6E4` |
| **Eden Ember** | warm sunset, ember over umber | `#F0A35E` |
| **Eden Moss** | forest greens, moss light over pine | `#B8E39B` |
| **Eden Deep Sea** | blue-teal, glacial cyan over abyss | `#7FD9E8` |

Open [`preview/index.html`](preview/index.html) after a build for a side-by-side
gallery of every palette (swatches, chrome ramp, syntax sample, ANSI-16).

## Install

### VS Code

- Marketplace: search “Eden Bloom” (all four themes in one extension)
- Or from a checkout: `npm run package` → install the resulting `.vsix`

### WezTerm

`wezterm/<id>.lua` is a self-contained module. Register the ones you want:

```lua
local eden = dofile '/path/to/eden-bloom/wezterm/lilac.lua'
config.color_schemes = config.color_schemes or {}
config.color_schemes[eden.name] = eden.colors
config.window_frame = eden.window_frame
config.color_scheme = eden.name
```

Or, on the machine with this checkout: `npm run deploy` wires all of them into
`~/.wezterm.lua` as switchable schemes (flagship selected by default).

### Obsidian

Generated themes live in `obsidian/<id>/` (`theme.css` + `manifest.json`):

```
node scripts/install-obsidian.mjs --vault <vault-path> --apply
```

Then Settings → Appearance → pick an Eden theme. Use with base theme **Dark**.

## The palettes

Every palette is 10 role slots — `bg, raised, muted, info, accent, secondary,
error, warm, bright, success` — with poetic names for display. Eden Lilac:

| Name | Hex | Role |
|---|---|---|
| Midnight | `#171729` | background base |
| Plum | `#29233F` | raised chrome |
| Lavender | `#827B9B` | comments / muted |
| Ice Blue | `#8EADE8` | info / types |
| Lilac | `#D4A6E4` | signature accent |
| Rose | `#E9B5C5` | parameters |
| Coral | `#F18C9A` | errors / deleted |
| Peach | `#F5B58D` | numbers / warning |
| Sunlight | `#FFD0A6` | cursor / bright text |
| Sage | `#A9D3C1` | strings / success |

The other palettes carry the same roles under their own names (Cinder/Ember…,
Pine/Moss…, Abyss/Glacier…). Every derived role is a formula over these ten
(see `src/palettes/derive.mjs`); the flagship keeps its hand-tuned values.

## Development

```
npm run build    # regenerate themes/ + wezterm/ + obsidian/ + icons/ + preview/ from src/palettes/
npm test         # per-palette coverage (971/971 workbench IDs), provenance, wezterm contract
npm run deploy   # build + install locally + wire WezTerm + migrate settings (this machine)
npm run package  # build + test + produce .vsix
npm run release  # version bump + build + test + tag (+ --push --marketplace)
```

Structure:

- `src/palettes/` — the only files allowed raw hex: one module per palette,
  plus `derive.mjs` (the formula layer) and the registry
- `src/mappings/` — VS Code color-ID → palette role (explicit, with inference fallback)
- `src/emit/` — VS Code JSON, WezTerm Lua, Obsidian CSS, preview gallery
- `scripts/` — local deploy wiring, Obsidian install, release orchestration

Adding a palette: create `src/palettes/<id>.mjs` via `definePalette({...})`
with 10 base colors and display names, register it in `src/palettes/index.mjs`,
run `npm run build` — VS Code, WezTerm, Obsidian artifacts and the gallery
entry all appear; tests enforce the palette shape contract.

Every color in every artifact is a `Color` object with a provenance note;
tests fail if a hex appears that no palette produced.

## License

[MIT](LICENSE)
