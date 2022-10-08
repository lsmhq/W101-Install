import { useEffect, useState} from 'react';
import '../css/main.css'
import { List, Button, Modal, Notification, Drawer, Collapse, Message, Input, Tooltip  } from '@arco-design/web-react';
import logo from '../image/WizardLogoRA.png'
import { IconClose, IconMinus, IconSettings } from '@arco-design/web-react/icon';
import su from '../image/Subata_logo.png'
import apiPath from './http/api'
import BodyMain from './components/body-main';
import Setting from './components/setting';
import LeftNav from './components/left-nav'
// import { alertText } from './util/dialog';
// let {alertTextLive2d} = window.electronAPI

let update = false

let style = {
    right:'50px',
    top:'20px'
}
Notification.config({
    maxCount:'5',
    duration:5000
})
let isDown = false;  // 鼠标状态
let baseX = 0,baseY = 0; //监听坐标
let prveX = 0, prveY = 0 // 上次XY
let useTimer = null
function Main(){
    let [loading, setLoading] = useState(true) // 轮播加载
    let [loading1, setLoading1] = useState(true) // List加载
    let [imgs, setImgs] = useState([]) // 轮播图片
    let [percent, setPercent] = useState(0) // 进度百分比
    // let [news, setNews] = useState([]) // 新闻
    // let [activity, setActivity] = useState([])  // 活动
    // let [msgHeight, setHeight] = useState('95%') // 弃用高度
    let [btnLoading, setBtnLoad] = useState(false) // 按钮加载
    let [current, setCurrent] = useState(0)  // 当前进度
    let [total, setTotal] = useState(0) // 总进度
    let [version, setVersion] = useState('') // 版本号
    let [settingShow, setSetShow] = useState(false)
    let [subataShow, setSubataShow] = useState(JSON.parse(localStorage.getItem('btnSetting1')) || true)
    let [imgNum, setimgNum] = useState(localStorage.getItem('imgNum')? localStorage.getItem('imgNum')*1:0)
    useEffect(() => {  
        // 获取轮播
        getCarousel()
        // 拖拽
        drag()
        // 窗口自适应
        resize()
        // 获取安装目录
        setInterval(()=>{
            // console.log('检测更新')
            window.electronAPI.getUpdater((data)=>{
                // console.log('message---->',data)
                if(data.cmd==='downloadProgress'){
                    update = true
                    setPercent(parseInt(data.progressObj.percent))
                    setTotal(data.progressObj.total)
                    setCurrent(data.progressObj.transferred)
                    Notification.warning({
                        title:'检测到有最新版本',
                        style,
                        id:'subata-up',
                        content:'正在进行下载，稍后进行更新'
                    })
                    // alertTextLive2d('检测到有最新版本')
                }
            })
        }, 1000)
        // dark()
        // 获取version
        window.electronAPI.getVersion((version)=>{
            setVersion(version)
        })

        window.electronAPI.ready()
        return () => {
            // 注销
            destroy()
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(()=>{
        if(percent === 100){
            setBtnLoad(false)
            setPercent(0)
            window.electronAPI.sound()
            if(!update){
                Notification.success({
                    id:'download',
                    style,
                    title:'安装完成!',
                    content:'请点击下方开始游戏进行体验!',
                    duration: 2000
                }) 
            }
            // window.tools.changeType(localStorage.getItem('type'))
        }
        
        if(percent <= 3 && percent >= 1){
            // alertTextLive2d('开始！')
            clearInterval(useTimer)
        }
        if(percent >= 25 && percent <= 30){
            // alertTextLive2d('已经下载四分之一了！')
        }
        if(percent >= 50 && percent <= 55){
            // alertTextLive2d('已经下载一半了！')
        }
        if(percent >= 90 && percent <= 95){
            // alertTextLive2d('就快结束辣~')
        }
        window.electronAPI.setProgressBar(percent/100)
    },[percent])

    function resize(){
        window.onresize = ()=>{
            // setHeight(window.screen.height - 40 + 'px')
        }
    }
    function dark(){
        document.body.setAttribute('arco-theme', 'dark');
    }
    function destroy(){
        document.onmousedown = null
        document.onmousemove = null
        window.onresize = null
    }
    function drag(){
        // box.addEventListener('mousedown', function(e){
        //     isDown_live2d = true // 正在移动
        //     position = [e.clientX, e.clientY]
        // })
        document.addEventListener('mousemove',function(ev){
            if(isDown){
              const x = ev.screenX - baseX
              const y = ev.screenY - baseY
            //   console.log(x, y)
              if(prveX !== x || prveY !== y){
                // console.log(x, y)
                prveX = x
                prveY = y
                window.electronAPI.sendXY({
                    x, y
                })
              }
            }
        })
        document.addEventListener('mouseup',()=>{
            isDown = false
        })
    }
    function getCarousel(){
        apiPath.getCurl().then(res=>{
            // console.log(res.data.lunbo)
            setImgs([...res.data.lunbo])
            setLoading(false)
        })
    }
    return <div className="main">
        <div className={`bottom-bg bottom-bg${imgNum}`}>
            <img alt='' src=''/>
        </div>
        <div className='nav' 
            onMouseDown={(e)=>{
                e.stopPropagation()
                isDown = true 
                baseX = e.clientX
                baseY = e.clientY
                // console.log(baseX, baseY)
            }}
        >
            <div className='nav-logo'><img alt='' src={su}/></div>
            <div className='nav-title'>网易云音乐{`V${version}`}</div>
            {/* <div className='nav-title'> {obj[type]}</div> */}
            <div className='nav-control'
                onMouseDown={(e)=>{
                    e.stopPropagation()
                    isDown = false
                    // console.log(baseX, baseY)
                }}
            >
                <div className='control-btn' onClick={(e)=>{
                    e.stopPropagation()
                    // 设置
                    setSetShow(true)
                }}>
                    
                    <IconSettings style={{fontSize:'20px'}}/>
                </div>
                <div className='control-btn' onClick={(e)=>{
                    e.stopPropagation()
                    window.electronAPI.mini()
                }}>
                    <IconMinus style={{fontSize:'20px'}}/>
                </div>
                <div className='control-btn btn-danger' onClick={(e)=>{
                    e.stopPropagation()
                    if(localStorage.getItem('btnSetting2') === 'true'){
                        window.electronAPI.winHide()
                    }else{
                        window.electronAPI.close()
                    }
                }}>
                    <IconClose style={{fontSize:'20px'}}/>
                </div>
            </div>
        </div>
        <div className='body'>
            <LeftNav/>
            <BodyMain
                logo={logo}
                loading={loading}
                imgs = {imgs}
                loading1 = {loading1}
                btnLoading = {btnLoading}
                percent={percent}
                current={current}
                total = {total}
                subataShow={subataShow}
            />
            
        </div>

        <Modal
            title={'设置'}
            // style={{textAlign:'center'}}
            visible={settingShow}
            maskClosable={false}
            onCancel={()=>{
                setSetShow(false)
            }}
            style={{
                maxHeight:'550px',
                minHeight:'550px',
                width:'700px',
                backgroundColor: 'rgb(237, 237, 237)'
            }}
            children={<Setting
                setBg={setimgNum}
                setSubataShow = {setSubataShow}
            />}
            footer={null}
        />
    </div>    
}

export default Main