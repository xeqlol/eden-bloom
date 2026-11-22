// THE flagship palette: Midnight Lilac, hand-tuned in the live overlay.
// The only kind of file in src/ allowed to contain raw hex literals besides
// its derived siblings: the 10 base colors verbatim, plus hand-tuned
// derivatives recorded as tuned(hex, note) where every note names the base
// color(s) it descends from. Everything downstream consumes Color objects
// from palettes — never strings.
import { hex, tuned, mix, alpha, blend } from '../lib/color.mjs'

/** The 10 agreed base colors (verbatim from the grilling session), in role slots. */
export const base = {
  bg: '#171729', raised: '#29233F', muted: '#827B9B', info: '#8EADE8',
  accent: '#D4A6E4', secondary: '#E9B5C5', error: '#F18C9A', warm: '#F5B58D',
  bright: '#FFD0A6', success: '#A9D3C1',
}

/** Poetic display names for the slots (used in notes, README, swatches). */
export const names = {
  bg: 'Midnight', raised: 'Plum', muted: 'Lavender', info: 'Ice Blue',
  accent: 'Lilac', secondary: 'Rose', error: 'Coral', warm: 'Peach',
  bright: 'Sunlight', success: 'Sage',
}

// Color-object view of the base ten.
const c = (slot) => hex(base[slot], `base ${names[slot]} (${slot})`)
export const C = {
  bg: c('bg'), raised: c('raised'), muted: c('muted'), info: c('info'),
  accent: c('accent'), secondary: c('secondary'), error: c('error'), warm: c('warm'),
  bright: c('bright'), success: c('success'),
}

/** Fully transparent — silences borders that must not draw (highlight frames). */
export const hidden = alpha(C.bg, 0, 'transparent (Midnight @0%) — hides a border')

/** Background chrome ramp, hand-tuned in the live overlay. Dark → raised. */
export const chrome = {
  sunken: tuned('#151426', '≈ darken(Midnight, .09) — overlay activityBar.background'),
  panel: tuned('#19182B', '≈ Midnight→Plum .25 — overlay sideBar/panel.background'),
  tabIdle: tuned('#1B1A2E', '≈ Midnight→Plum .35 — overlay tab.inactiveBackground'),
  titleBar: tuned('#1D1B31', '≈ Midnight→Plum .42 — overlay titleBar.activeBackground'),
  input: tuned('#211F35', '≈ Midnight→Plum .5 — overlay input.background'),
  tab: tuned('#242139', '≈ Midnight→Plum .55 — overlay tab.activeBackground, terminal.ansiBlack'),
  hover: tuned('#302A45', '≈ Midnight→Plum .7 — overlay list.hoverBackground'),
  selected: tuned('#51436F', '≈ Plum→Lilac .35 — overlay badge/list selection background'),
}

/** Borders and separators. */
export const line = {
  subtle: mix(C.bg, C.muted, 0.18, 'border: Midnight→Lavender .18'),
  panel: tuned('#39324F', '≈ Plum→Lavender .25 — overlay panel.border'),
  indent: tuned('#39344D', '≈ Plum→Lavender .28 — overlay editorIndentGuide.background'),
  activeIndent: tuned('#82739F', '≈ Lavender darkened — overlay editorIndentGuide.activeBackground'),
  strong: tuned('#514866', '≈ Plum→Lavender .4 — overlay input.border'),
}

/** Foreground text roles. */
export const text = {
  normal: tuned('#E9E2F2', '≈ Midnight→white .87 — overlay editor.foreground'),
  soft: tuned('#D9D0E8', '≈ Midnight→white .8 — overlay sideBar.foreground'),
  status: tuned('#E9DDF0', '≈ Midnight→Lilac-white — overlay statusBar.foreground'),
  title: tuned('#E9E0F0', '≈ Midnight→white .85 — overlay titleBar.activeForeground'),
  input: tuned('#F0E8F5', '≈ Midnight→white .9 — overlay input.foreground'),
  bright: tuned('#FFE2D1', '≈ Sunlight softened — overlay tab.activeForeground'),
  variable: tuned('#E8D8ED', '≈ Lilac→white — overlay Variables token'),
  dim: tuned('#9B91AD', '≈ Lavender desaturated — overlay tab.inactiveForeground'),
  ghost: tuned('#625D7A', '≈ Lavender→Midnight — overlay editorLineNumber.foreground'),
  operator: tuned('#B7A9CC', '≈ Lavender→white .35 — overlay Operators token'),
  lineActive: tuned('#D6B9D5', '≈ Lilac desaturated — overlay editorLineNumber.activeForeground'),
  activity: tuned('#F2C6C4', '≈ Rose lightened — overlay activityBar.foreground'),
  selected: tuned('#FFF0E4', '≈ Sunlight→white — overlay list.activeSelectionForeground'),
  onAccent: tuned('#FFF3E8', '≈ Sunlight→white — overlay button.foreground'),
  onBadge: tuned('#FFE1C9', '≈ Sunlight soft — overlay badge.foreground'),
}

/** Interactive accents. */
export const accent = {
  primary: C.accent,
  focus: tuned('#B9A6E8', '≈ Lilac→Lavender — overlay focusBorder'),
  bracket: tuned('#C5A8E8', '≈ Lilac lightened — overlay editorBracketMatch.border'),
  button: tuned('#806CA8', '≈ Lilac→Plum .45 — overlay button.background'),
  buttonHover: tuned('#927DBB', '≈ Lilac→Plum .3 — overlay button.hoverBackground'),
  peachy: tuned('#FFB98F', '≈ Sunlight→Peach — overlay activityBar.activeBorder'),
  rose: tuned('#E9A4B1', '≈ Rose dimmed — overlay panelTitle.activeBorder'),
  roseStrong: tuned('#F5A6A9', '≈ Rose→Coral — overlay tab.activeBorderTop'),
  cursor: C.bright,
}

/** Semantic / state colors. */
export const state = {
  error: C.error,
  errorBright: tuned('#FF8798', '≈ Coral lightened — overlay editorError.foreground'),
  warning: C.warm,
  warningBright: tuned('#F4B77F', '≈ Peach muted — overlay editorWarning.foreground'),
  info: tuned('#91B8F2', '≈ IceBlue muted — overlay editorInfo.foreground'),
  success: C.success,
  gitAdded: tuned('#91C7B2', '≈ Sage muted — overlay gitDecoration.addedResourceForeground'),
  gitModified: tuned('#E9A77F', '≈ Peach muted — overlay gitDecoration.modifiedResourceForeground'),
  gitDeleted: tuned('#E58D9B', '≈ Coral muted — overlay gitDecoration.deletedResourceForeground'),
}

/** Alpha-carrying roles (VSCode target only; WezTerm gets pre-blended opaque). */
const selectionBase = tuned('#62547F', '≈ Plum→Lilac .5 — overlay editor.selectionBackground')
export const alphaed = {
  selection: alpha(selectionBase, 0x77 / 0xff, 'selection: Plum→Lilac @47% — overlay'),
  lineHighlight: alpha(tuned('#29243B', '≈ Plum darkened — overlay editor.lineHighlightBackground'), 0x88 / 0xff, 'line highlight: Plum @53% — overlay'),
  bracketMatch: alpha(tuned('#8D79B6', '≈ Lilac→Plum muted — overlay editorBracketMatch.background'), 0x33 / 0xff, 'bracket match: Lilac @20% — overlay'),
}
/** Opaque WezTerm equivalent of the selection overlay. */
export const selectionOpaque = blend(selectionBase, C.bg, 0x77 / 0xff, 'selection pre-blended over Midnight for WezTerm')

/** Terminal ANSI-16, verbatim from the overlay's terminal.ansi* values. */
export const terminal16 = {
  black: tuned('#242139', '≈ Midnight→Plum .55 — terminal.ansiBlack'),
  red: tuned('#F18C9A', '≈ Coral lightened — terminal.ansiRed'),
  green: tuned('#91C7B2', '≈ Sage muted — terminal.ansiGreen'),
  yellow: tuned('#F4C18B', '≈ Peach light — terminal.ansiYellow'),
  blue: tuned('#8EADE8', '≈ IceBlue — terminal.ansiBlue'),
  magenta: tuned('#C19AD9', '≈ Lilac muted — terminal.ansiMagenta'),
  cyan: tuned('#86C8D3', '≈ Sage→IceBlue — terminal.ansiCyan'),
  white: tuned('#E9E2F2', '≈ Midnight→white .87 — terminal.ansiWhite'),
  brightBlack: tuned('#746A88', '≈ Lavender→Midnight — terminal.ansiBrightBlack'),
  brightRed: tuned('#FFB0B5', '≈ Coral light — terminal.ansiBrightRed'),
  brightGreen: tuned('#B3DEC9', '≈ Sage light — terminal.ansiBrightGreen'),
  brightYellow: tuned('#FFDBA8', '≈ Sunlight soft — terminal.ansiBrightYellow'),
  brightBlue: tuned('#B1C8FF', '≈ IceBlue→white — terminal.ansiBrightBlue'),
  brightMagenta: tuned('#E0B5E9', '≈ Lilac light — terminal.ansiBrightMagenta'),
  brightCyan: tuned('#A8E0E5', '≈ Sage→white — terminal.ansiBrightCyan'),
  brightWhite: tuned('#FFF4E8', '≈ Sunlight→white — terminal.ansiBrightWhite'),
}

/** Syntax token colors (the 16 overlay textMateRules, verbatim values). */
export const tokens = {
  comment: C.muted,
  keyword: C.accent,
  string: C.success,
  number: C.warm,
  fn: tuned('#F2C4A7', '≈ Peach light — Functions token'),
  type: tuned('#91B8E8', '≈ IceBlue muted — Types token'),
  variable: text.variable,
  parameter: C.secondary,
  property: tuned('#E8AFA5', '≈ Rose→Peach — Properties token'),
  operator: text.operator,
  tag: tuned('#E69CB4', '≈ Rose bright — Tags token'),
  attribute: tuned('#F2C18E', '≈ Peach light — Attributes token'),
  heading: tuned('#F3B6C5', '≈ Rose light — Markup heading token'),
  link: tuned('#9FC5F4', '≈ IceBlue light — Markup link token'),
  inserted: C.success,
  deleted: C.error,
}

/** Convenience surface roles for mappings. */
export const surfaces = {
  base: C.bg,
  editor: C.bg,
  panel: chrome.panel,
  sideBar: chrome.panel,
  activityBar: chrome.sunken,
  titleBar: chrome.titleBar,
  statusBar: C.raised,
  tab: chrome.tab,
  tabInactive: chrome.tabIdle,
  input: chrome.input,
  raised: chrome.tabIdle,
  overlay: chrome.titleBar,
  hover: chrome.hover,
  active: chrome.tab,
  selected: chrome.selected,
  sunken: chrome.sunken,
}

/** Registry entry consumed by build/emitters. Same shape as definePalette(). */
export const palette = {
  id: 'lilac',
  variant: 'Lilac',
  label: 'Eden Lilac',
  family: 'Eden Bloom',
  description: 'Dark lilac — the original Eden Bloom palette, hand-tuned in a live overlay',
  uiTheme: 'vs-dark',
  base,
  names,
  C,
  hidden,
  chrome,
  line,
  text,
  accent,
  state,
  alphaed,
  selectionOpaque,
  terminal16,
  tokens,
  surfaces,
}
