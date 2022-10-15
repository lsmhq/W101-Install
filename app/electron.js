const { app, BrowserWindow, nativeImage, ipcMain, screen, Tray, Menu, ipcRenderer, shell } = require('electron');
const { autoUpdater } = require('electron-updater'); 
let mainWindow, loading, tray
const message = {
  error: '检查更新出错',
  checking: '正在检查更新…',
  updateAva: '正在更新',
  updateNotAva: '已经是最新版本',
  downloadProgress: '正在下载...'
}
process.setMaxListeners(0)
const path = require('path');
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
function createWindow () {
  let scaleFactor = (screen.getAllDisplays()[0].scaleFactor >= 2) ? 1 : screen.getAllDisplays()[0].scaleFactor
  scaleFactor = 1
  // localStorage.setItem('scale', scaleFactor)
  mainWindow = new BrowserWindow({
    width: parseInt(1250/scaleFactor), // 窗口宽度
    height: parseInt(700/scaleFactor), // 窗口高度
    // useContentSize:true,
    title: "Subata", // 窗口标题,如果由loadURL()加载的HTML文件中含有标签<title>，该属性可忽略
    icon: nativeImage.createFromPath('./images/logo.ico'), // "string" || nativeImage.createFromPath('src/image/icons/256x256.ico')从位于 path 的文件创建新的 NativeImage 实例
    frame: false,
    resizable: false,
    transparent: true, 
    // backgroundColor:'#282b30',
    focusable:true,
    show:false,
    webPreferences: { // 网页功能设置
      nodeIntegration: true, // 是否启用node集成 渲染进程的内容有访问node的能力
      // webviewTag: true, // 是否使用<webview>标签 在一个独立的 frame 和进程里显示外部 web 内容
      webSecurity: false, // 禁用同源策略
      contextIsolation: false,
      v8CacheOptions:'none',
      scrollBounce:true,
      nodeIntegrationInSubFrames: true, // 是否允许在子页面(iframe)或子窗口(child window)中集成Node.js
      preload: path.join(__dirname, 'preload.js'),
    }
  });
  // let size = mainWindow.getSize()
  mainWindow.webContents.openDevTools() // 打开窗口调试

  // 加载应用 --打包react应用后，__dirname为当前文件路径
  // mainWindow.loadURL(`https://static-cb49dc29-e439-4e8c-81f2-5ea0c9772303.bspapp.com/`);
    // mainWindow.loadURL('http://lsmhq.gitee.io/one-click-installation-script/')
    // mainWindow.loadFile(__dirname+'/../build/index.html')
    
  // mainWindow.loadFile(__dirname+'/../build/index.html')
  // mainWindow.loadURL(url.format({
  //   pathname: path.join(__dirname, '../build/index.html'),
  //   protocol: 'file:',
  //   slashes: true
  // }))
  // 加载应用 --开发阶段  需要运行 npm run start
  mainWindow.loadURL('http://localhost:3000/#/');

  // 解决应用启动白屏问题
  mainWindow.once('ready-to-show', () => {
    loading.hide();
    loading.close();
    mainWindow.webContents.send('scale', scaleFactor)
    mainWindow.webContents.send('install-path', app.getPath('exe'))
    mainWindow.webContents.send('install-version', app.getVersion())
  });
  mainWindow.on('will-resize',()=>{
    mainWindow.setMinimumSize(parseInt(1250/scaleFactor) , parseInt(700/scaleFactor))
    mainWindow.setMaximumSize(parseInt(1250/scaleFactor), parseInt(700/scaleFactor))
    mainWindow.setSize(parseInt(1250/scaleFactor), parseInt(700/scaleFactor))
  })

  // 当窗口关闭时发出。在你收到这个事件后，你应该删除对窗口的引用，并避免再使用它。
  mainWindow.on('closed', () => {
    mainWindow = null;
    // newWin && newWin.close()
    mainWindow = null;
    tray && tray.destroy()
    tray = null
    // newWin = null

  });
  mainWindow.on('resize',()=>{
    // return false
    mainWindow.setMinimumSize(parseInt(1250/scaleFactor), parseInt(700/scaleFactor))
    mainWindow.setMaximumSize(parseInt(1250/scaleFactor), parseInt(700/scaleFactor))
    mainWindow.setSize(parseInt(1250/scaleFactor), parseInt(700/scaleFactor))
  })
  // 自定义
  ipcMain.on("openGame",(e,data)=>{
    // 打开游戏
    
  });
  ipcMain.on("downLoadFile",(e,type)=>{
    // 下载补丁
    console.log(type)
  });
  // 移动
  ipcMain.on('move-application',(event,pos) => {
    // console.log(size)
    mainWindow.setPosition(parseInt(pos.posX), parseInt(pos.posY), true)
    // console.log(mainWindow.getSize())
  })
  //接收关闭命令
  ipcMain.on('close', function() {
    mainWindow.close();
  })
  // 最小化
  ipcMain.on('mini', function() {
    mainWindow.minimize();
  })
  // 重启
  ipcMain.on('restart', function(){
    mainWindow.reload()
  })
  // 进度条
  ipcMain.on('downLoad', (e, progress)=>{
    mainWindow.setProgressBar(progress)
  })
  // 进度条
  ipcMain.on('show', (e)=>{
    mainWindow.show()
  })
  ipcMain.on('hide', (e)=>{
    mainWindow.hide()
  })
  // 准备好显示
  ipcMain.on('ready', function(e, flag){
    if(flag.flag){
      mainWindow.focus();
      mainWindow.show();
    }
    // let img = nativeImage.createFromPath()
    let trayIcon = path.join(__dirname, 'images');//app是选取的目录
  
    // appTray = new Tray();//app.ico是app目录下的ico文件
    if(tray){

    }else{
      tray = new Tray(path.join(trayIcon, 'logo.ico'))
    }
    // console.log(trayIcon)
    let config = [
      {label:'补丁切换', submenu:[
        {label:'稳定版', click:()=>{  
          mainWindow.webContents.send('changeBd', 'r')
        }, checked: flag.type === 'r', type:'radio'},
        {label:"聊天纯享" ,click:()=>{
          mainWindow.webContents.send('changeBd', 'c')
        }, checked: flag.type === 'c', type:'radio'},
        {label:'测试版' ,click:()=>{
          mainWindow.webContents.send('changeBd', 'd')
        }, checked: flag.type === 'd', type:'radio'}
      ]},
      {label: "更多", submenu:[
        {
          label:'卸载Subata',
          click:()=>{
            let appPath = app.getPath('exe')
            appPath = appPath.split('\\')
            appPath.pop()
            console.log(appPath.join('\\'))
            let dirPath = `${appPath.join('\\')}\\Uninstall Subata.exe`
            shell.openPath(dirPath)
          }
        }
      ] },
      {label: "退出", click:()=>{
        mainWindow && mainWindow.close()
      }}
    ]
    const menu = new Menu.buildFromTemplate(config)
    tray.setContextMenu(menu)
    tray.setToolTip('Subata')
    tray.on('double-click',()=>{
      mainWindow && mainWindow.show()
      // mainWindow && mainWindow.focus()
    })
      // 改变补丁
      ipcMain.on('changeBd', (e, type)=>{
        config = [
          {label:'补丁切换', submenu:[
            {label:'稳定版', click:()=>{
              mainWindow.webContents.send('changeBd', 'r')
            }, checked: type === 'r', type:'radio'},
            {label:"聊天纯享" ,click:()=>{
              mainWindow.webContents.send('changeBd', 'c')
            }, checked: type === 'c', type:'radio'},
            {label:'测试版' ,click:()=>{
              mainWindow.webContents.send('changeBd', 'd')
            }, checked: type === 'd', type:'radio'}
          ]},
          {label: "更多", submenu:[
            {
              label:'卸载Subata',
              click:()=>{
                let appPath = app.getPath('exe')
                appPath = appPath.split('\\')
                appPath.pop()
                console.log(appPath.join('\\'))
                let dirPath = `${appPath.join('\\')}\\Uninstall Subata.exe`
                shell.openPath(dirPath)
              }
            }
          ] },
          {label: "退出", click:()=>{
            mainWindow && mainWindow.close()
          }}
        ]
        tray.setContextMenu(new Menu.buildFromTemplate(config))
      })
  })
}


const showLoading = (cb) => {
  loading = new BrowserWindow({
      show: false,
      frame: false, // 无边框（窗口、工具栏等），只包含网页内容
      width: 180,
      height: 220,
      transparent:true,
      // backgroundColor:'#282b30',
      resizable: false,
  });

  loading.once("show", cb);
  loading.loadURL('https://static-a3e579e1-12c0-4985-8d49-3ab58c03387a.bspapp.com/');
  loading.on('ready-to-show',()=>{
    loading.focus()
    loading.show();
  })
};



// app.whenReady().then(()=>{

// });
app.commandLine.appendSwitch("--disable-http-cache")
app.on('ready', () => {
  // console.log('app-ready')
  showLoading(createWindow)
  sendUpdateMessage({ cmd: 'app-ready', message: message.error })
  autoUpdater.checkForUpdates()
})

autoUpdater.on('update-downloaded', () => {
  sendUpdateMessage({ cmd: 'update-downloaded', message: message.error })
  autoUpdater.quitAndInstall()
})

autoUpdater.on('error', function (e) {
  console.log('error', e);
  sendUpdateMessage({ cmd: 'error', message: message.error })
})
autoUpdater.on('checking-for-update', function () {
  console.log(message.checking)
  sendUpdateMessage({ cmd: 'checking-for-update', message: message.checking })
})
autoUpdater.on('update-available', function (info) {
  console.log(message.updateAva)
  sendUpdateMessage({ cmd: 'update-available', message: message.updateAva, info })
})
autoUpdater.on('update-not-available', function (info) {
  console.log(message.updateNotAva)
  sendUpdateMessage({ cmd: 'update-not-available', message: message.updateNotAva, info: info })
})
// 更新下载进度事件
autoUpdater.on('download-progress', function (progressObj) {
  console.log('触发下载。。。')
  console.log(progressObj)
  mainWindow.setProgressBar((progressObj.transferred/progressObj.total).toFixed(2))
  sendUpdateMessage({ cmd: 'downloadProgress', message: message.downloadProgress, progressObj })
})

function sendUpdateMessage(data) {
  mainWindow && mainWindow.webContents.send('message', data)
}
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    mainWindow && mainWindow.show()
    mainWindow && mainWindow.focus()
    app.quit()
  }
});

// app.on('activate', () => {
//   if (BrowserWindow.getAllWindows().length === 0) {
//     createWindow()
//   }
// });

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
    app.quit()
}else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        try {
            if (mainWindow) {
                if (mainWindow.isMinimized()) mainWindow.restore()
                mainWindow.focus()
                mainWindow.show()
            }
        }catch (e) {

        }
    })
}