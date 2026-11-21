import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const fixture = JSON.parse(
  readFileSync(new URL('./fixtures/reference-ids.json', import.meta.url), 'utf8'),
)

test('fixture holds exactly the 971 documented workbench color IDs', () => {
  assert.equal(fixture.total, 971)
  assert.equal(fixture.ids.length, 971)
  assert.equal(new Set(fixture.ids).size, 971, 'IDs must be unique')
})

test('sections list the 906 missing IDs, none overlapping the overlay 65', () => {
  const overlay = JSON.parse(
    readFileSync(new URL('../vscode_theme.json', import.meta.url), 'utf8'),
  )
  const overlayKeys = Object.keys(overlay['workbench.colorCustomizations'])
  assert.equal(overlayKeys.length, 65)

  const sectionIds = Object.values(fixture.sections).flat()
  assert.equal(sectionIds.length, 906)
  assert.equal(new Set(sectionIds).size, 906, 'section IDs must be unique')

  const overlaySet = new Set(overlayKeys)
  const overlap = sectionIds.filter((id) => overlaySet.has(id))
  assert.deepEqual(overlap, [], 'missing IDs and overlay IDs must not intersect')

  for (const key of overlayKeys) {
    assert.ok(fixture.ids.includes(key), `overlay key ${key} missing from fixture.ids`)
  }
})

test('every section ID is present in the flat id list', () => {
  const idSet = new Set(fixture.ids)
  for (const [section, ids] of Object.entries(fixture.sections)) {
    for (const id of ids) {
      assert.ok(idSet.has(id), `${id} (${section}) not in fixture.ids`)
    }
  }
})
