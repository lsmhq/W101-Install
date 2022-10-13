import { Button, List, Message } from "@arco-design/web-react"
import { useContext, useEffect, useState } from "react"
import { api } from "../../util/http"
import MusicBox from "../Music/music"
function AlbumInfo(props){
    let { type, id, getIds } = props
    let [loading, setLoading] = useState(false)
    let [info, setInfo] = useState({})
    useEffect(() => {
        console.log(type)
        setLoading(true)
        if(type === 'album'){
            api.getAlbum({id}).then(res=>{
                if(res.data.code === 200){
                    console.log(res.data)
                    setInfo(res.data.songs)
                    getIds(res.data.songs)
                    setLoading(false)
                }
            })
        }
        if(type === 'playList'){
            // 获取歌单
            api.getPlayListAll({id}).then(res=>{
                if(res.data.code === 200){
                    console.log(res.data)
                    setInfo(res.data.songs)
                    getIds(res.data.songs)
                    setLoading(false)
                }
            })
        }
    }, [])
    return <div className="albumInfo">
        <List
            loading={loading}
            dataSource={info}
            noDataElement={<></>}
            render={(item, idx) => {
                return <List.Item key={idx}><MusicBox grid={[3, 10, 4, 4]} {...item}/></List.Item> 
            }}
        />
    </div>
}

export default AlbumInfo