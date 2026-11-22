// ~/.wezterm.lua wiring: inserts (or refreshes) the managed eden-bloom block
// right before `return config`. Registers every palette as a color scheme and
// selects the first one as the default. Pure core + CLI with dry-run default
// and timestamped backups. Idempotent: a second run replaces the block in
// place, byte-stable.
import { readFileSync, writeFileSync, copyFileSync } from 'node:fs'

const BEGIN = '-- >>> eden-bloom >>> (managed by Eden Bloom deploy.sh — delete this block to revert)'
const END = '-- <<< eden-bloom <<<'

// The pre-rename managed block (Midnight Lilac era). It referenced
// wezterm_theme.lua at the repo root, which no longer exists — any surviving
// copy must be migrated, in place, to the eden-bloom block. Position matters:
// user blocks layered "after the theme block" must stay after it.
const LEGACY_BEGIN = '-- >>> midnight-lilac >>>'
const LEGACY_END = '-- <<< midnight-lilac <<<'

// Detection keys — prefixes of the full markers, so hand-trimmed blocks
// (e.g. a BEGIN comment someone shortened) are still recognized.
const EDEN_KEY = '-- >>> eden-bloom >>>'
const LEGACY_KEY = LEGACY_BEGIN

/** [start, endExclusive] of a managed block, or null when absent. */
function span(text, beginMarker, endMarker) {
  const b = text.indexOf(beginMarker)
  if (b === -1) return null
  const e = text.indexOf(endMarker, b)
  if (e === -1) throw new Error(`found ${beginMarker} marker without its END — fix ~/.wezterm.lua manually`)
  return [b, e + endMarker.length]
}

const buildBlock = (themePaths) => [
  BEGIN,
  'local eden = {',
  ...themePaths.map((t) => `  '${t.replaceAll('\\', '/')}',`),
  '}',
  'config.color_schemes = config.color_schemes or {}',
  'local flagship',
  'for _, f in ipairs(eden) do',
  '  local t = dofile(f)',
  '  config.color_schemes[t.name] = t.colors',
  '  pcall(wezterm.add_watch_file, f)',
  '  if flagship == nil then flagship = t end',
  'end',
  'config.window_frame = flagship.window_frame',
  'config.color_scheme = flagship.name',
  END,
].join('\n')

/**
 * Pure wiring. Returns { output, changed }. Prefers the legacy block's
 * position (user blocks layered after the theme keep working), then the
 * existing eden-bloom block, then a fresh insert before `return config`.
 * Throws when no anchor exists — we refuse to guess.
 */
export function applyWezterm(luaText, themePaths) {
  const block = buildBlock(themePaths)

  const legacy = span(luaText, LEGACY_KEY, LEGACY_END)
  const eden = span(luaText, EDEN_KEY, END)

  if (legacy) {
    // Migration: drop any eden block elsewhere, then take the legacy spot.
    let out = luaText
    if (eden) out = out.slice(0, eden[0]) + out.slice(eden[1])
    const l2 = span(out, LEGACY_KEY, LEGACY_END)
    const output = out.slice(0, l2[0]) + block + out.slice(l2[1])
    return { output, changed: output !== luaText }
  }

  if (eden) {
    const existing = luaText.slice(eden[0], eden[1])
    if (existing === block) return { output: luaText, changed: false }
    return { output: luaText.slice(0, eden[0]) + block + luaText.slice(eden[1]), changed: true }
  }

  const m = /^return config/m.exec(luaText)
  if (!m) {
    throw new Error('no `return config` statement found in wezterm.lua — aborting rather than guessing where to insert')
  }
  return { output: luaText.slice(0, m.index) + block + '\n\n' + luaText.slice(m.index), changed: true }
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
const luaPath = flag('--lua')
const themePaths = []
for (let i = 0; i < args.length; i += 1) {
  if (args[i] === '--theme') themePaths.push(args[i + 1])
}
const apply = args.includes('--apply')

if (!luaPath || themePaths.length === 0) {
  console.error('usage: node scripts/apply-wezterm.mjs --lua <path> --theme <path> [--theme <path> …] [--apply]')
  process.exit(1)
}

const text = readFileSync(luaPath, 'utf8')
let result
try {
  result = applyWezterm(text, themePaths)
} catch (err) {
  console.error(`aborting, nothing written: ${err.message}`)
  process.exit(1)
}

if (!result.changed) {
  console.log(`${luaPath}: managed block already current, nothing to do`)
  process.exit(0)
}

console.log(`${luaPath} would ${text.includes(BEGIN) ? 'refresh' : 'gain'} the managed eden-bloom block:`)
console.log(result.output.split('\n').filter((l) => l.includes('eden') || l.includes('dofile') || l.includes('flagship')).map((l) => `  ${l.trim()}`).join('\n'))

if (!apply) {
  console.log('dry run — re-run with --apply to write (a .eb-backup-* copy is kept)')
  process.exit(0)
}

const stamp = new Date().toISOString().replaceAll(/[-:T]/g, '').slice(0, 14)
const backup = `${luaPath}.eb-backup-${stamp}`
copyFileSync(luaPath, backup)
writeFileSync(luaPath, result.output)
console.log(`written: ${luaPath} (backup: ${backup})`)
}
