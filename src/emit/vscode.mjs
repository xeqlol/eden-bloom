// Emits the VS Code color theme JSON. `colors` must already be an ordered
// plain object of serialized hex strings.
import { tokenColors } from '../token-colors.mjs'

export function emitTheme(colors, p) {
  const theme = { name: p.label, type: 'dark', colors, tokenColors: tokenColors(p) }
  return JSON.stringify(theme, null, 2) + '\n'
}
