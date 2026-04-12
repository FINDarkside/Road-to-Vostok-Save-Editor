import { autoUpdater } from 'electron-updater'
import { dialog, BrowserWindow } from 'electron'
import { is } from '@electron-toolkit/utils'

export function initAutoUpdater(): void {
  if (is.dev) return

  autoUpdater.autoDownload = true
  autoUpdater.autoInstallOnAppQuit = true

  autoUpdater.on('error', (error) => {
    console.error('Auto-updater error:', error)
  })

  autoUpdater.on('update-downloaded', (info) => {
    const window = BrowserWindow.getFocusedWindow() ?? BrowserWindow.getAllWindows()[0]
    dialog
      .showMessageBox(window, {
        type: 'info',
        title: 'Update Ready',
        message: `Version ${info.version} has been downloaded.`,
        detail: 'The update will be installed when you restart the app. Restart now?',
        buttons: ['Restart Now', 'Later'],
        defaultId: 0,
        cancelId: 1
      })
      .then(({ response }) => {
        if (response === 0) {
          autoUpdater.quitAndInstall(false, true)
        }
      })
  })

  autoUpdater.checkForUpdates().catch((error) => {
    console.error('Failed to check for updates:', error)
  })
}
