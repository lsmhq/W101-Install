import { useEffect, useState} from 'react';
import '../css/main.css'
import { Spin, Carousel, Tabs, List, Button, Modal, Notification, Progress, Drawer, Collapse  } from '@arco-design/web-react';
import logo from '../image/WizardLogoRA.png'
import { IconWechat, IconAlipayCircle, IconCloudDownload, IconLink, IconThumbUp, IconQq, IconSettings, IconClose, IconMinus, IconThunderbolt, IconNotification } from '@arco-design/web-react/icon';
import zfb from '../image/zfb.jpg'
import wechat from '../image/wechat.jpg'
import Icon from './components/Icon';
import QQ from '../image/QQ_share.jpg'
import su from '../image/Subata_logo.png'
import apiPath from './http/api'
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
let imgMap = {
    qq:QQ,
    wx:wechat,
    zf:zfb
}
let isDown = false;  // 鼠标状态
let baseX = 0,baseY = 0; //监听坐标
let timer = null // 计时器
function Main(){
    let [loading, setLoading] = useState(true)
    let [imgs, setImgs] = useState([])
    let [show, setShow] = useState(false)
    let [zfType, setZf] = useState('')
    let [img, setImg] = useState('')
    let [percent, setPercent] = useState(0)
    let [drawer, setDrawer] = useState(false)
    let [count, setCount] = useState(0)
    let [news, setNews] = useState([])
    let [activity, setActivity] = useState([])
    useEffect(() => {
        window.requestData.getImgs().then(res=>{
            setImgs([...res])
            setLoading(false)
        })
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
        document.body.setAttribute('arco-theme', 'dark');
        upDate()
        // let ws = new WebSocket('')
        // ws.onmessage(()=>{
            
        // })
        // ws.send()
        apiPath.mainPage().then(res=>{
            if(res.status === 200){
                setActivity([...res.data.activity])
                setNews([...res.data.news])
            }
        })
        return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    useEffect(()=>{
        setImg(imgMap[zfType])
    },[zfType])
    useEffect(()=>{
        if(img)
            setShow(true)
    },[img])
    function upDate(){
        Notification.warning({
            title:'当前有最新的补丁！是否进行更新？',
            id:'update',
            style,
            duration:1000000000,
            // closable:false,
            btn: (
                <span>
                  <Button
                    type='primary'
                    size='small'
                    style={{ margin: '0 12px' }}
                    onClick={downLoad}
                  >
                    全汉化更新
                  </Button>
                  <Button onClick={downLoad} type='primary' size='small'>
                    仅剧情更新
                  </Button>
                </span>
            ),
        })
    }
    function downLoad(){
        clearInterval(timer)
        let p = 0
        timer = setInterval(() => {
            if(p >= 100){
                p = 0
                setPercent(0)
                clearInterval(timer)
                window.electronAPI.sound()
                Notification.success({
                    content:'更新成功！请重启游戏体验！',
                    duration:2000,
                    style
                })
                return
            }
            setPercent(p++)
        }, 100);
    }
    return <div className="main">
        <div className='bottom-bg'></div>
        <div className='nav' 
            onMouseDown={(e)=>{
                isDown = true 
                baseX = e.clientX
                baseY = e.clientY
                console.log(baseX, baseY)
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
                                        render={(item, index) => <List.Item key={item} onClick={()=>{
                                            window.electronAPI.openBroswer(item.url)
                                        }}>{item.title}</List.Item>}
                                    />
                                </TabPane>
                                <TabPane key='2' title='活动'>
                                    <List
                                        dataSource={activity}
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
                                downLoad()
                            }} status='success' type='primary' className='openGame'>开始游戏</Button>
                        </div>
                    </div>
                </div>
                <div className='body-main-bottom'>
                    <Progress percent={percent} width='100%' color={'#00b42a'} style={{display:'block'}}/>
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
                    Child={<IconLink className="icon-child"/>}
                    onClick={()=>{
                        window.electronAPI.openBroswer('https://www.subata.top/')
                    }}
                    tips="前往社区"
                />
                <Icon
                    Child={<IconThumbUp className="icon-child"/>}
                    onClick={()=>{
                        Notification.success({
                            // closable: false,
                            title: '',
                            content: '您的支持就是我最大的动力！',
                            style,
                            showIcon:false
                        })
                    }}
                    tips="给灭火器点个赞"
                />              
                <Icon
                    Child={<IconThunderbolt className="icon-child"/>}
                    onClick={()=>{
                        // setZf('qq')
                        window.tools.connect(()=>{
                            Notification.success({
                                content:'修改host文件成功，可以尝试在不用加速器的情况下进行游戏！',
                                style
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
                            title:'切换补丁',
                            // closable:false,
                            showIcon:false,
                            id:'change_bd',
                            style,
                            btn: (
                                <span style={{display:'flex'}}>
                                  <Button
                                    type='primary'
                                    size='small'
                                    status= 'warning'
                                    style={{ margin: '0 12px' }}
                                    onClick={()=>{
                                        Notification.remove('change_bd')
                                        Notification.success({content:'切换成功', style})
                                    }}
                                  >
                                    全汉化
                                  </Button>
                                  <Button onClick={()=>{
                                        Notification.remove('change_bd')
                                        Notification.success({content:'切换成功', style})
                                    }} type='primary' status='success' size='small' style={{ margin: '0 12px 0 0' }}>
                                    仅剧情
                                  </Button>
                                  <Button onClick={()=>{
                                        Notification.remove('change_bd')
                                        Notification.success({content:'切换成功', style})
                                    }} type='primary' size='small'>
                                    仅聊天
                                  </Button>
                                </span>
                            ),
                        })
                    }}
                    tips="补丁切换"
                />
                <Icon
                    Child={<IconCloudDownload className="icon-child"/>}
                    count={count}
                    onClick={()=>{
                        Notification.info({
                            title:'安装补丁',
                            // closable:false,
                            showIcon:false,
                            id:'change_bd',
                            style,
                            btn: (
                                <span style={{display:'flex'}}>
                                  <Button
                                    type='primary'
                                    size='small'
                                    status= 'warning'
                                    style={{ margin: '0 12px' }}
                                    onClick={()=>{
                                        window.tools.downLoad('d',(mark)=>{
                                            Notification.info({
                                                content:mark,style
                                            })
                                        },(total, currentTotal)=>{
                                            console.log(currentTotal / total)
                                            setPercent(Number.parseInt((( currentTotal / total ).toFixed(2) * 100)))
                                        }, (err)=>{
                                            if(err)
                                                console.log(err)
                                        })
                                    }}
                                  >
                                    全汉化
                                  </Button>
                                  <Button onClick={()=>{
                                        Notification.remove('change_bd')
                                        Notification.success({content:'切换成功', style})
                                    }} type='primary' status='success' size='small' style={{ margin: '0 12px 0 0' }}>
                                    仅剧情
                                  </Button>
                                  <Button onClick={()=>{
                                        Notification.remove('change_bd')
                                        Notification.success({content:'切换成功', style})
                                    }} type='primary' size='small'>
                                    仅聊天
                                  </Button>
                                </span>
                            ),
                        })
                    }}
                    tips="补丁安装"
                />
                <Icon
                    Child={<IconQq className="icon-child"/>}
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
        <Modal
            title=''
            simple
            style={{textAlign:'center'}}
            visible={show}
            onCancel={()=>{
                setZf('')
                setShow(false)
                Notification.info({
                    content:'打赏的全部收入将用于Subata服务器中，谢谢老板！',
                    style,
                    showIcon:false,
                    duration:2000
                })
            }}
            children={[<img className='zf-img' src={img} alt=''/>]}
            footer={null}
        />
        <Drawer 
            visible={drawer}
            footer={null}
            title="通知中心"
            escToExit
            closable={false}
            maskClosable
            style={{
                height:'94%',
                top:'6%'
            }}
            bodyStyle={{
                background:'rgb(104 104 104)',
                padding:0
            }}
            onCancel={()=>{setDrawer(false)}}
        >
            <Collapse       
                style={{ width: '100%' }}
            >
                {
                    [1,2,3,4,5].map((v)=>{
                        return <CollapseItem style={{fontSize:'20px'}} key={v} header='消息标题' name={v}>
                            消息1消息1消息1消息1消息1消息1消息1消息1消息1
                        </CollapseItem>
                    })
                }
            </Collapse>
        </Drawer>
    </div>    

}

export default Main