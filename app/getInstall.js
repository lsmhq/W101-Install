const child_process = require('child_process');//引入模块
let path = 'HKLM\\SOFTWARE\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall'
const regedit = require('regedit');
var iconv = require('iconv-lite');
const fs = require('fs')
let str = ``
var encoding = 'cp936';
var binaryEncoding = 'binary';
regedit.list([path], (err, result)=>{
    if(err){
        console.log('error!!!', err)
        return
    }
    if(result[path].exists){
        result[path].keys.forEach((element, idx) => {
            let softPath = `${path}\\${element}`
            getAllRgeKeys(softPath)  
        });
    }
})
let keys = [
    'DisplayIcon',
    'DisplayName',
    'DisplayVersion',
    // 'InstallLocation',
    // 'Publisher',
    // 'UninstallString',
    // 'URLInfoAbout'
]
let keyMap = {
    DisplayIcon:'可执行文件路径',
    DisplayName:'程序名称',
    DisplayVersion:'版本号',
    // InstallLocation:'安装路径'
}
function getRegKey(softPath, key){

    return new Promise((resolve, reject) => {
        child_process.exec(`REG QUERY ${softPath} /v ${key}`,{encoding: binaryEncoding},function(error,stdout,stderr){
            if(error != null){
                reject(error)
            }
            resolve({stdout, stderr, key})
        });
    })
}

function getAllRgeKeys(softPath){
    let pArr = []
    keys.forEach(key=>{
        // getRegKey(softPath, key).then()
        pArr.push(getRegKey(softPath, key))
    })

    Promise.all(pArr).then(rArr=>{
        rArr.forEach((res)=>{
            let {key, stderr, stdout} = res
            if(res.stdout){
                // console.log(`${keyMap[key]} -----> `, stdout?.split(' ')?.pop())
                // console.log(stdout)
                console.log(iconv.decode(stdout, encoding));
                if(key === 'DisplayIcon'){
                    str += `--------------------<分割线>---------------------------\r\n`
                }
                str += `${key}:${iconv.decode(stdout, 'utf8')?.split(' ')?.pop()}\r\n`
            }
            if(res.stderr){
                // console.log('stderr', stderr)
            }
        })
        // console.log()
        // fs.writeFileSync(`${__dirname}\\softPath.txt`, str, 'utf-8')
    }).catch(err=>{
        // console.log('allErr')
    })
}