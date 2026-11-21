// Editor surface: the largest section (157 reference IDs).
import { C, chrome, text, line, accent, state, alphaed } from '../palette.mjs'

export const sections = ['Editor colors']

export default {
  'editor.background': C.Midnight,
  'editor.foreground': text.normal,
  'editorCursor.foreground': accent.cursor,
  'editor.selectionBackground': alphaed.selection,
  'editor.lineHighlightBackground': alphaed.lineHighlight,
  'editorLineNumber.foreground': text.ghost,
  'editorLineNumber.activeForeground': text.lineActive,
  'editorIndentGuide.background': line.indent,
  'editorIndentGuide.activeBackground': line.activeIndent,
  'editorBracketMatch.background': alphaed.bracketMatch,
  'editorBracketMatch.border': accent.bracket,
  'editorError.foreground': state.errorBright,
  'editorWarning.foreground': state.warningBright,
  'editorInfo.foreground': state.info,
}
