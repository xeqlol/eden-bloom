// Bottom panel, status bar, title bar, menu bar, command center.

export const sections = ['Panel colors', 'Status Bar colors', 'Title Bar colors', 'Menu Bar colors', 'Command Center colors']

export default (p) => ({
  'statusBar.background': p.C.raised,
  'statusBar.foreground': p.text.status,
  'titleBar.activeBackground': p.chrome.titleBar,
  'titleBar.activeForeground': p.text.title,
  'panel.background': p.chrome.panel,
  'panel.border': p.line.panel,
  'panelTitle.activeBorder': p.accent.rose,
})
