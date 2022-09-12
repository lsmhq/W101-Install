const { ipcRenderer, shell, screen } = require('electron')

// console.log(remote.app.getPath('exe'))


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
    getScale:()=>{ipcRenderer.on('scale',(event, scale)=>{
        console.log(scale)
        document.body.style.zoom = 1 + (1 - scale)
        localStorage.setItem('scale', scale)
    })},
    sound,
    getScaleFactor:()=>{
        // let scaleFactor = screen.getAllDisplays()[0].scaleFactor
        console.log(screen)
        // return scaleFactor
    }
}