import { useEffect, useState } from "react"
import { api } from "../util/http"
import { List, Grid } from '@arco-design/web-react'
import './css/love.css'
const Row = Grid.Row;
const Col = Grid.Col;
function Love(){
    const [ids, setIds] = useState([])
    const [songs, setSongs] = useState([])
    const [loading, setLoading] = useState(true)
    useEffect(()=>{
        let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
        api.getLikeList({uid:userInfo.userId}).then(res=>{
            console.log(res.data)
            if(res.data.code === 200){
                setIds([...res.data.ids])
            }
        })
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
    function getMusic(id){
        api.getSongsUrl({id}).then(res=>{
            console.log(res.data)
        })
    }
    return <div className="love">
        <Row>

        </Row>
        <Row>
            <List 
                loading={loading}
                noDataElement={<></>}
                dataSource={songs}
                render={(item, index) => <List.Item onClick={()=>{
                    getMusic(item.id)
                }} key={index}>{item.name}</List.Item>}
            />
        </Row>
    </div>
}

export default Love