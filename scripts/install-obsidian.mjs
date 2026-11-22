// Installs generated Obsidian themes into a vault's .obsidian/themes/.
// Dry-run default; --apply writes. --theme <id> narrows to one palette.
import { cpSync, mkdirSync, readdirSync, rmSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { palettes } from '../src/palettes/index.mjs'

const args = process.argv.slice(2)
const flag = (name) => {
  const i = args.indexOf(name)
  return i === -1 ? null : args[i + 1]
}
const vault = flag('--vault')
const only = flag('--theme')
const apply = args.includes('--apply')

if (!vault) {
  console.error('usage: node scripts/install-obsidian.mjs --vault <path> [--theme <id>] [--apply]')
  process.exit(1)
}

const themesRoot = `${vault.replaceAll('\\', '/')}/.obsidian/themes`
const selected = only ? palettes.filter((p) => p.id === only) : palettes
if (selected.length === 0) {
  console.error(`no palette with id '${only}' (known: ${palettes.map((p) => p.id).join(', ')})`)
  process.exit(1)
}

for (const p of selected) {
  const dest = `${themesRoot}/${p.label}`
  const src = fileURLToPath(new URL(`../obsidian/${p.id}/`, import.meta.url))
  if (apply) {
    rmSync(dest, { recursive: true, force: true })
    mkdirSync(dest, { recursive: true })
    cpSync(src, dest, { recursive: true })
    console.log(`installed: ${dest}`)
  } else {
    console.log(`would install ${p.label} -> ${dest} (exists: ${existsSync(dest) ? 'yes, will replace' : 'no'})`)
  }
}
if (!apply) {
  console.log('dry run — re-run with --apply to write')
} else {
  const live = new Set(selected.map((p) => p.label))
  for (const f of readdirSync(themesRoot)) {
    if (f.startsWith('Eden ') && !live.has(f)) {
      rmSync(`${themesRoot}/${f}`, { recursive: true, force: true })
      console.log(`removed stale: ${themesRoot}/${f}`)
    }
  }
  console.log('Restart Obsidian (or reload the app) and pick the theme in Settings → Appearance.')
}
