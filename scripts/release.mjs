// Release orchestrator: version bump -> build -> test -> vsce package ->
// git commit + tag -> (optional) push -> (optional) marketplace publish.
// Dry-run default: prints the exact plan. --apply executes it.
//   node scripts/release.mjs --bump minor --apply --push --marketplace
import { readFileSync, writeFileSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const args = process.argv.slice(2)
const apply = args.includes('--apply')
const push = args.includes('--push')
const marketplace = args.includes('--marketplace')
const bump = ['patch', 'minor', 'major'].includes(args[args.indexOf('--bump') + 1])
  ? args[args.indexOf('--bump') + 1]
  : 'patch'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const run = (cmd) => execSync(cmd, { stdio: 'inherit', cwd: ROOT })

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))
const [major, minor, patch] = pkg.version.split('.').map(Number)
const next = { patch: [major, minor, patch + 1], minor: [major, minor + 1, 0], major: [major + 1, 0, 0] }[bump].join('.')

const gitClean = execSync('git status --porcelain', { cwd: ROOT }).toString().trim() === ''
const branch = execSync('git branch --show-current', { cwd: ROOT }).toString().trim()

const steps = [
  `bump version ${pkg.version} -> ${next} (${bump})`,
  'npm run build (regenerates all artifacts incl. obsidian manifests at the new version)',
  'npm test',
  `git add -A && git commit -m "Release v${next}"`,
  `git tag v${next}`,
  'npx @vscode/vsce package (artifact for the marketplace/GitHub release)',
  ...(push ? [`git push origin ${branch} --tags`] : ['(skipped: push — pass --push)']),
  ...(marketplace ? ['npx @vscode/vsce publish'] : ['(skipped: marketplace publish — pass --marketplace)']),
]

console.log(`Release plan for Eden Bloom v${next} (branch: ${branch})`)
steps.forEach((s, i) => console.log(`  ${i + 1}. ${s}`))

if (!gitClean) {
  console.error('\naborting: working tree is dirty — commit or stash first')
  process.exit(1)
}
if (!apply) {
  console.log('\ndry run — re-run with --apply to execute')
  process.exit(0)
}

pkg.version = next
writeFileSync(new URL('../package.json', import.meta.url), JSON.stringify(pkg, null, 2) + '\n')
run('npm run build')
run('npm test')
run(`git add -A && git commit -m "Release v${next}"`)
run(`git tag v${next}`)
run('npx @vscode/vsce package')
if (push) run(`git push origin ${branch} --tags`)
if (marketplace) run('npx @vscode/vsce publish')
console.log(`\nv${next} released${marketplace ? ' and published to the marketplace' : ''}.`)
if (!marketplace) console.log('marketplace publish skipped — run npm run publish:marketplace when ready.')
