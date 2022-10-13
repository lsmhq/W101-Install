import { useContext, useEffect, useState } from 'react'
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
    let [ids, setIds] = useState([])
    useEffect(()=>{

    }, [])
    return <div className='body-main'>
        <Routes>
            <Route path='/recommend' element={<Home/>}/>
            <Route path='/music' element={<Music/>}/>
            <Route path='/' element={<Recommend/>}/>
            <Route path='/search' element={<Search/>}/>
            <Route path='/love' element={<Love  likeList = {ids}/>}/>
        </Routes>
    </div>
}
export default BodyMain