// Editor groups, tabs, empty groups.

export const sections = ['Editor Groups & Tabs']

export default (p) => ({
  'tab.activeBackground': p.chrome.tab,
  'tab.activeForeground': p.text.bright,
  'tab.inactiveBackground': p.chrome.tabIdle,
  'tab.inactiveForeground': p.text.dim,
  'tab.activeBorderTop': p.accent.roseStrong,
})
