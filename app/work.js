const { BrowserWindow } = require('electron');
const url = require('url')
const path = require('path');
function createWork(option){
    let work = new BrowserWindow({
        width:500,
        height:500,
        autoHideMenuBar: true,
        webPreferences: { // 网页功能设置
            nodeIntegration: true, // 是否启用node集成 渲染进程的内容有访问node的能力
            webviewTag: true, // 是否使用<webview>标签 在一个独立的 frame 和进程里显示外部 web 内容
            webSecurity: false, // 禁用同源策略
            contextIsolation: false,
            v8CacheOptions: 'none',
            scrollBounce: true,
            nodeIntegrationInSubFrames: true, // 是否允许在子页面(iframe)或子窗口(child window)中集成Node.js
        },
    })
    if(option.type === 'http'){
        work.loadURL(option.url)
    }
    if(option.type === 'file'){
        work.loadURL(url.format({
            pathname: path.join(__dirname, option.filePath),
            protocol: 'file:',
            slashes: true
          }))
    }
    return work
}

module.exports = {
    createWork
}