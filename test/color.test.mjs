import test from 'node:test'
import assert from 'node:assert/strict'
import { hex, tuned, mix, lighten, darken, brighten, alpha, blend, getRegistry } from '../src/lib/color.mjs'

test('hex parses #RGB/#RRGGBB/#RRGGBBAA and serializes', () => {
  assert.equal(hex('#171729').hex6(), '#171729')
  assert.equal(hex('#abc').hex6(), '#AABBCC')
  assert.equal(hex('#FFD0A6').hex6(), '#FFD0A6')
  assert.throws(() => hex('#12345'))
  assert.throws(() => hex('#GGGGGG'))
  assert.throws(() => hex('171729'))
  assert.throws(() => tuned('#171729', ''))
})

test('mix lerps per channel, round-half-up (worked example)', () => {
  // #171729 ⊕ #29233F @ 0.25: r 23+18*.25=27.5→28(0x1C), g 23+12*.25=26(0x1A), b 41+22*.25=46.5→47(0x2F)
  assert.equal(mix(hex('#171729'), hex('#29233F'), 0.25).hex6(), '#1C1A2F')
  assert.equal(mix(hex('#000000'), hex('#0A0A0A'), 0.5).hex6(), '#050505')
  assert.equal(mix(hex('#123456'), hex('#123456'), 0.7).hex6(), '#123456')
})

test('lighten/darken move toward white/black', () => {
  assert.equal(lighten(hex('#000000'), 1).hex6(), '#FFFFFF')
  assert.equal(darken(hex('#FFFFFF'), 1).hex6(), '#000000')
  assert.equal(lighten(hex('#171729'), 0).hex6(), '#171729')
  assert.equal(darken(hex('#171729'), 0).hex6(), '#171729')
})

test('brighten bumps HSL lightness', () => {
  assert.equal(brighten(hex('#242139'), 0).hex6(), '#242139')
  assert.equal(brighten(hex('#242139'), 1).hex6(), '#FFFFFF')
  const b = brighten(hex('#242139'), 0.15).hex6()
  assert.notEqual(b, '#242139')
  assert.ok(b !== '#FFFFFF')
})

test('alpha appends opacity byte; blend pre-blends over background', () => {
  assert.equal(alpha(hex('#62547F'), 0x77 / 0xff).hex8(), '#62547F77')
  // #62547F @ 119/255 over #171729: r 98*.4667+23*.5333=58(0x3A), g 84*.4667+23*.5333≈51.47→51(0x33), b 127*.4667+41*.5333≈81.13→81(0x51)
  assert.equal(blend(hex('#62547F'), hex('#171729'), 0x77 / 0xff).hex6(), '#3A3351')
})

test('registry records every serialized color with its provenance note', () => {
  const probe = '#AB' + 'CD' + 'EF' // avoid self-matching in this file's no-hex test
  const c = hex(probe, 'probe note')
  c.hex6()
  const reg = getRegistry()
  assert.ok(reg.has(probe.toLowerCase()), 'serialized hex registered')
  assert.ok(reg.get(probe.toLowerCase()).has('probe note'))
})
