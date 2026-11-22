// Contract tests for the whole family: every palette must expose the exact
// same role shape so mappings/emitters can consume any of them.
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { palettes, flagship } from '../src/palettes/index.mjs'

const ROLE_GROUPS = ['chrome', 'line', 'text', 'accent', 'state', 'alphaed', 'terminal16', 'tokens', 'surfaces']
const SLOTS = ['bg', 'raised', 'muted', 'info', 'accent', 'secondary', 'error', 'warm', 'bright', 'success']

test('family identity: every palette is an Eden Bloom variant with a unique label', () => {
  const labels = new Set()
  const ids = new Set()
  for (const p of palettes) {
    assert.equal(p.family, 'Eden Bloom')
    assert.match(p.label, /^Eden /)
    assert.ok(!labels.has(p.label), `duplicate label ${p.label}`)
    assert.ok(!ids.has(p.id), `duplicate id ${p.id}`)
    assert.match(p.id, /^[a-z-]+$/)
    labels.add(p.label)
    ids.add(p.id)
  }
  assert.equal(flagship.label, 'Eden Lilac')
})

test('every palette covers exactly the 10 base slots, as hex strings', () => {
  for (const p of palettes) {
    assert.deepEqual(Object.keys(p.base).sort(), [...SLOTS].sort(), `${p.id}: base slots`)
    assert.deepEqual(Object.keys(p.names).sort(), [...SLOTS].sort(), `${p.id}: names slots`)
    for (const slot of SLOTS) {
      assert.match(p.base[slot], /^#[0-9a-fA-F]{6}$/, `${p.id}.${slot} must be a #rrggbb literal`)
      assert.ok(p.names[slot].length > 0, `${p.id}.${slot} needs a display name`)
      assert.ok(p.C[slot], `${p.id}.${slot} needs a Color object`)
    }
  }
})

test('every palette exposes the same role groups with the same keys', () => {
  for (const p of palettes) {
    for (const group of ROLE_GROUPS) {
      assert.ok(p[group], `${p.id}.${group} is missing`)
    }
    assert.ok(p.hidden, `${p.id}.hidden is missing`)
    assert.ok(p.selectionOpaque, `${p.id}.selectionOpaque is missing`)
  }
  const shape = (p) => ROLE_GROUPS.flatMap((g) => Object.keys(p[g]).map((k) => `${g}.${k}`)).sort().join(',')
  const reference = shape(flagship)
  for (const p of palettes) {
    assert.equal(shape(p), reference, `${p.id} role shape diverges from the flagship`)
  }
})

test('every palette keeps its background dark enough to be a vs-dark theme', () => {
  for (const p of palettes) {
    const { r, g, b } = p.C.bg
    const luma = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
    assert.ok(luma < 0.2, `${p.id} background luma ${luma.toFixed(3)} too bright for vs-dark`)
    assert.equal(p.uiTheme, 'vs-dark')
  }
})

test('no hex literals outside src/palettes/ anywhere in src/', () => {
  const srcDir = fileURLToPath(new URL('../src', import.meta.url))
  const walk = (dir) => readdirSync(dir).flatMap((f) => {
    const p = `${dir}/${f}`
    return statSync(p).isDirectory() ? walk(p) : [p]
  })
  const offenders = []
  for (const file of walk(srcDir)) {
    if (file.replaceAll('\\', '/').includes('/src/palettes/')) continue
    const text = readFileSync(file, 'utf8')
    if (/#{1}[0-9a-fA-F]{6,8}\b/.test(text.replaceAll('#AB' + 'CD' + 'EF', ''))) offenders.push(file)
  }
  assert.deepEqual(offenders, [])
})
