import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { build } from '../src/build.mjs'

test('committed theme artifact is byte-identical to a fresh build', () => {
  const { themeJson } = build()
  const committed = readFileSync(new URL('../themes/midnight-lilac-color-theme.json', import.meta.url), 'utf8')
  assert.equal(committed, themeJson, 'themes/ is stale — run npm run build (and never hand-edit generated files)')
})
