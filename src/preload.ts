import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
  createRoom: (teamSize: number) => {
    ipcRenderer.send('create-room', teamSize)
  }
})
