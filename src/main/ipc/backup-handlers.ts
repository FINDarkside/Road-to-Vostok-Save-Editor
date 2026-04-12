import { ipcMain, shell } from 'electron'
import { readdir, mkdir, copyFile, rm, stat } from 'fs/promises'
import { join } from 'path'
import { getSaveDir } from './save-handlers'

const BACKUP_DIR_NAME = 'save-editor-backups'
const MAX_BACKUPS = 20

function getBackupDir() {
  return join(getSaveDir(), BACKUP_DIR_NAME)
}

function formatTimestamp(date: Date) {
  const pad = (n: number) => String(n).padStart(2, '0')
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
    pad(date.getHours()),
    pad(date.getMinutes()),
    pad(date.getSeconds())
  ].join('-')
}

async function getBackupFolders() {
  const backupDir = getBackupDir()
  try {
    const entries = await readdir(backupDir, { withFileTypes: true })
    return entries.filter((e) => e.isDirectory()).map((e) => e.name)
  } catch {
    return []
  }
}

export async function createBackup(): Promise<void> {
  const backupDir = getBackupDir()
  const saveDir = getSaveDir()

  // Backup all .tres files together
  const allFiles = await readdir(saveDir)
  const tresFiles = allFiles.filter((f) => f.endsWith('.tres'))
  if (tresFiles.length === 0) return

  // Generate folder name, handle same-second collisions
  let folderName = formatTimestamp(new Date())
  let targetDir = join(backupDir, folderName)
  let counter = 2
  const existing = new Set(await getBackupFolders())
  while (existing.has(folderName)) {
    folderName = `${formatTimestamp(new Date())}-${counter}`
    targetDir = join(backupDir, folderName)
    counter++
  }

  await mkdir(targetDir, { recursive: true })

  for (const file of tresFiles) {
    await copyFile(join(saveDir, file), join(targetDir, file))
  }

  // Enforce cap
  const folders = (await getBackupFolders()).sort()
  if (folders.length > MAX_BACKUPS) {
    const toDelete = folders.slice(0, folders.length - MAX_BACKUPS)
    for (const folder of toDelete) {
      await rm(join(backupDir, folder), { recursive: true })
    }
  }
}

export function registerBackupHandlers(): void {
  ipcMain.handle('backups:list', async () => {
    const backupDir = getBackupDir()
    const folders = await getBackupFolders()

    const entries = await Promise.all(
      folders.map(async (folderName) => {
        const folderPath = join(backupDir, folderName)
        const folderStat = await stat(folderPath)
        // Sum up file sizes in the folder
        let size = 0
        try {
          const files = await readdir(folderPath)
          for (const file of files) {
            const fileStat = await stat(join(folderPath, file))
            size += fileStat.size
          }
        } catch {
          // ignore
        }
        return {
          folderName,
          timestamp: folderStat.mtimeMs,
          size
        }
      })
    )

    return entries.sort((a, b) => b.timestamp - a.timestamp)
  })

  ipcMain.handle('backups:restore', async (_event, folderName: string) => {
    if (folderName !== folderName.replace(/[/\\]/g, '') || folderName.includes('..')) {
      throw new Error(`Invalid backup folder name: ${folderName}`)
    }

    const backupDir = getBackupDir()
    const folderPath = join(backupDir, folderName)
    const files = await readdir(folderPath)
    const saveDir = getSaveDir()

    // Backup current save files before overwriting them
    await createBackup()

    for (const file of files) {
      await copyFile(join(folderPath, file), join(saveDir, file))
    }
  })

  ipcMain.handle('backups:open-dir', async () => {
    const backupDir = getBackupDir()
    await mkdir(backupDir, { recursive: true })
    await shell.openPath(backupDir)
  })
}
