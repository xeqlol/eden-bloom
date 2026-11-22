import test from 'node:test'
import assert from 'node:assert/strict'
import { build } from '../src/build.mjs'
import { palettes } from '../src/palettes/index.mjs'
import { renderIcon } from '../src/icon.mjs'

test('every palette yields a valid PNG icon buffer', () => {
  for (const p of palettes) {
    const png = renderIcon(p)
    assert.ok(Buffer.isBuffer(png) && png.length > 100, `${p.id}: renderIcon must produce a PNG buffer`)
    // PNG magic
    assert.equal(png[0], 0x89)
    assert.equal(String.fromCharCode(png[1], png[2], png[3]), 'PNG')
  }
})

test('build() exposes the icon and it matches renderIcon()', () => {
  for (const p of palettes) {
    const { iconPng } = build(p)
    assert.ok(iconPng.equals(renderIcon(p)), `${p.id}: build icon differs from renderIcon`)
  }
})

test('icons differ between palettes (each carries its own colors)', () => {
  const [first, ...rest] = palettes.map((p) => renderIcon(p))
  for (const png of rest) {
    assert.ok(!png.equals(first), 'a palette icon collapsed onto the flagship icon')
  }
})
