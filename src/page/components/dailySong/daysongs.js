import { useEffect, useState } from "react"
import { api } from "../../util/http"
import { List, Button } from '@arco-design/web-react'
import MusicBox from "../Music/music"
import { useNavigate  } from 'react-router-dom'
import './daysongs.css'
function DailySongs(){
    const [songs, setSongs] = useState([])
    const navigate = useNavigate();
    useEffect(() => {
        api.getrecommendSongs({}).then(res=>{
            console.log(res.data.data.dailySongs)
            setSongs([...res.data.data.dailySongs])
        })
    }, [])
    return<div className="daySongs">
        <div><Button onClick={()=>{
            navigate("/home", { replace: true });
        }}>返回</Button></div>
        <List 
            noDataElement={<></>}
            dataSource={songs}
            render={(item, index) => <List.Item key={index}><MusicBox index={index} {...item}/>
            </List.Item>}
        />
    </div> 
}
export default DailySongs