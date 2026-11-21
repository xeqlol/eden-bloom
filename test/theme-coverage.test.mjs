import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { build } from '../src/build.mjs'

const fixture = JSON.parse(
  readFileSync(new URL('./fixtures/reference-ids.json', import.meta.url), 'utf8'),
)
const seed = JSON.parse(readFileSync(new URL('../vscode_theme.json', import.meta.url), 'utf8'))
const { themeJson } = build()
const theme = JSON.parse(themeJson)

test('theme covers exactly the 971 reference workbench color IDs', () => {
  const emitted = Object.keys(theme.colors)
  const emittedSet = new Set(emitted)
  const idSet = new Set(fixture.ids)
  const unknown = emitted.filter((id) => !idSet.has(id))
  const missing = fixture.ids.filter((id) => !emittedSet.has(id))
  assert.deepEqual(unknown, [], 'theme sets IDs outside the reference')
  assert.deepEqual(missing, [], `theme is missing ${missing.length} reference IDs (first 20: ${missing.slice(0, 20).join(', ')})`)
})

test('theme header declares a dark named theme', () => {
  assert.equal(theme.name, 'Midnight Lilac')
  assert.equal(theme.type, 'dark')
})

test('tokenColors migrate the 16 overlay textMateRules verbatim', () => {
  const seedRules = seed['editor.tokenColorCustomizations'].textMateRules
  assert.equal(theme.tokenColors.length, seedRules.length)
  theme.tokenColors.forEach((rule, i) => {
    assert.equal(rule.name, seedRules[i].name)
    assert.deepEqual(rule.scope, seedRules[i].scope)
    assert.equal(rule.settings.foreground.toLowerCase(), seedRules[i].settings.foreground.toLowerCase())
    assert.equal(rule.settings.fontStyle, seedRules[i].settings.fontStyle)
  })
})

test('overlay values survive migration spot-checks (incl. alpha forms)', () => {
  const o = seed['workbench.colorCustomizations']
  assert.equal(theme.colors['editor.selectionBackground'], o['editor.selectionBackground'])
  assert.equal(theme.colors['editorBracketMatch.background'], o['editorBracketMatch.background'])
  assert.equal(theme.colors['terminal.ansiMagenta'], o['terminal.ansiMagenta'])
  assert.equal(theme.colors['tab.activeBorderTop'], o['tab.activeBorderTop'])
})
