import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  setFullScreen: (fullscreen: boolean) => ipcRenderer.send('set-fullscreen', fullscreen),
  setFouse: () => ipcRenderer.send('set-focus', null),

  onFileOpened: (callback: (url: string, blobData: Blob) => void) => {
    ipcRenderer.on('file-opened', (_, url: string, blobData: Blob) => callback(url, blobData))
  }
})
