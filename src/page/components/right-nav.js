
import Icon from './Icon'
import { IconHeartFill, IconWechat, IconAlipayCircle, IconCompass, IconThumbUp, IconDelete, IconSettings, IconThunderbolt, IconNotification, IconBug } from '@arco-design/web-react/icon';
import { Message, Button, Notification } from '@arco-design/web-react'
let style = {
    right:'50px',
    top:'20px'
}
function RightNav(props){
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
                window.electronAPI.openBroswer('https://www.wizard101.com/')
            }}
            tips="前往官网"
            content="官网"
        />
        <Icon
            Child={<IconThumbUp className="icon-child"/>}
            onClick={()=>{
                window.tools.like(()=>{
                    Message.success({
                        // showIcon:false,
                        content:'你的支持就是我最大的动力！',
                        style:{top:'20px'},
                        duration:2000
                    })
                })
            }}
            // color="#d2881c"
            tips="给灭火器点个赞"
            content="点赞"
        />              
        <Icon
            Child={<IconThunderbolt className="icon-child"/>}
            onClick={()=>{
                // setZf('qq')
                window.tools.connect(()=>{
                    window.electronAPI.sound()
                    Message.success({
                        style:{top:'20px'},
                        content:'修改host文件成功，可以尝试在不用加速器的情况下进行游戏！',
                    })
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
                setDrawer(true)
            }}
            tips="通知中心"
            content="通知"
        />
        <Icon
            Child={<IconSettings className="icon-child"/>}
            onClick={()=>{
                if(btnLoading){
                    Message.error({
                        style:{top:'20px'},
                        content:'正在安装中，请稍后再试！',
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
                        content:'正在安装中，请稍后再试！',
                    }) 
                    return
                }
                window.tools.checkUpdate(localStorage.getItem('type'), (num)=>{
                    console.log('num ----->',num)
                    if(num !== 3){
                        Notification.warning({
                            title:'确定要狠心卸载汉化补丁吗?',
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
                                                content:'卸载成功!',
                                                duration:2000
                                            })
                                        })
                                    }}>确定</Button>
                                    <Button size='small' onClick={()=>{Notification.remove('unInstall')}}>取消</Button>
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
                        title:'未检测到Wizard101, 可能是官服或自定义Steam安装路径',
                        content: <span>
                            <Button onClick={()=>{  
                                let fileSelect = document.getElementById('selectWiz')
                                fileSelect.click()
                            }}>手动选择游戏路径</Button>
                        </span>
                    })
                })
            }}
            // textStyle={{fontSize:'12px'}}
            tips="卸载补丁"
            content="卸载"
        />
        <Icon
            Child={<IconBug className="icon-child"/>}
            onClick={()=>{
                setZf('qq')
            }}
            tips="联系我们"
            // color="#e4e517"
            content="建议"
        />
        <div className='nav-bottom'>
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