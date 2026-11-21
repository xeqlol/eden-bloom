import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { applySettings, stripJsonc } from '../scripts/apply-settings.mjs'

const read = (name) => readFileSync(new URL(`./fixtures/${name}`, import.meta.url), 'utf8')

test('strips JSONC comments but never touches // inside strings', () => {
  const stripped = stripJsonc('// leading comment\n{\n  // a comment\n  "url": "https://example.com/x", /* block\n  comment */ "b": 1\n}\n// trailing')
  const parsed = JSON.parse(stripped)
  assert.equal(parsed.url, 'https://example.com/x')
  assert.equal(parsed.b, 1)
})

test('surgery on the current live settings snapshot: blocks removed, theme set', () => {
  const { output, changed } = applySettings(read('settings-current.json'))
  assert.equal(changed, true)
  const parsed = JSON.parse(output)
  assert.equal(parsed['workbench.colorTheme'], 'Midnight Lilac')
  assert.ok(!('workbench.colorCustomizations' in parsed), 'colorCustomizations must be gone')
  assert.ok(!('editor.tokenColorCustomizations' in parsed), 'tokenColorCustomizations must be gone')
})

test('surgery on JSONC fixture: comments, trailing commas, URLs and siblings survive', () => {
  const { output } = applySettings(read('settings-with-comments.jsonc'))
  const parsed = JSON.parse(output)
  assert.equal(parsed['workbench.colorTheme'], 'Midnight Lilac')
  assert.equal(parsed['editor.fontSize'], 14)
  assert.equal(parsed['update.mode'], 'none')
  assert.equal(parsed['json.schemas'][0].url, 'https://json.schemastore.org/prettierrc.json')
  assert.ok(!('workbench.colorCustomizations' in parsed))
})

test('surgery is idempotent on already-migrated settings', () => {
  const first = applySettings(read('settings-current.json'))
  const second = applySettings(first.output)
  assert.equal(second.changed, false, 'second run must be a no-op')
  assert.equal(second.output, first.output)
})

test('output preserves the input EOL style', () => {
  const crlf = applySettings(read('settings-current.json').replaceAll('\n', '\r\n'))
  assert.ok(crlf.output.includes('\r\n'), 'CRLF input must produce CRLF output')
})
