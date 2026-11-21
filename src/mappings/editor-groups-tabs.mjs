// Editor groups, tabs, empty groups.
import { chrome, text, accent } from '../palette.mjs'

export const sections = ['Editor Groups & Tabs']

export default {
  'tab.activeBackground': chrome.tab,
  'tab.activeForeground': text.bright,
  'tab.inactiveBackground': chrome.tabIdle,
  'tab.inactiveForeground': text.dim,
  'tab.activeBorderTop': accent.roseStrong,
}
