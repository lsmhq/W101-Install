const fs = require('fs')
const request = require('request')
var ProgressBar = require("progress");
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
const args = process.argv.slice(2)
let path = './' // 打包路径
// let path = __dirname // 本地路径
let downLoadArr = ['d', 'r', 'c']
let params = {
    r:'release',
    d:'debug',
    c:'chatonly',
    u:'update'
}
let obj = {
    r:'<正式>',
    d:'<测试>',
    c:'<聊天纯享>',
    u:'<一键安装>'
}
let type = args[0] || '-input'
// 接收命令行参数
if(type.includes('-')){
    type = type.split('-')[1]
}
if(type === 'help'){
    console.log(`
    欢迎来到使用说明指引\r\n               
    下面是基本的命令行参数:\r\n              
    -h:   召唤灭火器进行讲解\r\n
    -r:   检测最新正式版并安装\r\n
    -d:   检测最新测试版并安装\r\n
    -u:   检测最新一键安装并更新(暂无❌)\r\n
    -i:   初始化\r\n
    -c:   聊天纯享版下载\r\n
    感谢阅读！`);
    process.exit();
}else if(downLoadArr.includes(type)){
    downLoad()
}else if(type == 'i'){
    init()
    process.exit()
}else{
    question()
}
// 核心
function downLoad(){
    request({
        url: `http://101.43.216.253:3001/file/latest?type=${params[type]}`,
        method: 'GET',
      }, (err, response, body) => {
        if (!err && response.statusCode === 200) {
            let url = JSON.parse(response.body).url
            // console.log(url)
            let version = url.split('/')[url.split('/').length-2]
            let files = fs.readdirSync(path,{withFileTypes:true})
            let names = files.map(file=>file.name)
            // console.log(names)
            if(names.includes(`version_zh_cn_${type}`)){
                let ver = fs.readFileSync(`version_zh_cn_${type}`)
                logColor(`\n当前版本: V ${ver.toString('utf-8')}`)
                if(compareVersion(version+'', ver.toString()) == 1){
                    let out = path+'Locale_English-Root.wad.' + type
                    if(names.includes('Locale_English-Root.wad.' + type)){
                        fs.unlinkSync(path+'Locale_English-Root.wad.' + type)
                    }
                    console.log(`\n检测到最新${obj[type]}版 V ${url.split('/')[url.split('/').length-2]}，正在更新`)
                    logColor(`\n运行过程中尽量不要终止`,93)
                    console.log('\n这可能需要几分钟，请耐心等待...')
                    getFile(url, out,()=>{
                        fs.writeFileSync(path+`version_zh_cn_${[type]}`, version)
                        changeType()
                    })
                }else{
                    // 切换补丁
                    console.log(`\n当前已经是最新${obj[type]}版本!`)
                    changeType()
                    next()
                }
            }else{
                let out = path+'Locale_English-Root.wad.' + type
                if(names.includes('Locale_English-Root.wad.' + type)){
                    fs.unlinkSync(path+'Locale_English-Root.wad.' + type)
                }
                logColor('\n❌检测到未安装任何版本', 31)
                console.log(`\n正在安装最新${obj[type]}版 V ${url.split('/')[url.split('/').length-2]}`)
                logColor(`\n运行过程中尽量不要终止`,93)
                console.log('\n这可能需要几分钟，请耐心等待...')
                getFile(url, out,(filePath)=>{
                    fs.writeFileSync(`version_zh_cn_${type}`,version)
                    // console.log(filePath)
                    changeType()
                    next()
                })
            }
        } else{
            console.log('请检测本地网络环境')
            next()
        }
      })
}
// 下载文件
function getFile(uri, filePath, callback){
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
    currentTotal += data.byteLength
    // console.log(currentTotal)
    var bar = new ProgressBar(`[ :bar ]${(currentTotal/1024/1024).toFixed(2)}MB/${(total/1024/1024).toFixed(2)}MB`, { total: total*1, curr:currentTotal });
    bar.tick();
    if (bar.complete) {
        out.close()
        logColor("❤下载完成!\n");
        // logColor(``,33)
        callback(filePath)
    }
   })
  }
}

function next(){
    rl.question(`${changeColor(`是否继续安装输入yes(y)或者no(n)并回车确认? `, 96, 4)}\r\n`,(yon)=>{
        // console.log(yon.toLocaleLowerCase())
        let yn = yon.toLocaleLowerCase()
        if(yn.includes('n') ||  yn.includes('no')){
            process.exit()
        }
        if(yn.includes('y') ||  yn.includes('yes')){
            question()
            return
        }
        next()
    })
}
function question(){
    rl.question(`
${changeColor('测试版 (d/D)',93)} ${changeColor('正式稳定版 (r/R)', 94)} ${changeColor('聊天纯享版 (c/C)')} ${changeColor('重置 (i/I)', 91)}

${changeColor(`输入补丁对应的英文字母并回车确认:`, 96, 4)}`, name => {
    let arr = ['r','c','i','d']
                type = name.toLocaleLowerCase()
                // console.log('out', name)
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
}

function changeType(){
    let files = fs.readdirSync(path,{withFileTypes:true})
    let names = files.map(file=>file.name)
    if(names.includes('Locale_English-Root.wad.' + type)){
        console.log(`检测到${obj[type]}版，正在切换...`)
        let file = fs.createReadStream(path+'Locale_English-Root.wad.' + type)
        let out = fs.createWriteStream(path+'Locale_English-Root.wad')
        file.pipe(out)
        // out.close()
        // fs.copyFileSync(path+'Locale_English-Root.wad', path+'Locale_English-Root.wad.' + typeUnlink[type])
        logColor("❤切换补丁完成，请重启游戏进行体验!\n");
    }
}
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