const child_process = require('child_process');
const { app, BrowserWindow, nativeImage, ipcMain, screen, Tray, Menu, shell } = require('electron');
const { autoUpdater } = require('electron-updater'); 
const remote = require('@electron/remote/main/index')
const url = require('url')
let canQuit = false, work
// const url = require('url');
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'
let mainWindow, loading, tray, width = 1250, height = 700
const message = {
  error: '检查更新出错',
  checking: '正在检查更新…',
  updateAva: '正在更新',
  updateNotAva: '已经是最新版本',
  downloadProgress: '正在下载...'
}
const path = require('path');
const { createWork } = require('./work');
function createWindow () {
  let scaleFactor = (screen.getAllDisplays()[0].scaleFactor >= 2) ? 1 : screen.getAllDisplays()[0].scaleFactor
  scaleFactor = 1
  // localStorage.setItem('scale', scaleFactor)
  mainWindow = new BrowserWindow({
    width: parseInt(width/scaleFactor), // 窗口宽度
    height: parseInt(height/scaleFactor), // 窗口高度
    maxHeight: parseInt(height/scaleFactor),
    maxWidth: parseInt(width/scaleFactor),
    minHeight: parseInt(height/scaleFactor),
    minWidth: parseInt(width/scaleFactor),
    // useContentSize:true,
    title: "Subata", // 窗口标题,如果由loadURL()加载的HTML文件中含有标签<title>，该属性可忽略
    icon: nativeImage.createFromPath('./images/logo.ico'), // "string" || nativeImage.createFromPath('src/image/icons/256x256.ico')从位于 path 的文件创建新的 NativeImage 实例
    frame: false,
    // resizable: false,
    // transparent: true, 
    // opacity:0,
    autoHideMenuBar: true,
    backgroundColor:'#262626',
    focusable: true,
    show: false,
    webPreferences: { // 网页功能设置
      nodeIntegration: true, // 是否启用node集成 渲染进程的内容有访问node的能力
      webviewTag: true, // 是否使用<webview>标签 在一个独立的 frame 和进程里显示外部 web 内容
      webSecurity: false, // 禁用同源策略
      contextIsolation: false,
      // v8CacheOptions: 'none',
      // scrollBounce: true,
      nodeIntegrationInSubFrames: true, // 是否允许在子页面(iframe)或子窗口(child window)中集成Node.js
      preload: path.join(__dirname, 'preload.js'),
      // plugins: true
      // enableRemoteModule: true,
    },
  });
  remote.initialize()
  remote.enable(mainWindow.webContents)

  // mainWindow.loadURL(url.format({
  //   pathname: path.join(__dirname, './build/index.html'),
  //   protocol: 'file:',
  //   slashes: true
  // }))
  
  // 加载应用 --开发阶段  需要运行 npm run start
  mainWindow.loadURL('http://localhost:5000/#/');
  // mainWindow.webContents.openDevTools()
  // 解决应用启动白屏问题
  mainWindow.once('ready-to-show', () => {
    loading.hide();
    loading.close();
    mainWindow.webContents.send('scale', scaleFactor)
    mainWindow.webContents.send('install-path', app.getPath('exe'))
    mainWindow.webContents.send('install-version', app.getVersion())
  });
  // mainWindow.on('resize',()=>{
  //   mainWindow.setMinimumSize(parseInt(width/scaleFactor) , parseInt(height/scaleFactor))
  //   mainWindow.setMaximumSize(parseInt(width/scaleFactor), parseInt(height/scaleFactor))
  //   mainWindow.setSize(parseInt(width/scaleFactor), parseInt(height/scaleFactor))
  // })
  // 当窗口关闭时发出。在你收到这个事件后，你应该删除对窗口的引用，并避免再使用它。
  mainWindow.on('close', (e) => {
    if(!canQuit){
      e.preventDefault()
      mainWindow.hide()
    }
  });

  // 自定义
  ipcMain.on("openGame",(e,data)=>{
    // 打开游戏
    
  });
  // 重启
  ipcMain.on('relaunch',(e, data)=>{
    // console.log('重启')
    app.relaunch()
    app.exit()
  })
  ipcMain.on("downLoadFile",(e,type)=>{
    // 下载补丁
    console.log(type)
  });
  // 打开调试窗口
  ipcMain.on('devWindow',(e, password)=>{
    if(password === 'wizard101-dev')
        mainWindow.webContents.openDevTools()
  })
  ipcMain.on('workError', function(){
    work.close()
  })
  // 移动
  // ipcMain.on('move-application',(event,pos) => {
  //   mainWindow.setPosition(parseInt(pos.posX/scaleFactor), parseInt(pos.posY/scaleFactor))
  // })
  //接收关闭命令
  ipcMain.on('close', function() {
    mainWindow.close()
    // app.quit()
  })
  // 最小化
  ipcMain.on('mini', function(e, data) {
    mainWindow.minimize();
  })
  // 重启
  ipcMain.on('restart', function(){
    mainWindow.reload()
  })
  // 进度条
  ipcMain.on('downLoad', (e, progress)=>{
    // console.log(progress)
    if(progress<=0){
      mainWindow && mainWindow.setProgressBar(-1)
    }else{
      mainWindow && mainWindow.setProgressBar(parseFloat(progress) )
    }
  })
  // 进度条
  ipcMain.on('show', (e)=>{
    mainWindow.show()
  })
  ipcMain.on('hide', (e)=>{
    mainWindow.hide()
    // tray?.displayBalloon({
    //   title: 'subata',
    //   content: '在这里~'
    // })
  })
  // 检查更新
  ipcMain.on('update',()=>{
    checkUpdate((type)=>{
      mainWindow.webContents.send('checking',type)
    })
  })
  ipcMain.on('updateGame', (e, data)=>{
    work = createWork({
      type:'file',
      filePath:'./build/work.html'
    })
    work.webContents.send('updateGame', data)
    work.on('closed',()=>{
      if(mainWindow.isDestroyed()){
        
        return
      }
      mainWindow && mainWindow.webContents.send('workClosed')
    })
    
  })
  let config
  // 准备好显示
  ipcMain.on('ready', function(e, flag){
    // console.log('ready')
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
    // console.log(flag)
    config = [
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
      ]},{
        label: '账号启动',
        submenu: flag.account.account.map(account=>{
          return {
            label: account.account,
            click:()=>{
              mainWindow.webContents.send('startGame', {
                account: account.account,
                password: flag.account.accountMap[account]
              })
            }
          }
        })
      },{
        label: '普通螺旋启动',
        click:()=>{
          mainWindow.webContents.send('startGame')
        }
      },
      {label: "更多操作", submenu:[
        {
          label:'卸载Subata',
          click:()=>{
            let appPath = app.getPath('exe')
            appPath = appPath.split('\\')
            appPath.pop()
            // console.log(appPath.join('\\'))
            let dirPath = `${appPath.join('\\')}\\Uninstall Subata.exe`
            shell.openPath(dirPath)
          }
        }
      ]},
      {label: "退出", click:()=>{
        // mainWindow && mainWindow.close()
        app.quit()
      }}
    ]
    const menu = new Menu.buildFromTemplate(config)
    tray.setContextMenu(menu)
    tray.setToolTip('Subata')
    tray.on('double-click',()=>{
      mainWindow && mainWindow.show()
      // mainWindow && mainWindow.focus()
    })
  })
        // 改变补丁
  ipcMain.on('changeBd', (e, data)=>{
    if(config){
      config[0] = {label:'补丁切换', submenu:[
        {label:'稳定版', click:()=>{  
          mainWindow.webContents.send('changeBd', 'r')
        }, checked: data.type === 'r', type:'radio'},
        {label:"聊天纯享" ,click:()=>{
          mainWindow.webContents.send('changeBd', 'c')
        }, checked: data.type === 'c', type:'radio'},
        {label:'测试版' ,click:()=>{
          mainWindow.webContents.send('changeBd', 'd')
        }, checked: data.type === 'd', type:'radio'}
      ]}
      tray?.setContextMenu(new Menu.buildFromTemplate(config))
    }
  })
  // 账号修改
  ipcMain.on('changeAccount', (e, data)=>{
    // console.log(data.account)
    if(config){
      config[1] = {
        label: '账号启动',
        submenu: data.account.account.map(account=>{
          // console.log(account)
          return {
            label: account.account,
            click:()=>{
              mainWindow.webContents.send('startGame', {
                account: account.account,
                password: data.account.accountMap[account.account]
              })
            }
          }
        })
      }
      tray?.setContextMenu(new Menu.buildFromTemplate(config))
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
  // loading.loadURL('https://static-a3e579e1-12c0-4985-8d49-3ab58c03387a.bspapp.com/');
  loading.loadURL(url.format({
    pathname: path.join(__dirname, './build/loading.html'),
    protocol: 'file:',
    slashes: true
  }))
  loading.on('ready-to-show',()=>{
    loading.focus()
    loading.show();
  })
};



// app.whenReady().then(()=>{

// });

function checkUpdate(callback){
  autoUpdater.checkForUpdates()
  autoUpdater.on('update-downloaded', () => {
    sendUpdateMessage({ cmd: 'update-downloaded', message: message.error })
    autoUpdater.quitAndInstall()
  })
  
  autoUpdater.on('error', function (e) {
    console.log('error', e);
    callback({type: 1, data: e})
    sendUpdateMessage({ cmd: 'error', message: message.error })
  })
  autoUpdater.on('checking-for-update', function () {
    console.log(message.checking)
    callback({type: 2, data: {}})
    sendUpdateMessage({ cmd: 'checking-for-update', message: message.checking })
  })
  autoUpdater.on('update-available', function (info) {
    console.log(message.updateAva)
    callback({type: 3, data: info})
    sendUpdateMessage({ cmd: 'update-available', message: message.updateAva, info })
  })
  autoUpdater.on('update-not-available', function (info) {
    console.log(message.updateNotAva)
    callback({type: 4, data: info})
    sendUpdateMessage({ cmd: 'update-not-available', message: message.updateNotAva, info: info })
  })
  // 更新下载进度事件
  autoUpdater.on('download-progress', function (progressObj) {
    console.log('触发下载。。。')
    // console.log(progressObj.percent)
    callback({type: 5, data: progressObj})
    // mainWindow && mainWindow.setProgressBar(Number.parseFloat(progressObj.percent))
    sendUpdateMessage({ cmd: 'downloadProgress', message: message.downloadProgress, progressObj })
  })
}
app.on('ready', () => {
  // console.log('app-ready')
  showLoading(createWindow)
  sendUpdateMessage({ cmd: 'app-ready', message: message.error })
})



function sendUpdateMessage(data) {
  mainWindow && mainWindow.webContents.send('message', data)
}
// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') {
//     mainWindow && mainWindow.show()
//     mainWindow && mainWindow.focus()
//     app.quit()
//   }
// });

app.on('before-quit',(e)=>{
  if(!canQuit){
    e.preventDefault()
  }
  function killExe (name, callback) {
    // process 不用引入，nodeJS 自带
    // 带有命令行的list进程命令是：“cmd.exe /c wmic process list full”
    //  tasklist 是没有带命令行参数的。可以把这两个命令再cmd里面执行一下看一下效果
    // 注意：命令行获取的都带有换行符，获取之后需要更换换行符。可以执行配合这个使用 str.replace(/[\r\n]/g,""); 去除回车换行符 
    let cmd = 'tasklist'
    child_process.exec(cmd, function (err, stdout, stderr) {
        if (err) {
            return console.error(err)
        }
        // console.log(stdout)
        if(stdout){
          stdout.split('\n').forEach((line) => {
            let processMessage = line.trim().split(/\s+/)
            let processName = processMessage[0] //processMessage[0]进程名称 ， processMessage[1]进程id
            if (processName === name) {
                console.log('Kill Process---->', processMessage[1], processMessage)
                process.kill(processMessage[1])
            }
          })
        }
        callback && callback()
    })
  }
  killExe('launchWizard101.exe', ()=>{
    // killExe('Subata.exe')
    canQuit = true
    // console.log(work)
    if(work && !work.isDestroyed()){
      work.close()
    }
    app.quit()
  })
})
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