/* eslint-disable no-unused-vars */

import Icon from './Icon'
import { IconMusic, IconCompass, IconHeart, IconSearch, IconFire } from '@arco-design/web-react/icon';
import { useNavigate  } from 'react-router-dom'
import { useState } from 'react';

function LeftNav(props){
    let { onMouseDown } = props
    const navigate = useNavigate();
    let [active, setActive] = useState(0)
    return <div className='right-nav'             
        onMouseDown={(e)=>{
            if(e.target.className === 'nav-bottom'){
                onMouseDown({
                    down: true,
                    X: e.clientX,
                    Y: e.clientY
                })
                // console.log(baseX, baseY)
            }

        }
    }>
        <Icon
            Child={<IconCompass className='icon-child'/>}
            className={`${active===0?'icon-active':''}`}
            onClick={()=>{
                setActive(0)
                navigate("/", { replace: true });
            }}
            tips="首页"
            content="首页"
        />
        <Icon
            Child={<IconHeart className={`icon-child`}/>}
            className={`${active===4?'icon-active':''}`}
            onClick={()=>{
                setActive(4)
                navigate("/love", { replace: true });
                
            }}
            // textStyle={{fontSize:'12px'}}
            tips="我喜欢"
            content="我喜欢"
        />
        <Icon
            Child={<IconFire className={`icon-child`}/>}
            className={`${active===3?'icon-active':''}`}
            onClick={()=>{
                setActive(3)
                navigate("/recommend", { replace: true });
            }}
            tips="推荐"
            // color="#27c346"
            content="推荐"
        />
        <Icon
            Child={<IconMusic className={`icon-child`}/>}
            className={`${active===1?'icon-active':''}`}
            onClick={()=>{
                setActive(1)
                navigate("/music", { replace: true });
            }}
            tips="歌单"
            content="歌单"
        />
        <Icon
            Child={<IconSearch className={`icon-child`}/>}
            className={`${active===2?'icon-active':''}`}
            onClick={()=>{
                setActive(2)
                navigate("/search", { replace: true });
            }}
            // textStyle={{fontSize:'12px'}}
            tips="发现"
            content="发现"
        />
        <div className='nav-bottom'>

        </div>
    </div>
}

export default LeftNav