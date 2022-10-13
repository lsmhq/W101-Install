import { useEffect, useState, createContext, useRef} from 'react';
import '../css/main.css'
import { List, Button, Modal, Notification, Drawer, Collapse, Message, Input, Tooltip  } from '@arco-design/web-react';
import logo from '../image/favicon.ico'
import { IconClose, IconMinus, IconSettings, IconUser } from '@arco-design/web-react/icon';
import BodyMain from './components/body-main';
import Setting from './components/setting';
import LeftNav from './components/left-nav'
import { HashRouter } from 'react-router-dom'
import globalData from './context/context';
import { api } from './util/http';
import SearchBar from './components/SearchBar/SearchBar';
import Audio from './components/Audio/Audio';

// import { alertText } from './util/dialog';
// let {alertTextLive2d} = window.electronAPI

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
let currentSongIndex = 0
function Main(props){
    let {login} = props
    let [percent, setPercent] = useState(0) // 进度百分比
    // let [news, setNews] = useState([]) // 新闻
    // let [activity, setActivity] = useState([])  // 活动
    // let [msgHeight, setHeight] = useState('95%') // 弃用高度
    let [current, setCurrent] = useState(0)  // 当前进度
    let [total, setTotal] = useState(0) // 总进度
    let [settingShow, setSetShow] = useState(false)
    let [currentSong, setCurrentSong] = useState() // 当前播放
    let [likeList, setLikeList] = useState([]) // 喜欢列表
    let [currentList, setCurrentList] = useState([]) // 喜欢列表
    let [songUrl, setSongUrl] = useState('')
    let [song, setSong] = useState({})
    let [lyric, setLyric] = useState('')
    let [lyric_fy, setLyric_fy] = useState('')
    let [lyric_rm, setLyric_rm] = useState('')
    let [keyword, setKeyWord] = useState('')
    let [user, setUser] = useState(JSON.parse(sessionStorage.getItem('userInfo')))
    let value = {
        current:{
            currentSong, setCurrentSong
        },
        currentSongIndex,
        currentList:{
            currentList, setCurrentList
        },
        likeList:{
            likeList, setLikeList
        },
        progress:{
            current, 
            setCurrent, 
            total, 
            setTotal
        },
        song:{
            song, setSong
        },
        keyword:{
            keyword, setKeyWord
        },
        user:{
            user, setUser
        }
    }
    useEffect(() => {  
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

        window.electronAPI.ready()
        if(localStorage.getItem('songId')){
            setCurrentSong(localStorage.getItem('songId'))
        }
        return () => {
            // 注销
            destroy()
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    useEffect(() => {
        if(currentSong){
            api.getSongs({ids:currentSong}).then(res=>{
                // console.log(res.data)
                localStorage.setItem('songId', currentSong)
                if(res.data.code === 200){
                    setSong(res.data.songs[0])
                    api.getSongsUrl({id:currentSong}).then(res=>{
                        // console.log(res.data)
                        if(res.data.code === 200){
                            setSongUrl(res.data.data[0].url)
                            setTotal(res.data.data[0].time)
                        }
                    })
                    api.getLyric({id:currentSong}).then(res=>{
                        // console.log(res.data)
                        if(res.data.code === 200){
                            setLyric(res.data.lrc.lyric)
                            setLyric_fy(res.data.tlyric.lyric)
                            setLyric_rm(res.data.romalrc.lyric)
                        }
                    })
                }
            })
        }
    }, [currentSong])
    useEffect(()=>{
        console.log(song)
    },[song])

    function resize(){
        window.onresize = ()=>{
            // setHeight(window.screen.height - 40 + 'px')
        }
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
    return <div className="main">
        <globalData.Provider value={value}>
        <div className='nav' 
            onMouseDown={(e)=>{
                e.stopPropagation()
                isDown = true 
                baseX = e.clientX
                baseY = e.clientY
                // console.log(baseX, baseY)
            }}
        >
            <div className='nav-logo'><img alt='' src={logo}/></div>
            <div className='nav-title'>网易云音乐</div>
            
            {/* <div className='nav-title'> {obj[type]}</div> */}

            <div className='nav-control'
                onMouseDown={(e)=>{
                    e.stopPropagation()
                    isDown = false
                    // console.log(baseX, baseY)
                }}
            >
                <SearchBar/>
                <div className='control-btn' onClick={(e)=>{
                    e.stopPropagation()
                    // 个人
                    login(true)
                }}>
                    
                    <IconUser style={{fontSize:'20px'}}/>
                </div>
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
                <HashRouter>
                    <LeftNav/>
                    <BodyMain/>
                </HashRouter>
            </div>
            <div className='footer'>
                <Audio 
                    src={songUrl} 
                    song={song}
                    lyric={{
                        lyric_old: lyric,
                        lyric_fy,
                        lyric_rm
                    }}
                />
            </div>
        </globalData.Provider>
        <Modal
            title={'设置'}
            // style={{textAlign:'center'}}
            visible={settingShow}
            maskClosable={false}
            onCancel={()=>{
                setSetShow(false)
            }}
            style={{
                maxHeight:'450px',
                minHeight:'450px',
                width:'450px',
                backgroundColor: 'rgb(237, 237, 237)'
            }}
            children={<Setting/>}
            footer={null}
        />
    </div>    
}

export default Main