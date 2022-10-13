import { Button, Drawer, Grid, Message, Slider, Switch, Tabs, Tooltip } from '@arco-design/web-react'
import {  IconPlayArrow, IconPause, IconSkipNext, IconSound, IconMute } from '@arco-design/web-react/icon';
import { api } from '../../util/http';
import './audio.css'
import Icon from '../Icon'
import { useEffect, useState, useRef, useContext } from 'react';
import globalData from '../../context/context';
import { formatSeconds, formatSecondsV2 } from '../../util/util';
let { Row, Col } = Grid
let timer = null, index, oldIndex
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
            })
            setLyric([...lyricArr])
            setTime([...time])
            setWordActive([...new Array(time.length).fill(false)])
        }
    },[lyric])
    useEffect(()=>{
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
            
            audio.current.addEventListener('ended', ()=>{
                // console.log('end')
                changeSong()
            })
        }
    }, [audio])
    useEffect(()=>{
        if(drawer){
            document.getElementById(`word-${lyricTime[index]}`)?.scrollIntoView({
                behavior:'smooth', block:'center'
            })
            setBgShow(true)
        }
    },[drawer])
    useEffect(()=>{
        if(index !== oldIndex){
            if(`[${formatSecondsV2(current)}]` >= lyricTime[index]){
                let newWord = new Array(wordActive.length).fill(false)
                newWord[index] = true
                setWordActive([...newWord])
                document.getElementById(`word-${lyricTime[index]}`)?.scrollIntoView({
                    behavior:'smooth', block:'center'
                })
                oldIndex = index
            }
        }
        // console.log(current)
    },[current])
    function changeSong(){
        let index = Math.floor((Math.random() * globalObj.likeList.likeList.length));
        // 判断是否有版权
        api.checkMusic({
          id: globalObj.likeList.likeList[index]
        }).then(res=>{
            if(res.data.success === true && res.data.message === 'ok'){
                globalObj.current.setCurrentSong(globalObj.likeList.likeList[index])
                document.getElementById(`song${globalObj.likeList.likeList[index]}`)?.scrollIntoView(
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
                    style:{top:'10px'},
                    content:'暂无版权'
                })
            }
        })
    }
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
                        changeSong()
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
                  译:
                  <Switch title='翻译' size='small' checked={showFy} onChange={(val)=>{
                      setFyShow(val)
                      localStorage.setItem('showFy', val)
                    }}
                  />
             </div>
             <div className='audio-setting-item'>
                  音:
                  <Switch title='翻译' size='small' checked={showRom} onChange={(val)=>{
                      setRomShow(val)
                      localStorage.setItem('showRom', val)
                    }}
                  />
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
                background:'rgb(240, 240, 240)'
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
                                let cur = `[${formatSecondsV2(current)}]`
                                if(cur>=lyricTime[idx]){
                                    index = idx
                                }
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
                                }} id={`word-${lyricTime[idx]}`} className={`song-words ${ wordActive[idx]?'song-words-active':''}`} key={idx}>
                                    <Tooltip position='right' content={lyricTime[idx]?.split('[')[1].split(']')[0]}>
                                        {ly.old}
                                    </Tooltip>
                                    {showRom && ly.rm &&<><br/>{ly.rm}</> }
                                    {showFy && ly.fy &&<><br/>{ly.fy}</> }
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

export default Audio