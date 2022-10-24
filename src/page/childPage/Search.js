import { List, Tabs } from "@arco-design/web-react";
import { useEffect, useState, useContext, useCallback } from "react";
import { api } from "../util/http";
import MusicBox from '../components/Music/music'
import globalData from "../context/context";
import Albums from "../components/albumsBox/album";
import MvBox from "../components/MvBox/mvBox";
let lastHeight = 0
// let isSroll = false, timerSroll
function Search(){
    // 默认为 1 即单曲 , 取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合, 2000:声音(搜索声音返回字段格式会不一样)
    let [type, setType] = useState('1')
    let [keywords, setKeyWord] = useState('')
    let [songs, setSongs] = useState([])
    let [loading, setLoading] = useState(false)
    let [offset, setOffset] = useState(0)
    let [albums, setAlb] = useState([])
    let [playlists, setPlayList] = useState([])
    let [mvs, setMv] = useState([])
    let globalObj = useContext(globalData)
    useEffect(() => {
        let hash = window.location.hash
        let keyword = hash.split('?')[1]?.split('=')[1] || sessionStorage.getItem('keyword')
        setKeyWord(keyword)
        window.addEventListener('storage',(e)=>{
            console.log(e)
        })
        return () => {};
    }, [])
    useEffect(()=>{
        setKeyWord(globalObj.keyword.keyword)
        setSongs([])
    }, [globalObj.keyword.keyword])
    useEffect(()=>{
        setOffset(0)
        search(0)
    },[keywords])
    useEffect(() => {
        setOffset(0)
        setSongs([])
        setAlb([])
        setPlayList([])
        setMv([])
        search(0)
    }, [type])
    useEffect(() => {
        search()
    }, [offset])
    function search(offsetFun){
        if(keywords){
            setLoading(true)
            api.cloudsearch({keywords: decodeURIComponent(keywords), type, offset: offsetFun || offset}).then(res=>{
                console.log(res.data, type)
                if(res.data.code === 200){
                    if(type === '1'){
                        // console.log(res.data.result.songs)
                        let songsList = songs.concat(res.data.result.songs || [])
                        setSongs(songsList)
                    }
                    if(type === '10'){
                        //albums
                        let albumsList = albums.concat(res.data.result.albums || [])
                        setAlb(albumsList)
                    }
                    if(type === '1000'){
                        //playlists
                        let playList = playlists.concat(res.data.result.playlists || [])
                        setPlayList(playList)
                    }
                    if(type === '1004'){
                        //mvs
                        let MvList = mvs.concat(res.data.result.mvs || [])
                        setMv(MvList)
                    }
                    setLoading(false)
                }
            })
        }
    }
    return <div className="search">
        <Tabs defaultActiveTab={type} animation destroyOnHide={true} onChange={(val)=>{
            console.log(typeof val)
            setType(val)
        }}>
            <Tabs.TabPane  title="单曲" key = '1'>
                <List
                    style={{height:'470px', overflowY:"scroll", padding:'0 10px'}}
                    loading={loading}
                    dataSource={songs}
                    noDataElement={<></>}
                    onListScroll={(e)=>{
                        // console.log(e.scrollHeight, e.clientHeight, e.scrollTop)
                        if(e.scrollTop + e.clientHeight >= (e.scrollHeight-10) && lastHeight !== e.scrollHeight){
                            console.log('到底')
                            offset += 30
                            setOffset(offset)
                            lastHeight = e.scrollHeight
                        }
                    }}
                    render={(item, idx)=><List.Item key={idx}>
                        <MusicBox
                            index={idx}
                            {...item}
                        />
                    </List.Item> 
                    }
                />
            </Tabs.TabPane>
            <Tabs.TabPane title="专辑" key='10'>
                <List
                    style={{height:'470px', overflowY:"scroll", padding:'0 10px'}}
                    loading={loading}
                    grid={{
                        sm: 24,
                        md: 12,
                        lg: 8,
                        xl: 6,
                    }}
                    bordered={false}
                    dataSource={albums}
                    noDataElement={<></>}
                    onListScroll={(e)=>{
                        // console.log(e.scrollHeight, e.clientHeight, e.scrollTop)
                        if(e.scrollTop + e.clientHeight >= (e.scrollHeight-10) && lastHeight !== e.scrollHeight){
                            console.log('到底')
                            offset += 30
                            setOffset(offset)
                            lastHeight = e.scrollHeight
                        }
                    }}
                    render={(item, idx)=><List.Item key={idx}>
                        <Albums {...item} type='album'/>
                    </List.Item> 
                    }
                />
            </Tabs.TabPane>
            <Tabs.TabPane title="歌单" key={'1000'}>
                <List
                    grid={{
                      sm: 24,
                      md: 12,
                      lg: 8,
                      xl: 6,
                    }}
                    style={{height:'470px', overflowY:"scroll", padding:'0 10px'}}
                    loading={loading}
                    dataSource={playlists}
                    noDataElement={<></>}
                    onListScroll={(e)=>{
                        // console.log(e.scrollHeight, e.clientHeight, e.scrollTop)
                        if(e.scrollTop + e.clientHeight >= (e.scrollHeight-10) && lastHeight !== e.scrollHeight){
                            console.log('到底')
                            offset += 30
                            setOffset(offset)
                            lastHeight = e.scrollHeight
                        }
                    }}
                    render={(item, idx)=><List.Item key={idx}>
                        <Albums {...item} type='playList'/>
                    </List.Item> 
                    }
                />
            </Tabs.TabPane>
            <Tabs.TabPane title="MV" key={'1004'}>
                <List
                    grid={{
                      sm: 24,
                      md: 24,
                      lg: 24,
                      xl: 24,
                    }}
                    style={{height:'470px', overflowY:"scroll", padding:'0 10px'}}
                    loading={loading}
                    dataSource={mvs}
                    noDataElement={<></>}
                    onListScroll={(e)=>{
                        // height: 470px;
                        // console.log(e.scrollHeight, e.clientHeight, e.scrollTop)
                        console.log(e)
                        // e.onscroll = (ee)=>{
                        //     ee.preventDefault()
                        // }
                        
                        // if(!isSroll){
                        //     clearTimeout(timerSroll)
                        //     e.scrollBy(0, 470)
                        // }
                        // isSroll = true
                        // timerSroll = setTimeout(() => {
                        //     isSroll = false
                        // }, 500);
                        if(e.scrollTop + e.clientHeight >= (e.scrollHeight-10) && lastHeight !== e.scrollHeight){
                            console.log('到底')
                            offset += 30
                            setOffset(offset)
                            lastHeight = e.scrollHeight
                        }
                    }}
                    render={(item, idx)=><List.Item id={`mv-${idx}`} key={idx}>
                        {/* {item.name} */}
                        <MvBox {...item}/>
                    </List.Item> 
                    }
                />
            </Tabs.TabPane>
        </Tabs>
    </div>
}

export default Search