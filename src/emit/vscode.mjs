// Emits the VS Code color theme JSON. `colors` must already be an ordered
// plain object of serialized hex strings.
import { THEME_NAME } from '../reference.mjs'
import { tokenColors } from '../token-colors.mjs'

export function emitTheme(colors) {
  const theme = { name: THEME_NAME, type: 'dark', colors, tokenColors }
  return JSON.stringify(theme, null, 2) + '\n'
}
