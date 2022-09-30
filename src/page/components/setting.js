import { Anchor, Button, Switch, Form, Image, Radio } from '@arco-design/web-react'
import { useState, useEffect } from 'react'
import '../../css/setting.css'
// import { alertText } from '../util/dialog/index'
let { alertTextLive2d } = window.electronAPI
let AnchorLink = Anchor.Link
let models = [
    {
        name:'shizuku',
        label:'默认'
    },
    {
        name:'xxban',
        label:'血小板'
    },{
        name:'22-0default',
        label:'22'
    },
    // {
    //     name:'22_high',
    //     label:'22（high）'
    // },
    {
        name:'33-0default',
        label:'33'
    },
    // {
    //     name:'33_high',
    //     label:'33（high）'
    // },
    {
        name:'haruto',
        label:'小可爱(男)'
    },{
        name:'koharu',
        label:'小可爱(女)'
    },{
        name:'hijiki',
        label:'黑喵'
    },{
        name:'tororo',
        label:'白喵'
    },{
        name:'wanko',
        label:'碗狗'
    },
]
function Setting(props){
    let {setBg, setSubataShow} = props
    let [btnSetting, setbtnSetting] = useState(JSON.parse(localStorage.getItem('btnSetting')))
    let [btnSetting1, setbtnSetting1] = useState(JSON.parse(localStorage.getItem('btnSetting1')) || true)
    let [imgNum, setimgNum] = useState(localStorage.getItem('imgNum')? localStorage.getItem('imgNum')*1:0)
    // eslint-disable-next-line no-unused-vars
    let [imgs, setImgs] = useState([])
    let [path, setPath] = useState(window.wizPath)
    let [liveName, setLive2d] = useState(localStorage.getItem('live2d') || 'defalut')
    let [zhSound, setZhSound] = useState(false)
    let [live2dOpen, setlive2dOpen] = useState(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        // alert('window.wizPath')
        setPath(window.wizPath)
    })
    useEffect(()=>{
        // window.L2Dwidget.init({ 
        //     "model": {jsonPath:`./Resources/live2dModel/${liveName}/model.json`,"scale": 1 }, 
        //     // "dialog":{enable: true}
        //     display: {
        //         position: 'left',//位置
        //     },
        // });
    },[])
    useEffect(()=>{
        alertTextLive2d(`你选择了第${imgNum+1}个背景图`)

    }, [imgNum])
    return <div className="setting">
        <div className='setting-left'>
            <Anchor affix={false} hash={false} scrollContainer={'#setting-right'}>
                <AnchorLink href='#live2d-set' title='Live2d' />
                <AnchorLink href='#clear' title='清除缓存' />
            </Anchor>
        </div>
        <div className='setting-right' id='setting-right'>
            <div className='setting-item' id='live2d-set'>
                <Form>
                    <Form.Item label={'开关'}>
                        <Switch checked={live2dOpen} onChange={(val)=>{
                            console.log(val)
                            setlive2dOpen(val)
                            if(val){
                                window.electronAPI.openLive2d({
                                    modelName: localStorage.getItem('live2d') || 'shizuku'
                                })
                            }else{
                                window.electronAPI.closeLive2d()
                            }
                            window.electronAPI.closedLive2d(()=>{
                                setlive2dOpen(false)
                            })
                        }}
                        />
                        <span style={{paddingLeft:'10px'}}>
                        {
                            live2dOpen ?'开启':'关闭'
                        }
                        </span>
                    </Form.Item>
                    <Form.Item label={'模型'}>
                        <Radio.Group direction='vertical' defaultValue={liveName} onChange={(val)=>{
                        // console.log(val)
                        localStorage.setItem('live2d', val)
                        setLive2d(val)
                        if(live2dOpen){
                            window.electronAPI.closeLive2d()
                            window.electronAPI.openLive2d({
                                modelName: localStorage.getItem('live2d') || 'shizuku'
                            })
                            setTimeout(() => {
                                setlive2dOpen(true)
                            }, 500);
                        }
                        // alertTextLive2d('重启才能看到呦~')
                    }}>
                    {
                        models.map((item, index)=>{
                            return <Radio value={item.name} key={item.name}>
                                {item.label}
                            </Radio>
                        })
                    }
                    </Radio.Group>
                    </Form.Item>
                </Form>
            </div>
            <div className='setting-item' id='clear'>
                {/* <PageHeader title='初始化'/> */}
                <Button status='danger' type='primary' size='large' onClick={()=>{
                    window.tools.init(()=>{
                        localStorage.clear()
                        // 重启
                        alertTextLive2d('即将重启...')
                        setTimeout(() => {
                            window.electronAPI.restart()
                        }, 2000)
                    })
                }}>初始化所有</Button>
            </div>

        </div>
    </div>
}

export default Setting