import { Button, Message, Popover } from '@arco-design/web-react'
import { useContext, useState } from 'react'
import globalData from '../../context/context'
import './album.css'
import AlbumInfo from './album_Info'
function Albums(props){
    let {picUrl, name, publishTime, id, type, coverImgUrl} = props
    let [songs, setSongs] = useState([])
    let globalObj = useContext(globalData)
    return <Popover 
        unmountOnExit = {false}
        title={<><span>{name}</span><Button status='danger' type='text' onClick={()=>{
            let ids = songs.map(song=>song.id)
            globalObj.currentList.setCurrentList(ids)
            globalObj.songListId.setSongListId(id)
            Message.success({
                style:{top:'10px'},
                content:'设置成功'
            })
        }}>设为播放列表</Button></>}
            style={{width:'400px !important'}}
            trigger='click'
            content={<AlbumInfo type = {type} getIds={(songs)=>{
                setSongs([...songs])
            }} id={id}/>}
        >
        <div className="albums">
            {type === 'album' && <img src={picUrl} alt=''/>}
            {type === 'playList' && <img src={coverImgUrl} alt=''/>}
            <div className='albums-content'>
                <div>{name}</div>
                {type === 'album' && <div>{`${new Date(publishTime).getFullYear()}年${new Date(publishTime).getMonth()+1}月`}</div>}
            </div>
        </div>
    </Popover>
}

export default Albums