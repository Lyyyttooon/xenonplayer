import { app, BrowserWindow, dialog, ipcMain, powerSaveBlocker } from 'electron'
import path, { join } from 'node:path'
import fs from 'node:fs'

let win: BrowserWindow | null = null
let powerSaveBlockerId: number | null = null

const preload = join(__dirname, './preload.js')
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join('dist/index.html')

function createWindow() {
  win = new BrowserWindow({
    frame: false,
    titleBarStyle: 'hidden',
    backgroundColor: '#1e1e1e',
    titleBarOverlay: {
      color: '#323233',
      symbolColor: '#9d9d9d',
      height: 34
    },
    webPreferences: {
      preload
    }
  })

  if (url) {
    win.loadURL(url)

    // Open devTool if the app is not packaged
    win.webContents.openDevTools()
  } else {
    win.loadFile(indexHtml)
  }
}

app.whenReady().then(() => {
  ipcMain.on('set-fullscreen', handleSetFullscreen)
  ipcMain.on('set-focus', handleFouseMainWindow)
  ipcMain.on('open-select-file-dialog', openSelectFileDialog)

  createWindow()
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    createWindow()
  } else {
    allWindows[0].focus()
  }
})

app.on('ready', () => {
  if (process.platform === 'darwin') {
    return
  }
  const url = process.argv[process.argv.length - 1]
  openFile(url)
})

app.on('will-finish-launching', () => {
  app.on('open-file', (event, url) => {
    event.preventDefault()
    openFile(url)
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// 设置全屏，并阻止屏幕休眠
function handleSetFullscreen(_: any, fullscreen: boolean) {
  if (win) {
    win.setFullScreen(fullscreen)
    if (powerSaveBlockerId) {
      powerSaveBlocker.stop(powerSaveBlockerId)
      powerSaveBlockerId = null
    } else {
      powerSaveBlockerId = powerSaveBlocker.start('prevent-display-sleep')
    }
  }
}

// 焦点到主窗口
function handleFouseMainWindow() {
  if (win) {
    win.focus()
  }
}

function openFile(url: string) {
  fs.readFile(url, (err, data) => {
    if (err) {
      console.log('File read error', err.message)
      return
    }
    win?.webContents.send('file-opened', path.parse(url).name, data)
  })
}

function openSelectFileDialog(_: any, options: object) {
  dialog
    .showOpenDialog(options)
    .then((result) => {
      openFile(result.filePaths[0])
    })
    .catch((err) => {
      console.log(err)
    })
}
