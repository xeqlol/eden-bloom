// Palette registry: every theme in the Eden Bloom family. The order here is
// the order everywhere (package.json contributions, preview gallery, deploy).
import { palette as lilac } from './midnight-lilac.mjs'
import { palette as ember } from './ember.mjs'
import { palette as moss } from './moss.mjs'
import { palette as deepSea } from './deep-sea.mjs'

export const palettes = [lilac, ember, moss, deepSea]
export const flagship = lilac
export const byId = Object.fromEntries(palettes.map((p) => [p.id, p]))
