import { Anchor, Button, Switch, Form, Image, Upload } from '@arco-design/web-react'
import { useState, useEffect } from 'react'
import '../../css/setting.css'
let AnchorLink = Anchor.Link
function Setting(props){
    let {setBg, setSubataShow} = props
    const [btnSetting, setbtnSetting] = useState(JSON.parse(localStorage.getItem('btnSetting')))
    const [btnSetting1, setbtnSetting1] = useState(JSON.parse(localStorage.getItem('btnSetting1')) || true)
    const [imgNum, setimgNum] = useState(localStorage.getItem('imgNum')? localStorage.getItem('imgNum')*1:0)
    const [imgs, setImgs] = useState([])
    const [path, setPath] = useState(window.wizPath)
    useEffect(() => {
        // alert('window.wizPath')
        setPath(window.wizPath)
    }, [window.wizPath])
    return <div className="setting">
        <div className='setting-left'>
            <Anchor affix={false} hash={false} 
                scrollContainer={'#setting-right'}
            >
                <AnchorLink href='#bg' title='自定义背景' />
                <AnchorLink href='#setting' title='按钮设置' />
                <AnchorLink href='#gameFile' title='游戏文件' />
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
                }}>定位游戏</Button>
                <br/><br/>
                <span>当前路径：</span>
                <span>{path}</span>
                {/* <br/><br/>
                <Button type='primary' size='large' onClick={()=>{
                    window.tools.checkFiles(path)
                }}>检查游戏基本文件</Button> */}
            </div>
            <div className='setting-item' id='clear'>
                {/* <PageHeader title='初始化'/> */}
                <Button status='danger' type='primary' size='large' onClick={()=>{
                    window.tools.init(()=>{
                        localStorage.clear()
                        // 重启
                        window.electronAPI.restart()
                    })
                }}>初始化所有</Button>
            </div>

        </div>
    </div>
}

export default Setting