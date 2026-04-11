import { ipcMain, shell } from 'electron'
import { readdir, readFile, copyFile, writeFile } from 'fs/promises'
import { join, basename, extname } from 'path'

const SAVE_DIR_NAME = 'Road to Vostok'

function getSaveDir(): string {
  const appData = process.env.APPDATA
  if (!appData) throw new Error('APPDATA environment variable not set')
  return join(appData, SAVE_DIR_NAME)
}

/** Validate fileName is a simple .tres filename with no path traversal */
function validateFileName(fileName: string): void {
  if (fileName !== basename(fileName) || fileName.includes('..') || extname(fileName) !== '.tres') {
    throw new Error(`Invalid save file name: ${fileName}`)
  }
}

export function registerSaveHandlers(): void {
  ipcMain.handle('saves:list', async () => {
    const dir = getSaveDir()
    const entries = await readdir(dir)
    return entries.filter((f) => f.endsWith('.tres')).map((fileName) => ({ fileName }))
  })

  ipcMain.handle('saves:load', async (_event, fileName: string) => {
    validateFileName(fileName)
    const filePath = join(getSaveDir(), fileName)
    return readFile(filePath, 'utf-8')
  })

  ipcMain.handle('saves:get-dir', () => getSaveDir())

  ipcMain.handle('saves:open-dir', async () => {
    await shell.openPath(getSaveDir())
  })

  ipcMain.handle('saves:save', async (_event, fileName: string, content: string) => {
    validateFileName(fileName)
    const dir = getSaveDir()
    const filePath = join(dir, fileName)
    const backupPath = join(dir, `${fileName}.bak`)

    // Create backup of original
    try {
      await copyFile(filePath, backupPath)
    } catch {
      // Original may not exist yet — that's fine
    }

    await writeFile(filePath, content, 'utf-8')
  })
}
