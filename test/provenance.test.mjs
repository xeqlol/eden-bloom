import test from 'node:test'
import assert from 'node:assert/strict'
import { build } from '../src/build.mjs'
import { getRegistry } from '../src/lib/color.mjs'
import { palettes } from '../src/palettes/index.mjs'

// Per-artifact floors: the theme JSON carries all 971 workbench IDs, the
// wezterm scheme and the obsidian css are compact by design.
const MIN_HEXES = { themeJson: 900, weztermLua: 50, obsidianCss: 60 }

test('every hex in every generated artifact traces to the color registry', () => {
  for (const p of palettes) {
    const { themeJson, weztermLua, obsidianCss } = build(p)
    const registry = getRegistry()
    const artifacts = { themeJson, weztermLua, obsidianCss }
    for (const [artifact, text] of Object.entries(artifacts)) {
      const hexes = [...text.matchAll(/#[0-9A-Fa-f]{6,8}\b/g)].map((m) => m[0].toLowerCase())
      assert.ok(hexes.length >= MIN_HEXES[artifact], `${p.id}/${artifact}: expected at least ${MIN_HEXES[artifact]} hex values, found ${hexes.length}`)
      const smuggled = [...new Set(hexes)].filter((hx) => !registry.has(hx))
      assert.deepEqual(smuggled, [], `${p.id}/${artifact}: hex values appeared that no Color object ever produced`)
    }
  }
})
