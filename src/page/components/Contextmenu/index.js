import React, { useState, useEffect } from 'react';
import {createPortal} from 'react-dom'
import { array, object } from 'prop-types';
import './index.less'
// 菜单
const propTypes = {
    menus: array,
    // visible: bool,
    target:object
};

const defaultProps = {

};

function ContextMenu(props){
    let { menus, target } = props
    let [ visible, setVisible ] = useState(false)
    let [position,setPosition] = useState({left:0,top:0})
    let [animation] = useState('slideInDownMine')
    useEffect(() => {
        let node = target || document
        console.log('node====>',node)
        console.log('target====>',target)
        node.oncontextmenu = () => false
        node.onmouseup = function(ev){
            var e = ev || window.event;
            console.log(e.target)
            if(e.button === 2){
                setVisible(false)
                setPosition({
                    left:e.clientX + 5,
                    top:e.clientY
                })
                setVisible(true)
            }else{
                setVisible(false)
            }
        }
        return () => {
            node.oncontextmenu = null
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return visible ? createPortal((<>
            <div className={`context-menu animated ${animation} faster`} style={{left: position.left,top: position.top}}>
                {
                    menus.map((val, idx)=>{
                        return <Item index={idx} control={setVisible} key={idx} content={val}/>
                    })
                }
            </div>
        </>
    ), document.getElementById('root')):null
}

function Item (props) {
    let { content, index, control } = props
    let [eventName, setName] = useState('')
    let [visible, setVisible] = useState(false)
    return <div 
            className={`menu-item menuItems-${eventName} `}
            id={`menu-item-${index}`}
            onMouseDown={()=>{
                setName('click')
            }}
            onMouseUp={(e)=>{
                e.stopPropagation()
                if(content.children){
                    control(true)
                }else{
                    control(false)
                    if(content.onclick)
                        content.onclick()
                }
                console.log('点击事件')
                setName('clickUp')
            }}
            onMouseEnter={()=>{
                if(content.children){
                    setVisible(true)
                }
                setName('hover')
            }}
            onMouseLeave={()=>{
                if(content.children){
                    setVisible(false)
                }
                setName('')
            }}
        >
            <div>
                {content.src && <img alt='icon' src={content.src}/>}
                {(typeof content === 'string') && content}
                {(typeof content.name === 'string') && content.name}
            </div>
            {content.children && <i className='iconfont icon-right-line'></i>}
            {visible && <ChildrenMenu control={control} menus={content.children}/>}
    </div>
}


function ChildrenMenu(props){
    let { menus, control } = props
    let [position] = useState({left:'100%',top:0})
    let [animation] = useState('slideInDownMine')
    return <div className={`context-menu animated ${animation} faster `} style={{left: position.left,top: position.top}}>
        {
            menus.map((val, idx)=>{
                return <Item index={idx} control={control} key={idx} content={val}/>
            })
        }
    </div>
        
}
ContextMenu.propTypes = propTypes;
ContextMenu.defaultProps = defaultProps;
// #endregion

export default ContextMenu;