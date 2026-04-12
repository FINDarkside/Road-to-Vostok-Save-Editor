import { execSync } from 'child_process'

const status = execSync('git status --porcelain', { encoding: 'utf-8' }).trim()
if (status) {
  console.error('Working directory is not clean. Commit or stash changes before releasing.')
  process.exit(1)
}

execSync('git push', { stdio: 'inherit' })
execSync('npm run build', { stdio: 'inherit' })
const token = execSync('gh auth token', { encoding: 'utf-8' }).trim()
execSync('electron-builder --win --publish always', {
  stdio: 'inherit',
  env: { ...process.env, GH_TOKEN: token }
})
