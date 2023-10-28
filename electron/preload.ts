import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  setFullScreen: (fullscreen: boolean) => ipcRenderer.send('set-fullscreen', fullscreen),
  setFouse: () => ipcRenderer.send('set-focus', null),
  setDialog: (options: object) => ipcRenderer.send('open-select-file-dialog', options),

  onFileOpened: (callback: (name: string, blobData: Blob) => void) => {
    ipcRenderer.on('file-opened', (_, name: string, blobData: Blob) => callback(name, blobData))
  }
})
