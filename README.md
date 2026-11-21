# Midnight Lilac

Dark lilac theme for VS Code, generated from a single 10-color palette.
A WezTerm port of the same palette lives in [`wezterm_theme.lua`](wezterm_theme.lua).

## Palette

| Name | Hex | |
|---|---|---|
| Midnight | `#171729` | background base |
| Plum | `#29233F` | raised chrome |
| Lavender | `#827B9B` | comments / muted |
| Ice Blue | `#8EADE8` | info / types |
| Lilac | `#D4A6E4` | signature accent |
| Rose | `#E9B5C5` | parameters |
| Coral | `#F18C9A` | errors / deleted |
| Peach | `#F5B58D` | numbers / warning |
| Sunlight | `#FFD0A6` | cursor |
| Sage | `#A9D3C1` | strings / success |

## Build & deploy

```
npm run build    # regenerate themes/ + wezterm_theme.lua + icon.png from src/palette.mjs
npm test         # coverage (971/971 workbench color IDs), provenance, wezterm contract
npm run deploy   # build + install locally + wire WezTerm (this machine)
npm run package  # build + test + produce .vsix
```

The single source of truth is `src/palette.mjs` — the only file allowed to contain
raw hex literals. Everything else (mappings, emitters) references it by name.
