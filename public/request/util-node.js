const request = require('request')
const fs = require('fs')
let path = './' // 打包路径
let params = {
    r: 'release',
    d: 'debug',
    c: 'chatonly',
}
let obj = {
    r: '<剧情>',
    d: '<全汉化>',
    c: '<轻聊>',
}
// 初始化host
function initDns(callback){
    let pathC = 'C:\\Windows\\System32\\drivers\\etc'
    // console.log(pathC)
    let files = fs.readdirSync(pathC, {withFileTypes: true})
    // console.log(files)
    files.forEach(file=>{
        if(file.name === 'hosts'){
            let content = fs.readFileSync(`${pathC}\\${file.name}`,'utf-8')
            // 写入
            request({
                url: 'http://101.43.216.253:3001/file/host',
                method: "GET",
            }, function (error, response) {
                if (!error && response.statusCode == 200) {
                    // console.log(JSON.parse(response.body).host)
                    let oldHost = JSON.parse(response.body).old
                    // console.log(oldHost)
                    content = content.split(`\r\n${oldHost}`)[0]
                    // console.log(content.split(oldHost)[0])
                    fs.writeFileSync(`${pathC}\\${file.name}`, content)
                    callback && callback()
                }
            });
        }
    })
}

// 修改host
function connect(callback){
    let pathC = 'C:\\Windows\\System32\\drivers\\etc'
    // console.log(pathC)
    let files = fs.readdirSync(pathC, {withFileTypes: true})
    // console.log(files)
    files.forEach(file=>{
        if(file.name === 'hosts'){
            let content = fs.readFileSync(`${pathC}\\${file.name}`,'utf-8')
            // 写入
            request({
                url: 'http://101.43.216.253:3001/file/host',
                method: "GET",
            }, function (error, response) {
                if (!error && response.statusCode == 200) {
                    // console.log(JSON.parse(response.body).host)
                    let host = JSON.parse(response.body).new
                    let oldHost = JSON.parse(response.body).old
                    // console.log(host, oldHost)
                    content = content.split(`\r\n${oldHost}`)[0]+ '\r\n' + host
                    // console.log(content.split(oldHost)[0])
                    fs.writeFileSync(`${pathC}\\${file.name}`, content)
                    callback && callback()
                }
            });
        }
    })
}

// 初始化
function init() {
    let files = fs.readdirSync(path, {
        withFileTypes: true
    })
    let unlinkArr = ['version_zh_cn_d', 'version_zh_cn_r', 'version_zh_cn_u', 'version_zh_cn_c', 'Locale_English-Root.wad', 'Locale_English-Root.wad.d', 'Locale_English-Root.wad.r', 'Locale_English-Root.wad.c']
    files.forEach(file => {
        if (unlinkArr.includes(file.name)) {
            fs.unlinkSync(path + file.name)
        }
    })
}

function downLoad(type, getMark, getProcess, failed) {
    request({
        url: `http://101.43.216.253:3001/file/latest?type=${params[type]}`,
        method: 'GET',
    }, (err, response, body) => {
        if (!err && response.statusCode === 200) {
            let url = JSON.parse(response.body).url
            let mark = JSON.parse(response.body).mark || '暂无描述内容'
            // console.log(response.body)
            let version = url.split('/')[url.split('/').length - 2]
            let files = fs.readdirSync(path, {
                withFileTypes: true
            })
            let names = files.map(file => file.name)
            // console.log(names)
            if (names.includes(`version_zh_cn_${type}`)) {
                let ver = fs.readFileSync(path + `version_zh_cn_${type}`)
                if (compareVersion(version + '', ver.toString()) == 1) {
                    let out = path + 'Locale_English-Root.wad.' + type
                    if (names.includes('Locale_English-Root.wad.' + type)) {
                        fs.unlinkSync(path + 'Locale_English-Root.wad.' + type)
                    }
                    console.log(`\n检测到最新${obj[type]}版 V ${url.split('/')[url.split('/').length - 2]}，正在更新`)
                    console.log(`\n此次更新的内容如下:\n`)
                    console.log(mark)
                    getMark(mark)
                    getFile(url, out, () => {
                        fs.writeFileSync(path + `version_zh_cn_${[type]}`, version)
                        changeType(type)
                    }, getProcess)
                } else {
                    // 切换补丁
                    changeType(type)
                }
            } else {
                let out = path + 'Locale_English-Root.wad.' + type
                let mark = JSON.parse(response.body).mark || '暂无描述内容'
                if (names.includes('Locale_English-Root.wad.' + type)) {
                    fs.unlinkSync(path + 'Locale_English-Root.wad.' + type)
                }
                getMark(mark)
                getFile(url, out, (filePath) => {
                    fs.writeFileSync(path + `version_zh_cn_${type}`, version)
                }, getProcess)
            }
        } else {
            failed('请检查本地网络')
        }
    })
}
// 下载文件
function getFile(uri, filePath, callback, onData) {
    if (uri) {
        let currentTotal = 0
        let total = 0
        let req = request(uri)
        let out = fs.createWriteStream(filePath)
        req.pipe(out)
        req.on('response', (res) => {
            // console.log(res.headers['content-length'])
            total = res.headers['content-length']
        })
        req.on('data', (data) => {
            currentTotal += data.byteLength
            onData(total, currentTotal)
        })
        out.on('finish', () => {
            out.close()
            callback()
        })
    }
}

// 改变type
function changeType(type) {
    let files = fs.readdirSync(path, {
        withFileTypes: true
    })
    let names = files.map(file => file.name)
    if (names.includes('Locale_English-Root.wad.' + type)) {
        console.log(`\n检测到${obj[type]}版，正在切换...`)
        let file = fs.createReadStream(path + 'Locale_English-Root.wad.' + type)
        let out = fs.createWriteStream(path + 'Locale_English-Root.wad')
        file.pipe(out)
        // out.close()
    }
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

window.tools = {
    initDns,
    connect,
    init,
    downLoad
}