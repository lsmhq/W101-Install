import { Anchor, Button, Switch, Form, Image, Message, Grid } from '@arco-design/web-react'
import { useState, useEffect, useRef } from 'react'
import '../../css/setting.css'
import LocalStorage_subata from '../util/localStroage'
let localStorage_subata = new LocalStorage_subata({
    filter:['wizInstall', 'installPath', 'steamInstall', 'wizPath', 'gameDataPath'],
})
// import { alertText } from '../util/dialog/index'
// let { alertTextLive2d } = window.electronAPI
let AnchorLink = Anchor.Link
let downLoadTimer
let { Row, Col } = Grid
// let models = [
//     {
//         name:'shizuku',
//         label:'默认'
//     },
//     {
//         name:'xxban',
//         label:'血小板'
//     },{
//         name:'22-0default',
//         label:'22'
//     },{
//         name:'33-0default',
//         label:'33'
//     },{
//         name:'haruto',
//         label:'小可爱(男)'
//     },{
//         name:'koharu',
//         label:'小可爱(女)'
//     },{
//         name:'hijiki',
//         label:'黑喵'
//     },{
//         name:'tororo',
//         label:'白喵'
//     },{
//         name:'wanko',
//         label:'碗狗'
//     },
// ]
function Setting(props){
    let {setBg, setSubataShow} = props
    let [btnSetting, setbtnSetting] = useState(localStorage_subata.getItem('btnSetting') === null?true: localStorage_subata.getItem('btnSetting'))
    let [btnSetting1, setbtnSetting1] = useState(localStorage_subata.getItem('btnSetting1') === null?true: localStorage_subata.getItem('btnSetting1'))
    let [btnSetting2, setbtnSetting2] = useState(localStorage_subata.getItem('btnSetting2') === null?true: localStorage_subata.getItem('btnSetting2'))
    let [imgNum, setimgNum] = useState(localStorage_subata.getItem('imgNum')? localStorage_subata.getItem('imgNum')*1:0)
    // eslint-disable-next-line no-unused-vars
    let [imgs, setImgs] = useState([])
    let [path, setPath] = useState(window.wizPath)
    // let [liveName, setLive2d] = useState(localStorage.getItem('live2d') || 'defalut')
    let [zhSound, setZhSound] = useState(false)
    let [loadFile, setLoadFile] = useState(false)
    let [fileLength, setLength] = useState(0)
    let [currentFile, setCurrentFile] = useState(0)
    let [total, setTotal] = useState(0)
    let [current, setCurrent] = useState(0)
    let outputFile = useRef()
    let inputFile = useRef()
    // let [live2dOpen, setlive2dOpen] = useState(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        // alert('window.wizPath')
        setPath(window.wizPath)
    })
    useEffect(()=>{
        // window.L2Dwidget.init({ 
        //     "model": {jsonPath:`./Resources/live2dModel/${liveName}/model.json`,"scale": 1 }, 
        //     // "dialog":{enable: true}
        //     display: {
        //         position: 'left',//位置
        //     },
        // });
        if(localStorage_subata.getItem('btnSetting2') === null){
            localStorage_subata.setItem('btnSetting2', true)
        }
        if(localStorage_subata.getItem('btnSetting1') === null){
            localStorage_subata.setItem('btnSetting1', true)
        }
        if(localStorage_subata.getItem('btnSetting') === null){
            localStorage_subata.setItem('btnSetting', true)
        }
    },[])
    useEffect(()=>{
        // alertTextLive2d(`你选择了第${imgNum+1}个背景图`)

    }, [imgNum])
    return <div className="setting">
        <div className='setting-left'>
            <Anchor affix={false} hash={false} scrollContainer={'#setting-right'}>
                <AnchorLink href='#bg' title='背景' />
                <AnchorLink href='#setting' title='功能' />
                <AnchorLink href='#gameFile' title='游戏' />
                <AnchorLink href='#output' title='备份配置' />
                {/* <AnchorLink href='#live2d-set' title='Live2d' /> */}
                <AnchorLink href='#language' title="谨慎使用!"/>
                <AnchorLink href='#clear' title='清除缓存' />
                {/* <AnchorLink href='#bug' title='bug上报' /> */}
            </Anchor>
        </div>
        <div className='setting-right' id='setting-right'>
            <div className='setting-item' id='bg'>
                {/* <PageHeader title='自定义背景图'/> */}
                <div className='setting-bg'>
                    <Image onClick={()=>{
                        setimgNum(0)
                        setBg(0)
                        localStorage_subata.setItem('imgNum', 0)
                    }} className={imgNum === 0?'arco-image-active':''} preview={false} style={{objectFit:'cover'}} width={100} height={100} src='https://vkceyugu.cdn.bspapp.com/VKCEYUGU-a3e579e1-12c0-4985-8d49-3ab58c03387a/c3e29bb5-d5a0-4799-a544-264e310356aa.jpg'/>
                    <Image onClick={()=>{
                        setimgNum(1)
                        setBg(1)
                        localStorage_subata.setItem('imgNum', 1)
                    }}  className={imgNum === 1?'arco-image-active':''} preview={false} style={{objectFit:'cover'}} width={100} height={100} src='https://vkceyugu.cdn.bspapp.com/VKCEYUGU-a3e579e1-12c0-4985-8d49-3ab58c03387a/151d0d95-b330-4ca8-9de7-d0336aed9872.webp'/>
                    {
                        imgs.map((img, index)=>{
                            return <Image key={index} onClick={()=>{
                                setimgNum(index + 2)
                                setBg(index + 2)
                                localStorage_subata.setItem('imgNum', index + 2)
                            }} className={(index + 2 === index)?'arco-image-active':''} preview={false} style={{objectFit:'cover'}} width={100} height={100} src={img}/>
                        })
                    }
                    {/* <Upload
                        
                        showUploadList={false}
                        onChange={(_, currentFile) => {
                            console.log(URL.createObjectURL(currentFile.originFile))
                            imgs.push(URL.createObjectURL(currentFile.originFile))
                            setImgs([...imgs])
                        }}
                    ></Upload> */}
                </div>
            </div>
            <div className='setting-item' id='setting'>
                {/* <PageHeader title='按钮设置'/> */}
                <Form>
                    <Form.Item label={'开始游戏'}>
                        <Switch checked={btnSetting} onChange={(val)=>{
                            console.log(val)
                            setbtnSetting(val)
                            // true 开始游戏最小化
                            // false 开始游戏不进行操作
                            localStorage_subata.setItem('btnSetting', val)
                        }}
                        />
                        <span style={{paddingLeft:'10px'}}>
                        {
                            btnSetting ?'启动游戏自动最小化':'启动游戏后不进行操作'
                        }
                        </span>
                    </Form.Item>
                    <Form.Item label="Subata">
                        <Switch checked={btnSetting1} onChange={(val)=>{
                            // console.log(val)
                            setbtnSetting1(val)
                            setSubataShow(val)
                            // true 开始游戏最小化
                            // false 开始游戏不进行操作
                            localStorage_subata.setItem('btnSetting1', val)
                        }}
                        />
                        <span style={{paddingLeft:'10px'}}>
                        {
                            btnSetting1 ?'显示':'隐藏'
                        }
                        </span>
                    </Form.Item>
                    <Form.Item label="关闭按钮">
                        <Switch checked={btnSetting2} onChange={(val)=>{
                            // console.log(val)
                            setbtnSetting2(val)
                            // true 开始游戏最小化
                            // false 开始游戏不进行操作
                            localStorage_subata.setItem('btnSetting2', val)
                        }}
                        />
                        <span style={{paddingLeft:'10px'}}>
                        {
                            btnSetting2 ?'后台运行':'退出程序'
                        }
                        </span>
                    </Form.Item>
                </Form>
            </div>
            <div className='setting-item' id='gameFile'>
                {/* <PageHeader title='初始化'/> */}
                <Row>
                    <Col span={4}>
                        <Button type='primary' size='large' onClick={()=>{
                            window.tools.openFile(path)
                            window.electronAPI.mini()
                        }}>定位游戏</Button>
                    </Col>
                    <Col span={10} offset={2}>
                        <Button type='primary' status='warning' size='large' onClick={()=>{
                            document.getElementById('selectWiz').click()
                        }}>重新选择</Button>
                    </Col>
                </Row>
                <br/><br/>
                <span>当前路径：</span>
                <span>{path?path:<Button onClick={()=>{
                        console.log(localStorage_subata.getItem('wizInstall'))
                        let fileSelect = document.getElementById('selectWiz')
                        fileSelect.click()
                    }} status='success' type='primary'>{'选择Wizard.exe'}</Button>}</span>
                {/* <br/><br/>
                <Button type='primary' size='large' onClick={()=>{
                    window.tools.checkFiles(path)
                }}>检查游戏基本文件</Button> */}
            </div>
            {/* <div className='setting-item' id='live2d-set'>
                <Form>
                    <Form.Item label={'开关'}>
                        <Switch checked={live2dOpen} onChange={(val)=>{
                            console.log(val)
                            setlive2dOpen(val)
                            if(val){
                                window.electronAPI.openLive2d({
                                    modelName: localStorage.getItem('live2d') || 'shizuku'
                                })
                            }else{
                                window.electronAPI.closeLive2d()
                            }
                            window.electronAPI.closedLive2d(()=>{
                                setlive2dOpen(false)
                            })
                        }}
                        />
                        <span style={{paddingLeft:'10px'}}>
                        {
                            live2dOpen ?'开启':'关闭'
                        }
                        </span>
                    </Form.Item>
                    <Form.Item label={'模型切换'}>
                        <Radio.Group direction='vertical' defaultValue={liveName} onChange={(val)=>{
                        // console.log(val)
                        localStorage.setItem('live2d', val)
                        setLive2d(val)
                        if(live2dOpen){
                            window.electronAPI.closeLive2d()
                            window.electronAPI.openLive2d({
                                modelName: localStorage.getItem('live2d') || 'shizuku'
                            })
                            setTimeout(() => {
                                setlive2dOpen(true)
                            }, 500);
                        }
                        // alertTextLive2d('重启才能看到呦~')
                    }}>
                    {
                        models.map((item, index)=>{
                            return <Radio value={item.name} key={item.name}>
                                {item.label}
                            </Radio>
                        })
                    }
                    </Radio.Group>
                    </Form.Item>
                </Form>
            </div> */}
            <div className='setting-item' id='output'>
                <Row style={{marginBottom:'20px'}}>
                    备份配置，防止数据丢失, 配置文件名为 setJson.json
                </Row>
                <Row style={{marginBottom:'20px'}}>
                    <p>问: 如何导入配置?</p>
                    <span>答：点击导入配置，并选择 setJson.json 文件，看到提示导入成功，代表成功 , <span style={{color:'red', fontSize:'20px', display:'inline'}}>将会重启</span></span> 
                </Row>
                <Row style={{marginBottom:'20px', color:'red'}}>
                    *注意: 配置文件中包含账号密码等私密信息，严禁随意发送给其他人，保护好自己的信息
                </Row>
                <Row>
                    <Col span={4}><Button type='primary' status='success' onClick={()=>{
                        // console.log(localStorage_subata.outPutToJson())
                        window.tools.choseDir((dir)=>{
                            console.log(dir)
                            window.tools.writeFile(`${dir}\\setJson.json`,localStorage_subata.outPutToJson(), ()=>{
                                Message.success({
                                    content:'保存成功！',
                                    style:{top:'10px'}
                                })
                                window.tools.openFile(`${dir}`)
                            })
                        })
                    }}>备份配置</Button></Col>
                    <Col span={10} offset={2}><Button type='primary' status='default' onClick={()=>{
                        inputFile.current.click()
                    }}>导入配置</Button></Col>
                </Row>
                <Row>
                    <Col>
                        <input ref={inputFile} id='inputFile' onChange={(e)=>{
                            console.log(e.target.files[0].path)
                            if(e.target.files[0].path.includes('setJson.json')){
                                window.tools.readFile(e.target.files[0].path, (str)=>{
                                    localStorage_subata.inputLocalStroage(str)
                                    Message.success({
                                        content:'导入成功',
                                        duration: 2000,
                                        style:{top:'10px'},
                                        onClose: window.electronAPI.restart
                                    })
                                })
                            }else{
                                Message.error({
                                    content:'解析配置失败',
                                    style:{top:'10px'}
                                })
                            }
                            e.target.value = ''
                            // e.target.files = []
                        }} type='file' style={{visibility:'hidden'}}/>
                    </Col>
                </Row>
            </div>
            <div className='setting-item' id='language'>
                <Form>
                    <Form.Item label={'更新'}>
                        <Button
                            type='primary'
                            status='success'
                            loading={loadFile}
                            onClick={()=>{
                                setLoadFile(true)
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
                                    let fileList_update = window.fileList_update || localStorage_subata.getItem('fileList_update')
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
                            }}
                        > {fileLength > 0 ? `正在下载中( 测试谨慎操作 )`:'更新游戏文件 ( 测试谨慎操作 )'}  </Button>
                        <br/>
                        {fileLength > 0 && `已下载：${currentFile}个 \n总数：${fileLength}（个）`}<br/>
                        {fileLength > 0 && `当前文件进度：${((current/total)*100).toFixed(2)}%`}<br/>
                        {fileLength > 0 && `下载过程中终止可能会导致游戏无法启动，下载过程中可以关掉设置窗口`}
                    </Form.Item>
                    <Form.Item label={'语音'}>
                        <Switch checked={zhSound} onChange={(val)=>{
                            console.log(val)
                            // true 开始游戏最小化
                            // false 开始游戏不进行操作
                            localStorage_subata.setItem('zhSound', val)
                            setZhSound(val)
                            if(val){
                                // alertTextLive2d('还没有正式上线哦~')
                            }
                        }}
                        />
                        <span style={{paddingLeft:'10px'}}>
                        {
                            zhSound ?'中文':'英文'
                        }(不可用)
                        </span>
                    </Form.Item>
                    <Form.Item label={'调试'}>
                        <Switch onChange={(val)=>{
                            if(val){
                                // alertTextLive2d('还没有正式上线哦~')
                                window.electronAPI.openDev()
                            }
                        }}
                        />
                    </Form.Item>
                    
                </Form>
            </div>
            <div className='setting-item' id='clear'>
                {/* <PageHeader title='初始化'/> */}
                <Button status='danger' type='primary' size='large' onClick={()=>{
                    window.tools.init(()=>{
                        localStorage.clear()
                        window.electronAPI.restart()
                    })
                }}>初始化所有</Button>
            </div>

        </div>
    </div>
}

export default Setting