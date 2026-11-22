// Live settings.json surgery: remove the legacy overlay blocks and pin
// workbench.colorTheme to the flagship Eden Bloom theme. Pure core (testable)
// + CLI with dry-run default, timestamped backups (pruned to 5) and EOL
// preservation.
import { readFileSync, writeFileSync, copyFileSync, readdirSync } from 'node:fs'
import { flagship } from '../src/palettes/index.mjs'

/** String-aware comment stripper: removes //… and /*…*\/ outside strings only. */
export function stripJsonc(text) {
  let out = ''
  let i = 0
  let inString = false
  while (i < text.length) {
    const ch = text[i]
    if (inString) {
      out += ch
      if (ch === '\\') { out += text[i + 1] ?? ''; i += 2; continue }
      if (ch === '"') inString = false
      i += 1
      continue
    }
    if (ch === '"') { inString = true; out += ch; i += 1; continue }
    if (ch === '/' && text[i + 1] === '/') {
      while (i < text.length && text[i] !== '\n') i += 1
      continue
    }
    if (ch === '/' && text[i + 1] === '*') {
      i += 2
      while (i < text.length && !(text[i] === '*' && text[i + 1] === '/')) {
        if (text[i] === '\n') out += '\n'
        i += 1
      }
      i += 2
      continue
    }
    out += ch
    i += 1
  }
  return out
}

/** Drops commas whose next non-space char is } or ] (string-aware). */
function removeTrailingCommas(text) {
  let out = ''
  let inString = false
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i]
    if (inString) {
      out += ch
      if (ch === '\\') { out += text[i + 1] ?? ''; i += 1; continue }
      if (ch === '"') inString = false
      continue
    }
    if (ch === '"') { inString = true; out += ch; continue }
    if (ch === ',') {
      let j = i + 1
      while (j < text.length && /\s/.test(text[j])) j += 1
      if (text[j] === '}' || text[j] === ']') continue
    }
    out += ch
  }
  return out
}

/**
 * Pure surgery. Returns { output, changed }. When nothing changes the input
 * text is returned untouched (so an already-migrated file keeps its comments).
 * Throws on unparseable content — the CLI never writes in that case.
 */
export function applySettings(text) {
  const eol = text.includes('\r\n') ? '\r\n' : '\n'
  const parsed = JSON.parse(removeTrailingCommas(stripJsonc(text)))
  const before = JSON.stringify(parsed)
  delete parsed['workbench.colorCustomizations']
  delete parsed['editor.tokenColorCustomizations']
  parsed['workbench.colorTheme'] = flagship.label
  const changed = JSON.stringify(parsed) !== before
  if (!changed) return { output: text, changed: false }
  const output = JSON.stringify(parsed, null, 2).replaceAll('\n', eol) + eol
  return { output, changed: true }
}

// ---- CLI (direct invocation only; tests import the pure core above) --------
import { pathToFileURL } from 'node:url'

const isDirect = import.meta.url === pathToFileURL(process.argv[1] ?? '').href
if (!isDirect) {
  // imported as a module — skip CLI
} else {
const args = process.argv.slice(2)
const flag = (name) => {
  const i = args.indexOf(name)
  return i === -1 ? null : args[i + 1]
}
const settingsPath = flag('--settings')
const apply = args.includes('--apply')

if (!settingsPath) {
  console.error('usage: node scripts/apply-settings.mjs --settings <path> [--apply]')
  process.exit(1)
}

const text = readFileSync(settingsPath, 'utf8')
let result
try {
  result = applySettings(text)
} catch (err) {
  console.error(`aborting, nothing written: ${err.message}`)
  process.exit(1)
}

if (!result.changed) {
  console.log(`${settingsPath}: already migrated, nothing to do`)
  process.exit(0)
}

const printDiff = (before, after) => {
  const a = before.split('\n')
  const b = after.split('\n')
  const max = Math.max(a.length, b.length)
  let shown = 0
  for (let i = 0; i < max && shown < 40; i += 1) {
    if (a[i] !== b[i]) {
      if (a[i] !== undefined) console.log(`  - ${a[i].slice(0, 100)}`)
      if (b[i] !== undefined) console.log(`  + ${b[i].slice(0, 100)}`)
      shown += 1
    }
  }
}
console.log(`${settingsPath} would change:`)
printDiff(text, result.output)

if (!apply) {
  console.log('dry run — re-run with --apply to write (a .eb-backup-* copy is kept)')
  process.exit(0)
}

const stamp = new Date().toISOString().replaceAll(/[-:T]/g, '').slice(0, 14)
const backup = `${settingsPath}.eb-backup-${stamp}`
copyFileSync(settingsPath, backup)
writeFileSync(settingsPath, result.output)

const dir = settingsPath.replaceAll('\\', '/').split('/').slice(0, -1).join('/')
const base = settingsPath.replaceAll('\\', '/').split('/').pop()
const backups = readdirSync(dir).filter((f) => f.startsWith(`${base}.eb-backup-`)).sort()
for (const old of backups.slice(0, Math.max(0, backups.length - 5))) {
  const { unlinkSync } = await import('node:fs')
  unlinkSync(`${dir}/${old}`)
}
console.log(`written: ${settingsPath} (backup: ${backup})`)
}
