const request = require('request')
const child = require('child_process')
const fs = require('fs')
var ProgressBar = require("progress");
// 下载文件
function getFile(uri, filePath, callback, showProgress = true){
    if (uri) {
     let currentTotal = 0 
     let total = 0
     let req = request(uri)
     let out = fs.createWriteStream(filePath)
     req.pipe(out)
     req.on('response',(res)=>{
      // console.log(res.headers['content-length'])
      total = res.headers['content-length']
     })
     req.on('data',(data)=>{
      if(showProgress){
          currentTotal += data.byteLength
          // console.log(currentTotal)
          var bar = new ProgressBar(`[ :bar ]${(currentTotal/1024/1024).toFixed(2)}MB/${(total/1024/1024).toFixed(2)}MB`, { total: total*1, curr:currentTotal });
          bar.tick();
          if (bar.complete) {
              out.close()
              logColor("❤下载完成!\n");
             
          }
      }
     })
     out.on('finish',()=>{
        callback()
     })
    }
  }
function upDate(){
    request({
        url: `http://101.43.216.253:3001/file/latest?type=update`,
        method: 'GET',
      }, (err, response, body) => {
        // console.log(response.body)
        let url = JSON.parse(response.body).url
        console.log('检测到新版本'+url.split('/')[url.split('/').length-2])
        console.log('正在下载...请稍后')
        getFile(url, 'install_zh_cn.exe',()=>{
            console.log('更新完成!准备运行程序!', url)
            let exe = 'install_zh_cn.exe'
            fs.writeFileSync('install_zh_cn_v', url.split('/')[url.split('/').length-2], 'utf-8')
            child.exec(exe,()=>{
    
            })
        })
      })
}


  function changeColor(input, color = 92, style = 1) {
    return `\x1b[${style};${color}m${input}\x1b[0m`
  }
  
  function logColor(input, color = 92) {
    console.log(changeColor(input, color))
  }


setTimeout(upDate, 2000)