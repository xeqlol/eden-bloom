// Bottom panel, status bar, title bar, menu bar, command center.
import { C, chrome, text, line, accent } from '../palette.mjs'

export const sections = ['Panel colors', 'Status Bar colors', 'Title Bar colors', 'Menu Bar colors', 'Command Center colors']

export default {
  'statusBar.background': C.Plum,
  'statusBar.foreground': text.status,
  'titleBar.activeBackground': chrome.titleBar,
  'titleBar.activeForeground': text.title,
  'panel.background': chrome.panel,
  'panel.border': line.panel,
  'panelTitle.activeBorder': accent.rose,
}
