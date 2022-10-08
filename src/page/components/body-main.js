import { Route, Routes } from 'react-router-dom'
import Home from '../childPage/home'
import Love from '../childPage/Love'
import Music from '../childPage/Music'
import Recommend from '../childPage/recommend'
import Search from '../childPage/Search'
function BodyMain(props){
    
    return <div className='body-main'>
        <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/music' element={<Music/>}/>
            <Route path='/recommend' element={<Recommend/>}/>
            <Route path='/search' element={<Search/>}/>
            <Route path='/love' element={<Love/>}/>
        </Routes>
    </div>
}
export default BodyMain