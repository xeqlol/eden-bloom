import test from 'node:test'
import assert from 'node:assert/strict'
import { inflateSync, crc32 } from 'node:zlib'
import { build } from '../src/build.mjs'

test('icon is a structurally valid 128x128 RGBA PNG', () => {
  const { iconPng } = build()
  assert.ok(Buffer.isBuffer(iconPng) && iconPng.length > 100, 'build() must produce iconPng buffer')

  // PNG signature
  assert.deepEqual([...iconPng.subarray(0, 8)], [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])

  // Walk chunks: IHDR, ..., IEND; verify each CRC
  const chunks = []
  let off = 8
  while (off < iconPng.length) {
    const len = iconPng.readUInt32BE(off)
    const type = iconPng.subarray(off + 4, off + 8).toString('ascii')
    const data = iconPng.subarray(off + 8, off + 8 + len)
    const crc = iconPng.readUInt32BE(off + 8 + len)
    assert.equal(crc, crc32(Buffer.concat([iconPng.subarray(off + 4, off + 8), data])), `bad CRC in ${type}`)
    chunks.push({ type, data })
    off += 12 + len
  }
  assert.equal(chunks[0].type, 'IHDR')
  assert.equal(chunks.at(-1).type, 'IEND')

  const ihdr = chunks[0].data
  assert.equal(ihdr.readUInt32BE(0), 128, 'width')
  assert.equal(ihdr.readUInt32BE(4), 128, 'height')
  assert.equal(ihdr[8], 8, 'bit depth')
  assert.equal(ihdr[9], 6, 'color type RGBA')

  const idat = Buffer.concat(chunks.filter((c) => c.type === 'IDAT').map((c) => c.data))
  const raw = inflateSync(idat)
  assert.equal(raw.length, 128 * (1 + 128 * 4), 'raw scanline size with filter byte 0')
  for (let y = 0; y < 128; y++) assert.equal(raw[y * (1 + 128 * 4)], 0, 'filter byte must be 0')
})
