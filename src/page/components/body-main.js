import { Spin, Carousel, Tabs, List, Button, Grid, Progress, Notification, AutoComplete, Form, Input, Checkbox, Modal, Message, Image  } from '@arco-design/web-react'
import { useEffect, useRef, useState } from 'react'
import LocalStorage_subata from '../util/localStroage'
import '../../css/shark.css'
import bodyBear from '../../image/body.png'
import emo1 from '../../image/emo1.png'
import emo2 from '../../image/emo2.png'
import emo3 from '../../image/emo3.png'
// import head1 from '../../image/headImg/icon_0.jpeg'
let headImgPath = 'image/headImg/'
const headImgs = new Array(19).fill(headImgPath).map((path, index)=>{
    return require(`../../${path}icon_${index}.jpeg`)
})
let localStorage_subata = new LocalStorage_subata({
    filter:['wizInstall', 'installPath', 'steamInstall', 'wizPath', 'gameDataPath']
})
let carouselIndex = 0
let { TabPane } = Tabs
let { Row, Col } = Grid
let style = {
    right:'50px',
    top:'20px'
}
let timerKill = null
function BodyMain(props){
    let { logo, imgs, loading, loading1, nav, btnLoading, percent, current, total, play, subataShow } = props
    const [data, setData] = useState(localStorage_subata.getItem('accounts')||[]);
    const [dataMap, setDataMap] = useState(localStorage_subata.getItem('accountsMap')||{});
    const [showLogin, setShowLogin] = useState(false)
    let [password, setPassword] = useState('')
    let [account, setAccount] = useState('')
    let [save, setSave] = useState(false)
    let [delable, setDelable] = useState(false)
    let [emo, setEmo] = useState(1)
    let [closedMask, setClosedMask] = useState(false)
    let [headIndex, setHeadIndex] = useState(-1)
    let [choseHead, setChoseHead] = useState(false)
    let submit = useRef()
    useEffect(()=>{
        if(!showLogin){
            setAccount('')
            setPassword('')
            document.onkeydown = null
        }
        if(showLogin){
            document.onkeydown = (e)=>{
                // console.log(e.keyCode)
                if(e.keyCode === 13){
                    console.log(e.keyCode)
                    submit.current.click()
                }
            }
        }
    },[showLogin])
    useEffect(()=>{
        if(data.length > 0){
            localStorage_subata.setItem('accounts', data)
            window.electronAPI.addAccount()
        }
    }, [data])
    useEffect(()=>{
        if(account && password){
            dataMap[account] = password
            localStorage_subata.setItem('accountsMap', {...dataMap})
            window.electronAPI.addAccount()
        }
    }, [dataMap])
    useEffect(()=>{
        let accounts = localStorage_subata.getItem('accounts') || []
        let index = accounts.findIndex(val=> {
            return val.account === account
        })
        console.log(index)
        if(index >= 0){
            setDelable(false)
            setHeadIndex(accounts[index].icon)
        }else{
            setDelable(true)
            setHeadIndex(-1)
        }
    },[account])
    return <div className='body-main'>
    <div className='body-main-top'>
        <div className='left'>
            <div className='logo' onClick={()=>{
                window.electronAPI.openBroswer('https://www.wizard101.com')
            }}>
                <img src={logo} alt=''/>
            </div>
            <div className='carousel-main'>
                <Spin dot tip="拼命中" style={{color:'white'}} loading={loading}>
                    <Carousel
                        // showArrow='hover'
                        // showArrow='never'
                        indicatorClassName="indicatorClassName"
                        // indicatorPosition='outer'
                        arrowClassName='arrowClassName'
                        animation='card'
                        style={{ width: 350}}
                        autoPlay={true}
                        onChange={(index)=>{
                            carouselIndex = index
                            // console.log(index)
                        }}
                    >
                        {imgs.map((img, index) => <div
                                className='carousel-img'
                                key={index}
                                style={{ width: '100%' }}
                                onClick={()=>{
                                    if(img.href && carouselIndex === index)
                                        window.electronAPI.openBroswer(img.href)
                                }}
                            >
                            <img
                                className='carousel-img'
                                style={{borderRadius:'10px'}}
                                key={index}
                                src={img.src}
                                alt=""
                            />
                            </div>
                        )}
                    </Carousel>
                </Spin>
            </div>
            <div className='tips'>
                <Tabs defaultActiveTab='0'  animation={true} scrollPosition='center'>
                    {
                        Object.keys(nav).sort((a, b) => b.length - a.length).map((title, idx)=>{
                            return <TabPane key={idx} className='tabPane' title={title}>
                            <List
                                dataSource={nav[title]}
                                loading={loading1}
                                // noDataElement={<></>}
                                render={(item, index) => <List.Item key={item.href} onClick={()=>{
                                    if(item.href)
                                        window.electronAPI.openBroswer(item.href)
                                }}>{item.title}</List.Item>}
                            />
                        </TabPane>
                        })
                    }
                </Tabs>
            </div>
        </div>
        <div className='right'>
            <div className='right-btn-group'>
                {
                    subataShow && <div className='subata-right-btn'>
                        <Button color='#4cc6e7' onClick={()=>{
                            window.electronAPI.openBroswer('https://www.subata.top')
                        }} type='primary' className='right-openGame subata-right-op' size='large'>
                            中文攻略(subata)
                        </Button>
                    </div>
                }
                <div className='subata-right-btn'>
                        <Button status='success' onClick={()=>{
                            if(play === 'true'){
                                setShowLogin(true)
                            }else{
                                document.getElementById('selectWiz').click()
                            }
                        }} type='primary' className='right-openGame' size='large'>
                            {play === 'true'?'开始游戏':'选择Wizard.exe'}
                        </Button>
                </div>
            </div>

        </div>
    </div>
    <div className='body-main-bottom'>
        {percent > 0 && <Progress formatText={()=><span style={{color:'white'}}>{`${(current / 1024 / 1024).toFixed(2)}MB / ${(total / 1024 / 1024).toFixed(2)}MB`}</span>} percent={percent} width='100%' color={'#00b42a'} style={{display:'block'}}/>}
    </div>
    <Modal 
        visible={showLogin}
        title=''
        focusLock={true}
        autoFocus={false}
        footer={null}
        className="login-modal"
        hideCancel={true}
        maskClosable = {false}
        onCancel={()=>{
            setShowLogin(false)
        }}
        children={<div className='login-right'>
            <div className='login-modal-bg'></div>
            <div className='shakeBox'>
                <div className='shake'>
                    <div className='shake-body' onClick={()=>{
                        setChoseHead(true)
                    }} onMouseEnter={()=>{
                        setEmo(2)
                    }} onMouseLeave={()=>{
                        setEmo(3)
                    }}>
                        { headIndex === -1 && <>
                            <img className='bodyImg'src={bodyBear} alt="body"/>
                            {emo === 1 && <img className='emo' src={emo1} alt='emo'/>}
                            {emo === 2 && <img className='emo' src={emo2} alt='emo'/>}
                            {emo === 3 && <img className='emo' src={emo3} alt='emo'/>}
                        </>}
                        {
                            headImgs.map((img, idx)=>{
                                return <>{ idx === headIndex && <img className='bodyImg animated fadeIn fast' src={img} alt=""/>}</>
                            })
                        }
                    </div>
                    <div onClick={()=>{
                        setClosedMask(!closedMask)
                    }} className={`shake-mask ${closedMask?'shake-mask-close':''}`}>
                        <div className='shake-mask-text'>秘</div>
                        <div className='shake-mask-bottom'></div>
                        <div className='shake-mask-switch'></div>
                    </div>
                </div>
            </div>
        {play==='true' && <Form>
               <Form.Item  style={{display:'flex',justifyContent:'center'}} label=''>
                   <AutoComplete 
                       strict = {true}
                       placeholder='账号' 
                       value={account}
                       data={data.map(account=>account.account)}
                        dropdownRender={(menu, idx)=>{
                            return <Row justify='center' align='center' key={idx} className='autoItem'>
                                <Col span={24} className="autoItem-col" >{menu}</Col>
                            </Row>
                        }}
                       onChange={(val)=>{
                            // console.log(val)  
                            setAccount(val)
                            setPassword(dataMap[val]?dataMap[val]:'')
                       }}
                   />
               </Form.Item>
               <Form.Item label=''  style={{display:'flex',justifyContent:'center'}}>
                   <Input.Password placeholder='密码' value={password} onChange={(val)=>{
                       setPassword(val)
                       if(val.length>0){
                            setClosedMask(true)
                       }else{
                            setClosedMask(false)
                       }
                   }}/>
               </Form.Item>
               <Form.Item label=''  style={{display:'flex',justifyContent:'center'}}>
                   <Checkbox checked={save} onChange={(val)=>{
                       console.log(val)
                       setSave(val)
                   }}>记住账号和密码</Checkbox>
               </Form.Item>
           </Form>}
           <div className='btn-group'>
            <div className='op-btn del-btn'>
                   <Button disabled={delable} size='large' status='danger' type='primary' className='openGame' onClick={()=>{
                        let accounts = localStorage_subata.getItem('accounts') || []
                        // console.log(accounts)
                        let index = accounts.findIndex(val=>val.account===account)
                        if(index > -1){
                            console.log(index)
                            accounts.splice(index, 1)
                            localStorage_subata.setItem('accounts', accounts)
                            let accountsObj = localStorage_subata.getItem('accountsMap')
                            delete accountsObj[account]
                            localStorage_subata.setItem('accountsMap', accountsObj)
                            setData([...accounts])
                            setDataMap({...accountsObj})
                            setAccount('')
                            setPassword('')
                        }
                   }}>删除{account && `[${account}]`}</Button>
            </div>
                <div className='op-btn'>
                    <Button ref={submit} onClick={()=>{
                        // ws.send(JSON.stringify({msg:'1111', title:'123123'}))
                        // console.log(localStorage.getItem('wizInstall'))
                        if(!account){
                            window.tools.startGame((message)=>{
                                if(message){
                                    Notification.error({
                                        id:'notInstallWizard101',
                                        style,
                                        title:'出现错误',
                                        content: message
                                    })
                                }else{
                                    Notification.success({
                                        id:'notInstallWizard101',
                                        style,
                                        title:'进入游戏中',
                                        content: '',
                                        duration: 2000,
                                        onClose:()=>{
                                            // window.tools.killExe('launchWizard101.exe')
                                            // window.tools.killExe('launchWizard101.exe')
                                            let next = localStorage_subata.getItem('btnSetting')
                                            // console.log(next)
                                            setShowLogin(false)
                                            if(next){
                                                window.electronAPI.mini()
                                            } 
                                        }
                                    })
                                }
                            })
                            return
                        }
                        if(!password){
                            Message.error({
                                style:{top:'10px'},
                                content:'请输入密码'
                            })
                            return
                        }
                        if(localStorage_subata.getItem('wizInstall')){
                            if(save){
                                    let index = data.findIndex(val=>val.account === account)
                                    if(index >= 0){
                                        data[index] = {account, icon: headIndex}
                                        setData([...data])
                                    }else{
                                        data.push({account, icon: headIndex})
                                        setData([...data])
                                    }
                                    dataMap[account] = password
                                    setDataMap({...dataMap})
                            }
                            clearInterval(timerKill)
                            window.tools.login(account, password, (flag, err)=>{
                                // console.log('flag',flag)
                                if(flag === true){
                                    Notification.error({
                                        id:'notInstallWizard101',
                                        style,
                                        title:'出现错误',
                                        content: err
                                    })
                                }else if(flag === false){
                                    // console.log(err.indexOf('100'))
                                    if(err.indexOf('100') > 0){
                                        Notification.success({
                                            id:'notInstallWizard101',
                                            style,
                                            title:'准备完成',
                                            content: err ,
                                            duration: 2000
                                        })
                                        setShowLogin(false)
                                    }
                                    Notification.info({
                                        id:'notInstallWizard101',
                                        style,
                                        title:'第一次启动需要一些准备工作',
                                        content: err
                                    })
                                    // window.tools.killExe('launchWizard101.exe')
                                }else if(flag === undefined){
                                    Notification.success({
                                        id:'notInstallWizard101',
                                        style,
                                        title:'进入游戏中',
                                        content: err,
                                        duration: 2000,
                                        onClose:()=>{
                                            // window.tools.killExe('launchWizard101.exe')
                                            // window.tools.killExe('launchWizard101.exe')
                                            let next = localStorage_subata.getItem('btnSetting')
                                            // console.log(typeof next)
                                            setShowLogin(false)
                                            if(next){
                                                window.electronAPI.mini()
                                            } 
                                        }
                                    })
                                }else if(flag === 1){
                                    Notification.success({
                                        id:'notInstallWizard101',
                                        style,
                                        title:'进入游戏中',
                                        content: err,
                                        duration: 2000,
                                        onClose:()=>{
                                            setShowLogin(false)
                                            // window.tools.killExe('launchWizard101.exe')
                                            // window.tools.killExe('launchWizard101.exe')
                                        }
                                    })
                                }
                            })
                        }else{   
                            let fileSelect = document.getElementById('selectWiz')
                            fileSelect.click()
                        }
                    }} status='success' loading={btnLoading} size='large' type='primary' className='openGame'>登录</Button>
                </div>
            </div>
       </div>}
    />
    <Modal
        visible={choseHead}
        title=''
        focusLock={true}
        closable={false}
        autoFocus={false}
        footer={null}
        className="login-modal"
        hideCancel={true}
        maskClosable = {false}
        onCancel={()=>{
            setChoseHead(false)
        }}
        children={<>
            <div className='setting-bg'>
                {/* <Image /> */}
                {
                    headImgs.map((img, idx)=>{
                        return <Image className={headIndex === idx?'arco-image-active':''} preview={false} onClick={()=>{
                            setHeadIndex(idx)
                            setChoseHead(false)
                        }} src={img} width={60} height={60}/>
                    })
                }
            </div>
        </>}
    />
</div>
}
export default BodyMain