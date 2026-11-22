// Editor surface: the largest section (157 reference IDs).

export const sections = ['Editor colors']

export default (p) => ({
  'editor.background': p.C.bg,
  'editor.foreground': p.text.normal,
  'editorCursor.foreground': p.accent.cursor,
  'editor.selectionBackground': p.alphaed.selection,
  'editor.lineHighlightBackground': p.alphaed.lineHighlight,
  'editor.lineHighlightBorder': p.hidden, // no frame around the current line (user call)
  'editorLineNumber.foreground': p.text.ghost,
  'editorLineNumber.activeForeground': p.text.lineActive,
  'editorIndentGuide.background': p.line.indent,
  'editorIndentGuide.activeBackground': p.line.activeIndent,
  'editorBracketMatch.background': p.alphaed.bracketMatch,
  'editorBracketMatch.border': p.accent.bracket,
  'editorError.foreground': p.state.errorBright,
  'editorWarning.foreground': p.state.warningBright,
  'editorInfo.foreground': p.state.info,
})
