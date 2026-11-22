// Merges the per-area mapping files. Each file owns named doc sections and
// exports explicit { colorId: Color } entries. Duplicate IDs across files are
// a build error. IDs not covered explicitly are resolved by the inference
// fallback layer (defaults.mjs) at build time.
import * as baseChrome from './base-chrome.mjs'
import * as controls from './controls.mjs'
import * as listsTrees from './lists-trees.mjs'
import * as activityBar from './activity-bar.mjs'
import * as sideBar from './side-bar.mjs'
import * as editor from './editor.mjs'
import * as editorGroupsTabs from './editor-groups-tabs.mjs'
import * as diffEditor from './diff-editor.mjs'
import * as editorWidgets from './editor-widgets.mjs'
import * as panelsStatus from './panels-status.mjs'
import * as notifications from './notifications.mjs'
import * as terminal from './terminal.mjs'
import * as ai from './ai.mjs'
import * as misc from './misc.mjs'

export const mappingFiles = {
  'base-chrome': baseChrome,
  controls,
  'lists-trees': listsTrees,
  'activity-bar': activityBar,
  'side-bar': sideBar,
  editor,
  'editor-groups-tabs': editorGroupsTabs,
  'diff-editor': diffEditor,
  'editor-widgets': editorWidgets,
  'panels-status': panelsStatus,
  notifications,
  terminal,
  ai,
  misc,
}

/** Merge all explicit entries; throw on duplicate ownership. */
export function explicitMappings(p) {
  const merged = new Map()
  for (const [file, mapping] of Object.entries(mappingFiles)) {
    for (const [id, color] of Object.entries(mapping.default(p))) {
      if (merged.has(id)) {
        throw new Error(`duplicate color ID ${id} (already claimed when merging ${file})`)
      }
      merged.set(id, color)
    }
  }
  return merged
}
