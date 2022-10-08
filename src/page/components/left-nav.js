/* eslint-disable no-unused-vars */

import Icon from './Icon'
import { IconMusic, IconCompass, IconHeart, IconSettings, IconSearch, IconFire } from '@arco-design/web-react/icon';
import { Message, Button, Notification } from '@arco-design/web-react'
let style = {
    right:'50px',
    top:'20px'
}
function LeftNav(props){
    let { onMouseDown, setZf, changeBd, install, setDrawer, btnLoading, count } = props
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
            onClick={()=>{
                
            }}
            tips="首页"
            content="首页"
        />
        <Icon
            Child={<IconMusic className="icon-child"/>}
            count={count}
            onClick={()=>{
                
            }}
            tips="歌单"
            content="歌单"
        />
        <Icon
            Child={<IconSearch className="icon-child"/>}
            onClick={()=>{

            }}
            // textStyle={{fontSize:'12px'}}
            tips="发现"
            content="发现"
        />
        <Icon
            Child={<IconFire className="icon-child"/>}
            onClick={()=>{

            }}
            tips="推荐"
            // color="#27c346"
            content="推荐"
        />
        
        <Icon
            Child={<IconHeart className="icon-child"/>}
            onClick={()=>{

            }}
            // textStyle={{fontSize:'12px'}}
            tips="我喜欢"
            content="我喜欢"
        />
        <div className='nav-bottom'>

        </div>
    </div>
}

export default LeftNav