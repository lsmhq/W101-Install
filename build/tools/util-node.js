(function () {
    const request = require('request')
    const fs = require('fs')
    const child_process = require('child_process'); //引入模块
    const {
        shell
    } = require('electron')
    window.path = localStorage.getItem('gameDataPath') || '' // 打包路径
    window.wizPath = localStorage.getItem('wizPath') || '' // Wiz路径
    let params = {
        r: 'release',
        d: 'debug',
        c: 'chatonly',
        s: 'subata'
    }
    let obj = {
        r: '<剧情>',
        d: '<全汉化>',
        c: '<轻聊>',
        s: '<启动器>'
    }
    // 初始化host
    function initDns(callback) {
        let pathC = 'C:\\Windows\\System32\\drivers\\etc'
        // console.log(pathC)
        let files = fs.readdirSync(pathC, {
            withFileTypes: true
        })
        // console.log(files)
        files.forEach(file => {
            if (file.name === 'hosts') {
                let content = fs.readFileSync(`${pathC}\\${file.name}`, 'utf-8')
                // 写入
                request({
                    url: 'http://101.43.216.253:3001/file/host',
                    method: "GET",
                }, function (error, response) {
                    if (!error && response.statusCode === 200) {
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
    function connect(callback) {
        let pathC = 'C:\\Windows\\System32\\drivers\\etc'
        // console.log(pathC)
        let files = fs.readdirSync(pathC, {
            withFileTypes: true
        })
        // console.log(files)
        files.forEach(file => {
            if (file.name === 'hosts') {
                let content = fs.readFileSync(`${pathC}\\${file.name}`, 'utf-8')
                // 写入
                request({
                    url: 'http://101.43.216.253:3001/file/host',
                    method: "GET",
                }, function (error, response) {
                    if (!error && response.statusCode === 200) {
                        // console.log(JSON.parse(response.body).host)
                        let host = JSON.parse(response.body).new
                        let oldHost = JSON.parse(response.body).old
                        // console.log(host, oldHost)
                        content = content.split(`\r\n${oldHost}`)[0] + '\r\n' + host
                        // console.log(content.split(oldHost)[0])
                        fs.writeFileSync(`${pathC}\\${file.name}`, content)
                        callback && callback()
                    }
                });
            }
        })
    }

    // 初始化
    function init(callback) {
        try {
            let files = fs.readdirSync(window.path, {
                withFileTypes: true
            })
            let unlinkArr = ['version_zh_cn_d', 'version_zh_cn_r', 'version_zh_cn_u', 'version_zh_cn_c', 'Locale_English-Root.wad', 'Locale_English-Root.wad.d', 'Locale_English-Root.wad.r', 'Locale_English-Root.wad.c']
            // console.log('卸载')
            files.forEach(file => {
                if (unlinkArr.includes(file.name)) {
                    fs.unlinkSync(window.path + file.name)
                }
            })
        } catch (error) {
            console.log(error)
        }
        callback()
    }

    function checkUpdate(type, success, failed, error) {
        console.log(window.path)
        request({
            url: `http://101.43.216.253:3001/file/latest?type=${params[type]}`,
            method: 'GET',
        }, (err, response, body) => {
            if (!err && response.statusCode === 200) {

                try {
                    let url = JSON.parse(response.body).url
                    let version = url.split('/')[url.split('/').length - 2]
                    console.log(version)
                    let files = fs.readdirSync(window.path, {
                        withFileTypes: true
                    })
                    let names = files.map(file => file.name)

                    // console.log(names.includes(`version_zh_cn_${type}`))
                    if (names.includes(`version_zh_cn_${type}`)) {
                        // console.log('判断')
                        let ver = fs.readFileSync(window.path + `version_zh_cn_${type}`)
                        if (compareVersion(version + '', ver.toString()) === 1) {
                            // console.log(`\n检测到最新${obj[type]}版 V ${url.split('/')[url.split('/').length - 2]}，正在更新`)
                            // console.log(1)
                            success(1) // 有最新
                        } else {
                            // console.log(2)
                            success(2) // 没有
                        }
                    } else {
                        // console.log(3)
                        success(3) // 未安装
                    }
                } catch (err) {
                    // console.log(err)
                    error && error(err)
                }

            } else {
                failed(err)
            }
        })
    }

    function checkUpdateExe(type, current, success, error) {
        // console.log(path)
        request({
            url: `http://101.43.216.253:3001/file/latest?type=${params[type]}`,
            method: 'GET',
        }, (err, response, body) => {
            if (!err && response.statusCode === 200) {
                try {
                    let url = JSON.parse(response.body).url
                    let mark = JSON.parse(response.body).mark
                    let version = url.split('/')[url.split('/').length - 2]
                    console.log(version)
                    console.log(current)
                    if (compareVersion(version + '', current) === 1) {
                        // console.log(`\n检测到最新${obj[type]}版 V ${url.split('/')[url.split('/').length - 2]}，正在更新`)
                        // console.log(1)
                        success(1, url, version, mark) // 有最新

                    } else {
                        // console.log(2)
                        success(2) // 没有
                    }
                } catch (err) {
                    error && error(err)
                }
            } else {
                error && error(err)
            }
        })
    }

    function downLoad(type, getMark, getProcess, failed, changed) {
        request({
            url: `http://101.43.216.253:3001/file/latest?type=${params[type]}`,
            method: 'GET',
        }, (err, response, body) => {
            if (!err && response.statusCode === 200) {
                let url = JSON.parse(response.body).url
                let mark = JSON.parse(response.body).mark || '暂无描述内容'
                // console.log(response.body)
                let version = url.split('/')[url.split('/').length - 2]
                let files = fs.readdirSync(window.path, {
                    withFileTypes: true
                })
                let names = files.map(file => file.name)
                // console.log(names)
                if (names.includes(`version_zh_cn_${type}`)) {
                    let ver = fs.readFileSync(window.path + `version_zh_cn_${type}`)
                    if (compareVersion(version + '', ver.toString()) === 1) {
                        let out = window.path + 'Locale_English-Root.wad.' + type
                        if (names.includes('Locale_English-Root.wad.' + type)) {
                            fs.unlinkSync(window.path + 'Locale_English-Root.wad.' + type)
                        }
                        console.log(`\n检测到最新${obj[type]}版 V ${url.split('/')[url.split('/').length - 2]}，正在更新`)
                        console.log(`\n此次更新的内容如下:\n`)
                        console.log(mark)
                        getMark(mark)
                        getFile(url, out, () => {
                            fs.writeFileSync(window.path + `version_zh_cn_${[type]}`, version)
                            changeType(type, () => {
                                changed(1)
                            })
                        }, getProcess)
                    } else {
                        // 切换补丁
                        changeType(type, () => {
                            changed(2)
                        })
                    }
                } else {
                    let out = window.path + 'Locale_English-Root.wad.' + type
                    let mark = JSON.parse(response.body).mark || '暂无描述内容'
                    if (names.includes('Locale_English-Root.wad.' + type)) {
                        fs.unlinkSync(window.path + 'Locale_English-Root.wad.' + type)
                    }
                    getMark(mark)
                    getFile(url, out, (filePath) => {
                        fs.writeFileSync(window.path + `version_zh_cn_${type}`, version)
                        changeType(type, () => {
                            changed(1)
                        })
                    }, getProcess)
                }
            } else {
                failed(err)
            }
        })
    }
    // 下载文件
    function getFile(uri, filePath, callback, onData) {
        console.log(filePath)
        if (uri) {
            let currentTotal = 0
            let total = 0
            let req = request(uri)
            let out = fs.createWriteStream(filePath)
            req.on('response', (res) => {
                console.log(res.headers['content-length'])
                total = res.headers['content-length']
                
                console.log('当前目标文件大小:',total)
                if(total){
                    req.pipe(out)
                    out.on('finish', () => {
                        out.close()
                        callback()
                    })
                }else{
                    out.close()
                    req.end()
                    callback('error')
                }
            })
            req.on('data', (data) => {
                // console.log(data.byteLength)
                currentTotal += data.byteLength
                onData(total, currentTotal)
            })

        }
    }

    // 改变type
    function changeType(type, callback) {
        let files = fs.readdirSync(window.path, {
            withFileTypes: true
        })
        let names = files.map(file => file.name)
        if (names.includes('Locale_English-Root.wad.' + type)) {
            console.log(`\n检测到${obj[type]}版，正在切换...`)
            let file = fs.createReadStream(window.path + 'Locale_English-Root.wad.' + type)
            let out = fs.createWriteStream(window.path + 'Locale_English-Root.wad')
            file.pipe(out)
            callback(true)
            // out.close()
        } else {
            callback(false)
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
    // 点赞
    function like(callback) {
        request({
            url: 'http://101.43.216.253:3001/file/like',
            method: "GET",
        }, function (error, response) {
            if (!error && response.statusCode === 200) {
                callback()
            }
        });
    }
    // 获取Steam
    function getPath(callback, r) {
        //查
        child_process.exec(`REG QUERY HKEY_LOCAL_MACHINE\\SOFTWARE\\WOW6432Node\\Valve\\Steam /v InstallPath`, function (error, stdout, stderr) {
            if (error != null) {
                console.log('Steam 注册表查询失败:', String(error));
                r(error)
                return
            }
            callback(stdout, stderr)
        });
    }

    // 打开安装包

    // 开始游戏
    function startGame(callback) {
        console.log(window.wizPath)
        console.log(localStorage.getItem('steamPath'))
        try {
            let files = fs.readdirSync(window.wizPath, {
                withFileTypes: true
            })
            let names = files.map(file => file.name)
            console.log(names)
            if (names.includes('startGame.bat') && names.includes('Wizard101.exe')) {
                let exe = window.wizPath + "\\startGame.bat"
                // console.log(exe)
                shell.openPath(exe)
                if (JSON.parse(localStorage.getItem('btnSetting'))) {
                    window.electronAPI.mini()
                }
            } else if (!names.includes('startGame.bat') && names.includes('Wizard101.exe')) {
                getFile(`http://101.43.216.253:3001/bat/startGame.bat`, `${window.wizPath}\\startGame.bat`, () => {
                    console.log('添加bat成功')
                    let exe = window.wizPath + "\\startGame.bat"
                    // console.log(exe)
                    shell.openPath(exe)
                    if (JSON.parse(localStorage.getItem('btnSetting'))) {
                        window.electronAPI.mini()
                    }
                }, () => {

                })
            } else {
                callback({
                    path: '没有在游戏根目录下'
                })
            }
        } catch (error) {
            if (error) {
                callback(error)
            }
        }

    }
    // 打开文件
    function openFile(path) {
        console.log('打开', path)
        shell.openPath(path)
        // window.confirm('请关闭程序之后进行更新')
    }
    // 获取游戏版本
    function getGameVersion( callback ) {
        try {
            let logPath = `${window.wizPath}/Bin`
            let files = fs.readdirSync(logPath, {
                withFileTypes: true
            })
            let names = files.map(file => file.name)
            console.log(names)
            names.forEach(file => {
                if (file === 'WizardClient.log') {
                    let content = fs.readFileSync(`${logPath}/${file}`).toString('utf-8')
                    callback(content.split('\n'))
                }
            })
        } catch (error) {
            console.log(error)
            callback(error)
        }
    }
    // 检测Wizard和Steam
    function checkGameInstall(callback) {
        let steamPath = localStorage.getItem('steamPath')
        console.log(steamPath, window.wizPath)
        let steamInstall = false
        let wizInstall = false
        let errors = []
        // let gameDataPath = localStorage.getItem('gameDataPath')
        try {
            let files = fs.readdirSync(steamPath)
            // callback(0)
            steamInstall = true
        } catch (error) {
            if (error) {
                // steam未安装
                steamInstall = false
                errors.push(error)
                // callback(1, error)
            }
        }
        try {
            let files = fs.readdirSync(window.wizPath)
            // callback(0)
            wizInstall = true
        } catch (error) {
            if (error) {
                wizInstall = false
                errors.push(error)
                // Wizard101未安装或是自定义路径
                // callback(2, error)
            }
        }
        callback(steamInstall, wizInstall, errors)
    }
    // 登录
    function login(account, password, callback){
        console.log(window.wizPath)
        console.log(localStorage.getItem('steamPath'))
        try {
            let files = fs.readdirSync(`${window.wizPath}\\Bin\\`, {
                withFileTypes: true
            })
            // let files_root = fs.readdirSync(`${window.wizPath}`, {
            //     withFileTypes: true
            // })
            let names = files.map(file => file.name)
            // let names_root = files_root.map(file => file.name)
            if(!names.includes('WizardGraphicalClient.exe')){
                callback(true, '出现错误：WizardGraphicalClient.exe不存在')
                return
            }
            // if(!names_root.includes('startWizard.bat')){
            //     getFile(`http://101.43.216.253:3001/bat/startWizard.bat`, `${window.wizPath}\\startWizard.bat`, () => {
            //         console.log('添加bat成功')
            //     }, () => {})
            // }
            if (names.includes('launchWizard101.exe')) {
                let exe = `"${window.wizPath}\\Bin\\launchWizard101.exe" ${account} ${password} ${window.wizPath}\\Bin`
                console.log(exe)
                // shell.openPath(exe)
                child_process.exec(exe,(err, stdout, stderr)=>{
                    console.log(stderr.toString('utf-8'))
                    console.log(stdout.toString('utf-8'))
                })
                callback()
            } else if (!names.includes('launchWizard101.exe')) {
                // startWizard.bat
                console.log('下载开始')
                getFile(`https://vkceyugu.cdn.bspapp.com/VKCEYUGU-479328cb-417a-467c-9512-83793cb72c1e/83202b9e-7b0e-448b-8b6c-c5ec416a7df7.exe`, `${window.wizPath}\\Bin\\launchWizard101.exe`, (error) => {
                    console.log('添加launch.exe成功', error)
                    let exe = `"${window.wizPath}\\Bin\\launchWizard101.exe" ${account} ${password} ${window.wizPath}\\Bin`
                    console.log(exe)
                    // shell.openPath(exe)

                    callback(1, '第一次启动, 稍等...')
                    setTimeout(()=>{
                        child_process.exec(exe,(err, stdout, stderr)=>{
                            console.log(stderr.toString('utf-8'))
                            console.log(stdout.toString('utf-8'))
                        })
                        callback()
                    }, 500)
                }, (total, currentTotal) => {
                    callback(false, `正在下载启动文件${Number.parseInt((( currentTotal / total ).toFixed(2) * 100))}%`)
                })
            } else {
                callback(true, '出现错误：游戏文件缺失')
            }
        } catch (error) {
            if (error) {
                callback(true, JSON.stringify( error ))
            }
        }
    }

    function killExe (name) {
        // process 不用引入，nodeJS 自带
        // 带有命令行的list进程命令是：“cmd.exe /c wmic process list full”
        //  tasklist 是没有带命令行参数的。可以把这两个命令再cmd里面执行一下看一下效果
        // 注意：命令行获取的都带有换行符，获取之后需要更换换行符。可以执行配合这个使用 str.replace(/[\r\n]/g,""); 去除回车换行符 
        let cmd = process.platform === 'win32' ? 'tasklist' : 'ps aux'
        child_process.exec(cmd, function (err, stdout, stderr) {
            if (err) {
                return console.error(err)
            }
            // console.log(stdout)
            stdout.split('\n').forEach((line) => {
                let processMessage = line.trim().split(/\s+/)
                let processName = processMessage[0] //processMessage[0]进程名称 ， processMessage[1]进程id
                if (processName === name) {
                    console.log('Kill Process---->', processMessage[1], processMessage)
                    process.kill(processMessage[1])
                }
            })
        })
    }
    window.tools = {
        initDns,
        connect,
        init,
        downLoad,
        checkUpdate,
        like,
        changeType,
        getPath,
        startGame,
        checkGameInstall,
        checkUpdateExe,
        getFile,
        openFile,
        getGameVersion,
        login,
        killExe
    }
})()