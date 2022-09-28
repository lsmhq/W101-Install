import { useEffect, useState} from 'react';
import '../css/main.css'
import { Button, Notification } from '@arco-design/web-react';
import { IconClose, IconMinus, IconTool } from '@arco-design/web-react/icon';
import zfb from '../image/zfb.jpg'
import wechat from '../image/wechat.jpg'
import QQ from '../image/QQ_share.jpg'
import su from '../image/Subata_logo.png'
import Setting from './components/setting';
// import { alertText } from './util/dialog';
let {alertTextLive2d} = window.electronAPI
Notification.config({
    maxCount:'5',
    duration:5000
})

let imgMap = {
    qq:QQ,
    wx:wechat,
    zf:zfb
}
let isDown = false;  // 鼠标状态
let baseX = 0,baseY = 0; //监听坐标
let prveX = 0, prveY = 0 // 上次XY
let useTimer = null, useTime = 0
function Main(){
    let [show, setShow] = useState(false) // ModalShow
    let [zfType, setZf] = useState('') // zf类型
    let [img, setImg] = useState('')  // zf图片
    let [percent, setPercent] = useState(0) // 进度百分比
    let [drawer, setDrawer] = useState(false) // 通知显隐
    let [count, setCount] = useState(0)  // 通知条数
    let [btnLoading, setBtnLoad] = useState(false) // 按钮加载
    let [message, setMessage] = useState([]) // 通知
    let [version, setVersion] = useState('') // 版本号
    let [settingShow, setSetShow] = useState(false)
    let [subataShow, setSubataShow] = useState(JSON.parse(localStorage.getItem('btnSetting1')) || true)
    let [imgNum, setimgNum] = useState(localStorage.getItem('imgNum')? localStorage.getItem('imgNum')*1:0)
    useEffect(() => {
        // 初始化地址
        // 拖拽
        drag()
        // 黑主题
        dark()
        // 获取安装目录
        // setInterval(()=>{
        //     // console.log('检测更新')
        //     window.electronAPI.getUpdater((data)=>{
        //         // console.log('message---->',data)
        //         if(data.cmd==='downloadProgress'){
        //             update = true
        //             setPercent(parseInt(data.progressObj.percent))
        //             setTotal(data.progressObj.total)
        //             setCurrent(data.progressObj.transferred)
        //             Notification.warning({
        //                 title:'检测到有最新版本',
        //                 style,
        //                 id:'subata-up',
        //                 content:'正在进行下载，稍后进行更新'
        //             })
        //             alertTextLive2d('检测到有最新版本')
        //         }
        //     })
        // }, 1000)
        // 获取version
        window.electronAPI.getVersion((version)=>{
            setVersion(version)
        })

        window.electronAPI.ready()
        return () => {
            // 注销
            destroy()
            localStorage.setItem('msgLength', message.length)
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    useEffect(()=>{
        setImg(imgMap[zfType])
    },[zfType])
    useEffect(()=>{
        if(img)
            setShow(true)
    },[img])
    useEffect(()=>{

    },[settingShow])
    useEffect(()=>{
        setCount(0)
    },[drawer])
    useEffect(()=>{
        if(percent === 100){
            setBtnLoad(false)
            setPercent(0)
            // window.tools.changeType(localStorage.getItem('type'))
        }
        
        if(percent <= 3 && percent >= 1){
            alertTextLive2d('开始！')
            clearInterval(useTimer)
            useTimer = setInterval(() => {
                useTime+=1
            }, 1000);
        }
        if(percent >= 25 && percent <= 30){
            alertTextLive2d('已经下载四分之一了！')
        }
        if(percent >= 50 && percent <= 55){
            alertTextLive2d('已经下载一半了！')
        }
        if(percent >= 90 && percent <= 95){
            alertTextLive2d('就快结束辣~')
        }
    },[percent])

    function dark(){
        document.body.setAttribute('arco-theme', 'dark');
    }
    function destroy(){
        document.onmousedown = null
        document.onmousemove = null
        window.onresize = null
    }
    function drag(){
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
            <div className='nav-title'>Live2d - {`v${version}`}</div>
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
                    window.electronAPI.mini()
                }}>
                    <IconMinus style={{fontSize:'20px'}}/>
                </div>
                <div className='control-btn btn-danger' onClick={(e)=>{
                    e.stopPropagation()
                    window.electronAPI.close()
                }}>
                    <IconClose style={{fontSize:'20px'}}/>
                </div>
            </div>
        </div>
        <div className='body'>
            <Setting
                setBg={setimgNum}
                setSubataShow = {setSubataShow}
            />
        </div>
    </div>    
}

export default Main