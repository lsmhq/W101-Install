import { useEffect, useState } from 'react';
import '../css/main.css'
import '../css/main_small.css'
import {IconClose, IconMinus, IconSettings} from '@arco-design/web-react/icon'
import { List, Button, Modal, Notification, Drawer, Collapse, Message, Input, Tooltip, Trigger } from '@arco-design/web-react';
// import logo from '../image/WizardLogoRA.png'
import QQ from '../image/QQ_share.jpg'
import apiPath from './http/api'
import RightNav from './components/right-nav';
import BodyMain from './components/body-main';
import Setting from './components/setting';
import su from '../image/Subata_logo.png'
import LocalStorage_subata from './util/localStroage';
import { installBtn_config } from './config/config.page';
import '../i18n';
import { useTranslation } from 'react-i18next'
import finishAudio from '../audio/get.wav'
import TriggerSelect from './components/TriggerSelect';
let { getItem, setItem } = new LocalStorage_subata({
    filter: ['wizInstall', 'installPath', 'steamInstall', 'wizPath', 'gameDataPath']
})
// let wsPath = 'ws://localhost:8000'
let wsPath = 'ws://101.43.174.221:8000'
let timerr
let style = {
    right: '50px',
    top: '20px'
}
Notification.config({
    maxCount: '5',
    duration: 5000
})
let obj = {
    r: '<稳定版>',
    d: '<测试版>',
    c: '<轻聊>',
}
let ws = null, socketError = false
let imgMap = {
    qq: QQ,
    wx: 'http://101.43.174.221:3001/zf/wx.png',
    zf: 'http://101.43.174.221:3001/zf/zfb.jpg'
}
// let satanTimer = false, satanTimerStart
let { getPath, checkGameInstall, changeType} = window.tools
function Main(props) {
    // let {setLocal} = props
    let [loading, setLoading] = useState(true) // 轮播加载
    let [loading1, setLoading1] = useState(true) // List加载
    let [imgs, setImgs] = useState([]) // 轮播图片
    let [show, setShow] = useState(false) // ModalShow
    let [zfType, setZf] = useState('') // zf类型
    let [img, setImg] = useState('')  // zf图片
    let [percent, setPercent] = useState(0) // 进度百分比
    let [drawer, setDrawer] = useState(false) // 通知显隐
    let [count, setCount] = useState(0)  // 通知条数
    let [btnLoading, setBtnLoad] = useState(false) // 按钮加载
    let [msgShow, setMsgShow] = useState(false) // 消息
    let [text, setText] = useState('')  // 内容
    let [title, setTitle] = useState('')  // 标题
    let [user, setUser] = useState(getItem('username')) // 用户名
    let [msgShow1, setMsgShow1] = useState(false)  // 反显
    let [text1, setText1] = useState('')  // 反显 
    let [title1, setTitle1] = useState('')// 反显
    let [message, setMessage] = useState([]) // 通知
    let [type, setType] = useState(getItem('type')) // 汉化type
    let [root, setRoot] = useState(getItem('root') || '') // 是否可以进行发布通知
    let [play, setPlay] = useState(getItem('wizInstall')) // 是否可以开始游戏
    let [nav, setNavs] = useState({}) // subata 文章 tabs
    let [settingShow, setSetShow] = useState(false) // 设置弹窗显隐
    let [subataShow, setSubataShow] = useState(getItem('btnSetting1') === null ? true : getItem('btnSetting1')) // subata按钮显隐
    let [imgNum, setimgNum] = useState(getItem('imgNum') ? getItem('imgNum') * 1 : 0) // 背景图index
    let [filePath, setFilePath] = useState(getItem('wizInstall')) // wiz安装路径
    let [onlineNum, setOnline] = useState(0) // 在线人数
    let [bgImg, setBgImg] = useState('') // 背景图blobUrl
    let [bgShow, setBgShow] = useState(true) // 背景图显隐
    let [status, setStatus] = useState('') // webSocket 状态
    // let [popupVisible, setPopupVisible] = useState(false)
    const { t:translation } = useTranslation();
    useEffect(() => {
        // 初始化地址
        getSteam(() => {
            // 检查补丁更新
            if (getItem('type')) {
                checkUpdate(false)
            }
        })
        window.tools.getGameInstallPath('f').then((stdout, stderr)=>{
            console.log('gamePath',stdout, stderr)
        }).catch(err=>{
            console.log('gamePathErr',err)
        })
        // 获取软件
        // window.tools.getSoftWares()
        // 获取轮播
        getCarousel()
        // 拖拽
        // drag()
        // 黑主题
        dark()
        // 获取活动新闻
        getData()
        clearInterval(timerr)
        timerr = setInterval(() => {
            getData()
        }, 60000)
        // 创建WebSocket
        createSocket()
        // 窗口自适应
        // 获取installPath
        window.electronAPI.getPath((path) => {
            window.installPath = path
            setItem('installPath', path)
        })
        let bgImgDir = getItem('bgImgDir')
        if(!bgImgDir || bgImgDir === 'undefined'){
            window.electronAPI.ready()
        }
        window.electronAPI.menuChangeType((type) => {
            setItem('type', type)
            checkUpdate()
        })
        if (getItem('accounts') === null) {
            setItem('accounts', [])
        }
        if (getItem('accountsMap') === null) {
            setItem('accountsMap', {})
        }
        // 监听开始游戏
        window.electronAPI.startGame()
        if(!window.drag.supported) {
            document.querySelector('#nav').style['-webkit-app-region'] = 'drag';
        }
        return () => {
            // 注销
            destroy()
            setItem('msgLength', message.length)
            // clearInterval(satanTimer)
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    useEffect(() => {
        setImg(imgMap[zfType])
    }, [zfType])
    useEffect(() => {
        if (img)
            setShow(true)
    }, [img])
    useEffect(() => {

    }, [settingShow])
    useEffect(() => {
        setCount(0)
    }, [drawer])

    useEffect(()=>{
        document.title = ` V ${window.appVersion} / ${translation('onlineNum')} · ${onlineNum} / ${translation('status')} · ${status}`
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onlineNum, status])
    function getSteam(callback) {
        // console.log('getSteam')
        getPath((stdout, stderr) => {
            // console.log(stdout.split('InstallPath')[1].split('REG_SZ')[1].trim())
            if (getItem('gameDataPath') === null) {
                setItem('gameDataPath', `${stdout.split('InstallPath')[1].split('REG_SZ')[1].trim()}\\steamapps\\common\\Wizard101\\Data\\GameData\\`)
            }
            if (getItem('wizPath') === null) {
                setItem('wizPath', `${stdout.split('InstallPath')[1].split('REG_SZ')[1].trim()}\\steamapps\\common\\Wizard101`)
            }
            if (getItem('steamPath') === null) {
                setItem('steamPath', stdout.split('InstallPath')[1].split('REG_SZ')[1].trim())
            }
            window.wizPath = getItem('wizPath')
            window.gameDataPath = getItem('gameDataPath')
            //   console.log(window.wizPath)
            //   console.log(window.gameDataPath)
            //   console.log('============')  
            checkGameInstall((steam, wizard, err) => {
                // console.log(steam, wizard, err)
                if (steam) {
                    // Message.warning('检测到未安装Steam')
                    setItem('steamInstall', true)
                } else {
                    setItem('steamInstall', false)
                }
                if (wizard) {
                    setItem('wizInstall', true)
                    setPlay(true)
                } else {
                    setItem('wizInstall', false)
                }
            })
            callback()
        }, (error) => {
            //   console.log('没安装Steam')
            //   console.log(error)
            checkGameInstall((steam, wizard, err) => {
                // console.log('Steam:' + steam)
                // console.log('Wizard:' + wizard)
                // console.log('Error:' + err)
                if (steam) {
                    // Message.warning('检测到未安装Steam')
                    setItem('steamInstall', true)
                } else {
                    setItem('steamInstall', false)
                }
                if (wizard) {
                    setItem('wizInstall', true)
                    setPlay(true)
                } else {
                    setItem('wizInstall', false)
                }
            })
            callback()
        })
    }
    function createSocket(callback) {
        ws = new WebSocket(wsPath)
        ws.onopen = () => {
            // console.log('连接成功')   
            getMessage()
            setStatus('在线')
            callback && callback()
        }
        ws.onerror = () => {
            console.log('ws Error!!!')
            reconnet()
            setStatus('离线')
        }
        ws.onclose = () => {
            console.log('ws Closed!!!')
            reconnet()
            setStatus('离线')
        }

        // console.log(ws)
        ws.onmessage = (msg) => {
            // console.log(msg.data)
            let data = JSON.parse(msg.data)
            if (data?.id === getItem('userid')) {
                Message.success({
                    style: { top: '20px' },
                    content: '发布成功',
                    duration: 3000,
                    onClose: () => {
                        setTitle('')
                        setText('')
                    }
                })
                window.electronAPI.sound()
            } else if (data.type === 'del') {
                getMessage()
            } else if (data.type === 'count') {
                setOnline(data.onLineNum)
            }else if(data.type === 'onlineList'){
                // console.log(data.list)
            } else if (data?.id) {
                window.electronAPI.sound()
                Notification.info({
                    style,
                    content: data.title,
                    title: `您收到了一条来自${data.username || '神秘人'}的消息`
                })
                setCount(1)
            }
            getMessage()
        }

    }
    function reconnet(){ //重新连接websock函数
        if (socketError)
            return false
        socketError = true
        setTimeout(() => {
            createSocket(()=>{
                socketError = false
                setStatus('在线')
            })
        }, 5000)
    }
    function getData() {
        // apiPath.mainPage().then(res=>{
        //     if(res.status === 200){
        //         setActivity([...res.data.activity])
        //         setNews([...res.data.news])
        //         setLoading1(false)
        //     }
        // })
        apiPath.getNav().then(res => {
            // console.log(res)
            if (res.status === 200) {
                // console.log(res.data.messages)
                setNavs(res.data.messages)
                setLoading1(false)
            }
        })
    }
    function dark() {
        document.body.setAttribute('arco-theme', 'dark');
    }
    function destroy() {
        document.onmousedown = null
        document.onmousemove = null
        window.onresize = null

    }
    // function drag() {
    //     // box.addEventListener('mousedown', function(e){
    //     //     isDown_live2d = true // 正在移动
    //     //     position = [e.clientX, e.clientY]
    //     // })
    //     document.addEventListener('mousemove', function (ev) {
    //         if (isDown) {
    //             const x = ev.screenX - baseX
    //             const y = ev.screenY - baseY
    //             //   console.log(x, y)
    //             if (prveX !== x || prveY !== y) {
    //                 // console.log(x, y)
    //                 prveX = x
    //                 prveY = y
    //                 window.electronAPI.sendXY({
    //                     x, y
    //                 })
    //             }
    //         }
    //     })
    //     document.addEventListener('mouseup', () => {
    //         isDown = false
    //         // isDown_live2d = false
    //     })
    // }
    function getCarousel() {
        apiPath.getCurl().then(res => {
            // console.log(res.data.lunbo)
            setImgs([...res.data.lunbo])
            setLoading(false)
        })
    }
    function getMessage() {
        apiPath.getMessage().then(res => {
            // console.log(res.data.message)
            setMessage([...res.data.messages.reverse()])
            if (getItem('msgLength') && res.data.messages.length !== getItem('msgLength')) {
                setCount(1)
            }
            setItem('msgLength', res.data.messages.length)
        })
    }
    function install(type) {
        Notification.error({
            id: 'notInstall_bd',
            style,
            title: translation('Tips_1'),
            btn: (
                <span className='btn-bd'>
                    {installBtn_config.map(btn => {
                        return type ? type === btn.zhType && <Button
                            loading={btnLoading}
                            type={btn.type}
                            key={btn.zhType}
                            size={btn.size}
                            style={btn.style}
                            status={btn.status}
                            onClick={() => {
                                downLoad(btn.zhType)
                                setType(btn.zhType)
                                setItem('type', btn.zhType)
                            }}
                        >
                             {translation(btn.smTitle)}
                        </Button> : <Button
                            loading={btnLoading}
                            type={btn.type}
                            size={btn.size}
                            key={btn.zhType}
                            style={btn.style}
                            status={btn.status}
                            onClick={() => {
                                downLoad(btn.zhType)
                                setType(btn.zhType)
                                setItem('type', btn.zhType)
                            }}
                        >
                             {translation(btn.smTitle)}
                        </Button>
                    })}
                </span>
            ),
        })
    }
    function checkUpdate(show = true) {
        // console.log(obj[getItem('type')])
        Notification.remove('change_bd')
        // Notification.clear()
        // console.log(window.tools)
        window.tools.checkUpdate(getItem('type'), (num) => {
            // console.log('num----->', num)
            switch (num) {
                case 1:
                    // 有更新
                    upDate()
                    break;
                case 2:
                    // 没有需要的更新
                    if (show)
                        changeType(getItem('type'), (sign) => {
                            // console.log(sign)
                            if (!sign) {
                                if (show)
                                    install(getItem('type'))
                                return
                            }
                            window.electronAPI.sound()
                            Message.success({
                                style: { top: '20px' },
                                content: `${translation('Switch')}${obj[getItem('type')]}${translation('Success')}!`
                            })
                            window.electronAPI.changeType(getItem('type'))
                            setType(getItem('type'))
                            setBtnLoad(false)
                        })
                    break
                case 3:
                    // 未安装
                    console.log('未安装')
                    if (show)
                        install(getItem('type'))
                    window.electronAPI.winShow()
                    break
                default:
                    break;
            }
        }, (err) => {
            console.log(err)
        }, (err) => {
            console.log(err)
            Notification.error({
                style,
                id: 'notInstallWizard101',
                title: translation('Right_Tips_1'),
                content: <span>
                    <Button onClick={() => {
                        let fileSelect = document.getElementById('selectWiz')
                        fileSelect.click()
                    }}>{translation('Btn')}</Button>
                </span>
            })
            window.electronAPI.winShow()
        })
    }
    function upDate() {
        console.log(obj[getItem('type')])
        Notification.warning({
            title: `${translation('Checked')}${obj[getItem('type')]}${translation('Have')}！`,
            id: 'update',
            style,
            duration: 1000000000,
            // closable:false,
            btn: (
                <span>
                    {
                        getItem('type') === 'd' && <Button
                            loading={btnLoading}
                            type='primary'
                            size='small'
                            style={{ margin: '0 12px' }}
                            onClick={() => {
                                downLoad()
                            }}
                        >
                            {translation('Beta')}
                        </Button>
                    }
                    {
                        getItem('type') === 'r' && <Button
                            loading={btnLoading}
                            onClick={() => {
                                downLoad()
                            }}
                            type='primary'
                            size='small'
                        >
                            {translation('Stable')}
                        </Button>
                    }
                    {
                        getItem('type') === 'c' && <Button
                            loading={btnLoading}
                            onClick={() => {
                                downLoad()
                            }}
                            type='primary'
                            size='small'
                        >
                            {translation('Chat')}
                        </Button>
                    }
                </span>
            ),
        })
    }
    function downLoad(type) {
        setBtnLoad(true)
        Notification.clear()
        window.tools.downLoad(type || getItem('type'), (mark, version) => {
            if(version){
                Notification.warning({
                    id: 'download',
                    title: translation('Wait'),
                    content: mark, style, duration: 10000000
                })
            }else{
                Notification.error({
                    id: 'download',
                    title: translation('Tips_6'),
                    content: mark, style, duration: 3000
                })
                setBtnLoad(false)
            }

        }, (err) => {
            if (err) {
                Notification.error({
                    content: err,
                    style,
                    title: '请将本消息提供给<灭火器>'
                })
            }
        }, (num) => {
            console.log(num)
            if (num === 1) {
                setBtnLoad(false)
                setPercent(0)
                window.electronAPI.sound()
                Notification.success({
                    id: 'download',
                    style,
                    title: translation('FinishedInstall'),
                    content: translation('Please'),
                    duration: 2000
                })
            }
            if (num === 2) {
                window.electronAPI.sound()
                Notification.remove('download')
                Message.success({
                    style: { top: '20px' },
                    content: `${translation('Switch')}${obj[getItem('type')]}${translation('Success')}!`
                })
            }
        },(percent)=>{
            console.log('----->', percent)
            setPercent(percent)
        })
    }

    function changeBd() {
        Notification.info({
            title: '切换/更新',
            // closable:false,
            showIcon: false,
            duration: 100000,
            id: 'change_bd',
            style,
            btn: (
                <span className='btn-bd'>

                    {
                        installBtn_config.map(btn => {
                            return <Tooltip key={btn.zhType} style={{ zIndex: '999999' }} content={btn.tips}>
                                <Button
                                    // loading={btnLoading}  
                                    type={btn.type}
                                    size={btn.size}
                                    key={btn.zhType}
                                    status={btn.status}
                                    style={btn.style}
                                    onClick={() => {
                                        setItem('type', btn.zhType)
                                        // Notification.remove('change_success')
                                        setType(btn.zhType)
                                        checkUpdate(getItem('type'))
                                        
                                    }}
                                >
                                    {translation(btn.smTitle)}
                                </Button>
                            </Tooltip>
                        })
                    }
                </span>
            ),
        })
    }
    function getMain() {
        return document.getElementsByClassName('main')[0]
    }
    return <div className="main">
        {bgShow && <div className={`bottom-bg ${bgImg ? '' : `bottom-bg${imgNum >= 1 ? 1 : 0}`} animated fast fadeIn`}>
            {bgImg && <img alt='' src={bgImg} />}
        </div>}
        <div className='nav'>   
            <div className='nav-title' id='nav'>
                <div className='nav-logo'><img alt='' src={su} /></div>
                <div className='nav-title'>
                    Subata<span className='nav-title-version'>{`${window.appVersion}`}</span>
                    <div className='online-count'>
                        <span className='online'></span>
                        <span className='online-text'>{onlineNum}</span>
                    </div>
                </div>
            </div>

            <div className='nav-control'
                onMouseDown={(e) => {
                    e.stopPropagation()
                    // console.log(baseX, baseY)
                }}
            >
                <div className='control-btn set-btn' onClick={(e) => {
                    e.stopPropagation()
                    // 设置
                    setSetShow(true)
                }}>

                    <IconSettings style={{ fontSize: '20px' }} />
                </div>
                <Trigger
                    // popupVisible={popupVisible}
                    
                    popup={()=><TriggerSelect onClick={(type)=>{
                        // setPopupVisible(false)
                        window.electronAPI.changeSize(type)
                    }}/>}
                    trigger='hover'
                >
                    <div className='control-btn' 
                     onClick={()=>{
                        window.electronAPI.mini()
                    }}>
                        <IconMinus style={{ fontSize: '20px' }} />
                    </div>
                </Trigger>
                <div className='control-btn btn-danger' onClick={(e) => {
                    e.stopPropagation()
                    console.log(getItem('btnSetting2'))
                    if (getItem('btnSetting2')) {
                        window.electronAPI.winHide()
                    } else {
                        window.electronAPI.close()
                    }
                }}>
                    <IconClose style={{ fontSize: '20px' }} />
                </div>
            </div>
        </div>
        <div className='body'>
            <BodyMain
                // logo={logo}
                loading={loading}
                imgs={imgs}
                nav={nav}
                loading1={loading1}
                btnLoading={btnLoading}
                percent={percent}
                play={play}
                subataShow={subataShow}
                onlineNum={onlineNum}
            />
            <RightNav
                setZf={(type)=>{
                    setZf(type)
                }}
                changeBd={changeBd}
                install={install}
                setDrawer={setDrawer}
                drawer={drawer}
                btnLoading={btnLoading}
                count={count}
                opSet={()=>{
                    console.log('打开设置')
                    setSetShow(!settingShow)
                }}
            />
        </div>
        <Drawer
            visible={drawer}
            getPopupContainer={getMain}
            footer={(
                <span>
                    {<Button onClick={() => {
                        setMsgShow(true)
                    }}>发布通知</Button>}
                </span>
            )}
            onOk={() => {
                setDrawer(false);
            }}
            onCancel={() => {
                setDrawer(false);
            }}
            title="通知中心"
            escToExit
            width={350}
            closable={false}
            maskClosable
            style={{
                bottom: '0px',
                right: '70px'
            }}
            bodyStyle={{
                background: 'rgb(104 104 104)',
                padding: 0
            }}
        >
            <Collapse
                style={{ width: '100%' }}
            >
                {
                    <List
                        dataSource={message}
                        noDataElement={<></>}
                        render={(item, index) => item.del ? null : <List.Item key={index} onClick={() => {
                            setMsgShow1(true)
                            setTitle1(`${item.title} - ${item.time}`)
                            setText1(item.msg)
                        }}><span>{`${item.title}-${item.username || 'Subata'}`}{getItem('userid') === item.id && <Button type='text' onClick={(e) => {
                            e.preventDefault()
                            Notification.warning({
                                style,
                                id: 'delmessage',
                                title: '确定要删除这条通知吗?',
                                content: <><Button onClick={() => {
                                    apiPath.delMessage({ id: item.msgid }).then(res => {
                                        if (res.data.success) {
                                            Message.success({
                                                style: { top: '20px' },
                                                content: '删除成功'
                                            })
                                        }
                                        Notification.remove('delmessage')
                                        ws.send(JSON.stringify({ type: 'del' }))
                                    })
                                }}>确定</Button></>
                            })
                        }}>删除</Button>}</span></List.Item>}
                    />
                }
            </Collapse>
        </Drawer>
        <Modal
            title=''
            simple
            style={{ textAlign: 'center'}}
            visible={show}
            // getPopupContainer={getMain}
            closable={true}
            // mountOnEnter= {false}
            onCancel={() => {
                setZf('')
                setShow(false)
                if (zfType !== 'qq') {
                    Message.info({
                        content: '打赏将全部用于网站的维护，谢谢老板支持！',
                        style: { top: '20px' },
                        duration: 2000
                    })
                }
            }}
            children={[<img key={1} className='zf-img' src={img} alt='' />]}
            footer={null}
        />
        <Modal
            title='通知发布'
            style={{ textAlign: 'center' }}
            // mountOnEnter= {false}
            visible={msgShow}
            maskClosable={false}
            getPopupContainer={getMain}
            onCancel={() => {
                setMsgShow(false)
            }}
            children={<>
                <Input
                    placeholder='发布者'
                    type='text'
                    maxLength={15}
                    value={user}
                    onChange={(val) => {
                        setUser(val)
                        setItem('username', val)
                    }}
                />
                <Input
                    placeholder='标题'
                    type='text'
                    value={title}
                    maxLength={20}
                    onChange={(val) => {
                        setTitle(val)
                    }}
                />
                <Input.TextArea
                    placeholder='消息内容'
                    style={{
                        height: '300px'
                    }}
                    value={text}
                    onChange={(val) => {
                        setText(val)
                    }}
                />
                {
                    root !== 'wizard-subata-lsmhq' && <Input
                        placeholder='管理员口令'
                        type='text'
                        value={root}
                        onChange={(val) => {
                            setRoot(val)
                            if (val === 'wizard-subata-lsmhq') {
                                setItem('root', 'wizard-subata-lsmhq')
                            }
                        }}
                    />
                }
            </>}
            footer={(<span>
                {
                    root === 'wizard-subata-lsmhq' && <Button type='primary' status='success' onClick={() => {

                        let data = {
                            msg: text,
                            title: title,
                            id: getItem('userid'),
                            username: user,
                            msgid: Math.random()
                        }
                        if (text.length === 0) return
                        if (title.length === 0) return
                        if (user.length === 0) return
                        ws.send(JSON.stringify(data))
                        setMsgShow(false)
                    }}>发布</Button>
                }
            </span>)}
        />
        <Modal
            title={title1}
            style={{ textAlign: 'center' }}
            getPopupContainer={getMain}
            // mountOnEnter= {false}
            visible={msgShow1}
            maskClosable={true}
            onCancel={() => {
                setMsgShow1(false)
            }}
            children={<>
                <div style={{textAlign:'left'}} dangerouslySetInnerHTML={{__html:text1.replaceAll('\n','<br>')}}></div>
            </>}
            footer={null}
        />
        <Modal
            title={translation('Settings')}
            // style={{textAlign:'center'}}
            visible={settingShow}
            getPopupContainer={getMain}
            maskClosable={true}
            onCancel={() => {
                setSetShow(false)
            }}
            mountOnEnter={false}
            className="setting_container"
            children={<Setting
                setBg={setimgNum}
                setSubataShow={setSubataShow}
                setSetShow={setSetShow}
                // setLocal={setLocal}
                // satan={satan}
                // onSatanChange={(show)=>{
                //     setsatanBegin(show)
                // }}
                onBgChange={(imgs, imgNum) => {
                    setBgShow(false)
                    setBgImg(imgs[imgNum]?.url)
                    setTimeout(() => {
                        setBgShow(true)
                    }, 500);
                    setItem('lastBgImg', imgNum)
                    // setItem('lastBgImgType', imgs[imgNum]?.type)
                }}
                onImgsChange={(imgs, imgNum) => {
                    setBgShow(false)
                    setBgImg(imgs[imgNum]?.url)
                    // window.tools.writeFile(`${getItem('installPath')}\\dataCache`, imgs[imgNum]?.data,()=>{
                    //     console.log('缓存成功')
                    // },'')
                    setTimeout(() => {
                        setBgShow(true)
                    }, 100);
                    setItem('lastBgImg', imgNum)
                    // setItem('lastBgImgType', imgs[imgNum]?.type)
                }}
                // reload = {reload}
                filePath={filePath}
                onlineNum={onlineNum}
            />}
            footer={null}
        />
        <input id='selectWiz' directory="" nwdirectory="" type='file' accept='.exe' onChange={(e) => {
            // console.log(e.target.files[0].path)
            if (e.target.files[0].path.includes('Wizard101.exe')) {
                // console.log('---选择成功')
                let wizPath = e.target.files[0].path.split('Wizard101.exe')[0]
                let gameDataPath = e.target.files[0].path.split('Wizard101.exe')[0] + 'Data\\GameData\\'
                setItem('wizPath', wizPath)
                setItem('gameDataPath', gameDataPath)
                window.wizPath = wizPath
                window.gameDataPath = gameDataPath
                setFilePath(wizPath)
                getSteam(() => {
                    if (getItem('type')) {
                        checkUpdate(false)
                    }
                    setItem('wizInstall', true)
                    setPlay(true)
                })
            } else {
                Message.error({
                    content: '路径错误请重新选择 PS:请选择游戏目录下的Wizard101.exe',
                    style: {
                        top: '20px'
                    }
                })
            }
            e.target.value = ''
            // e.target.files = []
        }} style={{ opacity: 0, position: 'absolute', width: 0, height: 0, top: '1000px' }} />
        <audio src={finishAudio} id="audio"></audio>
    </div>
}

export default Main