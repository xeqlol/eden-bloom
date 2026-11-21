import test from 'node:test'
import assert from 'node:assert/strict'
import { build } from '../src/build.mjs'
import { getRegistry } from '../src/lib/color.mjs'

test('every hex in the generated theme traces to the color registry', () => {
  const { themeJson } = build()
  const registry = getRegistry()
  const hexes = [...themeJson.matchAll(/#[0-9A-Fa-f]{6,8}\b/g)].map((m) => m[0].toLowerCase())
  assert.ok(hexes.length > 980, `expected ~987 hex values (971 workbench + 16 tokens), found ${hexes.length}`)
  const smuggled = [...new Set(hexes)].filter((h) => !registry.has(h))
  assert.deepEqual(smuggled, [], 'hex values appeared that no Color object ever produced')
})
