import { Anchor, Button, Switch, Form, Image } from '@arco-design/web-react'
import { useState, useEffect } from 'react'
import '../../css/setting.css'
// import { alertText } from '../util/dialog/index'
// let { alertTextLive2d } = window.electronAPI
let AnchorLink = Anchor.Link
// let models = [
//     {
//         name:'shizuku',
//         label:'默认'
//     },
//     {
//         name:'xxban',
//         label:'血小板'
//     },{
//         name:'22-0default',
//         label:'22'
//     },{
//         name:'33-0default',
//         label:'33'
//     },{
//         name:'haruto',
//         label:'小可爱(男)'
//     },{
//         name:'koharu',
//         label:'小可爱(女)'
//     },{
//         name:'hijiki',
//         label:'黑喵'
//     },{
//         name:'tororo',
//         label:'白喵'
//     },{
//         name:'wanko',
//         label:'碗狗'
//     },
// ]
function Setting(props){
    let {setBg, setSubataShow} = props
    let [btnSetting, setbtnSetting] = useState(localStorage.getItem('btnSetting')|| true)
    let [btnSetting1, setbtnSetting1] = useState(localStorage.getItem('btnSetting1') || true)
    let [btnSetting2, setbtnSetting2] = useState(localStorage.getItem('btnSetting2') || true)
    let [imgNum, setimgNum] = useState(localStorage.getItem('imgNum')? localStorage.getItem('imgNum')*1:0)
    // eslint-disable-next-line no-unused-vars
    let [imgs, setImgs] = useState([])
    let [path, setPath] = useState(window.wizPath)
    // let [liveName, setLive2d] = useState(localStorage.getItem('live2d') || 'defalut')
    let [zhSound, setZhSound] = useState(false)
    // let [live2dOpen, setlive2dOpen] = useState(false)
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
        if(localStorage.getItem('btnSetting2') === null){
            localStorage.setItem('btnSetting2', true)
        }
        if(localStorage.getItem('btnSetting1') === null){
            localStorage.setItem('btnSetting1', true)
        }
        if(localStorage.getItem('btnSetting') === null){
            localStorage.setItem('btnSetting', true)
        }
    },[])
    useEffect(()=>{
        // alertTextLive2d(`你选择了第${imgNum+1}个背景图`)

    }, [imgNum])
    return <div className="setting">
        <div className='setting-left'>
            <Anchor affix={false} hash={false} scrollContainer={'#setting-right'}>
                <AnchorLink href='#setting' title='按钮设置' />
                <AnchorLink href='#clear' title='清除缓存' />
                {/* <AnchorLink href='#bug' title='bug上报' /> */}
            </Anchor>
        </div>
        <div className='setting-right' id='setting-right'>
            <div className='setting-item' id='setting'>
                {/* <PageHeader title='按钮设置'/> */}
                <Form>
                    <Form.Item label={'开始游戏'}>
                        <Switch checked={JSON.parse(btnSetting)} onChange={(val)=>{
                            console.log(val)
                            setbtnSetting(val)
                            // true 开始游戏最小化
                            // false 开始游戏不进行操作
                            localStorage.setItem('btnSetting', val)
                        }}
                        />
                        <span style={{paddingLeft:'10px'}}>
                        {
                            JSON.parse(btnSetting) ?'启动游戏自动最小化':'启动游戏后不进行操作'
                        }
                        </span>
                    </Form.Item>
                    <Form.Item label="Subata">
                        <Switch checked={JSON.parse(btnSetting1)} onChange={(val)=>{
                            // console.log(val)
                            setbtnSetting1(val)
                            setSubataShow(val)
                            // true 开始游戏最小化
                            // false 开始游戏不进行操作
                            localStorage.setItem('btnSetting1', val)
                        }}
                        />
                        <span style={{paddingLeft:'10px'}}>
                        {
                            JSON.parse(btnSetting1) ?'显示':'隐藏'
                        }
                        </span>
                    </Form.Item>
                    <Form.Item label="关闭按钮">
                        <Switch checked={JSON.parse(btnSetting2)} onChange={(val)=>{
                            // console.log(val)
                            setbtnSetting2(val)
                            // true 开始游戏最小化
                            // false 开始游戏不进行操作
                            localStorage.setItem('btnSetting2', val)
                        }}
                        />
                        <span style={{paddingLeft:'10px'}}>
                        {
                            JSON.parse(btnSetting2) ?'后台运行':'退出程序'
                        }
                        </span>
                    </Form.Item>
                </Form>
            </div>
            <div className='setting-item' id='clear'>
                {/* <PageHeader title='初始化'/> */}
                <Button status='danger' type='primary' size='large' onClick={()=>{
                    window.tools.init(()=>{
                        localStorage.clear()
                        // 重启
                        // alertTextLive2d('即将重启...')
                        // setTimeout(() => {
                            window.electronAPI.restart()
                        // }, 2000)
                    })
                }}>初始化所有</Button>
            </div>

        </div>
    </div>
}

export default Setting