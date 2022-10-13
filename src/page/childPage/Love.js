import { useEffect, useState } from "react"
import { api } from "../util/http"
import { List, Grid, Button, Message } from '@arco-design/web-react'
import './css/love.css'
import MusicBox from "../components/Music/music";
import { useContext } from 'react';
import globalData from '../context/context';
const Row = Grid.Row;
const Col = Grid.Col;
let count = 0
let timer = null
let songId = 0
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
        document.addEventListener('setItemEvent', (e)=>{
            console.log('Item', e.key)
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
    return <div className="love">
        <Row>

        </Row>
        <Row>
            {user && <List 
                loading={loading}
                noDataElement={<></>}
                dataSource={songs}
                render={(item, index) => <List.Item id={`song${item.id}`} style={{color:globalObj.current.currentSong === item.id?'red':''}} key={index}><MusicBox 
                    isLike={globalObj.likeList.likeList.includes(item.id)} 
                    onClick={(id)=>{
                        if(id !== songId){
                            songId = id
                            timer = null
                            count = 0
                            if (!timer) {
                                timer = setTimeout(() => {
                                  count = 0;
                                  timer = null;
                                }, 1000);
                              }
                              count++;
                              if (count === 2) {
                                // console.log('ble')
                                globalObj.current.setCurrentSong(id)
                                globalObj.song.setSong(item)
                                count = 0;
                                clearTimeout(timer);
                                timer = null;
                              }
                        }else{
                            if (!timer) {
                                timer = setTimeout(() => {
                                  count = 0;
                                  timer = null;
                                }, 1000);
                            }
                            count++;
                            if (count === 2) {
                              // console.log('ble')
                              // 判断是否有版权
                              api.checkMusic({
                                id
                              }).then(res=>{
                                  if(res.data.success === true && res.data.message === 'ok'){
                                      globalObj.current.setCurrentSong(id)
                                      globalObj.song.setSong(item)
                                  }else{
                                      Message.error({
                                          style:{top:'10px'},
                                          content:'暂无版权'
                                      })
                                  }
                              })
                              count = 0;
                              clearTimeout(timer);
                              timer = null;
                              
                            }
                        }
                    }} 
                    onChange={()=>{
                        let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
                        if(userInfo){
                            api.getLikeList({uid:userInfo.userId}).then(res=>{
                                // console.log(res.data)
                                if(res.data.code === 200){
                                    globalObj.likeList.setLikeList([...res.data.ids])
                                }
                            })
                        }
                    }}
                    {...item}/>
                </List.Item>}
            />}
            {!user && <span>请先去登录</span>}
        </Row>
    </div>
}

export default Love