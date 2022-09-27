import { Anchor, Button, Switch, Form, Image, Radio } from '@arco-design/web-react'
import { useState, useEffect } from 'react'
import '../../css/setting.css'
import { alertText } from '../util/dialog/index'
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
    },{
        name:'33-0default',
        label:'33'
    },{
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
        alertText(`你选择了第${imgNum+1}个背景图`)
    }, [imgNum])
    return <div className="setting">
        <div className='setting-left'>
            <Anchor affix={false} hash={false} scrollContainer={'#setting-right'}>
                <AnchorLink href='#bg' title='自定义背景' />
                <AnchorLink href='#setting' title='按钮设置' />
                <AnchorLink href='#gameFile' title='游戏文件' />
                <AnchorLink href='#live2d-set' title='Live2d设置' />
                <AnchorLink href='#language' title="实验性功能"/>
                <AnchorLink href='#clear' title='清除缓存' />
                {/* <AnchorLink href='#bug' title='bug上报' /> */}
            </Anchor>
        </div>
        <div className='setting-right' id='setting-right'>
            <div className='setting-item' id='bg'>
                {/* <PageHeader title='自定义背景图'/> */}
                <div className='setting-bg'>
                    <Image onClick={()=>{
                        setimgNum(0)
                        setBg(0)
                        localStorage.setItem('imgNum', 0)
                    }} className={imgNum === 0?'arco-image-active':''} preview={false} style={{objectFit:'cover'}} width={100} height={100} src='https://vkceyugu.cdn.bspapp.com/VKCEYUGU-a3e579e1-12c0-4985-8d49-3ab58c03387a/c3e29bb5-d5a0-4799-a544-264e310356aa.jpg'/>
                    <Image onClick={()=>{
                        setimgNum(1)
                        setBg(1)
                        localStorage.setItem('imgNum', 1)
                    }}  className={imgNum === 1?'arco-image-active':''} preview={false} style={{objectFit:'cover'}} width={100} height={100} src='https://vkceyugu.cdn.bspapp.com/VKCEYUGU-a3e579e1-12c0-4985-8d49-3ab58c03387a/151d0d95-b330-4ca8-9de7-d0336aed9872.webp'/>
                    {
                        imgs.map((img, index)=>{
                            return <Image key={index} onClick={()=>{
                                setimgNum(index + 2)
                                setBg(index + 2)
                                localStorage.setItem('imgNum', index + 2)
                            }} className={(index + 2 === index)?'arco-image-active':''} preview={false} style={{objectFit:'cover'}} width={100} height={100} src={img}/>
                        })
                    }
                    {/* <Upload
                        
                        showUploadList={false}
                        onChange={(_, currentFile) => {
                            console.log(URL.createObjectURL(currentFile.originFile))
                            imgs.push(URL.createObjectURL(currentFile.originFile))
                            setImgs([...imgs])
                        }}
                    ></Upload> */}
                </div>
            </div>
            <div className='setting-item' id='setting'>
                {/* <PageHeader title='按钮设置'/> */}
                <Form>
                    <Form.Item label={'开始游戏'}>
                        <Switch checked={btnSetting} onChange={(val)=>{
                            console.log(val)
                            setbtnSetting(val)
                            // true 开始游戏最小化
                            // false 开始游戏不进行操作
                            localStorage.setItem('btnSetting', val)
                        }}
                        />
                        <span style={{paddingLeft:'10px'}}>
                        {
                            btnSetting ?'启动游戏自动最小化':'启动游戏后不进行操作'
                        }
                        </span>
                    </Form.Item>
                    <Form.Item label="Subata">
                        <Switch checked={btnSetting1} onChange={(val)=>{
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
                            btnSetting1 ?'显示':'隐藏'
                        }
                        </span>
                    </Form.Item>
                </Form>
            </div>
            <div className='setting-item' id='gameFile'>
                {/* <PageHeader title='初始化'/> */}
                <Button type='primary' size='large' onClick={()=>{
                    window.tools.openFile(path)
                    window.electronAPI.mini()
                }}>定位游戏</Button>
                <br/><br/>
                <span>当前路径：</span>
                <span>{path?path:<Button onClick={()=>{
                        console.log(localStorage.getItem('wizInstall'))
                        let fileSelect = document.getElementById('selectWiz')
                        fileSelect.click()
                    }} status='success' type='primary'>{'选择Wizard.exe'}</Button>}</span>
                {/* <br/><br/>
                <Button type='primary' size='large' onClick={()=>{
                    window.tools.checkFiles(path)
                }}>检查游戏基本文件</Button> */}
            </div>
            <div className='setting-item' id='live2d-set'>
                <Radio.Group direction='vertical' defaultValue={liveName} onChange={(val)=>{
                    // console.log(val)
                    localStorage.setItem('live2d', val)
                    setLive2d(val)
                    // if(document.querySelector('#live2d-widget')){
                    //     document.querySelector('#live2d-widget').remove();
                    // }
                    // setTimeout(() => {
                    //     window.initLive2d()
                    // }, 100);
                    // Message.warning({
                    //     id:'live2d-change',
                    //     style:{top:'20px', zIndex:99999},
                    //     content:'重启生效',
                    // })
                    alertText('重启才能看到呦~')
                }}>
                {
                    models.map((item, index)=>{
                        return <Radio value={item.name} key={item.name}>
                            {item.label}
                        </Radio>
                    })
                }
                </Radio.Group>
            </div>
            <div className='setting-item' id='language'>
                <Form>
                    <Form.Item label={'语音'}>
                        <Switch checked={zhSound} onChange={(val)=>{
                            console.log(val)
                            // true 开始游戏最小化
                            // false 开始游戏不进行操作
                            localStorage.setItem('zhSound', val)
                            setZhSound(val)
                            if(val){
                                alertText('还没有正式上线哦~')
                            }
                        }}
                        />
                        <span style={{paddingLeft:'10px'}}>
                        {
                            zhSound ?'中文':'英文'
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
                        alertText('即将重启...')
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