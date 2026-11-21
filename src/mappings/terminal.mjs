// Integrated terminal: chrome plus the full ANSI-16 palette.
import { C, text, accent, terminal16 } from '../palette.mjs'

export const sections = ['Integrated Terminal colors']

export default {
  'terminal.background': C.Midnight,
  'terminal.foreground': text.normal,
  'terminalCursor.foreground': accent.cursor,
  'terminal.ansiBlack': terminal16.black,
  'terminal.ansiRed': terminal16.red,
  'terminal.ansiGreen': terminal16.green,
  'terminal.ansiYellow': terminal16.yellow,
  'terminal.ansiBlue': terminal16.blue,
  'terminal.ansiMagenta': terminal16.magenta,
  'terminal.ansiCyan': terminal16.cyan,
  'terminal.ansiWhite': terminal16.white,
  'terminal.ansiBrightBlack': terminal16.brightBlack,
  'terminal.ansiBrightRed': terminal16.brightRed,
  'terminal.ansiBrightGreen': terminal16.brightGreen,
  'terminal.ansiBrightYellow': terminal16.brightYellow,
  'terminal.ansiBrightBlue': terminal16.brightBlue,
  'terminal.ansiBrightMagenta': terminal16.brightMagenta,
  'terminal.ansiBrightCyan': terminal16.brightCyan,
  'terminal.ansiBrightWhite': terminal16.brightWhite,
}
