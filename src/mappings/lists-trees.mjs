// Lists and trees: explorer, search results, outline, scm view.
import { chrome, text } from '../palette.mjs'

export const sections = ['Lists and trees']

export default {
  'list.activeSelectionBackground': chrome.selected,
  'list.activeSelectionForeground': text.selected,
  'list.hoverBackground': chrome.hover,
}
