import { useEffect, useState} from 'react';
import '../css/main.css'
import { Spin, Carousel, Tabs, List, Button, Modal, Notification, Progress, Drawer, Collapse, Message, Input  } from '@arco-design/web-react';
import logo from '../image/WizardLogoRA.png'
import { IconWechat, IconAlipayCircle, IconBulb, IconThumbUp, IconDelete, IconSettings, IconClose, IconMinus, IconThunderbolt, IconNotification, IconBug } from '@arco-design/web-react/icon';
import zfb from '../image/zfb.jpg'
import wechat from '../image/wechat.jpg'
import Icon from './components/Icon';
import QQ from '../image/QQ_share.jpg'
import su from '../image/Subata_logo.png'
import apiPath from './http/api'

//'ws://localhost:8000'
let wsPath = 'ws://101.43.216.253:8000'

let { TabPane } = Tabs
let CollapseItem = Collapse.Item
let style = {
    right:'20px',
    top:'20px'
}
Notification.config({
    maxCount:'5',
    duration:5000
})
let obj = {
    r: '<剧情>',
    d: '<全汉化>',
    c: '<轻聊>',
}
let ws = null, socketError = false
let imgMap = {
    qq:QQ,
    wx:wechat,
    zf:zfb
}
let isDown = false;  // 鼠标状态
let baseX = 0,baseY = 0; //监听坐标
function Main(){
    let [loading, setLoading] = useState(true)
    let [loading1, setLoading1] = useState(true)
    let [imgs, setImgs] = useState([])
    let [show, setShow] = useState(false)
    let [zfType, setZf] = useState('')
    let [img, setImg] = useState('')
    let [percent, setPercent] = useState(0)
    let [drawer, setDrawer] = useState(false)
    let [count, setCount] = useState(0)
    let [news, setNews] = useState([])
    let [activity, setActivity] = useState([])
    let [msgHeight, setHeight] = useState(window.innerHeight - 40 + 'px')
    let [btnLoading, setBtnLoad] = useState(false)
    let [current, setCurrent] = useState(0)
    let [total, setTotal] = useState(0)
    let [msgShow, setMsgShow] = useState(false)
    let [text, setText] = useState('')
    let [title, setTitle] = useState('')
    let [user, setUser] = useState(localStorage.getItem('username'))
    let [message, setMessage] = useState([])
    let [root, setRoot] = useState(localStorage.getItem('root')||'')
    useEffect(() => {
        // 检查补丁更新
        if(localStorage.getItem('type'))
        checkUpdate(false) 
        // 获取轮播
        getCarousel()
        // 拖拽
        drag()
        // 黑主题
        dark()
        // 获取活动新闻
        getData()
        // 创建WebSocket
        createSocket()
        // 窗口自适应
        resize()
        return () => {
            // 注销
            destroy()
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    useEffect(()=>{
        setImg(imgMap[zfType])
    },[zfType])
    useEffect(()=>{
        if(img)
            setShow(true)
    },[img])
    useEffect(()=>{
        setCount(0)
    },[drawer])
    useEffect(()=>{
        if(percent === 100){
            setBtnLoad(false)
            setPercent(0)
            window.electronAPI.sound()
            Notification.success({
                id:'download',
                style,
                title:'安装完成!',
                content:'请点击下方开始游戏进行体验!',
                duration: 2000
            })
            // window.tools.changeType(localStorage.getItem('type'))
        }
    },[percent])
    function createSocket(){
        ws = new WebSocket(wsPath)
        ws.onopen =()=>{
            console.log('连接成功')   
            getMessage()   
        }
        ws.onerror = ()=>{
            reconnet()
        }
        ws.onclose = ()=>{
            reconnet()
        }
        
        // console.log(ws)
        ws.onmessage = (msg)=>{
            // console.log(msg.data)
            let data = JSON.parse(msg.data)
            if(data.id === localStorage.getItem('userid')){
                Message.success({
                    style:{top:'20px'},
                    content:'发布成功',
                    duration:3000,
                    onClose:()=>{
                        setTitle('')
                        setText('')
                    }
                })
            }else if(data.type === 'del'){
                getMessage()
            }else{
                window.electronAPI.sound()
                Notification.info({
                    style,
                    content:data.title,
                    title:`您收到了一条来自${data.username || '神秘人'}的消息`
                })
                setCount(1)
            }
            getMessage()
        }
        let reconnet = ()=>{ //重新连接websock函数
            if(socketError)
                return false
            socketError = true
            setTimeout(()=>{
                ws = new WebSocket(wsPath)
                socketError = false
            },2000)
        }
    }
    function resize(){
        window.onresize = ()=>{
            setHeight(window.screen.height - 40 + 'px')
        }
    }
    function getData(){
        apiPath.mainPage().then(res=>{
            if(res.status === 200){
                setActivity([...res.data.activity])
                setNews([...res.data.news])
                setLoading1(false)
            }
        })
    }
    function dark(){
        document.body.setAttribute('arco-theme', 'dark');
    }
    function destroy(){
        document.onmousedown = null
        document.onmousemove = null
        window.onresize = null
    }
    function drag(){
        document.addEventListener('mousemove',function(ev){
            if(isDown){
              const x = ev.screenX - baseX
              const y = ev.screenY - baseY
            //   console.log(x, y)
              window.electronAPI.sendXY({
                  x,y
              })
            }
        })
        document.addEventListener('mouseup',()=>{
            isDown = false
        })
    }
    function getCarousel(){
        apiPath.getCurl().then(res=>{
            // console.log(res.data.lunbo)
            setImgs([...res.data.lunbo])
            setLoading(false)
        })
    }
    function getMessage(){
        apiPath.getMessage().then(res=>{
            // console.log(res.data.message)
            setMessage([...res.data.messages])
        })
    }
    function install(type){
        Notification.error({
            id:'notInstall_bd',
            style,
            title:'检测到未安装汉化补丁',
            btn: (
                <span style={{display:'flex', flexDirection:'column'}}>
                  {
                    type ? type==='d' && <Button
                        loading = {btnLoading}
                        type='primary'
                        size='small'
                        style={{ margin: '5px' }}
                        status='warning'
                        onClick={()=>{
                            downLoad('d')
                            localStorage.setItem('type', 'd')
                        }}
                    >
                        全汉化安装
                    </Button>: <Button
                        loading = {btnLoading}
                        type='primary'
                        size='small'
                        style={{ margin: '5px' }}
                        status='warning'
                        onClick={()=>{
                            downLoad('d')
                            localStorage.setItem('type', 'd')
                        }}
                    >
                        全汉化安装
                    </Button>
                  }
                  {
                    type?type === 'r'&&<Button 
                        loading={btnLoading}
                        style={{ margin: '5px' }}
                        status='success'
                        onClick={()=>{
                            downLoad('r')
                            localStorage.setItem('type', 'r')
                        }}
                        type='primary' 
                        size='small'
                    >
                        剧情汉化安装
                    </Button>:<Button 
                        loading={btnLoading}
                        style={{ margin: '5px' }}
                        status='success'
                        onClick={()=>{
                            downLoad('r')
                            localStorage.setItem('type', 'r')
                        }}
                        type='primary' 
                        size='small'
                    >
                        剧情汉化安装
                    </Button>
                  }
                  {
                    type?type==='c'&&<Button 
                        loading={btnLoading}
                        style={{ margin: '5px' }}
                        onClick={()=>{
                            downLoad('c')
                            localStorage.setItem('type', 'c')
                        }}
                        type='primary' 
                        size='small'
                    >
                        聊天纯享安装
                    </Button>:<Button 
                        loading={btnLoading}
                        style={{ margin: '5px' }}
                        onClick={()=>{
                            downLoad('c')
                            localStorage.setItem('type', 'c')
                        }}
                        type='primary' 
                        size='small'
                    >
                        聊天纯享安装
                    </Button>
                  }
                </span>
            ),
        })
    }
    function checkUpdate(show = true){
        // console.log(obj[localStorage.getItem('type')])
        Notification.remove('change_bd') 
        // console.log(window.tools)
        window.tools.checkUpdate(localStorage.getItem('type'), (num)=>{
            // console.log('num----->',num)
            switch (num) {
                case 1:
                    // 有更新
                    upDate()
                    break;
                case 2:
                    // 没有需要的更新
                    if(show)
                    window.tools.changeType(localStorage.getItem('type'),()=>{
                        window.electronAPI.sound()
                        Message.success({
                            style:{top:'20px'},
                            content:`切换${obj[localStorage.getItem('type')]}成功!`
                        })
                    })
                    break
                case 3:
                    // 未安装
                    // console.log('未安装')
                    if(show)
                        install(localStorage.getItem('type'))
                    break
                default:
                    break;
            }
        },(err)=>{
            console.log(err)
        })
    }
    function upDate(){
        // console.log(obj[localStorage.getItem('type')])
        Notification.warning({
            title:`检测到${obj[localStorage.getItem('type')]}有最新的补丁！`,
            id:'update',
            style,
            duration:1000000000,
            // closable:false,
            btn: (
                <span>
                  {
                    localStorage.getItem('type') === 'd' && <Button
                        loading={btnLoading}
                        type='primary'
                        size='small'
                        style={{ margin: '0 12px' }}
                        onClick={downLoad}
                    >
                        全汉化更新
                    </Button>
                  }
                  {
                    localStorage.getItem('type') === 'r' && <Button 
                        loading={btnLoading}
                        onClick={downLoad} 
                        type='primary' 
                        size='small'
                    >
                        仅剧情更新
                    </Button>
                  }
                  {
                    localStorage.getItem('type') === 'c' && <Button 
                        loading={btnLoading}
                        onClick={downLoad} 
                        type='primary' 
                        size='small'
                    >
                        聊天纯享更新
                    </Button>
                  }
                </span>
            ),
        })
    }
    function downLoad(type){
        setBtnLoad(true)
        Notification.remove('notInstall_bd')
        window.tools.downLoad(type || localStorage.getItem('type') ,(mark)=>{
            Notification.warning({
                id:'download',
                title:'请耐心等待下载...',
                content:mark,style,duration:10000000
            })
        },(total, currentTotal)=>{
            setCurrent(currentTotal)
            setTotal(total)
            setPercent(Number.parseInt((( currentTotal / total ).toFixed(2) * 100)))
        }, (err)=>{
            if(err){
                Notification.error({
                    content:err,
                    style,
                    title:'请将本消息提供给<灭火器>'
                })
            }
        })
    }
    return <div className="main">
        <div className='bottom-bg'></div>
        <div className='nav' 
            onMouseDown={(e)=>{
                isDown = true 
                baseX = e.clientX
                baseY = e.clientY
                // console.log(baseX, baseY)
            }}
        >
            <div className='nav-logo'><img alt='' src={su}/></div>
            <div className='nav-title'>Subata</div>
            <div className='nav-control'>
                <div className='control-btn' onClick={()=>{
                    window.electronAPI.mini()
                }}>
                    <IconMinus style={{fontSize:'20px'}}/>
                </div>
                <div className='control-btn btn-danger' onClick={()=>{
                    window.electronAPI.close()
                }}>
                    <IconClose style={{fontSize:'20px'}}/>
                </div>
            </div>
        </div>
        <div className='body'>
            <div className='body-main'>
                <div className='body-main-top'>
                    <div className='left'>
                        <div className='logo'>
                            <img src={logo} alt=''/>
                        </div>
                        <div className='carousel-main'>
                            <Spin dot tip="拼命中" style={{color:'white'}} loading={loading}>
                                <Carousel
                                showArrow='hover'
                                indicatorClassName="indicatorClassName"
                                arrowClassName='arrowClassName'
                                animation='card'
                                style={{ width: 350}}
                                autoPlay={true}
                                >
                                    {imgs.map((src, index) => <div
                                        key={index}
                                        style={{ width: '100%' }}
                                        >
                                        <img
                                            key={index}
                                            src={src}
                                            style={{ width: '100%' }}
                                            alt=""
                                        />
                                        </div>
                                    )}
                                </Carousel>
                            </Spin>
                        </div>
                        <div className='tips'>
                            <Tabs defaultActiveTab='1' animation={true}>
                                <TabPane key='1' className='tabPane' title='新闻'>
                                    <List
                                        dataSource={news}
                                        loading={loading1}
                                        noDataElement={<></>}
                                        render={(item, index) => <List.Item key={item} onClick={()=>{
                                            window.electronAPI.openBroswer(item.url)
                                        }}>{item.title}</List.Item>}
                                    />
                                </TabPane>
                                <TabPane key='2' title='活动'>
                                    <List
                                        dataSource={activity}
                                        loading={loading1}
                                        noDataElement={<></>}
                                        render={(item, index) => <List.Item key={item} onClick={()=>{
                                            window.electronAPI.openBroswer(item.url)
                                        }}>{item.title}</List.Item>}
                                    />
                                </TabPane>
                            </Tabs>
                        </div>
                    </div>
                    <div className='right'>
                        <div className='op-btn'>
                            <Button onClick={()=>{
                                
                                // ws.send(JSON.stringify({msg:'1111', title:'123123'}))
                                // console.log(localStorage.getItem('steamInstall'))
                                if(localStorage.getItem('steamInstall') === 'true'){
                                    window.tools.startGame((err)=>{
                                        Notification.error({
                                            style,
                                            title:'检测到未安装Wizard101',
                                            content: err.path
                                        })
                                    })
                                }else{
                                    Notification.error({
                                        style,
                                        title:'检测到未安装Steam',
                                    })
                                }

                            }} status='success' loading={btnLoading} type='primary' className='openGame'>开始游戏</Button>
                        </div>
                    </div>
                </div>
                <div className='body-main-bottom'>
                    {percent > 0 && <Progress formatText={()=><span>{`${(current / 1024 / 1024).toFixed(2)}MB / ${(total / 1024 / 1024).toFixed(2)}MB`}</span>} percent={percent} width='100%' color={'#00b42a'} style={{display:'block'}}/>}
                </div>
            </div>

            <div className='right-nav'             
                onMouseDown={(e)=>{
                    if(e.target.className == 'nav-bottom'){
                        isDown = true 
                        baseX = e.clientX
                        baseY = e.clientY
                        // console.log(baseX, baseY)
                    }
                }
            }>
                <Icon
                    Child={<IconBulb className='icon-child'/>}
                    onClick={()=>{
                        window.electronAPI.openBroswer('https://www.subata.top/')
                    }}
                    tips="前往社区"  
                />
                <Icon
                    Child={<IconThumbUp className="icon-child"/>}
                    onClick={()=>{
                        window.tools.like(()=>{
                            Message.success({
                                // showIcon:false,
                                content:'您的支持就是我最大的动力！',
                                style:{top:'20px'},
                                duration:2000
                            })
                        })
                    }}
                    tips="给灭火器点个赞"
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
                                style:{top:'20px'}
                            })
                        })
                    }}
                    tips="一键加速"
                />
                <Icon
                    Child={<IconNotification className="icon-child"/>}
                    count={count}
                    onClick={()=>{
                        setDrawer(true)
                    }}
                    tips="通知中心"
                />
                <Icon
                    Child={<IconSettings className="icon-child"/>}
                    onClick={()=>{
                        Notification.info({
                            title:'切换/更新',
                            // closable:false,
                            showIcon:false,
                            duration:100000,
                            id:'change_bd',
                            style,
                            btn: (
                                <span style={{display:'flex'}}>
                                  <Button
                                    loading={btnLoading}  
                                    type='primary'
                                    size='small'
                                    status= 'warning'
                                    style={{ margin: '0 12px' }}
                                    onClick={()=>{
                                        localStorage.setItem('type','d')
                                        // Notification.remove('change_success')
                                        checkUpdate(localStorage.getItem('type'))
                                    }}
                                  >
                                    全汉化
                                  </Button>
                                  <Button onClick={()=>{
                                        localStorage.setItem('type','r')
                                        // Notification.remove('change_success')
                                        checkUpdate(localStorage.getItem('type'))
                                    }} type='primary' loading={btnLoading} status='success' size='small' style={{ margin: '0 12px 0 0' }}>
                                    仅剧情
                                  </Button>
                                  <Button onClick={()=>{
                                        localStorage.setItem('type','c')
                                        // Notification.remove('change_success')
                                        checkUpdate(localStorage.getItem('type'))
                                    }} loading={btnLoading} type='primary' size='small'>
                                    仅聊天
                                  </Button>
                                </span>
                            ),
                        })
                    }}
                    tips="补丁切换"
                />
                
                <Icon
                    Child={<IconDelete className="icon-child"/>}
                    onClick={()=>{
                        if(btnLoading){
                            Message.error({
                                style:{top:'20px'},
                                content:'正在安装中，请稍后再试！',
                                style:{top:'20px'},
                            }) 
                            return
                        }
                        window.tools.checkUpdate(localStorage.getItem('type') || 'r', (num)=>{
                            if(num !== 3){
                                Notification.warning({
                                    title:'确定要狠心卸载吗?',
                                    style,
                                    id:'unInstall',
                                    content:(
                                        <span>
                                            <Button type='primary' status='success' style={{marginRight:'10px'}} onClick={()=>{
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
                                            <Button onClick={()=>{Notification.remove('unInstall')}}>取消</Button>
                                        </span>
                                    )
                                },(err)=>{
                                    console.log(err)
                                })
                            }else{
                                install()
                            }
                        })
                    }}
                    tips="卸载补丁"
                />
                <Icon
                    Child={<IconBug className="icon-child"/>}
                    onClick={()=>{
                        setZf('qq')
                    }}
                    tips="联系我们"
                />
                <div className='nav-bottom'>
                    <Icon
                        Child={<IconWechat className="icon-child"/>}
                        onClick={()=>{
                            setZf('wx')
                        }}
                        tips="微信打赏"
                    />
                    <Icon
                        Child={<IconAlipayCircle className="icon-child"/>}
                        onClick={()=>{
                            setZf('zf')
                        }}
                        tips="支付宝打赏"
                    />
                </div>
            </div>
        </div>
        <Drawer 
            visible={drawer}
            footer={(
                <span>
                    {<Button onClick={()=>{
                        setMsgShow(true)
                    }}>发布通知</Button>}
                </span>
            )}
            onOk={() => {
                setDrawer(false);
            }}
            onCancel={() => {
                setDrawer(false);
            }}
            title="通知中心"
            escToExit
            width={350}
            closable={false}
            maskClosable
            style={{
                height:msgHeight,
                top:'40px'
            }}
            bodyStyle={{
                background:'rgb(104 104 104)',
                padding:0
            }}
        >
            <Collapse       
                style={{ width: '100%' }}
            >
                {
                    message.map((v, idx)=>{
                        if(v.del){
                            return null
                        }
                        return <CollapseItem style={{fontSize:'20px'}} key={v.id} header={<span>{`${v.title}-${v.username||'Subata'}`} {localStorage.getItem('userid')===v.id && <Button type='text' onClick={(e)=>{
                            e.preventDefault()
                            Notification.warning({
                                style,
                                id:'delmessage',
                                title:'确定要删除这条通知吗?',
                                content:<><Button onClick={()=>{
                                    apiPath.delMessage({id:v.msgid}).then(res=>{
                                        if(res.data.success){
                                            Message.success({
                                                style:{top:'20px'},
                                                content:'删除成功'
                                            })
                                        }
                                        Notification.remove('delmessage')
                                        ws.send(JSON.stringify({type:'del'}))
                                    })
                                }}>确定</Button></>
                            })
                        }}>删除</Button>}</span>} name={idx}>
                            <span dangerouslySetInnerHTML={{__html:v.msg.replace(/[\n]/g,'<br/>')}}></span>
                        </CollapseItem>
                    })
                }
            </Collapse>
        </Drawer>
        <Modal
            title=''
            simple
            style={{textAlign:'center'}}
            visible={show}
            onCancel={()=>{
                setZf('')
                setShow(false)
                if(zfType !== 'qq'){
                    Message.info({
                        content:'打赏将全部用于网站的维护，谢谢老板支持！',
                        style:{top:'20px'},
                        duration:2000
                    })
                }
            }}
            children={[<img key={1} className='zf-img' src={img} alt=''/>]}
            footer={null}
        />
        <Modal
            title='通知发布'
            style={{textAlign:'center'}}
            visible={msgShow}
            maskClosable={false}
            onCancel={()=>{
                setMsgShow(false)
            }}
            children={<>
                <Input 
                    placeholder='发布者'
                    type='text'
                    maxLength={15}
                    value={user}
                    onChange = {(val)=>{
                        setUser(val)
                        localStorage.setItem('username',val)
                    }}
                />
                <Input 
                    placeholder='标题'
                    type='text'
                    value={title}
                    onChange = {(val)=>{
                        setTitle(val)
                    }}
                />
                <Input.TextArea
                    placeholder='消息内容'
                    style={{
                        height:'300px'
                    }}
                    value={text}
                    onChange={(val)=>{
                        setText(val)
                    }}
                />
                {
                    root !== 'wizard101-subata-lsmhq' && <Input 
                        placeholder='管理员口令'
                        type='text'
                        value={root}
                        onChange = {(val)=>{
                            setRoot(val)
                            if(val === 'wizard101-subata-lsmhq'){
                                localStorage.setItem('root','wizard101-subata-lsmhq')
                            }
                        }}
                    />
                }
            </>}
            footer={(<span>
                {
                   root === 'wizard101-subata-lsmhq' && <Button type='primary' status='success' onClick={()=>{
                        
                        let data = {
                            msg:text,
                            title:title,
                            id:localStorage.getItem('userid'),
                            username:user,
                            msgid:Math.random()
                        }
                        if(text.length === 0) return
                        if(title.length === 0) return
                        if(user.length === 0) return
                        ws.send(JSON.stringify(data))
                        setMsgShow(false)
                    }}>发布</Button>
                }
            </span>)}
        />
    </div>    
}

export default Main