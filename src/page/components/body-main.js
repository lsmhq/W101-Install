import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../childPage/home'
import Love from '../childPage/Love'
import Music from '../childPage/Music'
// import Recommend from '../childPage/recommend'
import Search from '../childPage/Search'
import Singer from '../childPage/songer'
// import globalData from '../context/context'
// import { api } from '../util/http'
import DailySongs from './dailySong/daysongs'
function BodyMain(props){
    // let globalObj = useContext(globalData)
    // let [ids, setIds] = useState([])
    useEffect(()=>{

    }, [])
    return <div className='body-main'>
        <Routes>
            <Route path='/home' element={<Home/>}/>
            <Route path='/daysongs' element={<DailySongs/>}/>
            <Route path='/singer' element={<Singer/>}/>
            <Route path='/music' element={<Music/>}/>
            {/* <Route path='/' element={<Recommend/>}/> */}
            <Route path='/search' element={<Search/>}/>
            <Route path='/love' element={<Love/>}/>
        </Routes>
    </div>
}
export default BodyMain