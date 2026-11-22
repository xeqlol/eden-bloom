// Icon "bloom": pure-Node PNG writer + signed-distance-field renderer.
// All colors come from the palette (pre-blended via the color API, so icon
// colors carry provenance like everything else). No fonts, no deps.
import { deflateSync, crc32 } from 'node:zlib'
import { blend } from './lib/color.mjs'

const SIZE = 128
const clamp01 = (v) => Math.max(0, Math.min(1, v))
const rgb = (c) => [c.r, c.g, c.b]

function chunk(type, data) {
  const b = Buffer.alloc(12 + data.length)
  b.writeUInt32BE(data.length, 0)
  b.write(type, 4, 'ascii')
  data.copy(b, 8)
  b.writeUInt32BE(crc32(b.subarray(4, 8 + data.length)), 8 + data.length)
  return b
}

function encodePng(rgba) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(SIZE, 0)
  ihdr.writeUInt32BE(SIZE, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // RGBA
  const stride = SIZE * 4
  const raw = Buffer.alloc(SIZE * (1 + stride))
  for (let y = 0; y < SIZE; y++) {
    const rowStart = y * (1 + stride)
    raw[rowStart] = 0 // filter: none
    rgba.copy(raw, rowStart + 1, y * stride, (y + 1) * stride)
  }
  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

// SDF coverage: 1px feather via smoothstep on signed distance (in pixels).
const cov = (dist) => {
  const t = clamp01(dist + 0.5) // dist <= -0.5 -> fully inside
  return 1 - t
}
const circleSdf = (x, y, cx, cy, r) => Math.hypot(x - cx, y - cy) - r
const ringSdf = (x, y, cx, cy, r, halfWidth) => Math.abs(Math.hypot(x - cx, y - cy) - r) - halfWidth

export function renderIcon(pal) {
  const bg = rgb(pal.C.bg)
  const ring = rgb(blend(pal.C.muted, pal.C.bg, 0.6, 'icon ring: muted over bg'))
  const petalSources = [pal.C.accent, pal.C.secondary, pal.C.info, pal.C.warm, pal.C.success]
  const petals = petalSources.map((s) => rgb(blend(s, pal.C.bg, 0.85, `icon petal: ${s.note} over bg`)))
  const core = rgb(pal.C.bright)

  const cx = SIZE / 2 - 0.5
  const cy = SIZE / 2 - 0.5
  const petalPositions = petals.map((_, k) => {
    const a = (Math.PI / 2) + (k * 2 * Math.PI) / 5
    return [cx + 24 * Math.cos(a), cy - 24 * Math.sin(a)]
  })

  const rgba = Buffer.alloc(SIZE * SIZE * 4)
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      let px = x + 0.5
      let py = y + 0.5
      let [r, g, b] = bg

      const ringA = cov(ringSdf(px, py, cx, cy, 54, 1.5))
      if (ringA > 0) {
        r += (ring[0] - r) * ringA; g += (ring[1] - g) * ringA; b += (ring[2] - b) * ringA
      }
      for (let k = 0; k < petals.length; k++) {
        const a = cov(circleSdf(px, py, petalPositions[k][0], petalPositions[k][1], 17))
        if (a > 0) {
          const p = petals[k]
          r += (p[0] - r) * a; g += (p[1] - g) * a; b += (p[2] - b) * a
        }
      }
      const coreA = cov(circleSdf(px, py, cx, cy, 10))
      if (coreA > 0) {
        r += (core[0] - r) * coreA; g += (core[1] - g) * coreA; b += (core[2] - b) * coreA
      }

      const i = (y * SIZE + x) * 4
      rgba[i] = Math.round(r)
      rgba[i + 1] = Math.round(g)
      rgba[i + 2] = Math.round(b)
      rgba[i + 3] = 255
    }
  }
  return encodePng(rgba)
}
