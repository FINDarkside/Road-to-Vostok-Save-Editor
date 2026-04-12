import { execSync } from 'child_process'

execSync('npm run build', { stdio: 'inherit' })
const token = execSync('gh auth token', { encoding: 'utf-8' }).trim()
execSync('electron-builder --win --publish always', {
  stdio: 'inherit',
  env: { ...process.env, GH_TOKEN: token }
})
