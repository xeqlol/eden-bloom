import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { build } from '../src/build.mjs'
import { palettes, flagship } from '../src/palettes/index.mjs'

const fixture = JSON.parse(
  readFileSync(new URL('./fixtures/reference-ids.json', import.meta.url), 'utf8'),
)
const seed = JSON.parse(readFileSync(new URL('../vscode_theme.json', import.meta.url), 'utf8'))
const themes = new Map(palettes.map((p) => [p, build(p)]))

test('every theme covers exactly the 971 reference workbench color IDs', () => {
  for (const p of palettes) {
    const theme = JSON.parse(themes.get(p).themeJson)
    const emitted = Object.keys(theme.colors)
    const emittedSet = new Set(emitted)
    const idSet = new Set(fixture.ids)
    const unknown = emitted.filter((id) => !idSet.has(id))
    const missing = fixture.ids.filter((id) => !emittedSet.has(id))
    assert.deepEqual(unknown, [], `${p.id}: theme sets IDs outside the reference`)
    assert.deepEqual(missing, [], `${p.id}: theme is missing ${missing.length} reference IDs (first 20: ${missing.slice(0, 20).join(', ')})`)
  }
})

test('every theme header declares a dark named Eden theme', () => {
  for (const p of palettes) {
    const theme = JSON.parse(themes.get(p).themeJson)
    assert.equal(theme.name, p.label)
    assert.equal(theme.type, 'dark')
  }
})

test('tokenColors migrate the 16 overlay textMateRules with scope and font styles intact', () => {
  const seedRules = seed['editor.tokenColorCustomizations'].textMateRules
  for (const p of palettes) {
    const theme = JSON.parse(themes.get(p).themeJson)
    assert.equal(theme.tokenColors.length, seedRules.length, `${p.id}: rule count`)
    theme.tokenColors.forEach((rule, i) => {
      assert.equal(rule.name, seedRules[i].name, `${p.id}: rule name`)
      assert.deepEqual(rule.scope, seedRules[i].scope, `${p.id}: rule scope`)
      assert.equal(rule.settings.fontStyle, seedRules[i].settings.fontStyle, `${p.id}: fontStyle`)
    })
  }
})

test('flagship tokenColors keep the overlay colors verbatim', () => {
  const seedRules = seed['editor.tokenColorCustomizations'].textMateRules
  const theme = JSON.parse(themes.get(flagship).themeJson)
  theme.tokenColors.forEach((rule, i) => {
    assert.equal(rule.settings.foreground.toLowerCase(), seedRules[i].settings.foreground.toLowerCase())
  })
})

test('overlay values survive migration spot-checks (incl. alpha forms)', () => {
  const o = seed['workbench.colorCustomizations']
  const theme = JSON.parse(themes.get(flagship).themeJson)
  const spots = [
    'editor.background', 'sideBar.background', 'activityBar.background', 'tab.activeBackground',
    'statusBar.background', 'editor.selectionBackground', 'editor.lineHighlightBackground',
    'focusBorder', 'editorError.foreground', 'gitDecoration.addedResourceForeground',
  ]
  for (const id of spots) {
    assert.equal(theme.colors[id].toLowerCase(), o[id].toLowerCase(), `spot: ${id}`)
  }
})

test('every theme is complete enough to differ from its siblings', () => {
  const jsons = palettes.map((p) => themes.get(p).themeJson)
  for (let i = 1; i < jsons.length; i++) {
    assert.notEqual(jsons[i], jsons[0], `${palettes[i].id} collapsed onto the flagship`)
  }
})
