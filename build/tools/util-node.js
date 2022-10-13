(function () {
    const request = require('request')
    const fs = require('fs')
    const {
        shell
    } = require('electron')


    // 下载文件
    function getFile(uri, filePath, callback, onData) {
        console.log(filePath)
        if (uri) {
            let currentTotal = 0
            let total = 0
            let req = request(uri)
            let out = fs.createWriteStream(filePath)
            req.pipe(out)
            req.on('response', (res) => {
                console.log(res.headers['content-length'])
                total = res.headers['content-length']
            })
            req.on('data', (data) => {
                // console.log(data.byteLength)
                currentTotal += data.byteLength
                onData(total, currentTotal)
            })
            out.on('finish', () => {
                out.close()
                callback()
            })
        }
    }

    // 打开文件
    function openFile(path) {
        console.log('打开', path)
        shell.openPath(path)
        // window.confirm('请关闭程序之后进行更新')
    }

    window.tools = {
        getFile,
        openFile,
    }
})()