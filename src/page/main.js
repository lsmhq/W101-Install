import { useEffect, useState } from 'react';
import '../css/main.css'
import {IconClose, IconMinus, IconSettings} from '@arco-design/web-react/icon'
import { List, Button, Modal, Notification, Drawer, Collapse, Message, Input, Tooltip } from '@arco-design/web-react';
import logo from '../image/WizardLogoRA.png'
import QQ from '../image/QQ_share.jpg'
import apiPath from './http/api'
import RightNav from './components/right-nav';
import BodyMain from './components/body-main';
import Setting from './components/setting';
import su from '../image/Subata_logo.png'
import LocalStorage_subata from './util/localStroage';
import { Snow, Tree } from './components/tree';
import { installBtn_config } from './config/config.page';
let { getItem, setItem } = new LocalStorage_subata({
    filter: ['wizInstall', 'installPath', 'steamInstall', 'wizPath', 'gameDataPath']
})
// let wsPath = 'ws://localhost:8000'
let wsPath = 'ws://101.43.174.221:8000'
let update = false
let timerr
let style = {
    right: '50px',
    top: '0px'
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
let isDown = false;  // 鼠标状态
// let isDown_live2d = false
let baseX = 0, baseY = 0; //监听坐标
let prveX = 0, prveY = 0 // 上次XY
let useTimer = null
let satanTimer = false, satanTimerStart
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
    let [current, setCurrent] = useState(0)  // 当前进度
    let [total, setTotal] = useState(0) // 总进度
    let [msgShow, setMsgShow] = useState(false) // 消息
    let [text, setText] = useState('')  // 内容
    let [title, setTitle] = useState('')  // 标题
    let [user, setUser] = useState(getItem('username')) // 用户名
    let [msgShow1, setMsgShow1] = useState(false)  // 反显
    let [text1, setText1] = useState('')  // 反显 
    let [title1, setTitle1] = useState('')// 反显
    let [user1, setUser1] = useState('')// 反显
    let [message, setMessage] = useState([]) // 通知
    let [type, setType] = useState(getItem('type')) // 汉化type
    let [root, setRoot] = useState(getItem('root') || '') // 是否可以进行发布通知
    let [play, setPlay] = useState(getItem('wizInstall')) // 是否可以开始游戏
    let [nav, setNavs] = useState({})
    let [settingShow, setSetShow] = useState(false) // 设置弹窗显隐
    let [subataShow, setSubataShow] = useState(getItem('btnSetting1') === null ? true : getItem('btnSetting1')) // subata按钮显隐
    let [imgNum, setimgNum] = useState(getItem('imgNum') ? getItem('imgNum') * 1 : 0) // 背景图index
    let [filePath, setFilePath] = useState(getItem('wizInstall')) // wiz安装路径
    let [onlineNum, setOnline] = useState(0) // 在线人数
    let [bgImg, setBgImg] = useState('') // 背景图blobUrl
    let [bgShow, setBgShow] = useState(true) // 背景图显隐
    let [satan, setSatan] = useState(false) // 显示圣诞树和雪花开关
    let [satanBegin, setsatanBegin] = useState(false) // 显示圣诞树和雪花
    let [status, setStatus] = useState('')
    useEffect(() => {
        // 初始化地址
        getSteam(() => {
            // 检查补丁更新
            if (getItem('type')) {
                checkUpdate(false)
            }
        })
        // 获取软件
        // window.tools.getSoftWares()
        // 获取轮播
        getCarousel()
        // 拖拽
        drag()
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
        // 获取安装目录
        // setInterval(()=>{
        // console.log('检测更新')
        // getIpLocaltion(getPublicIP()).then(address=>{
        //     console.log(address)
        //     // console.log(address.country)
        // })
        // }, 1000)
        // 获取version
        // window.electronAPI.getVersion((version) => {
        //     // setVersion(version)
        // })
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
        // 壁纸
        // window.tools.readFile(`${getItem('installPath')}\\dataCache`,(data)=>{
        //     console.log('img---->',data)
        //     let bufferArr = new Int8Array(data)
        //     let blob = new Blob([bufferArr],{ type : `application/${getItem('lastBgImgType')}`})
        //     console.log(blob)
        //     let url = URL.createObjectURL(blob)
        //     setBgImg(url)
        // },'')
        if (satanTimer) clearInterval(satanTimer)
        satanTimer = setInterval(() => {
            let targetMonth = 12 // 12月
            let targetDay = [24, 25] // 24 25号
            let date = new Date()
            let month = date.getMonth() + 1
            let day = date.getDate()
            let hour = date.getHours()  
            // console.log(month, day)
            if (month === targetMonth && day === targetDay[0] && hour > 18) {
                setSatan(true)
                return
            }
            if (month === targetMonth && day === targetDay[1]) {
                setSatan(true)
                return
            }
        }, 10000);
        return () => {
            // 注销
            destroy()
            setItem('msgLength', message.length)
            clearInterval(satanTimer)
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    useEffect(()=>{
        if(satan){
            clearInterval(satanTimer)
            if(satanTimerStart) clearInterval(satanTimerStart)
            satanTimerStart = setInterval(() => {
                let targetMonth = 12 // 12月
                let targetDay = [24, 25] // 26号
                let date = new Date()
                let month = date.getMonth() + 1
                let day = date.getDate()
                // let hour = date.getHours()
                if (month !== targetMonth || !targetDay.includes(day)) {
                    setSatan(false)
                    setsatanBegin(false)
                }
            }, 10000);
        }
    },[satan])
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
        document.title = ` V ${window.appVersion} / 在线人数 · ${onlineNum} / 状态 · ${status}`
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
    function createSocket() {
        ws = new WebSocket(wsPath)
        ws.onopen = () => {
            // console.log('连接成功')   
            getMessage()
            setStatus('在线')
        }
        ws.onerror = () => {
            reconnet()
            setStatus('离线')
        }
        ws.onclose = () => {
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
            } else if (data.type === 'del') {
                getMessage()
            } else if (data.type === 'count') {
                setOnline(data.onLineNum)
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
        let reconnet = () => { //重新连接websock函数
            if (socketError)
                return false
            socketError = true
            setTimeout(() => {
                ws = new WebSocket(wsPath)
                socketError = false
            }, 2000)
        }
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
    function drag() {
        // box.addEventListener('mousedown', function(e){
        //     isDown_live2d = true // 正在移动
        //     position = [e.clientX, e.clientY]
        // })
        document.addEventListener('mousemove', function (ev) {
            if (isDown) {
                const x = ev.screenX - baseX
                const y = ev.screenY - baseY
                //   console.log(x, y)
                if (prveX !== x || prveY !== y) {
                    // console.log(x, y)
                    prveX = x
                    prveY = y
                    window.electronAPI.sendXY({
                        x, y
                    })
                }
            }
        })
        document.addEventListener('mouseup', () => {
            isDown = false
            // isDown_live2d = false
        })
    }
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
            title: '检测到未安装汉化补丁',
            btn: (
                <span style={{ display: 'flex', flexDirection: 'column' }}>
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
                            {btn.title}
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
                            {btn.title}
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
            console.log('num----->', num)
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
                                content: `切换${obj[getItem('type')]}成功!`
                            })
                            window.electronAPI.changeType(getItem('type'))
                            setType(getItem('type'))
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
                title: '未检测到Wizard101, 可能是官服或自定义Steam安装路径',
                content: <span>
                    <Button onClick={() => {
                        let fileSelect = document.getElementById('selectWiz')
                        fileSelect.click()
                    }}>手动选择游戏路径</Button>
                </span>
            })
            window.electronAPI.winShow()
        })
    }
    function upDate() {
        console.log(obj[getItem('type')])
        Notification.warning({
            title: `检测到${obj[getItem('type')]}有最新的补丁！`,
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
                            测试版更新
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
                            稳定版更新
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
                            聊天纯享更新
                        </Button>
                    }
                </span>
            ),
        })
    }
    function downLoad(type) {
        setBtnLoad(true)
        Notification.clear()
        window.tools.downLoad(type || getItem('type'), (mark) => {

            Notification.warning({
                id: 'download',
                title: '请耐心等待下载...',
                content: mark, style, duration: 10000000
            })
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
                    title: '安装完成!',
                    content: '请点击下方开始游戏进行体验!',
                    duration: 2000
                })
            }
            if (num === 2) {
                window.electronAPI.sound()
                Notification.remove('download')
                Message.success({
                    style: { top: '20px' },
                    content: `切换${obj[getItem('type')]}成功!`
                })
            }
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
                <span style={{ display: 'flex' }}>

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
                                    disabled={type === btn.zhType}
                                    onClick={() => {
                                        if (btn.zhType === 'd') {
                                            Notification.warning({
                                                title: '提示:测试版为全面汉化版本',
                                                style,
                                                duration: 100000,
                                                id: 'change_bd',
                                                content: <span>
                                                    <Button onClick={() => {
                                                        setItem('type', 'd')
                                                        setType('d')
                                                        // Notification.remove('change_success')
                                                        checkUpdate(getItem('type'))
                                                    }} type='primary' status='warning' size='small' style={{ margin: '0 12px 0 0' }}>
                                                        继续
                                                    </Button>
                                                    <Button onClick={() => {
                                                        changeBd()
                                                    }} type='primary' status='success' size='small' style={{ margin: '0 12px 0 0' }}>
                                                        返回
                                                    </Button>
                                                </span>
                                            })
                                        } else {
                                            setItem('type', btn.zhType)
                                            // Notification.remove('change_success')
                                            setType(btn.zhType)
                                            checkUpdate(getItem('type'))
                                        }
                                    }}
                                >
                                    {btn.smTitle}
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
        {/* {showBg && <div className={`bottom-bg bottom-bg${imgNum} animated faster FadeIn`}>
            <img alt='' src={bgImg}/>
        </div>} */}
        {/* <div className='nav'
            onMouseDown={(e) => {
                e.stopPropagation()
                isDown = true
                baseX = e.clientX
                baseY = e.clientY
                // console.log(baseX, baseY)
            }}
        >
            <div className='nav-logo'><img alt='' src={su} /></div>
            <div className='nav-title'>
                Subata{`${window.appVersion}`}
                <div className='online-count'>
                    <span className='online'></span>
                    <span className='online-text'>{onlineNum}</span>
                </div>
            </div>
            <div className='nav-control'
                onMouseDown={(e) => {
                    e.stopPropagation()
                    isDown = false
                    // console.log(baseX, baseY)
                }}
            >
                <div className='control-btn' onClick={(e) => {
                    e.stopPropagation()
                    // 设置
                    setSetShow(true)
                }}>

                    <IconSettings style={{ fontSize: '20px' }} />
                </div>
                <div className='control-btn' onClick={(e) => {
                    e.stopPropagation()
                    window.electronAPI.mini()
                }}>
                    <IconMinus style={{ fontSize: '20px' }} />
                </div>
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
        </div> */}
        <div className='body'>
            <BodyMain
                logo={logo}
                loading={loading}
                imgs={imgs}
                nav={nav}
                loading1={loading1}
                btnLoading={btnLoading}
                percent={percent}
                current={current}
                total={total}
                play={play}
                subataShow={subataShow}
                onlineNum={onlineNum}
            />
            <RightNav
                onMouseDown={(init) => {
                    let { down, X, Y } = init
                    isDown = down
                    baseX = X
                    baseY = Y
                }}
                setZf={setZf}
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
                            setTitle1(item.title)
                            setUser1(item.username)
                            setText1(item.msg)
                        }}><span><Tooltip position='bl' content={item.time.split(' ')[0]}>{`${item.title}-${item.username || 'Subata'}`}</Tooltip> {getItem('userid') === item.id && <Button type='text' onClick={(e) => {
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
            style={{ textAlign: 'center' }}
            visible={show}
            getPopupContainer={getMain}
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
            visible={msgShow1}
            maskClosable={true}
            onCancel={() => {
                setMsgShow1(false)
            }}
            children={<>
                <Input
                    placeholder='发布者'
                    type='text'
                    maxLength={15}
                    readOnly
                    value={user1}
                    autoFocus={false}
                />
                <Input
                    placeholder='标题'
                    type='text'
                    value={title1}
                    readOnly
                    autoFocus={false}
                    // maxLength={20}
                    onChange={(val) => {
                        setTitle1(val)
                    }}
                />
                <Input.TextArea
                    placeholder='消息内容'
                    style={{
                        height: '300px'
                    }}
                    readOnly
                    autoFocus={false}
                    value={text1}
                    onChange={(val) => {
                        setText1(val)
                    }}
                />
            </>}
            footer={null}
        />
        <Modal
            title={'设置'}
            // style={{textAlign:'center'}}
            visible={settingShow}
            getPopupContainer={getMain}
            maskClosable={true}
            onCancel={() => {
                setSetShow(false)
            }}
            mountOnEnter={false}

            style={{
                maxHeight: '600px',
                minHeight: '600px',
                width: '700px',
            }}
            children={<Setting
                setBg={setimgNum}
                setSubataShow={setSubataShow}
                setSetShow={setSetShow}
                // setLocal={setLocal}
                satan={satan}
                onSatanChange={(show)=>{
                    setsatanBegin(show)
                }}
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
        <Snow show={satanBegin}/>
        <Tree show={satanBegin}/>
    </div>
}

export default Main