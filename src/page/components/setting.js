/* eslint-disable react-hooks/exhaustive-deps */
import { Anchor, Button, Switch, Form, Image, Message, Grid, Notification } from '@arco-design/web-react'
import { useState, useEffect, useRef } from 'react'
import '../../css/setting.css'
import LocalStorage_subata from '../util/localStroage'
import imgKfWx from '../../image/kfwx.jpg'
import imgKfZfb from '../../image/kfzfb.jpg'
let { getItem, setItem, outPutToJson, inputLocalStroage } = new LocalStorage_subata({
    filter:['wizInstall', 'installPath', 'steamInstall', 'wizPath', 'gameDataPath'],
})
// import { alertText } from '../util/dialog/index'
// let { alertTextLive2d } = window.electronAPI
let AnchorLink = Anchor.Link
let downLoadTimer
let { Row, Col } = Grid
let style = {
    right: '50px',
    top: '20px'
}
function Setting(props){
    let {setBg, setSubataShow, onBgChange, onImgsChange, setSetShow} = props
    let [btnSetting, setbtnSetting] = useState(getItem('btnSetting') === null?true: getItem('btnSetting'))
    let [btnSetting1, setbtnSetting1] = useState(getItem('btnSetting1') === null?true: getItem('btnSetting1'))
    // let [btnSetting2, setbtnSetting2] = useState(getItem('btnSetting2') === null?true: getItem('btnSetting2'))
    // let [btnSetting3, setbtnSetting3] = useState(getItem('btnSetting3') === null?true: getItem('btnSetting3'))
    let [imgNum, setimgNum] = useState(getItem('imgNum')? getItem('imgNum')*1:0)
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
    let inputFile = useRef()
    let [updateLoading, setUpdateLoading] = useState(false)
    let [lastVer, setLastVer] = useState('')
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
        if(getItem('btnSetting2') === null){
            setItem('btnSetting2', true)
        }
        if(getItem('btnSetting1') === null){
            setItem('btnSetting1', true)
        }
        if(getItem('btnSetting') === null){
            setItem('btnSetting', true)
        }
        if(getItem('bgImgDir')){
            readImg(getItem('bgImgDir'))
        }
        fetch('http://101.43.174.221:3001/file/subataUpdate/latest.yml').then(res=>res.text()).then(res=>{
            if(res){
                setLastVer(res.split('\n')[0])
            }    
        }).catch(err=>{
            console.error('错误但问题不大---->', err)
        })
        window.electronAPI.workOnClosed(()=>{
            setLoadFile(false)
        })
    },[])
    useEffect(()=>{
        // alertTextLive2d(`你选择了第${imgNum+1}个背景图`)
        // console.log('初始化')
        if(imgs.length > 0){
            onImgsChange(imgs, imgNum - 2)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [imgs, imgNum])
    function readImg(dir){
        console.log('图片加载')
        if(dir && dir !== 'undefined'){
            setImgs([])
            window.tools.readDir(dir, (files)=>{
                // console.log(files)
                let imgType = ['jpg','png','jpeg','webp']
                imgs = []
                window.electronAPI.ready()
                files.forEach((file, idx)=>{
                    if(idx > 22) return
                    let fileType = file.name.split('.')[file.name.split('.').length-1]
                    if(imgType.includes(fileType)){
                        // console.log(`${dir}\\${file.name}`)
                        window.tools.readFile(`${dir}\\${file.name}`,(str)=>{
                            // console.log(str)
                            // window.tools.writeFile(`${getItem('installPath')}\\cacheImg`,str,()=>{
                            // console.log('缓存图片成功')
                            // console.log(`${__dirname}\\cacheImg`)
                            let bufferArr = new Int8Array(str)
                            let blob = new Blob([bufferArr],{ type : `application/${fileType}`})
                            // console.log(blob)
                            let filereder = new FileReader()
                            filereder.onload = (e)=>{
                                // console.log(url)
                                imgs.push({url: e.target.result, data: str, type: fileType})
                                // console.log(imgs)
                                setImgs([...imgs])
                            }
                            filereder.readAsDataURL(blob)
                            // })
                        },'')
                    }
                })
            },(error)=>{
                window.electronAPI.ready()
            })
        }else{
            if(imgs.length === 0 && imgNum > 1){
                setimgNum(0)
                setBg(0)
                setItem('imgNum', 0)
            }
        }
    }
    return <div className="setting">
        <div className='setting-left'>
            <Anchor affix={false} hash={false} scrollContainer={'#setting-right'}>
                <AnchorLink href='#bg' title='背景' />
                <AnchorLink href='#setting' title='功能' />
                <AnchorLink href='#gameFile' title='游戏' />
                <AnchorLink href='#output' title='备份配置' />
                <AnchorLink href='#language' title="谨慎使用!"/>
                <AnchorLink href='#kf' title="打赏开发者"/>
                <AnchorLink href='#clear' title='关于' />
            </Anchor>
        </div>
        <div className='setting-right' id='setting-right'>
            <div className='setting-item' id='bg'>
                {/* <PageHeader title='自定义背景图'/> */}
                <div className='setting-bg'>
                    <Image onClick={()=>{
                        setimgNum(0)
                        setBg(0)
                        setItem('imgNum', 0)
                    }} className={imgNum === 0?'arco-image-active':''} preview={false} style={{objectFit:'cover'}} width={82} height={82} src='https://vkceyugu.cdn.bspapp.com/VKCEYUGU-a3e579e1-12c0-4985-8d49-3ab58c03387a/c3e29bb5-d5a0-4799-a544-264e310356aa.jpg'/>
                    <Image onClick={()=>{
                        setimgNum(1)
                        setBg(1)
                        setItem('imgNum', 1)
                    }}  className={imgNum === 1?'arco-image-active':''} preview={false} style={{objectFit:'cover'}} width={82} height={82} src='https://vkceyugu.cdn.bspapp.com/VKCEYUGU-a3e579e1-12c0-4985-8d49-3ab58c03387a/151d0d95-b330-4ca8-9de7-d0336aed9872.webp'/>
                    {
                        imgs.map((img, index)=>{
                            return <Image key={index} width={82} height={82} onClick={()=>{
                                // console.log(index)
                                setimgNum(index + 2)
                                setItem('imgNum', index + 2)
                                // console.log('手动改变')
                                onBgChange(imgs, index)
                            }} className={(index + 2 === imgNum)?'arco-image-active':''} preview={false} style={{objectFit:'cover'}} src={img.url}/>
                        })
                    }
                    <div className='addBgImg' onClick={()=>{
                        // document.getElementById('bgUpload').click()
                        window.tools.choseDir((dir)=>{
                            // console.log(dir)
                            setItem('bgImgDir', dir)
                            readImg(dir)
                        })
                    }}>
                        <span>+</span>
                    </div>
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
                            setItem('btnSetting', val)
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
                            setItem('btnSetting1', val)
                        }}
                        />
                        <span style={{paddingLeft:'10px'}}>
                        {
                            btnSetting1 ?'显示':'隐藏'
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
                        console.log(getItem('wizInstall'))
                        let fileSelect = document.getElementById('selectWiz')
                        fileSelect.click()
                    }} status='success' type='primary'>{'选择Wizard.exe'}</Button>}</span>
                {/* <br/><br/>
                <Button type='primary' size='large' onClick={()=>{
                    window.tools.checkFiles(path)
                }}>检查游戏基本文件</Button> */}
            </div>
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
                        // console.log(outPutToJson())
                        window.tools.choseDir((dir)=>{
                            console.log(dir)
                            window.tools.writeFile(`${dir}\\setJson.json`,outPutToJson(), ()=>{
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
                        <input ref={inputFile} accept='application/json' id='inputFile' onChange={(e)=>{
                            console.log(e.target.files[0].path)
                            if(e.target.files[0].path.includes('setJson.json')){
                                window.tools.readFile(e.target.files[0].path, (str)=>{
                                    inputLocalStroage(str)
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
                    <Row style={{marginTop:'10px'}}>
                        <Col span={3}>语音</Col>
                        <Col span={3}>
                            <Switch checked={zhSound} onChange={(val)=>{
                                console.log(val)
                                // true 开始游戏最小化
                                // false 开始游戏不进行操作
                                setItem('zhSound', val)
                                setZhSound(val)
                                if(val){
                                    // alertTextLive2d('还没有正式上线哦~')
                                }
                            }}
                            />
                        </Col>
                        <Col span={10}>
                            <span style={{paddingLeft:'10px'}}>
                            {
                                zhSound ?'中文':'英文'
                            }(不可用)
                            </span>
                        </Col>
                    </Row>  
                    <Row style={{marginTop:'10px'}}>
                        <Col span={3}>调试</Col>
                        <Col span={3}>
                            <Switch onChange={(val)=>{
                                if(val){
                                    // alertTextLive2d('还没有正式上线哦~')
                                    window.electronAPI.openDev()
                                }
                            }}
                            />
                        </Col>
                    </Row>  
                    <Row style={{marginTop:'10px'}}>
                        <Col span={3}>皇冠</Col>
                        <Col span={3}>
                            <Button status='danger' onClick={()=>{
                                window.electronAPI.openBroswer('https://greasyfork.org/zh-CN/scripts/446159-wizard101-auto-answer')
                            }}
                            >皇冠自动答题</Button>
                        </Col>
                    </Row> 
                    <Row style={{marginTop:'10px'}} align="center">
                        <Col span={6}>游戏更新</Col>
                        <Col span={24}>
                            <Button
                                type='primary'
                                status='success'
                                loading={loadFile}
                                onClick={()=>{
                                    setLoadFile(true)
                                    window.electronAPI.updateGame()

                                }}
                            > {fileLength > 0 ? `正在下载中( 测试谨慎操作 )`:'更新游戏文件 ( 测试谨慎操作 )'}  </Button>
                        </Col>
                        <Row style={{marginTop:'5px'}}>
                            {fileLength > 0 && `已下载：${currentFile}个 \n总数：${fileLength}（个）`}<br/>
                        </Row>
                        <Row style={{marginTop:'5px'}}>
                            {fileLength > 0 && `当前文件进度：${((current/total)*100).toFixed(2)}%`}<br/>
                        </Row>
                        <Row style={{marginTop:'5px'}}>
                            {fileLength > 0 && `下载过程中终止可能会导致游戏无法启动，下载过程中可以关掉设置窗口`}
                        </Row>
                    </Row>
            </div>
            <div className='setting-item' id='kf'>
                <div className='kf-container-col'>
                    <div>注意！！！此打赏是给这个客户端开发者打赏，随意</div>
                    <div>我本身已游戏退坑，有任何建议联系我</div>
                    <div>联系QQ: 784433957</div>
                    <div className='kf-container'>
                        <img key={1} className='kf-img' src={imgKfWx} alt='' />
                        <img key={2} className='kf-img' src={imgKfZfb} alt='' />
                    </div>
                </div>
            </div>
            <div className='setting-item' id='clear'>
                {/* <PageHeader title='初始化'/> */}
                <Row align='center'>
                    <Col span={6}>开发者：</Col>
                    <Col span={15}>蓝色灭火器</Col>
                </Row>
                {/* <Row align='center' style={{marginTop:'5px'}}>
                    <Col span={5}>支持一下</Col>
                    <Col span={5}>
                        <Button onClick={()=>{
                            window.electronAPI.openBroswer('https://gitee.com/lsmhq/one-click-installation-script/tree/web-install/')
                        }}>前往 Star ~</Button>
                    </Col>
                    <Col span={10} offset={2}>项目仅供学习交流</Col>
                </Row> */}

                {/* <Row style={{marginTop:'30px'}}>
                    <Button status='danger' type='primary' size='large' onClick={()=>{
                        window.tools.init(()=>{
                            localStorage.clear()
                            window.electronAPI.restart()
                        })
                    }}>清空缓存</Button>
                </Row> */}
                <Row style={{marginTop:'30px'}}>
                    <Col span={5}>应用更新：</Col>
                    <Button status='success' loading={updateLoading} type='primary' size='large' onClick={()=>{
                        window.electronAPI.checkUpdate((data)=>{
                            // console.log(data)
                            setUpdateLoading(true)
                            switch (data.type) {
                                case 1: // 1 error
                                    console.log('error-check')
                                    Notification.error({
                                        title: '更新出错, 联系管理员',
                                        id: 'checkSubataUpdate',
                                        content: JSON.stringify(data.data),
                                        style
                                    })
                                    setUpdateLoading(false)
                                    break;
                                case 2: // 2 checking
                                    console.log('checking-check')
                                    Notification.info({
                                        title: '正在检测更新',
                                        id: 'checkSubataUpdate',
                                        content: '',
                                        style
                                    })
                                    break;
                                case 3: // 3 可用更新
                                    console.log('可用更新-check')
                                    Notification.info({
                                        title: '存在可用更新',
                                        id: 'checkSubataUpdate',
                                        content: JSON.stringify(data?.data?.version),
                                        style
                                    })
                                    setSetShow(false)
                                    break;
                                case 4: // 4 不可用更新
                                    console.log('不可用更新-check')
                                    Notification.success({
                                        title: '当前已是最新版本',
                                        id: 'checkSubataUpdate',
                                        content: data?.data?.version,
                                        style
                                    })
                                    setUpdateLoading(false)
                                    break;
                                case 5: // 5 正在下载
                                    console.log('正在下载-check')
                                    Notification.info({
                                        title: '正在进行下载',
                                        id: 'checkSubataUpdate',
                                        content: `下载进度${data.data?.percent?.toFixed(2)}%`,
                                        style
                                    })
                                    break;
                                default:
                                    setUpdateLoading(false)
                                    break;
                            }
                        })
                    }}>{window.appVersion}  {`--> ${lastVer.split(':')[1]}`}</Button>
                </Row>
                <Row align='center' style={{marginTop:'5px'}}>
                    <Col span={5}>联系我们</Col>
                    <Col span={15}><Button type='text' onClick={()=>{
                        window.electronAPI.openBroswer('https://jq.qq.com/?_wv=1027&k=46lAbmFk')
                    }}>美服汉化群</Button></Col>
                </Row>
            </div>
        </div>
    </div>
}

export default Setting