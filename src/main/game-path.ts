import { readFile } from 'fs/promises'
import { existsSync } from 'fs'
import { join } from 'path'
import { execFile } from 'child_process'
import { promisify } from 'util'

const execFileAsync = promisify(execFile)

const STEAM_DEFAULT_PATH = 'C:\\Program Files (x86)\\Steam'
const GAME_RELATIVE = 'steamapps\\common\\Road to Vostok\\RTV.pck'
const LIBRARY_FOLDERS_VDF = 'steamapps\\libraryfolders.vdf'

/** Look up Steam's install path from the Windows registry */
async function getSteamPathFromRegistry(): Promise<string | null> {
  const keys = [
    { key: 'HKCU\\SOFTWARE\\Valve\\Steam', value: 'SteamPath' },
    { key: 'HKLM\\SOFTWARE\\WOW6432Node\\Valve\\Steam', value: 'InstallPath' }
  ]
  for (const { key, value } of keys) {
    try {
      const { stdout } = await execFileAsync('reg', ['query', key, '/v', value])
      const match = stdout.match(new RegExp(`${value}\\s+REG_SZ\\s+(.+)`))
      if (match) return match[1].trim()
    } catch {
      // key not found
    }
  }
  return null
}

/** Parse Steam's VDF key-value format to extract library folder paths */
function parseLibraryPaths(vdf: string): string[] {
  const paths: string[] = []
  // Match "path" entries like:   "path"		"C:\\SteamLibrary"
  const pathRegex = /"path"\s+"([^"]+)"/g
  let match: RegExpExecArray | null
  while ((match = pathRegex.exec(vdf)) !== null) {
    paths.push(match[1].replace(/\\\\/g, '\\'))
  }
  return paths
}

/** Find the RTV.pck file by scanning Steam library folders */
export async function findGamePckPath(): Promise<string | null> {
  const steamPath = await getSteamPathFromRegistry()
  const libraryPaths: string[] = []
  if (steamPath) libraryPaths.push(steamPath)
  if (!libraryPaths.includes(STEAM_DEFAULT_PATH)) libraryPaths.push(STEAM_DEFAULT_PATH)

  // Try reading Steam's library config to find all library folders
  for (const base of [...libraryPaths]) {
    const vdfPath = join(base, LIBRARY_FOLDERS_VDF)
    try {
      const vdf = await readFile(vdfPath, 'utf-8')
      for (const p of parseLibraryPaths(vdf)) {
        if (!libraryPaths.includes(p)) libraryPaths.push(p)
      }
      break // parsed successfully, no need to try other bases
    } catch {
      // VDF not found or unreadable at this base
    }
  }

  for (const lib of libraryPaths) {
    const pckPath = join(lib, GAME_RELATIVE)
    if (existsSync(pckPath)) return pckPath
  }

  return null
}
