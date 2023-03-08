/* eslint-disable react-hooks/exhaustive-deps */
import { Anchor, Button, Switch, Form, Image, Message, Grid, Notification, Radio } from '@arco-design/web-react'
import { useState, useEffect, useRef } from 'react'
import '../../css/setting.css'
import LocalStorage_subata from '../util/localStroage'
import imgKfWx from '../../image/kfwx.jpg'
import imgKfZfb from '../../image/kfzfb.jpg'
// import { alertText } from '../util/dialog/index'
// let { alertTextLive2d } = window.electronAPI
import '../../i18n';
import { useTranslation } from 'react-i18next'
let { getItem, setItem, outPutToJson, inputLocalStroage } = new LocalStorage_subata({
    filter:['wizInstall', 'installPath', 'steamInstall', 'wizPath', 'gameDataPath'],
})
let AnchorLink = Anchor.Link
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
    let inputFile = useRef()
    let [updateLoading, setUpdateLoading] = useState(false)
    let [lastVer, setLastVer] = useState('')
    let {t: translation} = useTranslation()
    let [devOpen, setDevOpen] = useState(false)
    let [lang, setLang] = useState(getItem('lang')||'zh')
    let [reStart, setReStart] = useState(false)
    let [clickNum, setClickNum] = useState(0)
    let [clickTxt, setClickTxt] = useState('没用的按钮，可能没用吧，你可以试试点一点')
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
        window.electronAPI.devOnclosed(()=>{
            setDevOpen(false)
        })
    },[])
    useEffect(()=>{
        if(clickNum>=8 && clickNum<=11){
            window.clickEffect();
        }
        if(clickNum === 4){
            setClickTxt('继续继续')
        }
        if(clickNum === 7){
            setClickTxt('就要出效果啦！')
        }
        if(clickNum >= 8){
            setClickTxt('要爆炸了')
        }
    },[clickNum])
    useEffect(()=>{
        let langArr = ['zh','zh_tw','en']
        if(langArr.includes(lang)){
            setItem('lang', lang)
        }
    },[lang])
    useEffect(()=>{
        // alertTextLive2d(`你选择了第${imgNum+1}个背景图`)
        // console.log('初始化')
        if(imgs.length > 0){
            onImgsChange(imgs, imgNum - 2)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [imgs, imgNum])
    function readImg(dir){
        // console.log('图片加载')
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
                <AnchorLink href='#bg' title={translation('Background')} />
                <AnchorLink href='#setting' title={translation('Function')} />
                <AnchorLink href='#gameFile' title={translation('Game')} />
                <AnchorLink href='#output' title={translation('Backups')} />
                <AnchorLink href='#language' title={translation('Future')}/>
                <AnchorLink href='#kf' title={translation('Reward')}/>
                <AnchorLink href='#clear' title={translation('About')}/>
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
                    <Form.Item label={translation('Start Game')}>
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
                            btnSetting ?translation('Mini'):translation('Nothing')
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
                            btnSetting1 ?translation('Show'):translation('Hide')
                        }
                        </span>
                    </Form.Item>

                    <Form.Item label={translation('Languages')}>
                        <Radio.Group onChange={(val)=>{
                            console.log(val)
                            setLang(val)
                            if(val !== getItem('lang')){
                                setReStart(true)
                            }
                        }} defaultValue={lang} direction='vertical' style={{ marginBottom: 20 }}>
                            <Radio value='zh'>{translation('Zh')}</Radio>
                            <Radio value='zh_tw'>{translation('Zh_tw')}</Radio>
                            <Radio value='en'>{translation('En')}-Baidu</Radio>
                        </Radio.Group>
                    </Form.Item>
                    {reStart && <span>{translation('Lang_tips_1')}<span style={{textDecoration:'underline'}} onClick={(e)=>{
                        e.preventDefault()
                        window.electronAPI.restart()
                    }}>{translation('Lang_tips_2')}</span></span>}
                </Form>
            </div>
            <div className='setting-item' id='gameFile'>
                {/* <PageHeader title='初始化'/> */}
                <Row>
                    <Col span={4}>
                        <Button type='primary' size='large' onClick={()=>{
                            window.tools.openFile(path)
                            window.electronAPI.mini()
                        }}>{translation('localtion')}</Button>
                    </Col>
                    <Col span={10} offset={2}>
                        <Button type='primary' status='warning' size='large' onClick={()=>{
                            document.getElementById('selectWiz').click()
                        }}>{translation('Reselect')}</Button>
                    </Col>
                </Row>
                <br/><br/>
                <span>{translation('InstallPath')}：</span>
                <span>{path?path:<Button onClick={()=>{
                        console.log(getItem('wizInstall'))
                        let fileSelect = document.getElementById('selectWiz')
                        fileSelect.click()
                    }} status='success' type='primary'>{`${translation('Choice')}Wizard.exe`}</Button>}</span>
                {/* <br/><br/>
                <Button type='primary' size='large' onClick={()=>{
                    window.tools.checkFiles(path)
                }}>检查游戏基本文件</Button> */}
            </div>
            <div className='setting-item' id='output'>
                <Row style={{marginBottom:'20px'}}>
                    {translation('SettingTips_1')}
                </Row>
                <Row style={{marginBottom:'20px'}}>
                    <p>{translation('SettingTips_2')}</p>
                    <span>{translation('SettingTips_3')}<span style={{color:'red', fontSize:'20px', display:'inline'}}>{translation('SettingTips_4')}</span></span> 
                </Row>
                <Row style={{marginBottom:'20px', color:'red'}}>
                {translation('SettingTips_5')}
                </Row>
                <Row>
                    <Col span={10}><Button type='primary' status='success' onClick={()=>{
                        // console.log(outPutToJson())
                        window.tools.choseDir((dir)=>{
                            console.log(dir)
                            window.tools.writeFile(`${dir}\\setJson.json`,outPutToJson(), ()=>{
                                Message.success({
                                    content: translation('saveSuccess'),
                                    style:{top:'10px'}
                                })
                                window.tools.openFile(`${dir}`)
                            })
                        })
                    }}>{translation('Backups')}</Button></Col>

                </Row>
                <Row style={{marginBottom:'20px'}}></Row>
                <Row>
                    <Col span={10}><Button type='primary' status='default' onClick={()=>{
                        inputFile.current.click()
                    }}>{translation('InputSet')}</Button></Col>
                </Row>
                <Row>
                    <Col>
                        <input ref={inputFile} accept='application/json' id='inputFile' onChange={(e)=>{
                            console.log(e.target.files[0].path)
                            if(e.target.files[0].path.includes('setJson.json')){
                                window.tools.readFile(e.target.files[0].path, (str)=>{
                                    inputLocalStroage(str)
                                    Message.success({
                                        content:translation('InputSuccess'),
                                        duration: 2000,
                                        style:{top:'10px'},
                                        onClose: window.electronAPI.restart
                                    })
                                })
                            }else{
                                Message.error({
                                    content:translation('Failed'),
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
                        <Col span={3}>{translation('Voice')}</Col>
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
                                zhSound ?translation('Voice_zh'):translation('Voice_en')
                            }({translation("unUseAble")})
                            </span>
                        </Col>
                    </Row>  
                    <Row style={{marginTop:'10px'}}>
                        <Col span={3}>{translation('DevTools')}</Col>
                        <Col span={3}>
                            <Switch checked={devOpen} onChange={(val)=>{
                                if(val){
                                    // alertTextLive2d('还没有正式上线哦~')
                                    window.electronAPI.openDev()
                                }
                                setDevOpen(val)
                            }}
                            />
                        </Col>
                    </Row>  
                    <Row style={{marginTop:'10px'}}>
                        <Col span={3}>{translation('Crown')}</Col>
                        <Col span={3}>
                            <Button status='danger' onClick={()=>{
                                window.electronAPI.openBroswer('https://greasyfork.org/zh-CN/scripts/446159-wizard101-auto-answer')
                            }}
                            >{translation('CrownAutoAnswer')}</Button>
                        </Col>
                    </Row> 
                    <Row style={{marginTop:'10px'}} align="center">
                        <Col span={24}>
                            <a href='http://101.43.174.221:3001/#/publishBd' target="_blank" rel="noreferrer"> 补丁版本管理 </a>
                        </Col>
                    </Row>
                    <Row style={{marginTop:'10px'}} align="center">
                        <Col span={6}>{translation('Updater')}</Col>
                        <Col span={24}>
                            <Button
                                type='primary'
                                status='success'
                                loading={loadFile}
                                onClick={()=>{
                                    setLoadFile(true)
                                    window.electronAPI.updateGame()

                                }}
                            > {'更新游戏文件 ( 测试谨慎操作 )'}  </Button>
                        </Col>
                    </Row>
                    {/* <Row style={{marginTop:'10px'}} align="center">
                        <Col span={30}>
                            <Button
                                type='primary'
                                status='danger'
                                loading={loadFile}
                                onClick={()=>{  
                                    // window.tools.desktopPicture().then(source=>{
                                    //     console.log(source[0].thumbnail.getSize())
                                        
                                    // }).catch(err=>{
                                    //     console.log(err)
                                    // })
                                }}
                            > 屏幕录制 </Button>
                        </Col>
                    </Row> */}
            </div>
            <div className='setting-item' id='kf'>
                <div className='kf-container-col'>
                    <div>{translation('Kf_tips_1')}</div>
                    <div>{translation('Kf_tips_2')}</div>
                    <div>{translation('Kf_tips_3')}</div>
                    <div className='kf-container'>
                        <img key={1} className='kf-img' src={imgKfWx} alt='' />
                        <img key={2} className='kf-img' src={imgKfZfb} alt='' />
                    </div>
                </div>
            </div>
            <div className='setting-item' id='clear'>
                {/* <PageHeader title='初始化'/> */}
                <Row align='center'>
                    <Col span={6}>{translation('Author')}:</Col>
                    <Col span={15}>{translation('Lsmhq')}</Col>
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
                    <Col span={5}>{translation('SubataUpdater')}：</Col>
                    <Button status='success' loading={updateLoading} type='primary' size='large' onClick={()=>{
                        window.electronAPI.checkUpdate((data)=>{
                            // console.log(data)
                            setUpdateLoading(true)
                            switch (data.type) {
                                case 1: // 1 error
                                    console.log('error-check')
                                    Notification.error({
                                        title: translation('UpdateError'),
                                        id: 'checkSubataUpdate',
                                        content: JSON.stringify(data.data),
                                        style
                                    })
                                    setUpdateLoading(false)
                                    break;
                                case 2: // 2 checking
                                    console.log('checking-check')
                                    Notification.info({
                                        title: translation('CheckUpdate'),
                                        id: 'checkSubataUpdate',
                                        content: '',
                                        style
                                    })
                                    break;
                                case 3: // 3 可用更新
                                    console.log('可用更新-check')
                                    Notification.info({
                                        title: translation('UpdatesAvailable'),
                                        id: 'checkSubataUpdate',
                                        content: JSON.stringify(data?.data?.version),
                                        style
                                    })
                                    setSetShow(false)
                                    break;
                                case 4: // 4 不可用更新
                                    console.log('不可用更新-check')
                                    Notification.success({
                                        title: translation('Latest'),
                                        id: 'checkSubataUpdate',
                                        content: data?.data?.version,
                                        style
                                    })
                                    setUpdateLoading(false)
                                    break;
                                case 5: // 5 正在下载
                                    console.log('正在下载-check')
                                    Notification.info({
                                        title: translation('Downloading'),
                                        id: 'checkSubataUpdate',
                                        content: `${translation('Progress')}${data.data?.percent?.toFixed(2)}%`,
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
                    <Col span={5}>{translation('QQ')}</Col>
                    <Col span={15}><Button type='text' onClick={()=>{
                        window.electronAPI.openBroswer('https://jq.qq.com/?_wv=1027&k=46lAbmFk')
                    }}>Subata QQ</Button></Col>
                </Row>
                <Row align='center' style={{marginTop:'5px'}}>
                    <Col span={5}>{translation('QQ')}</Col>
                    <Col span={15}><Button type='text' onClick={()=>{
                        setClickNum(clickNum++)
                    }}>{clickTxt}</Button></Col>
                </Row>
            </div>
        </div>
    </div>
}

export default Setting