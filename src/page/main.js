import { useEffect, useState} from 'react';
import '../css/main.css'
import { Spin, Carousel, Tabs, List, Button, Modal, Notification, Progress, Drawer, Badge, Collapse  } from '@arco-design/web-react';
import logo from '../image/WizardLogoRA.png'
import { IconWechat, IconAlipayCircle, IconLink, IconThumbUp, IconQq, IconSettings, IconClose, IconMinus, IconThunderbolt, IconNotification } from '@arco-design/web-react/icon';
import zfb from '../image/zfb.jpg'
import wechat from '../image/wechat.jpg'
import Icon from './components/Icon';
import QQ from '../image/QQ_share.jpg'
import su from '../image/Subata_logo.png'
let { TabPane } = Tabs
let CollapseItem = Collapse.Item
let style = {
    right:'40px',
    top:'30px'
}
Notification.config({
    maxCount:'3',
    duration:5000
})
let imgMap = {
    qq:QQ,
    wx:wechat,
    zf:zfb
}
let isDown = false;  // 鼠标状态
let baseX = 0,baseY = 0; //监听坐标
function Main(){
    const [loading, setLoading] = useState(true)
    const [imgs, setImgs] = useState([])
    const [show, setShow] = useState(false)
    const [zfType, setZf] = useState('')
    const [img, setImg] = useState('')
    const [percent, setPercent] = useState(0)
    const [drawer, setDrawer] = useState(false)
    const [count, setCount] = useState(0)
    useEffect(() => {
        // window.requestData.getImgs().then(res=>{
        //     setImgs([...res])
        //     setLoading(false)
        // })
        document.addEventListener('mousemove',function(ev){
            if(isDown){
              const x = ev.screenX - baseX
              const y = ev.screenY - baseY
                window.electronAPI.sendXY({
                    x,y
                })
            }
        })
        document.addEventListener('mouseup',()=>{
            isDown = false
        })
        document.body.setAttribute('arco-theme', 'dark');
        // upDate()
        // let ws = new WebSocket('')
        // ws.onmessage(()=>{
            
        // })
        // ws.send()
        return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    useEffect(()=>{
        if(zfType !== '')
            setImg(imgMap[zfType])
    },[zfType])
    useEffect(()=>{
        if(img)
            setShow(true)
    },[img])
    function upDate(){
        Notification.warning({
            title:'当前有最新的补丁！是否进行更新？',
            style:{
                right:'40px',
                top:'30px'
            },
            closable:false,
            btn: (
                <span>
                  <Button
                    type='primary'
                    size='small'
                    style={{ margin: '0 12px' }}
                  >
                    全汉化更新
                  </Button>
                  <Button type='primary' size='small'>
                    仅剧情更新
                  </Button>
                </span>
            ),
        })
    }
    return <div className="main">
        <div className='bottom-bg'></div>
        <div className='nav' 
            onMouseDown={(e)=>{
                isDown = true 
                baseX = e.pageX
                baseY = e.pageY
                console.log(e)
            }}
        >
            <div className='nav-logo'><img alt='' src={su}/></div>
            <div className='nav-title'>Subata</div>
            <div className='nav-control'>
                <div className='control-btn'>
                    <IconMinus style={{fontSize:'20px'}}/>
                </div>
                <div className='control-btn btn-danger'>
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
                                style={{ width: 350}}
                                autoPlay={true}
                                >
                                    
                                        {imgs.map((src, index) => (
                                            <div
                                            key={index}
                                            style={{ width: '100%' }}
                                            >
                                            <img
                                                src={src}
                                                style={{ width: '100%' }}
                                                alt=""
                                            />
                                            </div>
                                        ))}

                                </Carousel>
                            </Spin>
                        </div>
                        <div className='tips'>
                            <Tabs defaultActiveTab='1' animation={true}>
                                <TabPane key='1' className='tabPane' title='新闻'>
                                    <List
                                        dataSource={[
                                        '事件1',
                                        '事件1',
                                        '事件1',
                                        ]}
                                        render={(item, index) => <List.Item key={index}>{item}</List.Item>}
                                    />
                                </TabPane>
                                <TabPane key='2' title='活动'>
                                    <List
                                        dataSource={[
                                        '活动',
                                        '活动',
                                        '活动',
                                        ]}
                                        render={(item, index) => <List.Item key={index}>{item}</List.Item>}
                                    />
                                </TabPane>
                            </Tabs>
                        </div>
                    </div>
                    <div className='right'>
                        <div className='op-btn'>
                            <Button onClick={()=>{
                                setInterval(() => {
                                    // if(percent === 100){
                                    //     setPercent(0)
                                    //     return
                                    // }
                                    // percent = percent + 1
                                    // setPercent(percent)
                                }, 100);
                            }} status='success' type='primary' className='openGame'>开始游戏</Button>
                        </div>
                    </div>
                </div>
                <div className='body-main-bottom'>
                    <Progress percent={percent} width='100%' color={'#00b42a'} showText={false} style={{display:'block'}}/>
                </div>
            </div>

            <div className='right-nav'>
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
                            closable: false,
                            title: '',
                            content: '您的支持就是我们最大的动力！',
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
                    }}
                    tips="一键裸连"
                />
                <Icon
                    Child={<IconQq className="icon-child"/>}
                    onClick={()=>{
                        setZf('qq')
                    }}
                    tips="联系我们"
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
                            closable:false,
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
                    tips="补丁设置"
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
            }}
            children={[<img className='zf-img' src={img} alt=''/>]}
            footer={null}
        />
        <Drawer 
            visible={drawer}
            footer={null}
            title="通知中心"
            escToExit
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
                        return <CollapseItem style={{fontSize:'20px'}} header='消息标题' name={v}>
                            消息1消息1消息1消息1消息1消息1消息1消息1消息1
                        </CollapseItem>
                    })
                }
            </Collapse>
        </Drawer>
    </div>    

}

export default Main