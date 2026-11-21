import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { applyWezterm } from '../scripts/apply-wezterm.mjs'

const read = (name) => readFileSync(new URL(`./fixtures/${name}`, import.meta.url), 'utf8')
const THEME_PATH = 'C:/Users/xeqlo/Documents/Coding Projects/Theme/wezterm_theme.lua'

test('block is inserted before `return config`, switching the active scheme', () => {
  const { output, changed } = applyWezterm(read('wezterm.lua'), THEME_PATH)
  assert.equal(changed, true)
  const idxBlock = output.indexOf('-- >>> midnight-lilac >>>')
  const idxReturn = output.indexOf('return config')
  assert.ok(idxBlock > -1, 'managed block present')
  assert.ok(idxBlock < idxReturn, 'block must precede return config')
  // last-write-wins: the managed color_scheme assignment must come after the Coffee Leather one
  assert.ok(output.indexOf("config.color_scheme = 'Coffee Leather'") < output.indexOf('config.color_scheme = ml.name'))
  assert.ok(output.includes(`dofile '${THEME_PATH}'`))
  assert.ok(output.includes('config.color_schemes[ml.name] = ml.colors'))
  // user's own schemes survive untouched
  assert.ok(output.includes("['Coffee Leather'] = {"))
  assert.ok(output.includes("['Monokai Pro'] = {"))
})

test('re-running replaces the block in place and is byte-stable', () => {
  const first = applyWezterm(read('wezterm.lua'), THEME_PATH)
  const second = applyWezterm(first.output, THEME_PATH)
  assert.equal(second.changed, false, 'second run must detect the existing block and not churn')
  assert.equal(second.output, first.output)
  assert.equal((second.output.match(/>>> midnight-lilac >>>/g) ?? []).length, 1, 'exactly one block')
})

test('path is emitted with forward slashes regardless of input separators', () => {
  const { output } = applyWezterm(read('wezterm.lua'), 'C:\\Users\\xeqlo\\Documents\\Coding Projects\\Theme\\wezterm_theme.lua')
  assert.ok(output.includes(`dofile 'C:/Users/xeqlo/Documents/Coding Projects/Theme/wezterm_theme.lua'`))
})

test('a config without `return config` aborts loudly instead of guessing', () => {
  assert.throws(() => applyWezterm('local x = 1\n', THEME_PATH), /return config/)
})
