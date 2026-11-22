// The authoritative ID list, extracted once into the committed fixture
// (scripts/extract-ids.mjs). Both the build and the tests read it from here.
import { readFileSync } from 'node:fs'

const fixture = JSON.parse(
  readFileSync(new URL('../test/fixtures/reference-ids.json', import.meta.url), 'utf8'),
)
const seed = JSON.parse(
  readFileSync(new URL('../vscode_theme.json', import.meta.url), 'utf8'),
)

export const referenceIds = fixture.ids
export const referenceSections = fixture.sections
export const overlayKeys = Object.keys(seed['workbench.colorCustomizations'])
