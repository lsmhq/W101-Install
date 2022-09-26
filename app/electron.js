const { app, BrowserWindow, nativeImage, ipcMain, screen } = require('electron');
const { autoUpdater } = require('electron-updater') 

let mainWindow, loading
const message = {
  error: '检查更新出错',
  checking: '正在检查更新…',
  updateAva: '正在更新',
  updateNotAva: '已经是最新版本',
  downloadProgress: '正在下载...'
}
const path = require('path');
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
function createWindow () {
  let scaleFactor = (screen.getAllDisplays()[0].scaleFactor >= 2) ? 1 : screen.getAllDisplays()[0].scaleFactor
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
    
  mainWindow.loadFile(__dirname+'/../build/index.html')
  // mainWindow.loadURL(url.format({
  //   pathname: path.join(__dirname, '../build/index.html'),
  //   protocol: 'file:',
  //   slashes: true
  // }))
  // 加载应用 --开发阶段  需要运行 npm run start
  // mainWindow.loadURL('http://localhost:3000/#/');

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
  // 准备好显示
  ipcMain.on('ready', function(e, flag){
    if(flag){
      mainWindow.focus();
      mainWindow.show();
    }
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



// app.whenReady().then(createWindow);
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
  sendUpdateMessage({ cmd: 'downloadProgress', message: message.downloadProgress, progressObj })
})

function sendUpdateMessage(data) {
  mainWindow && mainWindow.webContents.send('message', data)
}
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
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
}
