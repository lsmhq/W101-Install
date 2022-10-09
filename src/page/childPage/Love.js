import { useEffect, useState } from "react"
import { api } from "../util/http"
import { List, Grid } from '@arco-design/web-react'
import './css/love.css'
import MusicBox from "../components/Music/music";
import { useContext } from 'react';
import globalData from '../context/context';

const Row = Grid.Row;
const Col = Grid.Col;
function Love(){
    const [ids, setIds] = useState([])
    const [songs, setSongs] = useState([])
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('userInfo')))
    let globalObj = useContext(globalData)
    useEffect(()=>{
        let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
        if(userInfo){
            api.getLikeList({uid:userInfo.userId}).then(res=>{
                console.log(res.data)
                if(res.data.code === 200){
                    setIds([...res.data.ids])
                    globalObj.likeList.setLikeList([...res.data.ids])
                }
            })
        }
    }, [])
    useEffect(()=>{
        if(ids.length>0){
            api.getSongs({ids:ids.join(',')}).then(res=>{
                console.log(res.data)
                if(res.data.code === 200){
                    setSongs([...res.data.songs])
                    setLoading(false)
                }
            })
        }
    },[ids])
    return <div className="love">
        <Row>

        </Row>
        <Row>
            {user && <List 
                loading={loading}
                noDataElement={<></>}
                dataSource={songs}
                render={(item, index) => <List.Item style={{color:globalObj.current.currentSong === item.id?'red':''}} key={index}><MusicBox 
                    isLike={globalObj.likeList.likeList.includes(item.id)} 
                    onClick={(id)=>{
                        globalObj.current.setCurrentSong(id)
                    }} 
                    onChange={()=>{
                        let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
                        if(userInfo){
                            api.getLikeList({uid:userInfo.userId}).then(res=>{
                                console.log(res.data)
                                if(res.data.code === 200){
                                    globalObj.likeList.setLikeList([...res.data.ids])
                                }
                            })
                        }
                    }}
                    {...item}/>
                </List.Item>}
            />}
        </Row>
    </div>
}

export default Love