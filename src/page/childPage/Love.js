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
    let { likeList } = props
    const [ids, setIds] = useState([])
    const [songs, setSongs] = useState([])
    const [loading, setLoading] = useState(true)
    let globalObj = useContext(globalData)
    useEffect(()=>{
        setIds([...likeList]) 
    },[likeList])
    useEffect(()=>{
        if(ids.length>0){
            api.getSongs({ids:ids.join(',')}).then(res=>{
                console.log(res.data)
                if(res.data.code === 200){
                    setSongs([...res.data.songs])
                    globalObj.currentList.setCurrentList([...ids])
                    setLoading(false)
                }
            })
        }
    },[ids])
    return <div className="love">
        <Row>
            <Button status='danger' type='text' onClick={()=>{
                globalObj.currentList.setCurrentList(ids)
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
                render={(item, index) => <List.Item key={index}><MusicBox {...item}/>
                </List.Item>}
            />}
            {!globalObj.user.user && <span>请先去登录</span>}
        </Row>
    </div>
}

export default Love