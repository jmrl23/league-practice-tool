import { app, BrowserWindow, dialog, ipcMain, IpcMainEvent } from 'electron'
import { join } from 'path'
import {
  authenticate,
  createHttp1Request,
  ClientNotFoundError,
  type Credentials
} from 'league-connect'

let credentials: Credentials | null = null

async function createWindow() {
  try {
    credentials = await authenticate({
      awaitConnection: false
    })
    const win = new BrowserWindow({
      width: 600,
      height: 400,
      resizable: false,
      autoHideMenuBar: true,
      disableAutoHideCursor: true,
      titleBarStyle: 'customButtonsOnHover',
      fullscreenable: false,
      fullscreen: false,
      webPreferences: {
        preload: join(__dirname, 'preload.js'),
        nodeIntegration: true
      }
    })
    win.title = 'League Of Legends | Practice Tool'
    win.loadFile(join(__dirname, '../index.html'))
  } catch (error: ClientNotFoundError | unknown) {
    if (error instanceof ClientNotFoundError)
      dialog.showErrorBox('error', error.message)
  }
}

let onProcess = false

ipcMain.on('create-room', async (_event: IpcMainEvent, teamSize: number) => {
  if (onProcess || !credentials) return
  try {
    const response = (
      await createHttp1Request(
        {
          method: 'POST',
          url: '/lol-lobby/v2/lobby',
          body: {
            customGameLobby: {
              configuration: {
                gameMode: 'PRACTICETOOL',
                gameMutator: '',
                mapId: 11,
                mutators: { id: 1 },
                spectatorPolicy: 'NotAllowed',
                teamSize
              },
              lobbyName: 'Practice Tool',
              lobbyPassword: null
            },
            isCustom: true
          }
        },
        credentials
      )
    ).json()
    if (typeof response.errorCode !== 'undefined')
      throw new Error(response?.message as string)
  } catch (error: Error | unknown) {
    if (error instanceof Error)
      dialog.showErrorBox('An error occurs', error.message)
  } finally {
    onProcess = false
  }
})

app.whenReady().then(() => {
  void createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
