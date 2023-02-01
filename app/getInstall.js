const child_process = require('child_process');//引入模块
// HKEY_LOCAL_MACHINE\\SOFTWARE\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\Uninstall 
// HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall
// HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths
let path = 'HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths'
const regedit = require('regedit');
var iconv = require('iconv-lite');
// const fs = require('fs')
let obj = {}
var encoding = 'cp936';
var binaryEncoding = 'binary';

function getInstall(fun){
    regedit.list([path], (err, result)=>{
        if(err){
            console.log('error!!!', err)
            return
        }
        if(result[path].exists){
            let pArr = []
            result[path].keys.forEach((element, idx) => {
                let softPath = `${path}\\${element}`
                // console.log(softPath)
                pArr.push(getRegKey(softPath, element)) 
            });
            // console.log(pArr)
            Promise.all(pArr).then(rArr=>{
                rArr.forEach((res)=>{
                    console.log(res)
                    if(res){
                        let { stderr, stdout, key } = res
                        // console.log(stderr)
                        // console.log(stdout)
                        obj[key] = stdout.split('\r\n').filter(item=>{
                            return item != ''
                        }).map(item=>{
                            return item.trim()
                        })
                    }
                })
                return obj
            }).then(obj=>{
                fun && fun(obj)
            }).catch(err=>{
                console.error('allErr', err)
            })
        }
    })
}
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
        child_process.exec(`REG QUERY ${softPath}`,{encoding: binaryEncoding},function(error,stdout,stderr){
            if(error != null){
                reject(error)
            }
            resolve({stdout: iconv.decode(stdout, encoding), stderr, key})
        });
    }).catch(err=>{
        console.error('Error',err)
    })
}