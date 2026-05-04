import { autoUpdater } from 'electron-updater'
import { dialog, BrowserWindow } from 'electron'
import { is } from '@electron-toolkit/utils'

// GitHub returns release notes as HTML via the Atom feed; the native message
// box renders plain text, so strip tags and translate common block elements.
function htmlToPlainText(html: string): string {
  return html
    .replace(/<li[^>]*>/gi, '\n• ')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|h[1-6]|ul|ol|li)>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n[ \t]+/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

export function initAutoUpdater(): void {
  if (is.dev) return

  autoUpdater.autoDownload = true
  autoUpdater.autoInstallOnAppQuit = true

  autoUpdater.on('error', (error) => {
    console.error('Auto-updater error:', error)
  })

  autoUpdater.on('update-downloaded', (info) => {
    const window = BrowserWindow.getFocusedWindow() ?? BrowserWindow.getAllWindows()[0]
    const rawNotes = Array.isArray(info.releaseNotes)
      ? info.releaseNotes.map((n) => n.note).join('\n')
      : info.releaseNotes || ''
    const notes = htmlToPlainText(rawNotes)
    const detail = notes
      ? `${notes}\n\nRestart now to apply the update?`
      : 'Restart now to apply the update?'
    dialog
      .showMessageBox(window, {
        type: 'info',
        title: 'Update Ready',
        message: `Version ${info.version} has been downloaded.`,
        detail,
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
