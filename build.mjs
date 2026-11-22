// CLI entry: writes every palette's artifacts and prints the inference report
// (the acceptance worklist: sections still relying on suffix inference).
import { mkdirSync, writeFileSync, rmSync, readdirSync } from 'node:fs'
import { build } from './src/build.mjs'
import { emitPreview } from './src/emit/preview.mjs'
import { palettes, flagship } from './src/palettes/index.mjs'
import pkg from './package.json' with { type: 'json' }

const write = (rel, data) => {
  writeFileSync(new URL(`./${rel}`, import.meta.url), data)
  console.log(`${rel} written (${data.length} bytes)`)
}

let worstInferred = 0
const reports = []
for (const p of palettes) {
  const opts = { version: pkg.version, author: pkg.publisher, authorUrl: pkg.repository.url.replace(/\.git$/, '') }
  const { themeJson, weztermLua, obsidianCss, obsidianManifest, iconPng, inferredBySection, inferredCount } = build(p, opts)

  for (const dir of ['themes', 'wezterm', `obsidian/${p.id}`, 'icons', 'preview']) {
    mkdirSync(new URL(`./${dir}/`, import.meta.url), { recursive: true })
  }

  write(`themes/${p.id}-color-theme.json`, themeJson)
  write(`wezterm/${p.id}.lua`, weztermLua)
  write(`obsidian/${p.id}/theme.css`, obsidianCss)
  write(`obsidian/${p.id}/manifest.json`, obsidianManifest)
  write(`icons/${p.id}.png`, iconPng)

  worstInferred = Math.max(worstInferred, inferredCount)
  reports.push([p, inferredCount, inferredBySection])
}

writeFileSync(new URL('./icon.png', import.meta.url), build(flagship).iconPng)
console.log(`icon.png written (brand bloom from the flagship, ${flagship.label})`)

write('preview/index.html', emitPreview(palettes))

// prune stale generated themes (e.g. after a palette rename)
const live = new Set(palettes.flatMap((p) => [`${p.id}-color-theme.json`]))
for (const f of readdirSync(new URL('./themes/', import.meta.url))) {
  if (!live.has(f)) { rmSync(new URL(`./themes/${f}`, import.meta.url)); console.log(`themes/${f} removed (stale)`) }
}

if (worstInferred === 0) {
  console.log('all reference IDs have explicit mappings, for every palette')
} else {
  for (const [p, count, bySection] of reports) {
    if (!count) continue
    console.log(`${p.label}: inferred (no explicit mapping yet): ${count}`)
    for (const [section, n] of Object.entries(bySection)) {
      console.log(`  ${String(n).padStart(3)}  ${section}`)
    }
  }
}
