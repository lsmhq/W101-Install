(function(){
    try {
        const { ipcRenderer, shell } = require('electron')
    
        function openB(url){
            shell.openExternal(url);
        }
        function sound(){
            // shell.beep()
            document.getElementById('audio').play()
        }
        window.electronAPI = {
            openGame: (title) => ipcRenderer.send('openGame', title),
            downLoadFile:(type)=>ipcRenderer.send('downLoadFile',type),
            openBroswer:openB,
            sendXY:(e)=>{ipcRenderer.send('move-application',{posX:e.x,posY:e.y})},
            mini:()=>{ipcRenderer.send('mini')},
            close:()=>{ipcRenderer.send('close')},
            restart:()=>{ipcRenderer.send('relaunch')},
            updateGame:()=>{ipcRenderer.send('updateGame',{
                wizPath: window.wizPath
            })},
            workOnClosed:(callback)=>{
                ipcRenderer.on('workClosed',()=>{
                    callback()
                })
            },
            devOnclosed:(callback)=>{
                
                ipcRenderer.on('devClosed',()=>{
                    callback()
                })
            },
            sound,
            getScale:(getZoom)=>{ipcRenderer.on('scale',(event, scale)=>{
                console.log(scale)
                localStorage.setItem('scale', scale)
                getZoom && getZoom(scale)
            })},
            getPath:(getExe)=>{
                ipcRenderer.on('install-path',(event, path)=>{
                    console.log('install-path', path)
                    let installPath = path
                    installPath = installPath.split('\\')
                    installPath.pop()
                    console.log(installPath.join('\\'))
                    let dirPath = `${installPath.join('\\')}\\`
                    getExe && getExe(dirPath)
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
                // console.log('------->','123123')
                // console.log(JSON.parse(localStorage.getItem('accounts')))
                ipcRenderer.send('ready', {
                    flag: true, 
                    type:localStorage.getItem('type'), 
                    account:{
                        account: JSON.parse(localStorage.getItem('accounts')) || [],
                        accountMap: JSON.parse(localStorage.getItem('accountsMap')) || {}
                    }
                })
            },
            setProgressBar:(progress)=>{
                ipcRenderer.send('downLoad', progress)
            },
            changeType:(type)=>{
                ipcRenderer.send('changeBd', {
                    type, 
                    account:{
                        account: JSON.parse(localStorage.getItem('accounts')) || [],
                        accountMap: JSON.parse(localStorage.getItem('accountsMap')) || {}
                    }
                })
            },
            menuChangeType:(getType)=>{
                ipcRenderer.on('changeBd', (e, type)=>{
                    getType && getType(type)
                })
            },
            winShow:()=>{
                ipcRenderer.send('show')
            },
            winHide:()=>{
                ipcRenderer.send('hide')
            },
            openDev:()=>{
                ipcRenderer.send('devWindow', 'wizard101-dev')
                
            },
            checkUpdate:(callback)=>{
                ipcRenderer.send('update')
                ipcRenderer.on('checking',(e, type)=>{
                    // console.log(type)
                    callback(type)
                })
            },
            startGame: ()=>{
                ipcRenderer.on('startGame', (e, userInfo)=>{
                    console.log(userInfo)
                    if(userInfo){
                        window.tools.login(userInfo.account, userInfo.password,()=>{
    
                        })
                    }else{
                        window.tools.startGame()
                    }
                })
            },
            addAccount: ()=>{
                ipcRenderer.send('changeAccount',{
                    type: localStorage.getItem('type'), 
                    account:{
                        account: JSON.parse(localStorage.getItem('accounts')) || [],
                        accountMap: JSON.parse(localStorage.getItem('accountsMap')) || {}
                    }
                })
            }
        }
    } catch (error) {
        console.log('浏览器环境报错', error)
    }
})()

