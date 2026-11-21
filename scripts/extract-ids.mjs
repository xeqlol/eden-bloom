// Extracts the authoritative workbench color ID list into a committed test fixture.
// Sources: research/vscode-theme-color-ids.md (the 906 missing IDs, 58 doc sections)
// + vscode_theme.json overlay (the 65 already-set IDs). Invariants are hard-asserted
// before the fixture is written: 906 + 65 = 971, zero intersection, all unique.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'

const md = readFileSync(new URL('../research/vscode-theme-color-ids.md', import.meta.url), 'utf8')
const overlay = JSON.parse(readFileSync(new URL('../vscode_theme.json', import.meta.url), 'utf8'))

const START = '## Отсутствующие ID по разделам'
const END = '## Кросс-проверка'
const startIdx = md.indexOf(START)
const endIdx = md.indexOf(END)
if (startIdx === -1 || endIdx === -1 || endIdx < startIdx) {
  console.error('research md structure changed: section markers not found')
  process.exit(1)
}
const body = md.slice(startIdx, endIdx)

const HEADER_RE = /^### (.+?) — отсутствует (\d+) из \d+ \(задано \d+\)\s*$/gm
const ID_RE = /^- `([A-Za-z][\w.]*)` — /gm

const sections = {}
let headerMatch
while ((headerMatch = HEADER_RE.exec(body)) !== null) {
  const [, name, missing] = headerMatch
  const chunkStart = headerMatch.index + headerMatch[0].length
  // collect ID lines until the next ### header or end of body
  const chunkEnd = body.indexOf('\n### ', chunkStart) === -1
    ? body.length
    : body.indexOf('\n### ', chunkStart) + 1
  const chunk = body.slice(chunkStart, chunkEnd)
  const ids = [...chunk.matchAll(ID_RE)].map((m) => m[1])
  if (ids.length !== Number(missing)) {
    console.error(`section "${name}": expected ${missing} IDs, extracted ${ids.length}`)
    process.exit(1)
  }
  sections[name] = ids.sort()
  HEADER_RE.lastIndex = chunkEnd
}

const sectionIds = Object.values(sections).flat()
const overlayKeys = Object.keys(overlay['workbench.colorCustomizations']).sort()

const fail = (msg) => { console.error(msg); process.exit(1) }
// 58 ### headers in the doc body, but «пропусков нет» sections (fully covered by
// the overlay, e.g. Badge) contribute no IDs — 57 sections make it into the fixture.
if (Object.keys(sections).length !== 57) fail(`expected 57 sections, got ${Object.keys(sections).length}`)
if (sectionIds.length !== 906) fail(`expected 906 missing IDs, got ${sectionIds.length}`)
if (new Set(sectionIds).size !== 906) fail('missing IDs are not unique')
if (overlayKeys.length !== 65) fail(`expected 65 overlay keys, got ${overlayKeys.length}`)
const overlap = sectionIds.filter((id) => overlayKeys.includes(id))
if (overlap.length) fail(`overlap between sections and overlay: ${overlap.join(', ')}`)

const ids = [...new Set([...sectionIds, ...overlayKeys])].sort()
if (ids.length !== 971) fail(`expected union of 971, got ${ids.length}`)

const fixture = {
  source: 'research/vscode-theme-color-ids.md (docs DateApproved 2026-11-18) + vscode_theme.json overlay',
  extractedAt: new Date().toISOString().slice(0, 10),
  total: ids.length,
  sections,
  ids,
}
mkdirSync(new URL('../test/fixtures/', import.meta.url), { recursive: true })
writeFileSync(
  new URL('../test/fixtures/reference-ids.json', import.meta.url),
  JSON.stringify(fixture, null, 2) + '\n',
)
console.log(`fixture written: ${ids.length} IDs across ${Object.keys(sections).length} sections`)
