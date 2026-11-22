// Buttons, dropdowns, inputs, scrollbar, progress; Badge (fully covered by overlay).

export const sections = ['Button control', 'Dropdown control', 'Input control', 'Scrollbar control', 'Progress bar']

export default (p) => ({
  'input.background': p.chrome.input,
  'input.foreground': p.text.input,
  'input.border': p.line.strong,
  'button.background': p.accent.button,
  'button.foreground': p.text.onAccent,
  'button.hoverBackground': p.accent.buttonHover,
  'badge.background': p.chrome.selected,
  'badge.foreground': p.text.onBadge,
})
