const { ipcRenderer, shell } = require('electron')

function openB(url){
    shell.openExternal(url);
}
function sound(){
    shell.beep()
}
window.electronAPI = {
    openGame: (title) => ipcRenderer.send('openGame', title),
    downLoadFile:(type)=>ipcRenderer.send('downLoadFile',type),
    openBroswer:openB,
    sendXY:(e)=>{ipcRenderer.send('move-application',{posX:e.x,posY:e.y})},
    mini:()=>{ipcRenderer.send('mini')},
    close:()=>{ipcRenderer.send('close')},
    sound
}