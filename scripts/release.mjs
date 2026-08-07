/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { execFileSync, spawnSync } from 'node:child_process'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { resolve } from 'node:path'

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const gh = process.platform === 'win32' ? 'gh.exe' : 'gh'

function fail(message) {
  throw new Error(message)
}

function run(command, args) {
  execFileSync(command, args, { stdio: 'inherit' })
}

function capture(command, args) {
  return execFileSync(command, args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe']
  }).trim()
}

function optionValue(name) {
  const index = process.argv.indexOf(name)
  if (index === -1) return null
  const value = process.argv[index + 1]
  if (!value || value.startsWith('--')) fail(`${name} requires a value.`)
  return value
}

function showHelp() {
  console.log(`Usage: npm run release -- <notes-file>
       node scripts/release.mjs --notes-file <path>

Validates the release state, pushes main, builds the Windows installer, and
publishes the installer plus updater metadata as a GitHub release.`)
}

function assertReleaseDoesNotExist(tag) {
  const result = spawnSync(gh, ['release', 'view', tag], { encoding: 'utf8' })
  if (result.error) throw result.error
  if (result.status === 0) fail(`GitHub release ${tag} already exists.`)
  if (!result.stderr.includes('release not found')) {
    fail(result.stderr.trim() || `Unable to check whether ${tag} already exists.`)
  }
}

function assertTagDoesNotExist(tag) {
  if (capture('git', ['tag', '--list', tag])) fail(`Local tag ${tag} already exists.`)

  const result = spawnSync(
    'git',
    ['ls-remote', '--exit-code', '--tags', 'origin', `refs/tags/${tag}`],
    { encoding: 'utf8' }
  )
  if (result.error) throw result.error
  if (result.status === 0) fail(`Remote tag ${tag} already exists.`)
  if (result.status !== 2) {
    fail(result.stderr.trim() || `Unable to check whether remote tag ${tag} already exists.`)
  }
}

function main() {
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    showHelp()
    return
  }

  const positionalArgument = process.argv.slice(2).find((argument) => !argument.startsWith('-'))
  const notesArgument = optionValue('--notes-file') ?? positionalArgument
  if (!notesArgument) fail('Missing release notes file path.')

  const notesFile = resolve(notesArgument)
  if (!existsSync(notesFile) || !statSync(notesFile).isFile()) {
    fail(`Release notes file not found: ${notesFile}`)
  }
  if (!readFileSync(notesFile, 'utf8').trim()) fail('Release notes file is empty.')

  const packageJson = JSON.parse(readFileSync('package.json', 'utf8'))
  const packageLock = JSON.parse(readFileSync('package-lock.json', 'utf8'))
  const { name, version } = packageJson
  if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(version)) {
    fail(`Invalid package version: ${version}`)
  }
  if (packageLock.version !== version || packageLock.packages?.['']?.version !== version) {
    fail('package.json and package-lock.json versions do not match.')
  }

  const branch = capture('git', ['branch', '--show-current'])
  if (branch !== 'main')
    fail(`Releases must be created from main, not ${branch || 'detached HEAD'}.`)

  const status = capture('git', ['status', '--porcelain'])
  if (status) fail('Working directory is not clean. Commit or stash changes before releasing.')

  const tag = `v${version}`
  run(gh, ['auth', 'status'])
  assertReleaseDoesNotExist(tag)
  assertTagDoesNotExist(tag)

  run('git', ['push', 'origin', 'main'])
  const target = capture('git', ['rev-parse', 'HEAD'])

  run(npm, ['run', 'build:win'])

  const installerName = `${name}-${version}-setup.exe`
  const assetPaths = [
    resolve('dist', installerName),
    resolve('dist', `${installerName}.blockmap`),
    resolve('dist', 'latest.yml')
  ]
  for (const assetPath of assetPaths) {
    if (!existsSync(assetPath) || !statSync(assetPath).isFile()) {
      fail(`Expected release asset was not built: ${assetPath}`)
    }
  }

  const latestYaml = readFileSync(assetPaths[2], 'utf8')
  const latestVersion = latestYaml.match(/^version:\s*(.+)\s*$/m)?.[1]
  if (latestVersion !== version) {
    fail(`dist/latest.yml contains version ${latestVersion ?? '(missing)'}, expected ${version}.`)
  }

  run(gh, [
    'release',
    'create',
    tag,
    ...assetPaths,
    '--target',
    target,
    '--title',
    version,
    '--notes-file',
    notesFile,
    '--fail-on-no-commits'
  ])

  const url = capture(gh, ['release', 'view', tag, '--json', 'url', '--jq', '.url'])
  console.log(`Released ${tag}: ${url}`)
}

try {
  main()
} catch (error) {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
}
