// Buttons, dropdowns, inputs, scrollbar, progress; Badge (fully covered by overlay).
import { chrome, text, line, accent } from '../palette.mjs'

export const sections = ['Button control', 'Dropdown control', 'Input control', 'Scrollbar control', 'Progress bar']

export default {
  'input.background': chrome.input,
  'input.foreground': text.input,
  'input.border': line.strong,
  'button.background': accent.button,
  'button.foreground': text.onAccent,
  'button.hoverBackground': accent.buttonHover,
  'badge.background': chrome.selected,
  'badge.foreground': text.onBadge,
}
