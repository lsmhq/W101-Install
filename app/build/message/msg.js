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
        restart:()=>{ipcRenderer.send('restart')},
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
        },
        getUpdater:(getUpdate)=>{
            ipcRenderer.on('message', (e, data)=>{
                getUpdate && getUpdate(data)
            })
        },
        ready:()=>{
            ipcRenderer.send('ready', true)
        },
        openLive2d:(type)=>{
            ipcRenderer.send('live2d', type)
        },
        closeLive2d:()=>{
            ipcRenderer.send('close-live2d')
        },
        moveLive2d:(e)=>{
            ipcRenderer.send('move-live2d', {posX:e.x,posY:e.y})
        },
        closedLive2d:(op)=>{
            ipcRenderer.on('live2d-closed',()=>{
                op && op()
            })
        },
        alertTextLive2d:(text)=>{
            ipcRenderer.send('live2d-text', text)
        },
        saveTextLive2d:(save)=>{
            ipcRenderer.on('live2d-alert-text', (e, text)=>{
                save && save(text)
            })
        }
    }
})()

