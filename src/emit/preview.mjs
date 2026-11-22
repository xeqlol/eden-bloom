// Emits preview/index.html: a side-by-side gallery of every palette —
// swatches, chrome ramp, a syntax sample and the ANSI-16 row. This is the
// refinement workbench for new palettes (open it after npm run build).
const h = (c) => c.hex6().toLowerCase()
const esc = (s) => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')

const CODE = [
  '// a small sample to judge tokens',
  'export function bloom(garden, kind = "lilac") {',
  '  const count: number = garden.petals.length + 1;',
  '  if (count > 3) return `full bloom: ${kind}`;',
  '  return garden.water(count / 2);',
  '}',
]

// role assignment by capture group: 1 string, 2 comment, 3 keyword, 4 fn,
// 5 type, 6 variable, 7 property, 8 number, 9 operator
const TOKEN_RE = /("(?:[^"]*)"|`[^`]*`)|(\/\/.*$)|(\b(?:export|function|const|if|return)\b)|(\bbloom\b|\bwater\b)|(\bnumber\b)|(\bgarden\b|\bkind\b|\bcount\b)|(\bpetals\b|\blength\b)|(\b\d+\b)|([{}():=<>+\-;,/]+|`)/g
const ROLE_BY_GROUP = ['string', 'comment', 'keyword', 'fn', 'type', 'variable', 'property', 'number', 'operator']

/** Renders CODE lines as token-colored spans. */
function codeLines(pal) {
  return CODE.map((line, i) => {
    const parts = []
    let last = 0
    let m
    TOKEN_RE.lastIndex = 0
    while ((m = TOKEN_RE.exec(line)) !== null) {
      parts.push([esc(line.slice(last, m.index)), null])
      const group = m.slice(1).findIndex((g) => g !== undefined)
      parts.push([esc(m[0]), ROLE_BY_GROUP[group]])
      last = m.index + m[0].length
    }
    parts.push([esc(line.slice(last)), null])
    const html = parts.map(([text, role]) =>
      role ? `<span style="color:${h(pal.tokens[role])}">${text}</span>` : text,
    ).join('')
    return `<div class="line"><span class="ln">${i + 1}</span><span class="lc">${html}</span></div>`
  }).join('')
}

function card(pal) {
  const ramp = ['sunken', 'panel', 'tabIdle', 'titleBar', 'input', 'tab', 'hover', 'selected']
    .map((k) => `<div class="sw" style="background:${h(pal.chrome[k])}" title="chrome.${k}"></div>`).join('')
  const swatches = Object.entries(pal.base).map(([slot, hexValue]) =>
    `<div class="swatch"><div class="chip" style="background:${hexValue}"></div><div class="meta"><b>${esc(pal.names[slot])}</b><span>${esc(slot)}</span><span>${hexValue.toLowerCase()}</span></div></div>`,
  ).join('')
  const ansi = ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white',
    'brightBlack', 'brightRed', 'brightGreen', 'brightYellow', 'brightBlue', 'brightMagenta', 'brightCyan', 'brightWhite']
    .map((k) => `<div class="sw" style="background:${h(pal.terminal16[k])}" title="ansi ${k}"></div>`).join('')
  return `<section class="card" style="--bg:${h(pal.C.bg)};--panel:${h(pal.chrome.panel)};--tab:${h(pal.chrome.tab)};--text:${h(pal.text.normal)};--dim:${h(pal.text.dim)};--accent:${h(pal.C.accent)};--border:${h(pal.line.panel)}">
  <header>
    <div>
      <h2>${esc(pal.label)}</h2>
      <p>${esc(pal.description)}</p>
    </div>
    <div class="ramp">${ramp}</div>
  </header>
  <div class="swatches">${swatches}</div>
  <div class="editor">
    <div class="titlebar"><span class="dot"></span><span class="fname">bloom.ts</span></div>
    ${codeLines(pal)}
  </div>
  <div class="term">
    <div class="ansi">${ansi}</div>
    <code style="color:${h(pal.terminal16.green)}">$ <span style="color:${h(pal.terminal16.brightWhite)}">git</span> <span style="color:${h(pal.terminal16.magenta)}">commit</span> <span style="color:${h(pal.terminal16.yellow)}">-m</span> <span style="color:${h(pal.terminal16.cyan)}">"eden bloom"</span></code>
  </div>
</section>`
}

export function emitPreview(palettes) {
  const body = palettes.map(card).join('\n')
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Eden Bloom — palette gallery</title>
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  body { margin: 0; padding: 2rem 1rem 4rem; font: 14px/1.5 system-ui, sans-serif; color: rgb(221 214 230); background: rgb(16 16 24); }
  main { max-width: 1080px; margin: 0 auto; }
  h1 { font-weight: 650; letter-spacing: .01em; }
  .sub { color: rgb(154 147 172); margin-top: -0.75rem; }
  .card { background: var(--panel); border: 1px solid var(--border); border-radius: 12px; padding: 1.25rem; margin: 1.5rem 0; }
  .card header { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; flex-wrap: wrap; }
  .card h2 { margin: 0; color: var(--text); font-size: 1.1rem; }
  .card p { margin: .2rem 0 0; color: var(--dim); font-size: .85rem; }
  .ramp { display: flex; border-radius: 6px; overflow: hidden; border: 1px solid var(--border); }
  .ramp .sw, .ansi .sw { width: 26px; height: 18px; }
  .swatches { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: .6rem; margin-top: 1rem; }
  .swatch { display: flex; gap: .5rem; align-items: center; }
  .chip { width: 28px; height: 28px; border-radius: 7px; border: 1px solid var(--border); flex: none; }
  .meta { display: flex; flex-direction: column; font-size: .7rem; color: var(--dim); line-height: 1.3; }
  .meta b { color: var(--text); font-size: .75rem; }
  .editor { background: var(--bg); border: 1px solid var(--border); border-radius: 8px; margin-top: 1rem; overflow: hidden; font: 12.5px/1.65 ui-monospace, Consolas, monospace; }
  .titlebar { display: flex; align-items: center; gap: .5rem; background: var(--tab); padding: .3rem .6rem; border-bottom: 1px solid var(--border); }
  .dot { width: 9px; height: 9px; border-radius: 50%; background: var(--accent); }
  .fname { color: var(--dim); font-size: .72rem; font-family: inherit; }
  .line { display: flex; padding: 0 .4rem; white-space: pre; }
  .ln { width: 2ch; margin-right: 1.25ch; text-align: right; color: var(--dim); opacity: .55; user-select: none; }
  .lc { color: var(--text); }
  .term { margin-top: .75rem; }
  .ansi { display: flex; border-radius: 6px; overflow: hidden; border: 1px solid var(--border); width: max-content; }
  .term code { display: block; margin-top: .5rem; font: 12.5px ui-monospace, Consolas, monospace; }
</style>
</head>
<body>
<main>
  <h1>Eden Bloom — palette gallery</h1>
  <p class="sub">Generated by npm run build — regenerate after editing src/palettes/.</p>
${body}
</main>
</body>
</html>
`
}
