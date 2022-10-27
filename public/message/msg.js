(function(){
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
            ipcRenderer.send('ready', {flag: true, type:localStorage.getItem('type')})
        },
        setProgressBar:(progress)=>{
            ipcRenderer.send('downLoad', progress)
        },
        changeType:(type)=>{
            ipcRenderer.send('changeBd', type)
        },
        menuChangeType:(getType)=>{
            ipcRenderer.on('changeBd', (e, type)=>{
                getType && getType(type)
            })
        },
        wordOnHide: (op)=>{
            ipcRenderer.on('wordHide', (e, type)=>{
                op && op(type)
            })
        },
        onWord:(op)=>{
            ipcRenderer.on('onWord', (e, type)=>{
                op && op(type)
            })
        },
        winShow:()=>{
            ipcRenderer.send('show')
        },
        winHide:()=>{
            ipcRenderer.send('hide')
        },
        openWord:()=>{
            ipcRenderer.send('openWord')
        },
        closeWord:()=>{
            ipcRenderer.send('closeWord')
        },
        sendWord:(word)=>{
            ipcRenderer.send('sendWord', word)
        },
        checkUpdate: ()=>{
            ipcRenderer.send('checkupdate')
        }
    }
})()

