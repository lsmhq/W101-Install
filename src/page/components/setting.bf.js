                                    console.log(window.fileList_update.split('\n'))
                                    window.tools.getGameVersion((versionArr)=>{
                                        
                                        if(versionArr === undefined){
                                            Message.error({
                                                style:{top:'10px'},
                                                content:'出现错误，联系灭火器'
                                            })
                                            return
                                        }
                                        // window.tools.getFile()
                                        let serverUrl
                                        versionArr.forEach((line)=>{
                                            if(line.includes('UrlPrefix')){
                                                console.log(line.split('=')[1])
                                                serverUrl = line.split('=')[1]
                                            }
                                        })
                                        let fileStatus = [], indexDownload = 0
                                        let fileList_update = window.fileList_update || getItem('fileList_update')
                                        fileList_update.split('\n').forEach(path=>{
                                            // -1 未开始下载
                                            fileStatus.push({
                                                targetUrl: serverUrl.trim() + path,
                                                outPut: window.wizPath + path,
                                                status: -1
                                            })
                                        })
                                        setLength(fileStatus.length)
                                        // console.log(fileStatus)
                                        clearInterval(downLoadTimer)
                                        downLoadTimer = setInterval(()=>{
                                            // console.log(indexDownload, fileStatus.length)
                                            if(indexDownload === (fileStatus.length - 1)){
                                                // console.log(fileStatus.find(item=>item.status !== 1))
                                                clearInterval(downLoadTimer)
                                            }
                                            // console.log(fileStatus)
                                            if(fileStatus[indexDownload].status === -1){
                                                let {targetUrl, outPut} = fileStatus[indexDownload]
                                                fileStatus[indexDownload].status = 0
                                                window.tools.getFile(targetUrl, outPut, (sign)=>{}, (total, currentTotal)=>{
                                                    if(total){
                                                        setTotal(total)
                                                        setCurrent(currentTotal)
                                                        // console.log(total, currentTotal)
                                                        if(total * 1 === currentTotal * 1){
                                                            fileStatus[indexDownload].status = 1
                                                            if(!fileStatus.find(item=>item.status !== 1)){
                                                                setLoadFile(false)
                                                                setLength(0)
                                                                setCurrentFile(0)
                                                            }
                                                        }
                                                    }
                                                    if(!total){
                                                        fileStatus[indexDownload].status = 1
                                                        if(!fileStatus.find(item=>item.status !== 1)){
                                                            setLoadFile(false)
                                                            setLength(0)
                                                            setCurrentFile(0)
                                                        }
                                                    }
                                                })
                                            }
                                            if(fileStatus[indexDownload].status === 1){
                                                indexDownload++
                                                setCurrentFile(indexDownload + 1)
                                            }
                                        }, 500)
                                        // window.tools.getFile()
                                    })