// Electron API types
export interface ElectronAPI {
  getSources: () => Promise<Electron.DesktopCapturerSource[]>
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
    ipcRenderer: any
  }
}

export {}
