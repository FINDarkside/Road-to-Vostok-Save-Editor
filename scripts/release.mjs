/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { execFileSync, spawnSync } from 'node:child_process'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { resolve } from 'node:path'

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

function runNpm(args) {
  const npmExecPath = process.env.npm_execpath
  if (!npmExecPath) fail('npm_execpath is unavailable; run this script through npm run release.')
  run(process.execPath, [npmExecPath, ...args])
}

function showHelp() {
  console.log(`Usage: npm run release

Extracts the package version's notes from CHANGELOG.md, validates the release
state, pushes main, builds the Windows installer, and publishes the installer
plus updater metadata as a GitHub release.`)
}

function extractReleaseNotes(changelog, version) {
  const escapedVersion = version.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const heading = new RegExp(`^##\\s+${escapedVersion}\\s*$`, 'm')
  const match = heading.exec(changelog)
  if (!match) fail(`CHANGELOG.md has no section for version ${version}.`)

  const remainder = changelog.slice(match.index + match[0].length)
  const nextVersion = remainder.search(/^##\s+/m)
  const notes = (nextVersion === -1 ? remainder : remainder.slice(0, nextVersion)).trim()
  if (!notes) fail(`CHANGELOG.md section ${version} is empty.`)

  // The changelog nests release headings under its version heading. Promote
  // them one level when publishing the version section on its own.
  return notes.replace(/^###\s+/gm, '## ')
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

  const packageJson = JSON.parse(readFileSync('package.json', 'utf8'))
  const packageLock = JSON.parse(readFileSync('package-lock.json', 'utf8'))
  const { name, version } = packageJson
  if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(version)) {
    fail(`Invalid package version: ${version}`)
  }
  if (packageLock.version !== version || packageLock.packages?.['']?.version !== version) {
    fail('package.json and package-lock.json versions do not match.')
  }

  const changelogFile = resolve('CHANGELOG.md')
  if (!existsSync(changelogFile) || !statSync(changelogFile).isFile()) {
    fail(`Changelog file not found: ${changelogFile}`)
  }
  const releaseNotes = extractReleaseNotes(readFileSync(changelogFile, 'utf8'), version)

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

  runNpm(['run', 'build:win'])

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
    '--notes',
    releaseNotes,
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
