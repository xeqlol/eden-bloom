// Build orchestrator: mappings (+ inference) -> ordered colors -> artifacts.
// Also the test seam: everything downstream of the palette goes through here.
import { explicitMappings } from './mappings/index.mjs'
import { inferColor } from './mappings/defaults.mjs'
import { emitTheme } from './emit/vscode.mjs'
import { emitWezterm } from './emit/wezterm.mjs'
import { referenceIds, referenceSections, overlayKeys } from './reference.mjs'

const serialize = (color) => (color.a === 255 ? color.hex6() : color.hex8())

/** Resolve every reference ID: explicit mapping wins, inference fills the rest. */
export function resolveColors() {
  const explicit = explicitMappings()
  const resolved = new Map()
  const inferred = []
  for (const id of referenceIds) {
    if (explicit.has(id)) {
      resolved.set(id, explicit.get(id))
    } else {
      resolved.set(id, inferColor(id))
      inferred.push(id)
    }
  }
  for (const id of explicit.keys()) {
    if (!resolved.has(id)) {
      throw new Error(`explicit mapping for unknown reference ID: ${id}`)
    }
  }
  return { resolved, inferred }
}

/** Deterministic emit order: overlay core keys first, then doc sections. */
function orderedPlainColors(resolved) {
  const ordered = {}
  for (const id of [...overlayKeys].sort()) ordered[id] = serialize(resolved.get(id))
  for (const ids of Object.values(referenceSections)) {
    for (const id of [...ids].sort()) ordered[id] = serialize(resolved.get(id))
  }
  return ordered
}

export function build() {
  const { resolved, inferred } = resolveColors()
  const colors = orderedPlainColors(resolved)
  const themeJson = emitTheme(colors)
  const weztermLua = emitWezterm()
  const inferredBySection = {}
  for (const [section, ids] of Object.entries(referenceSections)) {
    const count = ids.filter((id) => inferred.includes(id)).length
    if (count) inferredBySection[section] = count
  }
  return { themeJson, weztermLua, inferredBySection, inferredCount: inferred.length }
}
