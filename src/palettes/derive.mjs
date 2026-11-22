// Formula layer for derived palettes: given 10 base colors (role slots),
// computes every role the same way the flagship's notes describe them
// (chrome.panel = bg→raised .25, etc.). New palettes start here and get
// polished later; overrides can replace any role wholesale.
import { hex, mix, lighten, darken, alpha, blend } from '../lib/color.mjs'

export const FAMILY = 'Eden Bloom'
export const SLOTS = ['bg', 'raised', 'muted', 'info', 'accent', 'secondary', 'error', 'warm', 'bright', 'success']

const d = (a, b, t, why) => mix(a, b, t, `${why}: ${a.note}→${b.note} .${String(t).replace(/^0/, '')}`)

/** All roles derived from the base Color view (see midnight-lilac.mjs notes). */
function deriveRoles(C) {
  const chrome = {
    sunken: darken(C.bg, 0.09, 'chrome.sunken: darken(bg)'),
    panel: d(C.bg, C.raised, 0.25, 'chrome.panel'),
    tabIdle: d(C.bg, C.raised, 0.35, 'chrome.tabIdle'),
    titleBar: d(C.bg, C.raised, 0.42, 'chrome.titleBar'),
    input: d(C.bg, C.raised, 0.5, 'chrome.input'),
    tab: d(C.bg, C.raised, 0.55, 'chrome.tab'),
    hover: d(C.bg, C.raised, 0.7, 'chrome.hover'),
    selected: d(C.raised, C.accent, 0.35, 'chrome.selected'),
  }
  const line = {
    subtle: d(C.bg, C.muted, 0.18, 'line.subtle'),
    panel: d(C.raised, C.muted, 0.25, 'line.panel'),
    indent: d(C.raised, C.muted, 0.28, 'line.indent'),
    activeIndent: darken(C.muted, 0.14, 'line.activeIndent: darken(muted)'),
    strong: d(C.raised, C.muted, 0.4, 'line.strong'),
  }
  const text = {
    normal: lighten(C.bg, 0.87, 'text.normal: bg→white .87'),
    soft: lighten(C.bg, 0.8, 'text.soft: bg→white .8'),
    status: mix(lighten(C.bg, 0.87), C.accent, 0.18, 'text.status: normal tinted with accent'),
    title: lighten(C.bg, 0.85, 'text.title: bg→white .85'),
    input: lighten(C.bg, 0.9, 'text.input: bg→white .9'),
    bright: lighten(C.bright, 0.4, 'text.bright: bright lifted toward white'),
    variable: lighten(C.accent, 0.45, 'text.variable: accent→white'),
    dim: lighten(C.muted, 0.18, 'text.dim: muted lightened'),
    ghost: d(C.muted, C.bg, 0.3, 'text.ghost'),
    operator: lighten(C.muted, 0.42, 'text.operator: muted→white'),
    lineActive: d(C.accent, C.muted, 0.3, 'text.lineActive'),
    activity: lighten(C.secondary, 0.15, 'text.activity: secondary lightened'),
    selected: lighten(C.bright, 0.7, 'text.selected: bright→white'),
    onAccent: lighten(C.bright, 0.75, 'text.onAccent: bright→white'),
    onBadge: lighten(C.bright, 0.4, 'text.onBadge: bright soft'),
  }
  const accent = {
    primary: C.accent,
    focus: d(C.accent, C.muted, 0.3, 'accent.focus'),
    bracket: lighten(C.accent, 0.1, 'accent.bracket: accent lightened'),
    button: d(C.accent, C.raised, 0.45, 'accent.button'),
    buttonHover: d(C.accent, C.raised, 0.3, 'accent.buttonHover'),
    peachy: d(C.bright, C.warm, 0.4, 'accent.peachy'),
    rose: d(C.secondary, C.error, 0.15, 'accent.rose'),
    roseStrong: d(C.secondary, C.error, 0.35, 'accent.roseStrong'),
    cursor: C.bright,
  }
  const state = {
    error: C.error,
    errorBright: lighten(C.error, 0.15, 'state.errorBright: error lightened'),
    warning: C.warm,
    warningBright: d(C.warm, C.muted, 0.12, 'state.warningBright'),
    info: d(C.info, C.muted, 0.15, 'state.info'),
    success: C.success,
    gitAdded: d(C.success, C.muted, 0.15, 'state.gitAdded'),
    gitModified: d(C.warm, C.muted, 0.12, 'state.gitModified'),
    gitDeleted: d(C.error, C.muted, 0.1, 'state.gitDeleted'),
  }
  const selectionBase = d(C.raised, C.accent, 0.5, 'alphaed.selection base')
  const alphaed = {
    selection: alpha(selectionBase, 0x77 / 0xff, 'selection: raised→accent @47%'),
    lineHighlight: alpha(darken(C.raised, 0.06), 0x88 / 0xff, 'line highlight: raised darkened @53%'),
    bracketMatch: alpha(d(C.accent, C.raised, 0.25), 0x33 / 0xff, 'bracket match: accent @20%'),
  }
  const selectionOpaque = blend(selectionBase, C.bg, 0x77 / 0xff, 'selection pre-blended over bg for WezTerm')
  const ansiCyan = d(C.success, C.info, 0.45, 'terminal.cyan')
  const terminal16 = {
    black: chrome.tab,
    red: C.error,
    green: state.gitAdded,
    yellow: d(C.warm, C.bright, 0.3, 'terminal.yellow'),
    blue: C.info,
    magenta: d(C.accent, C.muted, 0.2, 'terminal.magenta'),
    cyan: ansiCyan,
    white: text.normal,
    brightBlack: d(C.muted, C.bg, 0.35, 'terminal.brightBlack'),
    brightRed: lighten(C.error, 0.3, 'terminal.brightRed'),
    brightGreen: lighten(C.success, 0.25, 'terminal.brightGreen'),
    brightYellow: lighten(C.bright, 0.25, 'terminal.brightYellow'),
    brightBlue: lighten(C.info, 0.35, 'terminal.brightBlue'),
    brightMagenta: lighten(C.accent, 0.3, 'terminal.brightMagenta'),
    brightCyan: lighten(ansiCyan, 0.3, 'terminal.brightCyan'),
    brightWhite: lighten(C.bright, 0.55, 'terminal.brightWhite'),
  }
  const tokens = {
    comment: C.muted,
    keyword: C.accent,
    string: C.success,
    number: C.warm,
    fn: lighten(C.warm, 0.15, 'token fn: warm light'),
    type: d(C.info, C.muted, 0.15, 'token type'),
    variable: text.variable,
    parameter: C.secondary,
    property: d(C.secondary, C.warm, 0.4, 'token property'),
    operator: text.operator,
    tag: d(C.secondary, C.error, 0.25, 'token tag'),
    attribute: lighten(C.warm, 0.15, 'token attribute'),
    heading: lighten(C.secondary, 0.1, 'token heading'),
    link: lighten(C.info, 0.2, 'token link'),
    inserted: C.success,
    deleted: C.error,
  }
  const surfaces = {
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
  const hidden = alpha(C.bg, 0, 'transparent (bg @0%) — hides a border')
  return { hidden, chrome, line, text, accent, state, alphaed, selectionOpaque, terminal16, tokens, surfaces }
}

/**
 * Defines a palette from its 10 base colors. `spec.overrides(roles)` may
 * replace whole role groups (spread inside: `{ text: { ...d.text, dim: … } }`).
 */
export function definePalette(spec) {
  for (const slot of SLOTS) {
    if (typeof spec.base[slot] !== 'string') throw new Error(`palette ${spec.id}: base.${slot} is missing`)
    if (typeof spec.names[slot] !== 'string') throw new Error(`palette ${spec.id}: names.${slot} is missing`)
  }
  const C = {}
  for (const slot of SLOTS) C[slot] = hex(spec.base[slot], `base ${spec.names[slot]} (${slot})`)
  const roles = deriveRoles(C)
  if (spec.overrides) Object.assign(roles, spec.overrides(roles))
  return {
    id: spec.id,
    variant: spec.variant,
    label: `Eden ${spec.variant}`,
    family: FAMILY,
    description: spec.description,
    uiTheme: spec.uiTheme ?? 'vs-dark',
    base: { ...spec.base },
    names: { ...spec.names },
    C,
    ...roles,
  }
}
