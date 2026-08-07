import { app, ipcMain } from 'electron'

export function registerAppHandlers(): void {
  ipcMain.handle('app:get-version', () => app.getVersion())
}
