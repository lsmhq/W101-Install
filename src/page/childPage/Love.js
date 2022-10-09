import { useEffect, useState } from "react"
import { api } from "../util/http"
import { List, Grid } from '@arco-design/web-react'
import './css/love.css'
let account = JSON.parse(sessionStorage.getItem('account'))
const Row = Grid.Row;
const Col = Grid.Col;
function Love(){
    const [ids, setIds] = useState([])
    const [songs, setSongs] = useState([])
    useEffect(()=>{
        api.getLikeList({uid:account.id}).then(res=>{
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
                }
            })
        }
    },[ids])
    return <div className="love">
        <Row>

        </Row>
        <Row>
            <List 
                dataSource={songs}
                render={(item, index) => <List.Item key={index}>{item.name}</List.Item>}
            />
        </Row>
    </div>
}

export default Love