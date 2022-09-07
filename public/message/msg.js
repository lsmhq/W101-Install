const { ipcRenderer } = require('electron')
window.electronAPI = {
    setTitle: (title) => ipcRenderer.send('setTitle', title)
}