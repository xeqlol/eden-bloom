// Suffix/prefix inference: a total fallback that assigns a palette-consistent
// Color to every reference ID not yet mapped explicitly. Correct-but-plain by
// design — acceptance batches replace inferred values with explicit ones, and
// the build report shows which sections still rely on inference.
import {
  C, chrome, text, line, state,
} from '../palette.mjs'
import { alpha, darken } from '../lib/color.mjs'

const tint = (c, t) => alpha(c, t, `inferred tint of ${c.note}`)

export function inferColor(id) {
  const l = id.toLowerCase()
  const isBg = /background$/.test(l) || /\.background/.test(l)
  const isFg = /foreground$/.test(l) || /\.foreground/.test(l)

  // Semantic states first — they win over shape suffixes.
  if (/(^|[^a-z])error/.test(l)) return isBg ? tint(state.error, 0.15) : state.errorBright
  if (/(^|[^a-z])warning/.test(l)) return isBg ? tint(state.warning, 0.12) : state.warningBright
  if (/information|(^|[^a-z])info/.test(l)) return isBg ? tint(state.info, 0.12) : state.info
  if (/success|added|inserted|resolved/.test(l)) return isBg ? tint(state.success, 0.12) : state.gitAdded
  if (/deleted|removed|conflict/.test(l)) return isBg ? tint(state.error, 0.12) : state.gitDeleted
  if (/modified|changed|untracked|staged|incoming/.test(l)) return isBg ? tint(state.warning, 0.1) : state.gitModified

  if (/deactivated|disabled|inactive|unfocused|unactive/.test(l)) {
    return isBg ? chrome.tabIdle : text.dim
  }
  if (/shadow/.test(l)) return darken(C.Midnight, 0.55, 'inferred widget shadow')
  if (/hover/.test(l)) return isBg ? chrome.hover : text.normal
  if (/active|focused|selected|selection|highlight/.test(l)) {
    return isBg ? chrome.selected : text.normal
  }
  if (isBg) return chrome.tabIdle
  if (/border|sash|divider|separator|rule/.test(l)) return line.panel
  if (isFg) return text.normal
  if (/icon/.test(l)) return text.dim
  if (/title|heading|label|name/.test(l)) return text.normal
  return text.normal
}
