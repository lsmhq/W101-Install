import { useEffect, useState } from "react"
import { api } from "../util/http"
import { List, Grid, Button, Message } from '@arco-design/web-react'
import './css/love.css'
import MusicBox from "../components/Music/music";
import { useContext } from 'react';
import globalData from '../context/context';
const Row = Grid.Row;
const Col = Grid.Col;
function Love(props){
    const [ids, setIds] = useState([])
    const [songs, setSongs] = useState([])
    const [loading, setLoading] = useState(true)
    const [loveId, setLoveId] = useState()
    let globalObj = useContext(globalData)
    useEffect(()=>{
        let userInfo = JSON.parse(localStorage.getItem('userInfo'))
        if(userInfo){
            api.getLikeList({uid:userInfo.userId}).then(res=>{
                console.log(res.data)
                if(res.data.code === 200){
                    globalObj.likeList.setLikeList([...res.data.ids])
                    // setIds([...res.data.ids])
                    // globalObj.currentList.setCurrentList([...res.data.ids])
                    api.getSongs({ids: res.data.ids.join(',')}).then(res=>{
                        if(res.data.code === 200){
                            let songArr = res.data.songs.sort(function compareFunction(item1, item2) {
                                return item1.name.localeCompare(item2.name, 'zh');
                              })
                            let ids = songArr.map(song=>song.id)
                            setSongs([...songArr])
                            setLoveId(res.data.checkPoint)
                            setIds([...ids])
                            setLoading(false)
                        }
                    })
                }
            })
        }
        globalObj.user.setUser(localStorage.getItem('userInfo'))
    },[])
    return <div className="love">
        <Row>
            <Button status='danger' type='text' onClick={()=>{
                globalObj.currentList.setCurrentList(ids)
                globalObj.songListId.setSongListId(loveId)
                Message.success({
                    style:{top:'10px'},
                    content:'设置成功'
                })
            }}>设为播放列表</Button>
        </Row>
        <Row>
            {globalObj.user.user && <List 
                loading={loading}
                noDataElement={<></>}
                dataSource={songs}
                render={(item, index) => <List.Item key={index}><MusicBox index={index} {...item}/>
                </List.Item>}
            />}
            {!globalObj.user.user && <span>请先去登录</span>}
        </Row>
    </div>
}

export default Love