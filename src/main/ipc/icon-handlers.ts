import { ipcMain, BrowserWindow } from 'electron'
import { findGamePckPath } from '../game-path'
import { extractAllIcons, getIconStatus, getIconUrl, type IconStatus } from '../icon-extractor'

let cachedPckPath: string | null | undefined = undefined

async function getPckPath(): Promise<string | null> {
  if (cachedPckPath === undefined) {
    cachedPckPath = await findGamePckPath()
  }
  return cachedPckPath
}

function sendProgress(current: number, total: number): void {
  for (const win of BrowserWindow.getAllWindows()) {
    win.webContents.send('icons:progress', { current, total })
  }
}

export function registerIconHandlers(): void {
  ipcMain.handle('icons:get-status', async (): Promise<IconStatus> => {
    const pckPath = await getPckPath()
    if (!pckPath) return { status: 'not-found' }
    return getIconStatus()
  })

  ipcMain.handle('icons:extract-all', async (_event, force?: boolean): Promise<void> => {
    const pckPath = await getPckPath()
    if (!pckPath) throw new Error('Game not found')

    await extractAllIcons(
      pckPath,
      (progress) => sendProgress(progress.current, progress.total),
      force ?? false
    )
  })

  ipcMain.handle('icons:get', (_event, itemId: string): string | null => {
    return getIconUrl(itemId)
  })
}
