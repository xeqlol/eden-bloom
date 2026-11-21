// Color core: every color flowing through the build is a Color instance whose
// provenance is a human-readable note. Serialization registers the exact hex
// string in a registry, which the provenance test checks against the artifacts.

const HEX_RE = /^#(?:([0-9a-fA-F]{3})|([0-9a-fA-F]{6})|([0-9a-fA-F]{8}))$/
const registry = new Map() // lowercase hex string -> Set<provenance notes>

const h2 = (v) => Math.round(v).toString(16).padStart(2, '0').toUpperCase()
const register = (serialized, note) => {
  const key = serialized.toLowerCase()
  if (!registry.has(key)) registry.set(key, new Set())
  if (note) registry.get(key).add(note)
  return serialized
}

export class Color {
  constructor(r, g, b, a = 255, note = '') {
    this.r = r; this.g = g; this.b = b; this.a = a; this.note = note
  }

  hex6() {
    return register(`#${h2(this.r)}${h2(this.g)}${h2(this.b)}`, this.note)
  }

  hex8() {
    return register(`#${h2(this.r)}${h2(this.g)}${h2(this.b)}${h2(this.a)}`, this.note)
  }
}

const channelsFromString = (str) => {
  const m = HEX_RE.exec(str)
  if (!m) throw new Error(`invalid hex color: ${str}`)
  if (m[1]) {
    return [...m[1]].map((ch) => parseInt(ch + ch, 16))
  }
  const full = m[2] ?? m[3]
  const r = parseInt(full.slice(0, 2), 16)
  const g = parseInt(full.slice(2, 4), 16)
  const b = parseInt(full.slice(4, 6), 16)
  const a = m[3] ? parseInt(full.slice(6, 8), 16) : 255
  return [r, g, b, a]
}

export function hex(str, note = 'raw hex') {
  const [r, g, b, a] = channelsFromString(str)
  return new Color(r, g, b, a, note)
}

export function tuned(str, note) {
  if (!note || !note.trim()) throw new Error(`tuned(${str}) requires a provenance note`)
  return hex(str, note)
}

const roundHalfUp = (x) => Math.floor(x + 0.5)

export function mix(a, b, t, note) {
  const n = note ?? `mix(${a.note} | ${b.note} @${t})`
  return new Color(
    roundHalfUp(a.r + (b.r - a.r) * t),
    roundHalfUp(a.g + (b.g - a.g) * t),
    roundHalfUp(a.b + (b.b - a.b) * t),
    a.a,
    n,
  )
}

const WHITE = new Color(255, 255, 255, 255, 'white')
const BLACK = new Color(0, 0, 0, 255, 'black')

export const lighten = (c, t, note) =>
  mix(c, WHITE, t, note ?? `lighten(${c.note} @${t})`)
export const darken = (c, t, note) =>
  mix(c, BLACK, t, note ?? `darken(${c.note} @${t})`)

function toHsl({ r, g, b }) {
  const [rn, gn, bn] = [r / 255, g / 255, b / 255]
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const l = (max + min) / 2
  const d = max - min
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1))
  let h = 0
  if (d !== 0) {
    if (max === rn) h = ((gn - bn) / d) % 6
    else if (max === gn) h = (bn - rn) / d + 2
    else h = (rn - gn) / d + 4
    h *= 60
    if (h < 0) h += 360
  }
  return [h, s, l]
}

function hslToChannels(h, s, l) {
  const c = (1 - Math.abs(2 * l - 1)) * s
  const hp = h / 60
  const x = c * (1 - Math.abs((hp % 2) - 1))
  const [rn, gn, bn] =
    hp < 1 ? [c, x, 0] : hp < 2 ? [x, c, 0] : hp < 3 ? [0, c, x]
      : hp < 4 ? [0, x, c] : hp < 5 ? [x, 0, c] : [c, 0, x]
  const m = l - c / 2
  return [(rn + m) * 255, (gn + m) * 255, (bn + m) * 255].map((v) => Math.round(v))
}

export function brighten(c, t, note) {
  const [h, s, l] = toHsl(c)
  const [r, g, b] = hslToChannels(h, s, Math.min(1, l + t))
  return new Color(r, g, b, c.a, note ?? `brighten(${c.note} @${t})`)
}

export function alpha(c, t, note) {
  if (t < 0 || t > 1) throw new Error(`alpha t out of range: ${t}`)
  return new Color(c.r, c.g, c.b, roundHalfUp(t * 255), note ?? `alpha(${c.note} @${t})`)
}

export function blend(c, bg, t, note) {
  const n = note ?? `blend(${c.note} over ${bg.note} @${t})`
  return new Color(
    roundHalfUp(c.r * t + bg.r * (1 - t)),
    roundHalfUp(c.g * t + bg.g * (1 - t)),
    roundHalfUp(c.b * t + bg.b * (1 - t)),
    255,
    n,
  )
}

export function getRegistry() {
  return registry
}
