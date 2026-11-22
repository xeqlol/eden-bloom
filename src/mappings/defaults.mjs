// Suffix/prefix inference: a total fallback that assigns a palette-consistent
// Color to every reference ID not yet mapped explicitly. Correct-but-plain by
// design — acceptance batches replace inferred values with explicit ones, and
// the build report shows which sections still rely on inference.
import { alpha, darken } from '../lib/color.mjs'

const tint = (c, t) => alpha(c, t, `inferred tint of ${c.note}`)

export function inferColor(id, p) {
  const l = id.toLowerCase()
  const isBg = /background$/.test(l) || /\.background/.test(l)
  const isFg = /foreground$/.test(l) || /\.foreground/.test(l)

  // Semantic states first — they win over shape suffixes.
  if (/(^|[^a-z])error/.test(l)) return isBg ? tint(p.state.error, 0.15) : p.state.errorBright
  if (/(^|[^a-z])warning/.test(l)) return isBg ? tint(p.state.warning, 0.12) : p.state.warningBright
  if (/information|(^|[^a-z])info/.test(l)) return isBg ? tint(p.state.info, 0.12) : p.state.info
  if (/success|added|inserted|resolved/.test(l)) return isBg ? tint(p.state.success, 0.12) : p.state.gitAdded
  if (/deleted|removed|conflict/.test(l)) return isBg ? tint(p.state.error, 0.12) : p.state.gitDeleted
  if (/modified|changed|untracked|staged|incoming/.test(l)) return isBg ? tint(p.state.warning, 0.1) : p.state.gitModified

  if (/deactivated|disabled|inactive|unfocused|unactive/.test(l)) {
    return isBg ? p.chrome.tabIdle : p.text.dim
  }
  // Borders around highlight regions draw loud frames by mistake — stock themes
  // leave them off; silence the whole family (pinned by a dedicated test).
  if (/highlight/i.test(l) && /border/i.test(l)) return p.hidden
  if (/shadow/.test(l)) return darken(p.C.bg, 0.55, 'inferred widget shadow')
  if (/hover/.test(l)) return isBg ? p.chrome.hover : p.text.normal
  if (/active|focused|selected|selection|highlight/.test(l)) {
    return isBg ? p.chrome.selected : p.text.normal
  }
  if (isBg) return p.chrome.tabIdle
  if (/border|sash|divider|separator|rule/.test(l)) return p.line.panel
  if (isFg) return p.text.normal
  if (/icon/.test(l)) return p.text.dim
  if (/title|heading|label|name/.test(l)) return p.text.normal
  return p.text.normal
}
