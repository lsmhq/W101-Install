const fs = require('fs')
const request = require('request')
const child = require('child_process')
var ProgressBar = require("progress");
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
const args = process.argv.slice(2)
// let path = '../Data/GameData/' // 打包路径
let path = './' // 本地路径
// let downLoadArr = ['d', 'r', 'c']
let params = {
    r:'release',
    d:'debug',
    c:'chatonly',
    u:'update'
}
let obj = {
    r:'<剧情>',
    d:'<全汉化>',
    c:'<轻聊>',
    u:'<一键安装>'
}
let type = args[0] || '-input'
// 接收命令行参数
question()
// 核心
function downLoad(){
    request({
        url: `http://101.43.216.253:3001/file/latest?type=${params[type]}`,
        method: 'GET',
      }, (err, response, body) => {
        if (!err && response.statusCode === 200) {
            let url = JSON.parse(response.body).url
            let mark = JSON.parse(response.body).mark||'暂无描述内容'
            // console.log(response.body)
            let version = url.split('/')[url.split('/').length-2]
            let files = fs.readdirSync(path,{withFileTypes:true})
            let names = files.map(file=>file.name)
            // console.log(names)
            if(names.includes(`version_zh_cn_${type}`)){
                let ver = fs.readFileSync(path+`version_zh_cn_${type}`)
                logColor(`\n当前版本: V ${ver.toString('utf-8')}`)
                if(compareVersion(version+'', ver.toString()) == 1){
                    let out = path+'Locale_English-Root.wad.' + type
                    if(names.includes('Locale_English-Root.wad.' + type)){
                        fs.unlinkSync(path+'Locale_English-Root.wad.' + type)
                    }
                    console.log(`\n检测到最新${obj[type]}版 V ${url.split('/')[url.split('/').length-2]}，正在更新`)
                    console.log(`\n此次更新的内容如下:\n`)
                    console.log(mark)
                    logColor(`\n运行过程中尽量不要终止`,93)
                    console.log('\n这可能需要几分钟，请耐心等待...')
                    getFile(url, out,()=>{
                        fs.writeFileSync(path + `version_zh_cn_${[type]}`, version)
                        changeType()
                        question()
                    })
                }else{
                    // 切换补丁
                    console.log(`\n当前已经是最新${obj[type]}版本!`)
                    changeType()
                    question()
                }
            }else{
                let out = path+'Locale_English-Root.wad.' + type
                let mark = JSON.parse(response.body).mark||'暂无描述内容'
                if(names.includes('Locale_English-Root.wad.' + type)){
                    fs.unlinkSync(path+'Locale_English-Root.wad.' + type)
                }
                logColor('\n❌检测到未安装任何版本', 31)
                console.log(`\n正在安装最新${obj[type]}版 V ${url.split('/')[url.split('/').length-2]}`)
                console.log(`\n补丁内容如下:\n`)
                console.log(mark)
                logColor(`\n运行过程中尽量不要终止`,93)
                console.log('\n这可能需要几分钟，请耐心等待...')
                getFile(url, out,(filePath)=>{
                    fs.writeFileSync(path + `version_zh_cn_${type}`,version)
                    // console.log(filePath)
                    changeType()
                    question()
                })
            }
        } else{
            console.log('请检测本地网络环境')
            question()
        }
      })
}
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
            logColor("下载完成 ^3^ !\n");
        }
    }
   })
    out.on('finish',()=>{
        callback()
    })
  }
}
// 回答
function question(){
    fs.access(path, (err) => {
        if(err){
            console.log(`
==============<当看不见这个提示时，就成功了>====================

            温馨提示: 位置放错了\n`)                     
            console.log(`
                1、将本程序放到游戏 Bin 目录下\n
                2、创建一个快捷方式放到桌面\n
                3、双击快捷方式\n
                4、根据指引进行操作即可\n`)
            console.log(`
            位置如下:

                /Wizard101/Bin/install_zh_cn.exe
                
==============<当看不见这个提示时，就成功了>====================`)
                
            return
        }
    rl.question(`
${changeColor('全汉化版 (D/d)',93)}  ${changeColor('魔法剧情版 (R/r)', 94)}  ${changeColor('轻聊版 (C/c)')}  ${changeColor('螺旋启动 (P/p)',96)}  ${changeColor('重置 (I/i)', 91)}  ${changeColor('帮助面板 (H/h)',100)}\r\n
${changeColor(`输入操作对应的英文字母并回车确认:`, 96, 4)}`, name => {
            let arr = ['r','c','i','d']
            type = name.toLocaleLowerCase()
                // console.log('out', name)
            if(type == 'p'){
                let exe = "WizardGraphicalClient.exe -L login.us.wizard101.com 12000"
                child.exec(`${exe}`,(err, stdout, stderr)=>{})
                question()
                return
            }
            if(type == 'h'){
                help()
                question()
                return
            }
            if(type == 'q'){
                process.exit()
            }
            if(type == 'l'){
                like(()=>{
                    question()
                })
                return
            }
            if(!arr.includes(type)){
                question()
                return
            }
            if(type === 'i'){
                init()
            }else{
                downLoad()
            }
        });
    });
}

// 改变type
function changeType(){
    let files = fs.readdirSync(path,{withFileTypes:true})
    let names = files.map(file=>file.name)
    if(names.includes('Locale_English-Root.wad.' + type)){
        console.log(`\n检测到${obj[type]}版，正在切换...`)
        let file = fs.createReadStream(path+'Locale_English-Root.wad.' + type)
        let out = fs.createWriteStream(path+'Locale_English-Root.wad')
        file.pipe(out)
        // out.close()
        // fs.copyFileSync(path+'Locale_English-Root.wad', path+'Locale_English-Root.wad.' + typeUnlink[type])
        logColor("\n切换补丁完成，请重启游戏进行体验 ^3^ !\n");
    }
}
// 初始化
function init(){
    let files = fs.readdirSync(path,{withFileTypes:true})
    let unlinkArr = ['version_zh_cn_d', 'version_zh_cn_r', 'version_zh_cn_u', 'version_zh_cn_c','Locale_English-Root.wad','Locale_English-Root.wad.d','Locale_English-Root.wad.r','Locale_English-Root.wad.c']
    files.forEach(file=>{
        if(unlinkArr.includes(file.name)){
            fs.unlinkSync(path+file.name)
        }
    })
    logColor('\n重置完成！请重新安装...')
    question()
}
function help(){
    // console.png(image);
    // u:   更新一键更新程序\r\n
    console.log(`
    欢迎来到灭火器<🧯>的说明指引\r\n               
    下面是基本的操作说明:\r\n              
    r:   检测最新剧情版并安装\r\n
    d:   检测最新全汉版并安装\r\n
    c:   轻聊版下载\r\n
    p:   快速螺旋启动\r\n
    i:   初始化\r\n
    h:   召唤灭火器<🧯>\r\n
    l:   输入 (L/l) 点赞\r\n
    q:   退出\r\n`);
}
function like(callback){
    request({
        url: 'http://101.43.216.253:3001/file/like',
        method: "GET",
    }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(`\n感谢支持，共收到<${JSON.parse(response.body).length}>个赞了，玩的开心^3^`)
            callback()
        }
    }); 
}
// 版本号对比
function compareVersion(v1, v2) {
    v1 = v1.split('.')
    v2 = v2.split('.')
    const len = Math.max(v1.length, v2.length)
  
    while (v1.length < len) {
      v1.push('0')
    }
    while (v2.length < len) {
      v2.push('0')
    }
    for (let i = 0; i < len; i++) {
      const num1 = parseInt(v1[i])
      const num2 = parseInt(v2[i])
  
      if (num1 > num2) {
        return 1
      } else if (num1 < num2) {
        return -1
      }
    }
    return 0
}
function changeColor(input, color = 92, style = 1) {
  return `\x1b[${style};${color}m${input}\x1b[0m`
}

function logColor(input, color = 92) {
  console.log(changeColor(input, color))
}