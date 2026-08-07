import { app, shell, BrowserWindow, net, protocol } from 'electron'
import { join } from 'path'
import { pathToFileURL } from 'url'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { registerSaveHandlers } from './ipc/save-handlers'
import { registerIconHandlers } from './ipc/icon-handlers'
import { registerBackupHandlers } from './ipc/backup-handlers'
import { registerAppHandlers } from './ipc/app-handlers'
import { initAutoUpdater } from './updater'

const ICON_CACHE_DIR = join(app.getPath('userData'), 'icon-cache')

protocol.registerSchemesAsPrivileged([
  { scheme: 'app-icon', privileges: { bypassCSP: true, supportFetchAPI: true } }
])

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 930,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  protocol.handle('app-icon', (request) => {
    const fileName = decodeURIComponent(new URL(request.url).pathname.replace(/^\//, ''))
    const filePath = join(ICON_CACHE_DIR, fileName)
    return net.fetch(pathToFileURL(filePath).toString())
  })

  registerSaveHandlers()
  registerIconHandlers()
  registerBackupHandlers()
  registerAppHandlers()

  createWindow()
  initAutoUpdater()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
