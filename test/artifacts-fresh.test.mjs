import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { build } from '../src/build.mjs'
import { emitPreview } from '../src/emit/preview.mjs'
import { palettes, flagship } from '../src/palettes/index.mjs'
import pkg from '../package.json' with { type: 'json' }

const opts = { version: pkg.version, author: pkg.publisher, authorUrl: pkg.repository.url }

for (const p of palettes) {
  test(`[${p.id}] committed artifacts are byte-identical to a fresh build`, () => {
    const { themeJson, weztermLua, obsidianCss, obsidianManifest, iconPng } = build(p, opts)

    const theme = readFileSync(new URL(`../themes/${p.id}-color-theme.json`, import.meta.url), 'utf8')
    assert.equal(theme, themeJson, 'themes/ is stale — run npm run build (and never hand-edit generated files)')

    const lua = readFileSync(new URL(`../wezterm/${p.id}.lua`, import.meta.url), 'utf8')
    assert.equal(lua, weztermLua, 'wezterm/ is stale — run npm run build')

    const css = readFileSync(new URL(`../obsidian/${p.id}/theme.css`, import.meta.url), 'utf8')
    assert.equal(css, obsidianCss, 'obsidian theme.css is stale — run npm run build')

    const manifest = readFileSync(new URL(`../obsidian/${p.id}/manifest.json`, import.meta.url), 'utf8')
    assert.equal(manifest, obsidianManifest, 'obsidian manifest.json is stale — run npm run build')

    const icon = readFileSync(new URL(`../icons/${p.id}.png`, import.meta.url))
    assert.ok(icon.equals(iconPng), 'icons/ is stale — run npm run build')
  })
}

test('brand icon.png is the flagship bloom, fresh from the build', () => {
  const committed = readFileSync(new URL('../icon.png', import.meta.url))
  assert.ok(committed.equals(build(flagship).iconPng), 'icon.png is stale — run npm run build')
})

test('preview gallery is fresh', () => {
  const committed = readFileSync(new URL('../preview/index.html', import.meta.url), 'utf8')
  assert.equal(committed, emitPreview(palettes), 'preview/ is stale — run npm run build')
})
