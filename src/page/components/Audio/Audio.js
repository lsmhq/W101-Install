import { Button, Drawer, Grid, Message, Slider, Switch, Tabs, Tooltip } from '@arco-design/web-react'
import {  IconPlayArrow, IconPause, IconSkipNext, IconSound, IconMute } from '@arco-design/web-react/icon';
import { api } from '../../util/http';
import './audio.css'
import Icon from '../Icon'
import { useEffect, useState, useRef, useContext } from 'react';
import globalData from '../../context/context';
import { formatSeconds, formatSecondsV2 } from '../../util/util';
let { Row, Col } = Grid
let timer = null, index, oldIndex, word_timer
function Audio(props){
    let { src, song, lyric } = props
    let [paused, setPaused] = useState()
    let [current, setCurrent] = useState(0)  // 当前进度
    let [total, setTotal] = useState(0) // 总进度
    let [buffered, setBuffered] = useState(0) // 缓存进度
    let [drawer, setDrawer] = useState(false) // 歌曲详情
    let audio = useRef(null)  // audio
    let [lyric_audio, setLyric] = useState([]) // 歌词
    let [lyricTime, setTime] = useState([]) // 歌词时间
    let [wordActive, setWordActive] = useState([]) // 激活index
    let globalObj = useContext(globalData) // 上下文
    let [bgShow, setBgShow] = useState(false) // 背景
    let [showFy, setFyShow] = useState(JSON.parse(localStorage.getItem('showFy')) || false) // 翻译显示
    let [showRom, setRomShow] = useState(JSON.parse(localStorage.getItem('showRom')) || false) // 发音显示
    let [playType, setPlayType] = useState(localStorage.getItem('playType') * 1) // 0 单曲循环  1 随机  2 顺序  3 心动
    let [wordType, setWordType] = useState(localStorage.getItem('wordType') * 1) // 0 单曲循环  1 随机  2 顺序  3 心动
    let [activeIndex, setActive] = useState(0)
    // let [sounds, setSounds] = useState() // 音量
    useEffect(()=>{
        // console.log(lyric)
        if(lyric.lyric_old){
            let { lyric_old, lyric_fy, lyric_rm } = lyric
            let lyricArr = []
            let time = []
            let _lyric = lyric_old.replaceAll('\n', '<br/>').split('<br/>')
            let _lyric_fy = lyric_fy.replaceAll('\n', '<br/>').split('<br/>')
            let _lyric_rm = lyric_rm.replaceAll('\n', '<br/>').split('<br/>')
            _lyric.forEach((ly, idx)=>{
                let obj = {
                    old:ly.split(']')[1],
                }
                let fy = _lyric_fy.find(lyy=>lyy?.split(']')[0] === ly.split(']')[0])
                if(fy){
                    obj.fy = fy?.split(']')[1]
                }
                let rom = _lyric_rm.find(lyy=>lyy?.split(']')[0] === ly.split(']')[0])
                if(fy){
                    obj.rm = rom?.split(']')[1]
                }
                lyricArr.push(obj)
                time.push(ly.match(/\[(.+?)\]/g) && ly.match(/\[(.+?)\]/g).length > 0 && ly.match(/\[(.+?)\]/g)[0])
                time = time.filter(t=>t)
            })
            setLyric([...lyricArr])
            setTime([...time])
            setWordActive([...new Array(time.length).fill(false)])
        }
    },[lyric])
    useEffect(()=>{
        clearInterval(word_timer)
        word_timer = setInterval(() => {
            // console.log(lyricTime)
            
            let cur = `[${formatSecondsV2(audio.current.currentTime)}]`
            // console.log(lyricTime[lyricTime.length-1], cur, cur >= lyricTime[lyricTime.length-1])
            let firstIndex = lyricTime.findIndex(time => {
                return time >= cur
            })
            if(cur >= lyricTime[lyricTime.length-1]){
                index = lyricTime.length - 1
                setActive(index)
            }else{
                if(firstIndex !== -1){
                    index = firstIndex - 1
                    setActive(index)
                }
            }
        }, 50);
    },[lyricTime, audio.current])
    useEffect(()=>{
        if(activeIndex !== oldIndex){
            // console.log(`[${formatSecondsV2(current)}]` >= lyricTime[index])
            // console.log(`[${formatSecondsV2(current)}]`, lyricTime[index])
            if(`[${formatSecondsV2(audio.current?.currentTime)}]` >= lyricTime[activeIndex]){
                document.getElementById(`word-${lyricTime[activeIndex]}`)?.scrollIntoView({
                    behavior:'smooth', block:'center'
                })
                window.electronAPI.sendWord({
                    word:{val:lyric_audio[activeIndex], time:lyricTime[activeIndex]},
                    next:{val:lyric_audio[activeIndex+1], time:lyricTime[activeIndex+1]},
                    last:{val:lyric_audio[activeIndex-1 < 0 ? 0 : activeIndex-1], time:lyricTime[activeIndex-1 < 0 ? 0 : activeIndex-1]},
                    wordType
                })
                oldIndex = activeIndex
            }
        }
    },[activeIndex])
    useEffect(()=>{
        console.log('paused' ,audio.current.paused)
        if(audio.current){
            setPaused(audio.current.paused)
            audio.current.addEventListener('play', ()=>{
                audio.current.play()
                setPaused(audio.current.paused)
                setTotal(audio.current.duration)
                setBgShow(true)
            })
            audio.current.addEventListener('timeupdate',()=>{
                setCurrent(audio.current.currentTime)
            })
            audio.current.addEventListener('progress',(e)=>{
                let timeRages = audio.current.buffered;
                // 获取以缓存的时间
                let timeBuffered = timeRages.end(timeRages.length - 1);
                setBuffered(timeBuffered)
            })
        }
    }, [audio])
    useEffect(()=>{
        audio.current.onended = () => {
            console.log('end')
            changeSong({ playType, audio, globalObj, setPaused, setBgShow },()=>{
                changeSong({ playType, audio, globalObj, setPaused, setBgShow },()=>{
                    changeSong({ playType, audio, globalObj, setPaused, setBgShow })
                })
            })
        }
    },[globalObj, playType, audio])
    useEffect(()=>{
        if(playType === 3){
            api.heartbeatSongs({id: globalObj.current.getCurrentSong(), pid: globalObj.songListId.getSongListId()}).then(res=>{
                console.log(res.data)
                if(res.data.message === 'SUCCESS'){
                    let ids = res.data.data.map(val=>val.id)
                    globalObj.currentList.setCurrentList(ids)
                }
            })
        }
    },[playType])
    useEffect(()=>{
        if(drawer){
            document.getElementById(`word-${lyricTime[index]}`)?.scrollIntoView({
                behavior:'smooth', block:'center'
            })
            setBgShow(true)
        }
    },[drawer])
    useEffect(()=>{
        localStorage.setItem('wordType', wordType)
        localStorage.setItem('showFy', showFy)
        localStorage.setItem('showRom', showRom)
    },[wordType, showFy, showRom])

    return <div className='audio'>
        <div className='audio-controls'>
            <div className='audio-controls-item'>
                <img className={`audio-rotate-360`} style={{
                    animationPlayState:`${paused?'paused':'running'}`
                }} src={song?.al?.picUrl} alt="" onClick={()=>{
                    setDrawer(!drawer)
                }}/>
            </div>
            <div className='audio-controls-item'>
                <Icon
                    Child={<>
                        {paused || <IconPause className='audio-icon'/>}
                        {paused && <IconPlayArrow className='audio-icon'/>}
                    </>}
                    onClick={()=>{
                        // console.log(audio.current.paused)
                        if(audio.current?.paused){
                            audio.current.play()
                            setPaused(false)
                        }else{
                            audio.current.pause()
                            setPaused(true)
                        }
                    }}
                    // textStyle={{fontSize:'12px'}}
                    content=""
                />
            </div>
            <div className='audio-controls-item'>
                <Icon
                    Child={<IconSkipNext className='audio-icon'/>}
                    onClick={()=>{
                        changeSong({ playType, audio, globalObj, setPaused, setBgShow },()=>{
                            changeSong({ playType, audio, globalObj, setPaused, setBgShow },()=>{
                                changeSong({ playType, audio, globalObj, setPaused, setBgShow })
                            })
                        })
                    }}
                    // textStyle={{fontSize:'12px'}}
                    content=""
                />
            </div>
        </div>
        <div className='audio-progress'>
            <div className='audio-title'>
                 {song.name}-{song.ar?.map(ar=>ar.name).join(',')}
            </div>
            <div className='audio-total' onMouseDown={(e)=>{
                // console.log(e)
                e.stopPropagation()
            }}>
                <div style={{
                    width: `${(buffered / total) * 100}%`
                }} className='audio-getCurrent' onMouseDown={(e)=>{
                    // console.log(e)
                    e.stopPropagation()
                }}></div>
                <div style={{
                    width: `${(current / total) * 100}%`
                }} className='audio-current' onMouseDown={(e)=>{
                    // console.log(e)
                    e.stopPropagation()
                }}></div>
                <div style={{
                    left: current<=0?`${(current / total) * 100}%`:`${(current / total) * 100 - 1}%`
                }} className='audio-flag' onMouseDown={(e)=>{
                    // console.log(e)
                    e.stopPropagation()
                }}>
                    <span className='audio-flag-dot'></span>
                </div>
            </div>
            <div className='audio-time'>
                 {formatSeconds(current)}/{formatSeconds(total)}
            </div>
        </div>
        <div className='audio-setting'>
             <div className='audio-setting-item'>
                {wordType === 0 && <span onClick={()=>{
                    setWordType(1)
                    setRomShow(true)
                    setFyShow(false)
                }}>译</span>}
                {wordType === 1 && <span onClick={()=>{
                    setWordType(2)
                    setFyShow(true)
                    setRomShow(true)
                }}>音</span>}
                {wordType === 2 && <span onClick={()=>{
                    setWordType(0)
                    setFyShow(true)
                    setRomShow(false)
                }}>译+音</span>}
             </div>
             <div className='audio-setting-item'>
                    {playType === 0 && <i onClick={()=>{
                        setPlayType(1)
                    }} style={{fontSize:'20px', cursor:'pointer'}} className='iconfont icon-danqu animated fast fadeIn'></i>}
                    {playType === 1 && <i onClick={()=>{
                        setPlayType(2)
                    }} style={{fontSize:'20px', cursor:'pointer'}} className='iconfont icon-suiji animated fast fadeIn'></i>}
                    {playType === 2 && <i onClick={()=>{
                        setPlayType(3)
                    }} style={{fontSize:'20px', cursor:'pointer'}} className='iconfont icon-24gl-repeat2 animated fast fadeIn'></i>}
                    {playType === 3 && <i onClick={()=>{
                        setPlayType(0)
                    }} style={{fontSize:'20px', cursor:'pointer'}} className='iconfont icon-huaban animated fast fadeIn'></i>}
             </div>
        </div>
        <audio ref={audio} autoPlay src={src}/>
        <Drawer
            visible={drawer}
            title={null}
            style={{
                width:'100%',
                height:'82%',
                bottom:'12%',
                background:'rgba(40, 40, 40, 0.987)'
            }}
            mask={false}
            placement="bottom"
            onCancel={()=>{
                setDrawer(false)
            }}
            footer={null}
            children={<div className='audio-more' >
                {bgShow && <div className='audio-more-bg animated faster fadeIn' style={{backgroundImage:`url(${song?.al?.picUrl})`, borderRadius:'10px'}}></div>}
                <Row>
                    <Col className='audio-song-words' span={24}>
                        <div className='empty'></div>
                        {
                            lyric_audio.map((ly, idx)=>{
                                return <div onClick={()=>{
                                    // console.log(lyricTime[idx])
                                    // [01:07.996]
                                    let timee = lyricTime[idx]?.split('[')[1].split(']')[0]
                                    let cur = 0
                                    let min = timee.split(':')[0] * 60 
                                    let sec = timee.split(':')[1].split('.')[0] * 1
                                    let secc = timee.split(':')[1].split('.')[1] * 1
                                    cur += min + sec
                                    cur += '.'+secc
                                    // console.log(Number(cur))
                                    // console.log(formatSeconds(cur))
                                    setCurrent(Number(cur))
                                    audio.current.currentTime = Number(cur)
                                    audio.current.play()
                                }} id={`word-${lyricTime[idx]}`} className={`song-words ${ activeIndex === idx?'song-words-active':''}`} key={idx}>
                                    <Tooltip position='right' content={lyricTime[idx]?.split('[')[1].split(']')[0]}>
                                        {ly.old}
                                    </Tooltip>
                                    {showRom && ly.rm &&<><br/>{ly.rm || ' '}</> }
                                    {showFy && ly.fy &&<><br/>{ly.fy || ' '}</> }
                                </div>
                            })
                        }
                        <div className='empty'></div>
                    </Col>
                </Row>
                <Row>
                    {/* <Col>3</Col> */}
                </Row>
            </div>}
        />
    </div>
}

function changeSong(obj, callBack){
    // 0 单曲循环  1 随机  2 顺序  3 心动
    let { playType, audio, globalObj, setPaused, setBgShow } = obj
    console.log(playType)
    if(playType === 0){
        audio.current.currentTime = 0
        audio.current.play()
    }
    if(playType === 1){
        // console.log()
        if(globalObj.currentList.getCurrentList().length > 0){
            
            let songIndex = Math.floor((Math.random() * globalObj.currentList.getCurrentList().length));
            console.log(globalObj.currentList.getCurrentList()[songIndex], songIndex)
            // 判断是否有版权
            api.checkMusic({
              id: globalObj.currentList.getCurrentList()[songIndex]
            }).then(res=>{
                if(res.data.success === true && res.data.message === 'ok'){
                    globalObj.current.setCurrentSong(globalObj.currentList.getCurrentList()[songIndex])
                    globalObj.songIndex.setSongIndex(songIndex)
                    document.getElementById(`song${globalObj.currentList.getCurrentList()[songIndex]}`)?.scrollIntoView(
                        {
                            behavior: "smooth", 
                            block: "center", 
                            inline: "nearest"
                        }
                    )
                    // globalObj.song.setSong(globalObj.likeList.likeList[index])
                    setPaused(audio.current.paused)
                    setBgShow(false)
                }else{
                    Message.error({
                        style: {top:'10px'},
                        content: '暂无版权, 即将下一首',
                        duration: 1000,
                        onClose: callBack
                    })
                }
            })
        }
    }
    if(playType === 2 || playType === 3){
        console.log(globalObj.songIndex.getSongIndex())
        if(!globalObj.songIndex.getSongIndex()) globalObj.songIndex.setSongIndex(0)
        if(globalObj.songIndex.getSongIndex() === globalObj.currentList.getCurrentList().length - 1) globalObj.songIndex.setSongIndex(0)
        if(globalObj.songIndex.getSongIndex() !== undefined && globalObj.currentList.getCurrentList().length){
            let idx = globalObj.songIndex.getSongIndex()+1===globalObj.currentList.getCurrentList().length?0:globalObj.songIndex.getSongIndex()+1
            api.checkMusic({
                id: globalObj.currentList.getCurrentList()[idx]
              }).then(res=>{
                  if(res.data.success === true && res.data.message === 'ok'){
                      globalObj.current.setCurrentSong(globalObj.currentList.getCurrentList()[idx])
                      document.getElementById(`song${globalObj.currentList.getCurrentList()[idx]}`)?.scrollIntoView(
                          {
                              behavior: "smooth", 
                              block: "center", 
                              inline: "nearest"
                          }
                      )
                      // globalObj.song.setSong(globalObj.likeList.likeList[index])
                      setPaused(audio.current.paused)
                      setBgShow(false)
                    //   songIndex++
                      globalObj.songIndex.setSongIndex(idx)
                  }else{
                    //   songIndex++
                    let idx = globalObj.songIndex.getSongIndex()+1===globalObj.currentList.getCurrentList().length?0:globalObj.songIndex.getSongIndex()+1
                      globalObj.songIndex.setSongIndex(idx)
                      Message.error({
                          style: {top:'10px'},
                          content: '暂无版权',
                          duration: 1000,
                          onClose: callBack
                      })
                  }
            })
        }
    }
}
export default Audio