import { useEffect, useState} from 'react';
import '../css/main.css'
import { Spin, Carousel, Tabs, List, Button, Modal } from '@arco-design/web-react';
import logo from '../image/WizardLogoRA.png'
import { IconWechat, IconAlipayCircle, IconLink, IconApps, IconQq } from '@arco-design/web-react/icon';
import zfb from '../image/zfb.jpg'
import wechat from '../image/wechat.jpg'
import Icon from './components/Icon';
import QQ from '../image/QQ_share.jpg'
let { TabPane } = Tabs
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
    useEffect(() => {
        window.requestData.getImgs().then(res=>{
            setImgs([...res])
            setLoading(false)
        })
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
        return () => {
            
        };
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
    return <div className="main">
        <div className='bottom-bg'></div>
        <div className='nav' 
            onMouseDown={(e)=>{
                isDown = true 
                baseX = e.pageX
                baseY = e.pageY
                console.log(e)
            }}
        ></div>
        <div className='body'>
            <div className='left'>
                <div className='logo'>
                    <img src={logo} alt=''/>
                </div>
                <div className='carousel-main'>
                    <Spin dot loading={loading}>
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
                    <Button status='success' type='primary' className='openGame'>开始游戏</Button>
                </div>
            </div>
            <div className='right-nav'>
                <Icon
                    Child={<IconLink className="icon-child"/>}
                    onClick={()=>{
                        window.electronAPI.openBroswer('https://www.subata.top/')
                    }}
                    tips="前往Subata社区"
                />
                {/* <Icon
                    Child={<IconApps className="icon-child"/>}
                    onClick={()=>{
                        window.electronAPI.openBroswer('https://subata.top/index.php/2022/08/11/zwbdinstall/')
                    }}
                    tips="汉化补丁介绍"
                /> */}
                <Icon
                    Child={<IconQq className="icon-child"/>}
                    onClick={()=>{
                        setZf('qq')
                    }}
                    tips="加入我们"
                />
                <Icon
                    Child={<IconAlipayCircle className="icon-child"/>}
                    onClick={()=>{
                        setZf('zf')
                    }}
                    tips="支付宝打赏"
                />
                <Icon
                    Child={<IconWechat className="icon-child"/>}
                    onClick={()=>{
                        setZf('wx')
                    }}
                    tips="微信打赏"
                />
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
    </div>    

}

export default Main