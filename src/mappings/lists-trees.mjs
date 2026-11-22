// Lists and trees: explorer, search results, outline, scm view.

export const sections = ['Lists and trees']

export default (p) => ({
  'list.activeSelectionBackground': p.chrome.selected,
  'list.activeSelectionForeground': p.text.selected,
  'list.hoverBackground': p.chrome.hover,
})
