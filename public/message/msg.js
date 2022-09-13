(function(){
    const { ipcRenderer, shell, screen } = require('electron')
    
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
        sound,
        getScale:(getZoom)=>{ipcRenderer.on('scale',(event, scale)=>{
            console.log(scale)
            localStorage.setItem('scale', scale)
            getZoom && getZoom(scale)
        })},
        getPath:(getExe)=>{
            ipcRenderer.on('install-path',(event, path)=>{
                console.log('install-path')
                getExe && getExe(path)
            })
        },
        getVersion:(getVer)=>{
            ipcRenderer.on('install-version',(event, path)=>{
                console.log('install-version')
                getVer && getVer(path)
            })
        }
    }
})()

