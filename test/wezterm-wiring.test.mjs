import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { applyWezterm } from '../scripts/apply-wezterm.mjs'

const read = (name) => readFileSync(new URL(`./fixtures/${name}`, import.meta.url), 'utf8')
const THEME_PATHS = [
  'C:/Users/xeqlo/Documents/Coding Projects/Theme/wezterm/lilac.lua',
  'C:/Users/xeqlo/Documents/Coding Projects/Theme/wezterm/ember.lua',
  'C:/Users/xeqlo/Documents/Coding Projects/Theme/wezterm/moss.lua',
  'C:/Users/xeqlo/Documents/Coding Projects/Theme/wezterm/deep-sea.lua',
]

test('block is inserted before `return config`, switching the active scheme', () => {
  const { output, changed } = applyWezterm(read('wezterm.lua'), THEME_PATHS)
  assert.equal(changed, true)
  const idxBlock = output.indexOf('-- >>> eden-bloom >>>')
  const idxReturn = output.indexOf('return config')
  assert.ok(idxBlock > -1, 'managed block present')
  assert.ok(idxBlock < idxReturn, 'block must precede return config')
  // last-write-wins: the managed color_scheme assignment must come after the Coffee Leather one
  assert.ok(output.indexOf("config.color_scheme = 'Coffee Leather'") < output.indexOf('config.color_scheme = flagship.name'))
  // every palette is registered as a scheme; the first is the default
  assert.ok(output.includes(`'${THEME_PATHS[0]}'`), 'first theme path listed')
  assert.ok(output.includes(`'${THEME_PATHS[3]}'`), 'last theme path listed')
  assert.ok(output.includes('config.color_schemes[t.name] = t.colors'))
  assert.ok(output.includes('if flagship == nil then flagship = t end'))
  // user's own schemes survive untouched
  assert.ok(output.includes("['Coffee Leather'] = {"))
  assert.ok(output.includes("['Monokai Pro'] = {"))
})

test('re-running replaces the block in place and is byte-stable', () => {
  const first = applyWezterm(read('wezterm.lua'), THEME_PATHS)
  const second = applyWezterm(first.output, THEME_PATHS)
  assert.equal(second.changed, false, 'second run must detect the existing block and not churn')
  assert.equal(second.output, first.output)
  assert.equal((second.output.match(/>>> eden-bloom >>>/g) ?? []).length, 1, 'exactly one block')
})

test('a changed theme list refreshes the block in place', () => {
  const first = applyWezterm(read('wezterm.lua'), THEME_PATHS.slice(0, 2))
  const refreshed = applyWezterm(first.output, THEME_PATHS)
  assert.equal(refreshed.changed, true)
  assert.ok(refreshed.output.includes(`'${THEME_PATHS[2]}'`))
  assert.equal((refreshed.output.match(/>>> eden-bloom >>>/g) ?? []).length, 1, 'still exactly one block')
})

test('paths are emitted with forward slashes regardless of input separators', () => {
  const { output } = applyWezterm(read('wezterm.lua'), ['C:\\Users\\xeqlo\\wezterm\\lilac.lua'])
  assert.ok(output.includes(`'C:/Users/xeqlo/wezterm/lilac.lua'`))
})

test('a config without `return config` aborts loudly instead of guessing', () => {
  assert.throws(() => applyWezterm('local x = 1\n', THEME_PATHS), /return config/)
})

const LEGACY_CONFIG = `local wezterm = require 'wezterm'
local config = wezterm.config_builder()
config.color_schemes = { ['Coffee Leather'] = { background = '#343028' } }
config.color_scheme = 'Coffee Leather'
-- >>> midnight-lilac >>> (managed by Midnight Lilac deploy.sh — delete this block to revert)
local ml = dofile 'C:/old/path/wezterm_theme.lua'
config.color_schemes[ml.name] = ml.colors
config.window_frame = ml.window_frame
config.color_scheme = ml.name
-- <<< midnight-lilac <<<
-- >>> user block >>> (designed to sit AFTER the theme block and override it)
local scheme = config.color_schemes[config.color_scheme]
config.window_frame.font_size = 11.0
-- <<< user block <<<
return config
`

test('a legacy midnight-lilac block is migrated in place (position preserved)', () => {
  const { output, changed } = applyWezterm(LEGACY_CONFIG, THEME_PATHS)
  assert.equal(changed, true)
  assert.ok(!output.includes('midnight-lilac'), 'legacy markers must be gone')
  assert.ok(!output.includes('wezterm_theme.lua'), 'legacy dofile must be gone')
  assert.equal((output.match(/>>> eden-bloom >>>/g) ?? []).length, 1, 'exactly one eden block')
  // the user block stays AFTER the theme block, as its comment promises
  assert.ok(output.indexOf('>>> eden-bloom >>>') < output.indexOf('>>> user block >>>'))
  assert.ok(output.includes(`dofile(f)`))
})

test('legacy block plus a stray eden block: legacy position wins, no duplicates', () => {
  const { output } = applyWezterm(LEGACY_CONFIG + '-- >>> eden-bloom >>>\nx\n-- <<< eden-bloom <<<\n', THEME_PATHS)
  assert.equal((output.match(/>>> eden-bloom >>>/g) ?? []).length, 1)
  assert.ok(!output.includes('midnight-lilac'))
  assert.ok(output.indexOf('>>> eden-bloom >>>') < output.indexOf('>>> user block >>>'))
})
