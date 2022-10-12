import { Button, Drawer, Grid, Tabs, Tooltip } from '@arco-design/web-react'
import {  IconPlayArrow, IconPause, IconSkipNext } from '@arco-design/web-react/icon';
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
    let audio = useRef(null)
    let [lyric_audio, setLyric] = useState([])
    let [lyricTime, setTime] = useState([])
    let [wordActive, setWordActive] = useState([])
    let globalObj = useContext(globalData)
    useEffect(()=>{
        console.log(lyric)
        if(lyric.lyric_old){
            let { lyric_old, lyric_fy } = lyric
            let lyricArr = []
            let time = []
            let _lyric = lyric_old.replaceAll('\n', '<br/>').split('<br/>')
            let _lyric_fy = lyric_fy.replaceAll('\n', '<br/>').split('<br/>')
            _lyric.forEach((ly, idx)=>{

                lyricArr.push({
                    old:ly.split(']')[1],
                    fy:_lyric_fy[idx]?.split(']')[1]
                })
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
                clearInterval(timer)
                timer = setInterval(()=>{
                    let timeRages = audio.current.buffered;
                    // 获取以缓存的时间
                    let timeBuffered = timeRages.end(timeRages.length - 1);
                    setBuffered(timeBuffered)
                }, 500)
            })
            audio.current.addEventListener('timeupdate',()=>{
                setCurrent(audio.current.currentTime)
            })
            audio.current.addEventListener('ended', ()=>{
                // console.log('end')
                clearInterval(timer)
                let index = Math.floor((Math.random() * globalObj.likeList.likeList.length));
                globalObj.current.setCurrentSong(globalObj.likeList.likeList[index])
                document.getElementById(`song${globalObj.likeList.likeList[index]}`).scrollIntoView(
                    {
                        behavior: "smooth", 
                        block: "center", 
                        inline: "nearest"
                    }
                )
                // globalObj.song.setSong(globalObj.likeList.likeList[index])
                setPaused(audio.current.paused)
            })
        }
    }, [audio])
    useEffect(()=>{
        if(drawer){
            document.getElementById(`word-${lyricTime[index]}`)?.scrollIntoView({
                behavior:'smooth', block:'center'
            })
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
                        let index = Math.floor((Math.random() * globalObj.likeList.likeList.length));
                        globalObj.current.setCurrentSong(globalObj.likeList.likeList[index])
                        document.getElementById(`song${globalObj.likeList.likeList[index]}`).scrollIntoView(
                            {
                                behavior: "smooth", 
                                block: "center", 
                                inline: "nearest"
                            }
                        )
                        // globalObj.song.setSong(globalObj.likeList.likeList[index])
                        setPaused(audio.current.paused)
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
                console.log(e)
                e.stopPropagation()
            }}>
                <div style={{
                    width: `${(buffered / total) * 100}%`
                }} className='audio-getCurrent' onMouseDown={(e)=>{
                    console.log(e)
                    e.stopPropagation()
                }}></div>
                <div style={{
                    width: `${(current / total) * 100}%`
                }} className='audio-current' onMouseDown={(e)=>{
                    console.log(e)
                    e.stopPropagation()
                }}></div>
                <div style={{
                    left: current<=0?`${(current / total) * 100}%`:`${(current / total) * 100 - 1}%`
                }} className='audio-flag' onMouseDown={(e)=>{
                    console.log(e)
                    e.stopPropagation()
                }}>
                    <span className='audio-flag-dot'></span>
                </div>
                <div className='audio-time'>
                 {formatSeconds(current)}/{formatSeconds(total)}
                </div>
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
            children={<div className='audio-more'>
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
                                        {/* <br/> */}
                                        {/* {ly.fy} */}
                                    </Tooltip>
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