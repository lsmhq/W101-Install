import { useContext, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../childPage/home'
import Love from '../childPage/Love'
import Music from '../childPage/Music'
import Recommend from '../childPage/recommend'
import Search from '../childPage/Search'
import globalData from '../context/context'
import { api } from '../util/http'
function BodyMain(props){
    let globalObj = useContext(globalData)
    useEffect(()=>{
        let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
        if(userInfo){
            api.getLikeList({uid:userInfo.userId}).then(res=>{
                console.log(res.data)
                if(res.data.code === 200){
                    globalObj.likeList.setLikeList([...res.data.ids])
                    globalObj.currentList.setCurrentList([...res.data.ids])
                }
            })
        }
    }, [])
    return <div className='body-main'>
        <Routes>
            <Route path='/recommend' element={<Home/>}/>
            <Route path='/music' element={<Music/>}/>
            <Route path='/' element={<Recommend/>}/>
            <Route path='/search' element={<Search/>}/>
            <Route path='/love' element={<Love likeList = {globalObj.likeList.likeList}/>}/>
        </Routes>
    </div>
}
export default BodyMain