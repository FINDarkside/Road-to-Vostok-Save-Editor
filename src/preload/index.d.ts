import { ElectronAPI } from '@electron-toolkit/preload'

interface BackupEntry {
  folderName: string
  timestamp: number
  size: number
}

type IconStatus =
  | { status: 'idle' }
  | { status: 'extracting'; progress: number; total: number }
  | { status: 'done' }
  | { status: 'error'; error: string }
  | { status: 'not-found' }

interface SaveApi {
  listSaves(): Promise<{ fileName: string }[]>
  loadSave(fileName: string): Promise<string>
  saveSave(fileName: string, content: string): Promise<void>
  backupSave(): Promise<void>
  getSaveDir(): Promise<string>
  openSaveDir(): Promise<void>

  // Backups
  listBackups(): Promise<BackupEntry[]>
  restoreBackup(folderName: string): Promise<void>
  openBackupsDir(): Promise<void>

  // Icons
  getIconStatus(): Promise<IconStatus>
  extractIcons(force?: boolean): Promise<void>
  getIcon(itemId: string): Promise<string | null>
  onIconProgress(cb: (data: { current: number; total: number }) => void): () => void
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: SaveApi
  }
}
