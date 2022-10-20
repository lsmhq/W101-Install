import { useEffect, useState } from 'react'
import { api } from '../../util/http'
import './mvcss.css'
function MvBox(props){
    let {name, cover, id} = props
    let [src, setSrc] = useState('')
    useEffect(()=>{
        api.getMvUrl({id}).then(res=>{
            if(res.data.code === 200){
                console.log(res.data.data)
                setSrc(res.data.data.url)
            }
        })
    },[])
    return <div className='mvbox'>
        {name}
        <video onPlay={()=>{
            document.getElementsByTagName('audio')[0].pause()
        }} preload='none' className='mvbox-video' src={src} controls poster={cover}/>
        {/* <img className='mvbox-img' src={cover} alt=""/> */}
    </div>
}

export default MvBox