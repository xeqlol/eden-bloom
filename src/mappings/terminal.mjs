// Integrated terminal: chrome plus the full ANSI-16 palette.

export const sections = ['Integrated Terminal colors']

export default (p) => ({
  'terminal.background': p.C.bg,
  'terminal.foreground': p.text.normal,
  'terminalCursor.foreground': p.accent.cursor,
  'terminal.ansiBlack': p.terminal16.black,
  'terminal.ansiRed': p.terminal16.red,
  'terminal.ansiGreen': p.terminal16.green,
  'terminal.ansiYellow': p.terminal16.yellow,
  'terminal.ansiBlue': p.terminal16.blue,
  'terminal.ansiMagenta': p.terminal16.magenta,
  'terminal.ansiCyan': p.terminal16.cyan,
  'terminal.ansiWhite': p.terminal16.white,
  'terminal.ansiBrightBlack': p.terminal16.brightBlack,
  'terminal.ansiBrightRed': p.terminal16.brightRed,
  'terminal.ansiBrightGreen': p.terminal16.brightGreen,
  'terminal.ansiBrightYellow': p.terminal16.brightYellow,
  'terminal.ansiBrightBlue': p.terminal16.brightBlue,
  'terminal.ansiBrightMagenta': p.terminal16.brightMagenta,
  'terminal.ansiBrightCyan': p.terminal16.brightCyan,
  'terminal.ansiBrightWhite': p.terminal16.brightWhite,
})
