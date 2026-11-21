// CLI entry: writes the generated artifacts and prints the inference report
// (the acceptance worklist: sections still relying on suffix inference).
import { mkdirSync, writeFileSync } from 'node:fs'
import { build } from './src/build.mjs'

const { themeJson, weztermLua, inferredBySection, inferredCount } = build()

mkdirSync(new URL('./themes/', import.meta.url), { recursive: true })
writeFileSync(new URL('./themes/midnight-lilac-color-theme.json', import.meta.url), themeJson)
console.log(`themes/midnight-lilac-color-theme.json written (${themeJson.length} bytes)`)

writeFileSync(new URL('./wezterm_theme.lua', import.meta.url), weztermLua)
console.log(`wezterm_theme.lua written (${weztermLua.length} bytes)`)

if (inferredCount === 0) {
  console.log('all reference IDs have explicit mappings')
} else {
  console.log(`inferred (no explicit mapping yet): ${inferredCount}`)
  for (const [section, count] of Object.entries(inferredBySection)) {
    console.log(`  ${String(count).padStart(3)}  ${section}`)
  }
}
