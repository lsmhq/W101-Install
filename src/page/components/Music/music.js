
import { Grid, Message } from '@arco-design/web-react'
import {  IconHeart, IconHeartFill } from '@arco-design/web-react/icon';
import { useContext } from 'react';
import globalData from '../../context/context';
import { api } from '../../util/http';
import { formatSeconds } from '../../util/util';
const Row = Grid.Row;
const Col = Grid.Col;
let count = 0
let timer = null
let songId = 0
function MusicBox(props){
    let globalObj = useContext(globalData)
    // 歌名、id、歌手、发布日期、时长
    let {name, id, ar, dt, grid = []} = props
    return <Row id={`song${id}`} style={{color:globalObj.current.currentSong*1 === id ? 'red' : ''}}  onClick={(e)=>{
            e.stopPropagation()
            console.log('歌曲id-->', id)
            // getMusic(id)
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
                        api.checkMusic({
                            id
                          }).then(res=>{
                              if(res.data.success === true && res.data.message === 'ok'){
                                    globalObj.current.setCurrentSong(id)
                                    localStorage.setItem('songId', id)
                                    globalObj.song.setSong({...props})
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
                              localStorage.setItem('songId', id)
                              globalObj.song.setSong({...props})
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
        }}>
        <Col style={{color:'rgb(207, 0, 0)'}} span={grid[0] || 1}>
            {globalObj.likeList.likeList.includes(id) ? <IconHeartFill onClick={(e)=>{
                e.stopPropagation()
                api.likeMusic({id,like: false}).then(res=>{
                    // onChange && onChange()
                    let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
                    if(userInfo){
                        api.getLikeList({uid:userInfo.userId}).then(res=>{
                            // console.log(res.data)
                            if(res.data.code === 200){
                                globalObj.likeList.setLikeList([...res.data.ids])
                            }
                        })
                    }
                })
            }}/>:<IconHeart onClick={(e)=>{
                e.stopPropagation()
                api.likeMusic({id}).then(res=>{
                    let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
                    if(userInfo){
                        api.getLikeList({uid:userInfo.userId}).then(res=>{
                            // console.log(res.data)
                            if(res.data.code === 200){
                                globalObj.likeList.setLikeList([...res.data.ids])
                            }
                        })
                    }
                })
            }}/>}

        </Col>
        <Col style={{ textOverflow:'ellipsis', overflow:'hidden' }} span={grid[1] || 9}>
            {name}
        </Col>
        <Col style={{ textOverflow:'ellipsis', overflow:'hidden' }} span={grid[2] ||11}>
            {ar.map((a, idx)=><span key={idx} onClick={(e)=>{
                console.log('歌手id-->', a.id)
                e.stopPropagation()
            }}>{a.name}</span>)}
        </Col>
        <Col span={grid[3] || 3}>
            {formatSeconds(dt/1000)}
        </Col>
    </Row>
}

export default MusicBox

