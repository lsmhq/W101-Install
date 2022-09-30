import { useEffect, useState} from 'react';
import '../css/main.css'
import { IconClose, IconMinus } from '@arco-design/web-react/icon';
import Setting from './components/setting';
// import { alertText } from './util/dialog';
// let {alertTextLive2d} = window.electronAPI

let isDown = false;  // 鼠标状态
let baseX = 0,baseY = 0; //监听坐标
let prveX = 0, prveY = 0 // 上次XY
let useTimer = null 
let useTime = 0
function Main(){
    let [percent, setPercent] = useState(0) // 进度百分比
    let [version, setVersion] = useState('') // 版本号
    useEffect(() => {
        // 初始化地址
        // 拖拽
        drag()
        // 黑主题
        dark()
        // 获取安装目录
        setInterval(()=>{
            // console.log('检测更新')
            window.electronAPI.getUpdater((data)=>{
                // console.log('message---->',data)
                if(data.cmd==='downloadProgress'){
                    setPercent(parseInt(data.progressObj.percent))
                    // setTotal(data.progressObj.total)
                    // setCurrent(data.progressObj.transferred)
                    // alertTextLive2d('检测到有最新版本, 即将下载')
                }
            })
        }, 1000)
        // 获取version
        window.electronAPI.getVersion((version)=>{
            setVersion(version)
        })

        window.electronAPI.ready()
        return () => {
            // 注销
            destroy()
            // localStorage.setItem('msgLength', message.length)
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(()=>{
        if(percent === 100){
            // setBtnLoad(false)
            setPercent(0)
            // alertTextLive2d(`下载完成, 共用${useTime}秒`)
            // window.tools.changeType(localStorage.getItem('type'))
        }
        
        if(percent <= 3 && percent >= 1){
            // alertTextLive2d('开始更新！')
            clearInterval(useTimer)
            useTimer = setInterval(() => {
                useTime += 1
            }, 1000);
        }
        if(percent >= 25 && percent <= 30){
            // alertTextLive2d('已经下载四分之一啦！')
        }else if(percent >= 50 && percent <= 55){
            // alertTextLive2d('已经下载一半啦！')
        }else if(percent >= 90 && percent <= 95){
            // alertTextLive2d('就快结束啦~')
        }else{
            // alertTextLive2d(`已经下载 < ${percent}% >啦！`)
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
            <Setting/>
        </div>
    </div>    
}

export default Main