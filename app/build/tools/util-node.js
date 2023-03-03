(function () {
    let hrefNew = '101.43.174.221'

    // let hrefOld = '101.43.216.253'
    try {
        const request = require('request')
        const fs = require('fs')
        const cmdShell = require('node-cmd');
        const child_process = require('child_process'); //引入模块
        const { shell } = require('electron')
        const { dialog, app } = require('@electron/remote')
        console.log('version---->', app.getVersion())
        let binaryEncoding = 'binary' // 输出编码格式
        let encoding = 'cp936'; // 解码格式
        const iconv = require('iconv-lite'); // 解码
        window.appVersion = app.getVersion()
        let interfaces = require('os').networkInterfaces();
        // const regedit = require('regedit');
        window.gameDataPath = localStorage.getItem('gameDataPath') || '' // 打包路径
        window.wizPath = localStorage.getItem('wizPath') || '' // Wiz路径
        let params = {
            r: 'release',
            d: 'debug',
            c: 'chatonly',
            g: 'german', 
            f: 'french', 
            i: 'italiana'
        }
        let obj = {
            r: '<剧情>',
            d: '<全汉化>',
            c: '<轻聊>',
            s: '<启动器>',
            g: '<german>', 
            f: '<french>', 
            i: '<italiana>'
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
                        url: `http://${hrefNew}:3001/file/host`,
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
                        url: `http://${hrefNew}:3001/file/host`,
                        method: "GET",
                    }, function (error, response) {
                        if (!error && response.statusCode === 200) {
                            // console.log(JSON.parse(response.body).host)
                            let host = JSON.parse(response.body).new
                            let oldHost = JSON.parse(response.body).old
                            // console.log(host, oldHost)
                            content = content.split(`\r\n${oldHost}`)[0] + '\r\n' + host
                            // console.log(content.split(oldHost)[0])
                            try {
                                fs.writeFileSync(`${pathC}\\${file.name}`, content)
                                callback && callback()
                            } catch (error) {
                                callback && callback('error')
                            }
                        }
                    });
                }
            })
        }

        // 初始化
        function init(callback) {
            try {
                let files = fs.readdirSync(window.gameDataPath, {
                    withFileTypes: true
                })
                let unlinkArr = ['version_zh_cn_d', 'version_zh_cn_r', 'version_zh_cn_u', 'version_zh_cn_c', 'Locale_English-Root.wad', 'Locale_English-Root.wad.d', 'Locale_English-Root.wad.r', 'Locale_English-Root.wad.c']
                // console.log('卸载')
                files.forEach(file => {
                    if (unlinkArr.includes(file.name)) {
                        fs.unlinkSync(window.gameDataPath + file.name)
                    }
                })
            } catch (error) {
                console.log(error)
            }
            callback()
        }

        function checkUpdate(type, success, failed, error) {
            // console.log(window.gameDataPath)
            request({
                url: `http://${hrefNew}:3001/file/latest?type=${params[type]}`,
                method: 'GET',
            }, (err, response, body) => {
                if (!err && response.statusCode === 200) {

                    try {
                        let url = JSON.parse(response.body).url
                        let version = url.split('/')[url.split('/').length - 2]
                        console.log(version)
                        let files = fs.readdirSync(window.gameDataPath, {
                            withFileTypes: true
                        })
                        let names = files.map(file => file.name)

                        // console.log(names.includes(`version_zh_cn_${type}`))
                        if (names.includes(`version_zh_cn_${type}`)) {
                            // console.log('判断')
                            let ver = fs.readFileSync(window.gameDataPath + `version_zh_cn_${type}`)
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
                url: `http://${hrefNew}:3001/file/latest?type=${params[type]}`,
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

        function downLoad(type, getMark, failed, changed, progress) {
            request({
                url: `http://${hrefNew}:3001/file/latest?type=${params[type]}`,
                method: 'GET',
            }, (err, response, body) => {
                if (!err && response.statusCode === 200) {
                    let url = JSON.parse(response.body).url
                    let mark = JSON.parse(response.body).mark || '暂无描述内容'
                    // console.log(response.body)
                    let version = url.split('/')[url.split('/').length - 2]
                    let files = fs.readdirSync(window.gameDataPath, {
                        withFileTypes: true
                    })
                    let names = files.map(file => file.name)
                    // console.log(names)
                    if (names.includes(`version_zh_cn_${type}`)) {
                        let ver = fs.readFileSync(window.gameDataPath + `version_zh_cn_${type}`)
                        if (compareVersion(version + '', ver.toString()) === 1) {
                            let out = window.gameDataPath + 'Locale_English-Root.wad.' + type
                            if (names.includes('Locale_English-Root.wad.' + type)) {
                                fs.unlinkSync(window.gameDataPath + 'Locale_English-Root.wad.' + type)
                            }
                            console.log(`\n检测到最新${obj[type]}版 V ${url.split('/')[url.split('/').length - 2]}，正在更新`)
                            console.log(`\n此次更新的内容如下:\n`)
                            console.log(mark)
                            getMark(mark, version)
                            getFile(url, out, () => {
                                fs.writeFileSync(window.gameDataPath + `version_zh_cn_${[type]}`, version)
                                changeType(type, () => {
                                    changed(1)
                                })
                            }, (total, current) => {
                                // console.log(current, total, current/total)
                                let percent = (current / total).toFixed(2)
                                // setPercent(percent)
                                // console.log(percent)
                                if (percent >= 1) {
                                    window.electronAPI.setProgressBar(-1)
                                } else {
                                    window.electronAPI.setProgressBar(percent)
                                }
                                progress && progress(percent)
                            })
                        } else {
                            // 切换补丁
                            changeType(type, () => {
                                changed(2)
                            })
                        }
                    } else {
                        let out = window.gameDataPath + 'Locale_English-Root.wad.' + type
                        let mark = JSON.parse(response.body).mark || '暂无描述内容'
                        if (names.includes('Locale_English-Root.wad.' + type)) {
                            fs.unlinkSync(window.gameDataPath + 'Locale_English-Root.wad.' + type)
                        }
                        getMark(mark)
                        getFile(url, out, (filePath) => {
                            fs.writeFileSync(window.gameDataPath + `version_zh_cn_${type}`, version)
                            changeType(type, () => {
                                changed(1)
                            })
                        }, (total, current) => {
                            let percent = (current / total).toFixed(2)
                            // setPercent(percent)
                            // console.log(current, total)
                            if (percent >= 1) {
                                window.electronAPI.setProgressBar(-1)
                            } else {
                                window.electronAPI.setProgressBar(percent)
                            }
                            progress && progress(percent)
                        })
                    }
                } else {
                    failed(err)
                }
            })
        }
        // 下载文件
        function getFile(uri, filePath, callback, onData) {
            console.log('从', uri)
            console.log('下载到', filePath)
            if (uri) {
                let currentTotal = 0
                let total = 0
                let req = request(uri)
                let out = fs.createWriteStream(filePath)
                req.on('response', (res) => {
                    console.log(res.headers['content-length'])
                    total = res.headers['content-length']

                    console.log('当前目标文件大小:', total)
                    if (total) {
                        req.pipe(out)
                        out.on('finish', () => {
                            out.close()
                            callback()
                        })
                    } else {
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
            let files = fs.readdirSync(window.gameDataPath, {
                withFileTypes: true
            })
            let names = files.map(file => file.name)
            if (names.includes('Locale_English-Root.wad.' + type)) {
                console.log(`\n检测到${obj[type]}版，正在切换...`)
                let file = fs.createReadStream(window.gameDataPath + 'Locale_English-Root.wad.' + type)
                let out = fs.createWriteStream(window.gameDataPath + 'Locale_English-Root.wad')
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
                url: `http://${hrefNew}:3001/file/like`,
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
            child_process.exec(`REG QUERY HKEY_LOCAL_MACHINE\\SOFTWARE\\WOW6432Node\\Valve\\Steam /v InstallPath`, { encoding: binaryEncoding }, function (error, stdout, stderr) {
                if (error != null) {
                    console.warn(iconv.decode(error + '', encoding))
                    r(error)
                    return
                }
                callback(stdout, stderr)
            });
        }
        // 获取游戏exe
        function getGameInstallPath(dir) {
            return new Promise((rv, rj) => {
                child_process.exec(`${dir}: && dir /S/B *Wizard*.exe`, { encoding: binaryEncoding }, function (error, stdout, stderr) {
                    if (error != null) {
                        console.warn(iconv.decode(error + '', encoding))
                        rj(iconv.decode(error + '', encoding))
                        return
                    }
                    rv(iconv.decode(stdout + '', encoding), iconv.decode(stderr + '', encoding))
                });
            })

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
                let files_bin = fs.readdirSync(`${window.wizPath}\\Bin`, {
                    withFileTypes: true
                })
                let names_bin = files_bin.map(file => file.name)
                if (!names_bin.includes('WizardGraphicalClient.exe')) {
                    callback('出现错误：WizardGraphicalClient.exe不存在, 即将打开官方启动器')
                    return
                }
                console.log(names)
                if (names.includes('Wizard101.exe')) {
                    let exe = `${window.wizPath.split(':')[0]}: && cd "${window.wizPath}\\Bin" && WizardGraphicalClient.exe -L login.us.wizard101.com 12000`
                    // console.log(exe)
                    // shell.openPath(exe)
                    runExe(exe)
                    callback(false, '')
                } else {
                    callback('没有在游戏根目录下')
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
        function getGameVersion(callback) {
            try {
                let logPath = `${window.wizPath}/Bin`
                let files = fs.readdirSync(logPath, {
                    withFileTypes: true
                })
                let names = files.map(file => file.name)
                // console.log(names)
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
            // console.log(steamPath, window.wizPath)
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
        function login(account, password, callback) {
            console.log(window.wizPath)
            console.log(localStorage.getItem('steamPath'))
            try {
                let wizPath = window.wizPath || localStorage.getItem('wizPath')
                console.log(window.wizPath)
                // return
                let files = fs.readdirSync(`${window.wizPath}\\Bin\\`, {
                    withFileTypes: true
                })
                let files_root = fs.readdirSync(`${wizPath}`, {
                    withFileTypes: true
                })
                let names = files.map(file => file.name)
                let names_root = files_root.map(file => file.name)
                if (!names.includes('WizardGraphicalClient.exe')) {
                    callback(true, '出现错误：WizardGraphicalClient.exe不存在, 即将打开官方启动器')
                    return
                }
                if (names_root.includes('launchWizard101.exe')) {
                    let exe = `${window.wizPath.split(':')[0]}: && "${wizPath}\\launchWizard101.exe" ${account} ${password} "${window.wizPath}\\Bin"`
                    console.log(exe)
                    // shell.openPath(exe)
                    runExe(exe)
                    callback()
                } else if (!names_root.includes('launchWizard101.exe')) {
                    // startWizard.bat
                    console.log('下载开始')
                    getFile(`http://${hrefNew}:3001/file/launchWizard101.exe`, `${wizPath}\\launchWizard101.exe`, (error) => {
                        console.log('添加launch.exe成功', error)
                        let exe = `${window.wizPath.split(':')[0]}: && "${wizPath}\\launchWizard101.exe" ${account} ${password} "${window.wizPath}\\Bin"`
                        console.log(exe)
                        // shell.openPath(exe)

                        callback(1, '第一次启动, 稍等...')
                        setTimeout(() => {
                            // ()
                            runExe(exe)
                            callback()
                        }, 500)
                    }, (total, currentTotal) => {
                        callback(false, `正在下载启动文件${Number.parseInt(((currentTotal / total).toFixed(2) * 100))}%`)
                    })
                } else {
                    callback(true, '出现错误：游戏文件缺失')
                }
            } catch (error) {
                console.log(error)
                if (error) {
                    callback(true, JSON.stringify(error))
                }
            }
        }
        function runExe(exe) {
            cmdShell.run(exe, (err, stdout, stderr) => {
                if (err) {
                    // console.log('stdout1', iconv.decode(o, 'cp936'));
                    // console.log(new Buffer.from(err))
                    console.log('报错了 ----->  ', err)
                    return false;
                } else {
                    console.log('进程打印内容')
                    console.log(stderr)
                    console.log(stdout)
                }
            }).on('close', (e, err, out) => {
                console.log(e, err, out)
                console.log('已关闭')
            })
        }
        function killExe(name) {
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

        // 读取本地文件
        function readFile(path, callBack, code = 'utf-8') {
            try {
                let str = fs.readFileSync(path, code)
                // return str
                callBack && callBack(str)
            } catch (error) {
                console.error(error)
            }
        }
        // 写本地文件
        function writeFile(path, data, callBack, code = 'utf-8') {
            try {
                fs.writeFileSync(path, data, code)
                callBack && callBack()
            } catch (error) {
                console.error(error)
            }
        }
        // 选择目录
        function choseDir(callback) {
            dialog.showOpenDialog({
                // 标题
                title: '保存路径',
                // 过滤器,name 后面的值随便写 extensions 里面写允许上传的类型
                buttonLabel: '选择',
                properties: ['openDirectory'],

            }).then(result => {
                // console.log(result.filePaths)
                callback && callback(result.filePaths[0])
            }).catch(err => {
                console.log(err)
            })
        }
        // 读取目录
        function readDir(path, callBack, callbackError) {
            try {
                let dir = fs.readdirSync(path, { withFileTypes: true })
                callBack && callBack(dir)
            } catch (error) {
                console.warn('报错但问题不大---->', error)
                error && callbackError(error)
            }
        }
        // 获取软件
        function getSoftWares() {
            let path = 'HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths\\'

            // regedit.list([path]).on('data',(res)=>{
            //     console.log(res)
            // })
        }
        // 获取ip
        function getIpAddress() {
            let ip
            for (let devName in interfaces) {
                let iface = interfaces[devName];
                for (let i = 0; i < iface.length; i++) {
                    let alias = iface[i];
                    if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                        ip = alias.address
                    }
                }
            }
            return ip
        }
        // 获取公网ip
        function getPublicIP() {
            const ifaces = interfaces
            let en0;
            Object.keys(ifaces).forEach((ifname) => {
                let alias = 0;
                ifaces[ifname].forEach(function (iface) {
                    if ("IPv4" !== iface.family || iface.internal !== false) {
                        return;
                    }
                    if (alias >= 1) {
                        en0 = iface.address;
                        console.log(ifname + ":" + alias, iface.address);
                    } else {
                        console.log(ifname, iface.address);
                        en0 = iface.address;
                    }
                    ++alias;
                });
            });
            return en0;
        };
        // 获取属地
        function getIpLocaltion(ip) {
            return fetch(`https://ip.useragentinfo.com/json?ip=${ip}`).then(res => res.json())
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
            killExe,
            readFile,
            writeFile,
            choseDir,
            readDir,
            getSoftWares,
            getIpAddress,
            getPublicIP,
            getIpLocaltion,
            getGameInstallPath
        }
    } catch (error) {
        console.log('浏览器环境报错', error)
    }
})()