// 导入app、BrowserWindow模块
// app 控制应用程序的事件生命周期。事件调用app.on('eventName', callback)，方法调用app.functionName(arg)
// BrowserWindow 创建和控制浏览器窗口。new BrowserWindow([options]) 事件和方法调用同app
// Electron参考文档 https://www.electronjs.org/docs
const { app, BrowserWindow, nativeImage, ipcMain } = require('electron');
const url = require('url');
const path = require('path');
const httpServer = require('http-server');
function createWindow () {
  let mainWindow = new BrowserWindow({
    width: 1250, // 窗口宽度
    height: 700, // 窗口高度
    title: "Subata汉化", // 窗口标题,如果由loadURL()加载的HTML文件中含有标签<title>，该属性可忽略
    icon: nativeImage.createFromPath('./images/logo.ico'), // "string" || nativeImage.createFromPath('src/image/icons/256x256.ico')从位于 path 的文件创建新的 NativeImage 实例
    frame: false,
    resizable: false,
    darkTheme: true,
    transparent:true,
    backgroundColor:'#282b30',
    webPreferences: { // 网页功能设置
      nodeIntegration: true, // 是否启用node集成 渲染进程的内容有访问node的能力
      webviewTag: true, // 是否使用<webview>标签 在一个独立的 frame 和进程里显示外部 web 内容
      webSecurity: false, // 禁用同源策略
      contextIsolation: false,
      nodeIntegrationInSubFrames: true, // 是否允许在子页面(iframe)或子窗口(child window)中集成Node.js
      preload: path.join(__dirname, 'preload.js')
    }
  });
  mainWindow.webContents.openDevTools() // 打开窗口调试
  // 加载应用 --打包react应用后，__dirname为当前文件路径
  // mainWindow.loadURL(`https://static-a3e579e1-12c0-4985-8d49-3ab58c03387a.bspapp.com/`);

  // 加载应用 --开发阶段  需要运行 npm run start
  mainWindow.loadURL('http://localhost:3000/');

  // 解决应用启动白屏问题
  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  // 当窗口关闭时发出。在你收到这个事件后，你应该删除对窗口的引用，并避免再使用它。
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
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
    // console.log(pos.posX)
    mainWindow.setPosition(parseInt(pos.posX), parseInt(pos.posY))
  })
  //接收关闭命令
  ipcMain.on('close', function() {
    mainWindow.close();
  })
  // 最小化
  ipcMain.on('mini', function() {
    mainWindow.minimize();
  })
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
});