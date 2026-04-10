import { readFile } from 'fs/promises'
import { existsSync } from 'fs'
import { join } from 'path'

const STEAM_DEFAULT_PATH = 'C:\\Program Files (x86)\\Steam'
const GAME_RELATIVE = 'steamapps\\common\\Road to Vostok\\RTV.pck'
const LIBRARY_FOLDERS_VDF = 'steamapps\\libraryfolders.vdf'

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
  // Try reading Steam's library config to find all library folders
  const vdfPath = join(STEAM_DEFAULT_PATH, LIBRARY_FOLDERS_VDF)
  const libraryPaths: string[] = [STEAM_DEFAULT_PATH]

  try {
    const vdf = await readFile(vdfPath, 'utf-8')
    const parsed = parseLibraryPaths(vdf)
    for (const p of parsed) {
      if (!libraryPaths.includes(p)) libraryPaths.push(p)
    }
  } catch {
    // VDF not found or unreadable — just try default path
  }

  for (const lib of libraryPaths) {
    const pckPath = join(lib, GAME_RELATIVE)
    if (existsSync(pckPath)) return pckPath
  }

  return null
}
