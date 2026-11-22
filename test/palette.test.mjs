import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { flagship } from '../src/palettes/index.mjs'

const seed = JSON.parse(readFileSync(new URL('../vscode_theme.json', import.meta.url), 'utf8'))
const overlay = seed['workbench.colorCustomizations']
const palette = flagship

test('flagship base is exactly the 10 agreed colors from the grilling session', () => {
  assert.deepEqual(palette.base, {
    bg: '#171729', raised: '#29233F', muted: '#827B9B', info: '#8EADE8',
    accent: '#D4A6E4', secondary: '#E9B5C5', error: '#F18C9A', warm: '#F5B58D',
    bright: '#FFD0A6', success: '#A9D3C1',
  })
})

test('flagship terminal16 reproduces the overlay terminal.ansi* values 1:1', () => {
  const names = ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white']
  for (const n of names) {
    assert.equal(palette.terminal16[n].hex6().toLowerCase(), overlay[`terminal.ansi${n[0].toUpperCase()}${n.slice(1)}`].toLowerCase())
    assert.equal(palette.terminal16[`bright${n[0].toUpperCase()}${n.slice(1)}`].hex6().toLowerCase(),
      overlay[`terminal.ansiBright${n[0].toUpperCase()}${n.slice(1)}`].toLowerCase())
  }
})

test('flagship chrome ramp carries the overlay chrome backgrounds verbatim', () => {
  assert.equal(palette.chrome.sunken.hex6(), overlay['activityBar.background'])
  assert.equal(palette.chrome.panel.hex6(), overlay['sideBar.background'])
  assert.equal(palette.chrome.tabIdle.hex6(), overlay['tab.inactiveBackground'])
  assert.equal(palette.chrome.titleBar.hex6(), overlay['titleBar.activeBackground'])
  assert.equal(palette.chrome.input.hex6(), overlay['input.background'])
  assert.equal(palette.chrome.tab.hex6(), overlay['tab.activeBackground'])
  assert.equal(palette.chrome.hover.hex6(), overlay['list.hoverBackground'])
  assert.equal(palette.chrome.selected.hex6(), overlay['badge.background'])
})

test('flagship key text/line/accent roles carry their overlay values verbatim', () => {
  assert.equal(palette.text.normal.hex6(), overlay['editor.foreground'])
  assert.equal(palette.text.dim.hex6(), overlay['tab.inactiveForeground'])
  assert.equal(palette.text.ghost.hex6(), overlay['editorLineNumber.foreground'])
  assert.equal(palette.line.panel.hex6(), overlay['panel.border'])
  assert.equal(palette.line.indent.hex6(), overlay['editorIndentGuide.background'])
  assert.equal(palette.line.strong.hex6(), overlay['input.border'])
  assert.equal(palette.accent.focus.hex6(), overlay['focusBorder'])
  assert.equal(palette.accent.button.hex6(), overlay['button.background'])
})

test('flagship alphaed roles carry the overlay alpha values verbatim', () => {
  assert.equal(palette.alphaed.selection.hex8(), overlay['editor.selectionBackground'])
  assert.equal(palette.alphaed.lineHighlight.hex8(), overlay['editor.lineHighlightBackground'])
  assert.equal(palette.alphaed.bracketMatch.hex8(), overlay['editorBracketMatch.background'])
})

test('every tuned() note in the flagship names at least one base color', () => {
  const src = readFileSync(new URL('../src/palettes/midnight-lilac.mjs', import.meta.url), 'utf8')
  const calls = [...src.matchAll(/tuned\(\s*'([^']+)'\s*,\s*'([^']+)'\s*\)/g)]
  assert.ok(calls.length >= 40, `expected a substantial number of tuned entries, found ${calls.length}`)
  const baseNames = Object.values(palette.names).map((n) => n.replaceAll(' ', '')).join('|')
  const re = new RegExp(baseNames)
  for (const [, hexValue, note] of calls) {
    assert.match(note.replaceAll(' ', ''), re, `note for ${hexValue} must mention a base color name`)
  }
})
