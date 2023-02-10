/* eslint-disable no-unused-vars */

import Icon from './Icon'
import { IconHeartFill, IconWechat, IconAlipayCircle, IconCompass, IconDelete, IconSettings, IconNotification, IconThunderbolt } from '@arco-design/web-react/icon';
import { Message, Button, Notification } from '@arco-design/web-react'
import LocalStorage_subata from '../util/localStroage';
import '../../css/right-nav.css'
import zhIcon from  '../../image/zh.png'
import { useEffect } from 'react';
import '../../i18n'
import { useTranslation } from 'react-i18next'
let { getItem, setItem } = new LocalStorage_subata({
    filter:['wizInstall', 'installPath', 'steamInstall', 'wizPath', 'gameDataPath']
})
let style = {
    right: '50px',
    top: '20px'
}
function RightNav(props){
    let { setZf, changeBd, install, setDrawer, btnLoading, count, drawer, opSet } = props
    let {t: translation} = useTranslation()
    useEffect(()=>{
        if(!window.drag.supported) {
            document.querySelector('#nav-drag').style['-webkit-app-region'] = 'drag';
        }
    },[])
    return <div className='right-nav'>
        <div className='right-nav-bg'>
            
        </div>
        <Icon
            Child={<IconCompass className='icon-child'/>}
            onClick={()=>{
                window.electronAPI.openBroswer('https://www.wizard101.com/')
            }}
            tips="前往官网"
            content="官网"
        />
        <Icon
            Child={<IconThunderbolt className="icon-child"/>}
            onClick={()=>{
                // setZf('qq')
                window.tools.connect((error)=>{
                    if(error){
                        Message.error({
                            style:{top:'20px'},
                            content:'修改host文件失败，请使用管理员权限',
                        })
                    }else{
                        window.electronAPI.sound()
                        Message.success({
                            style:{top:'20px'},
                            content:'修改host文件成功，可以尝试在不用加速器的情况下进行游戏！',
                        })
                    }
                })
            }}
            // color="#fef9bf"
            tips="一键加速"
            content="加速"
        />
        <Icon
            Child={<IconNotification className="icon-child"/>}
            count={count}
            onClick={()=>{
                setDrawer(!drawer)
            }}
            tips="通知中心"
            content="通知"
        />
        <Icon
            Child={<img width={32} alt='' src={zhIcon}/>}
            onClick={()=>{
                if(btnLoading){
                    Message.error({
                        style:{top:'20px'},
                        content:translation('Tips_2'),
                    }) 
                    return
                }
                changeBd()
            }}
            tips="补丁切换"
            // color="#27c346"
            content="汉化"
        />
        
        <Icon
            Child={<IconDelete className="icon-child"/>}
            onClick={()=>{
                if(btnLoading){
                    Message.error({
                        style:{top:'20px'},
                        content:translation('Tips_2'),
                    }) 
                    return
                }
                window.tools.checkUpdate(getItem('type'), (num)=>{
                    console.log('num ----->',num)
                    if(num !== 3){
                        Notification.warning({
                            title:translation('Tips_3'),
                            style,
                            id:'unInstall',
                            content:(
                                <span>
                                    <Button type='primary' size='small' status='success' style={{marginRight:'10px'}} onClick={()=>{
                                        window.tools.init(()=>{
                                            Notification.remove('unInstall')
                                            window.electronAPI.sound()
                                            Message.success({
                                                style:{top:'20px'},
                                                content:translation('Tips_4'),
                                                duration:2000
                                            })
                                        })
                                    }}>{translation('Ok')}</Button>
                                    <Button size='small' onClick={()=>{Notification.remove('unInstall')}}>{translation('No')}</Button>
                                </span>
                            )
                        })
                    }else{
                        install()
                    }
                },(err)=>{
                    console.log(err)
                },(err)=>{
                    console.log(err)
                    Notification.error({
                        id:'notInstallWizard101',
                        style,
                        title:translation('Right_Tips_1'),
                        content: <span>
                            <Button onClick={()=>{  
                                let fileSelect = document.getElementById('selectWiz')
                                fileSelect.click()
                            }}>{translation('Btn1')}</Button>
                        </span>
                    })
                })
            }}
            // textStyle={{fontSize:'12px'}}
            tips="卸载补丁"
            content="卸载"
        />
        <div className='nav-drag' id='nav-drag'>

        </div>
        <div className='nav-bottom'>
            {/* <Icon
                Child={<i className='iconfont icon-dashang'></i>}
                onClick={()=>{
                    setZf('kf')
                }}
            /> */}
            <Icon
                Child={<IconWechat className="icon-child"/>}
                onClick={()=>{
                    setZf('wx')
                }}
                color='#27c346'
                tips="微信打赏"
            />
            <Icon
                Child={<IconAlipayCircle className="icon-child"/>}
                onClick={()=>{
                    setZf('zf')
                }}
                color='#3c7eff'
                tips="支付宝打赏"
            />
            
            <Icon
                Child={<IconHeartFill className="icon-child"/>}
                onClick={()=>{
                    window.electronAPI.openBroswer('https://subata.top/index.php/about/')
                }}
                color="#d1080e"
                tips="支付宝打赏"
            />
        </div>
    </div>
}

export default RightNav