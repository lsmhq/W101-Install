import { Spin, Carousel, Tabs, List, Button, Grid, Notification,Progress, AutoComplete, Form, Input, Checkbox, Modal, Message, Image } from '@arco-design/web-react'
import { useEffect, useRef, useState } from 'react'
import LocalStorage_subata from '../util/localStroage'
import '../../css/shark.css'
import bodyBear from '../../image/body.png'
import emo1 from '../../image/emo1.png'
import emo2 from '../../image/emo2.png'
import emo3 from '../../image/emo3.png'
import apiPath from '../http/api'
import '../../i18n';
import { useTranslation } from 'react-i18next'
// import head1 from '../../image/headImg/icon_0.jpeg'
// let headImgPath = 'image/headImg/'
// const headImgs = new Array(19).fill(headImgPath).map((path, index)=>{
//     return require(`../../${path}icon_${index}.jpeg`)
// })
let { getItem, setItem } = new LocalStorage_subata({
    filter:['wizInstall', 'installPath', 'steamInstall', 'wizPath', 'gameDataPath']
})
let carouselIndex = 0
let { TabPane } = Tabs
let { Row, Col } = Grid
let style = {
    right: '50px',
    top: '20px'
}
let headImgMap ={}
let timerKill = null
function BodyMain(props){
    let { imgs, loading, loading1, nav, btnLoading, play, subataShow, onlineNum, percent } = props
    const [data, setData] = useState(getItem('accounts')||[]);
    const [dataMap, setDataMap] = useState(getItem('accountsMap')||{});
    const [showLogin, setShowLogin] = useState(false)
    let [password, setPassword] = useState('')
    let [account, setAccount] = useState('')
    let [save, setSave] = useState(false)
    // let [delable, setDelable] = useState(false)
    let [emo, setEmo] = useState(1)
    let [closedMask, setClosedMask] = useState(false)
    let [headIndex, setHeadIndex] = useState(-1)
    let [choseHead, setChoseHead] = useState(false)
    let [headImgs, setHeadImgs] = useState([])
    let [headKey, setHeadKey] = useState('')
    let [headType, setHeadType] = useState('')
    let submit = useRef()
    let {t:translation} = useTranslation()
    useEffect(()=>{
        // console.log('accounts----->',getItem('accounts')) 
        let newAccounts = getItem('accounts')?.map((account, idx)=>{
            console.log(typeof account)
            if(typeof account !== 'object'){
                return {account, icon: -1, iconType: 'wizard101'}
            }else if(typeof account === 'object'){
                if(!account.iconType){
                    return {account: account.account, icon: -1, iconType: 'wizard101'}
                }
            }
            return account
        })
        // console.log(newAccounts)
        setItem('accounts', newAccounts || [])
        setData(newAccounts || [])
        apiPath.getHeadImg().then(res=>{
            if(res.data.success){
                // console.log(res.data.imgs)
                setHeadImgs([...res.data.imgs])
                setHeadKey('wizard101')
                headImgMap = res.data.data
            }
        })
    },[])
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
            setItem('accounts', data)
            window.electronAPI.addAccount()
        }
    }, [data])
    useEffect(()=>{
        if(account && password){
            dataMap[account] = password
            setItem('accountsMap', {...dataMap})
            window.electronAPI.addAccount()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataMap])
    useEffect(()=>{
        let accounts = getItem('accounts') || []
        let index = accounts.findIndex(val=> {
            return val.account === account
        })
        // console.log(index)
        if(index >= 0){
            // setDelable(false)
            setHeadIndex(accounts[index].icon)
            setHeadKey(accounts[index]?.iconType || 'wizard101')
        }else{
            // setDelable(true)
            setHeadIndex(-1)
            // setHeadType(accounts[index]?.iconType || 'wizard101')
            setHeadKey(accounts[index]?.iconType || 'wizard101')
        }
    },[account])
    useEffect(()=>{
        let accounts = getItem('accounts') || []
        let index = accounts.findIndex(val=> {
            return val.account === account
        })
        if(index >= 0){
            accounts[index].icon = headIndex
            accounts[index].iconType = headKey
            console.log(accounts)
            setData([...accounts])
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[headIndex])
    useEffect(() => {
        if(headKey && headImgMap[headKey]){
            setHeadImgs([...headImgMap[headKey]])
        }
    }, [headKey])
    function getMain(){
        return document.getElementsByClassName('main')[0]
    }
    return <div className='body-main'>
    <div className='body-main-top'>
        <div className='left'>
            {/* <div className='logo' onClick={()=>{
                window.electronAPI.openBroswer('https://www.wizard101.com')
            }}>
                <img src={logo} alt=''/>
            </div> */}
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
                            {translation('Introduction')}(subata)
                        </Button>
                    </div>
                }
                <div className='subata-right-btn'>
                        <Button status='success' onClick={()=>{
                            if(play){
                                setShowLogin(true)
                            }else{
                                document.getElementById('selectWiz').click()
                            } 
                        }} type='primary' className='right-openGame' size='large'>
                            {play?<>{translation('Start Game')} · <span>{onlineNum}</span></>:`${translation('Choice')}Wizard.exe`}
                        </Button>
                </div>
            </div>
        </div>
    </div>
    <div className='body-main-bottom'>
        {percent > 0 && <Progress formatText={()=><span>{(percent*100).toFixed(0)}%</span>} percent={percent*100} width='100%' color={'#00b42a'} style={{display:'block'}}/>}
    </div>
    <Modal 
        visible={showLogin}
        title=''
        focusLock={false}
        autoFocus={false}
        footer={null}
        className="login-modal"
        hideCancel={true}
        unmountOnExit = {true}
        mountOnEnter= {false}
        getPopupContainer={getMain}
        maskClosable = {true}
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
                                return <div key={idx}>{ idx === headIndex && <img className='bodyImg-bg animated fadeIn fast' src={img} alt=""/>}</div>
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
        {play && <Form>
               <Form.Item  style={{display:'flex',justifyContent:'center'}} label=''>
                   <AutoComplete 
                       strict = {true}
                       placeholder={translation('Account')}
                       value={account}
                       allowClear={true}
                       data={data.map(account=><AutoComplete.Option style={{height: '70px'}} key={account.account} value={account.account}>
                            <Row style={{margin:'5px', display:'flex', alignItems:'center'}}>
                                <Col span={5}>
                                    {headImgMap[account.iconType] && <img className='sl-headImg' width={30} alt='' src={headImgMap[account.iconType][account.icon]}/>}
                                </Col>
                                <Col span={15}>
                                    <span>{account.account}</span>
                                </Col>
                                <Col span={4}>
                                    <Button size='large' status='danger' type='primary' className='openGame' onClick={(e)=>{
                                        e.stopPropagation()
                                        let accounts = getItem('accounts') || []
                                        // console.log(accounts)
                                        let index = accounts.findIndex(val=>val.account === account.account)
                                        if(index > -1){
                                            console.log(index)
                                            accounts.splice(index, 1)
                                            setItem('accounts', accounts)
                                            let accountsObj = getItem('accountsMap')
                                            delete accountsObj[account.account]
                                            setItem('accountsMap', accountsObj)
                                            setData([...accounts])
                                            setDataMap({...accountsObj})
                                            setAccount('')
                                            setPassword('')
                                        }
                                    }}>{translation('Del')}</Button>
                                </Col>
                            </Row>
                        </AutoComplete.Option>)}
                        dropdownRender={(menu, idx)=>{
                            return<span key={idx}>{menu}</span> 
                        }}
                       onChange={(val)=>{
                            // console.log(val)  
                            setAccount(val)
                            setPassword(dataMap[val]?dataMap[val]:'')
                       }}
                   />
               </Form.Item>
               <Form.Item label=''  style={{display:'flex',justifyContent:'center'}}>
                   <Input.Password placeholder={translation('Password')} value={password} onChange={(val)=>{
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
                   }}>{translation('Remember')}</Checkbox>
               </Form.Item>
               {/* <Row style={{marginTop:'-15px'}}>
                   <Col offset={2}>
                        <Form.Item label='启动方式'  style={{display:'flex',justifyContent:'center'}}>
                            <Radio.Group>
                                <Radio value='d'>全部汉化</Radio>
                                <Radio value='r'>汉化剧情</Radio>
                                <Radio value='c'>仅聊天</Radio>
                            </Radio.Group>
                        </Form.Item>
                   </Col>
               </Row> */}
           </Form>}
           <div className='btn-group'>
            <div className='op-btn del-btn'>

            </div>
                <div className='op-btn'>
                    <Button ref={submit} style={{borderRadius:'5px'}} onClick={()=>{
                        // ws.send(JSON.stringify({msg:'1111', title:'123123'}))
                        // console.log(localStorage.getItem('wizInstall'))
                        if(!account){
                            window.tools.startGame((message)=>{
                                console.log(message)
                                if(message){

                                    Notification.error({
                                        id:'notInstallWizard101',
                                        style,
                                        title:translation('Error'),
                                        content: message,
                                        onClose:()=>{
                                            window.tools.openFile(`"${window.wizPath}\\Wizard101.exe"`)
                                        }
                                    })
                                }else{
                                    Notification.success({
                                        id:'notInstallWizard101',
                                        style,
                                        title:translation('Enter'),
                                        content: '',
                                        duration: 2000,
                                        onClose:()=>{
                                            // window.tools.killExe('launchWizard101.exe')
                                            // window.tools.killExe('launchWizard101.exe')
                                            let next = getItem('btnSetting')
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
                                content:translation('Input')
                            })
                            return
                        }
                        if(getItem('wizInstall')){
                            if(save){
                                    let index = data.findIndex(val=>val.account === account)
                                    if(index >= 0){
                                        data[index] = {account, icon: headIndex, iconType: headType || 'wizard101'}
                                        setData([...data])
                                    }else{
                                        data.push({account, icon: headIndex, iconType: headType || 'wizard101'})
                                        setData([...data])
                                    }
                                    dataMap[account] = password
                                    setDataMap({...dataMap})
                            }
                            clearInterval(timerKill)
                            window.tools.login(account, password, (flag, err)=>{
                                console.log('flag',flag)
                                if(flag === true){
                                    Notification.error({
                                        id:'notInstallWizard101',
                                        style,
                                        title:translation('Error'),
                                        content: err,
                                        onClose:()=>{
                                            window.tools.openFile(`"${window.wizPath}\\Wizard101.exe"`)
                                        }
                                    })
                                }else if(flag === false){
                                    // console.log(err.indexOf('100'))
                                    if(err.indexOf('100') > 0){ 
                                        Notification.success({
                                            id:'notInstallWizard101',
                                            style,
                                            title:translation('Finished'),
                                            content: err ,
                                            duration: 2000
                                        })
                                        setShowLogin(false)
                                    }
                                    Notification.info({
                                        id:'notInstallWizard101',
                                        style,
                                        title:translation('First'),
                                        content: err
                                    })
                                    // window.tools.killExe('launchWizard101.exe')
                                }else if(flag === undefined){
                                    Notification.success({
                                        id:'notInstallWizard101',
                                        style,
                                        title:translation("Enter"),
                                        content: err,
                                        duration: 2000,
                                        onClose:()=>{
                                            // window.tools.killExe('launchWizard101.exe')
                                            // window.tools.killExe('launchWizard101.exe')
                                            let next = getItem('btnSetting')
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
                                        title:translation('Enter'),
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
                    }} status='success' loading={btnLoading} size='large' type='primary' className='openGame'>{translation('Login')}</Button>
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
        getPopupContainer={getMain}
        className="login-modal"
        mountOnEnter= {false}
        hideCancel={true}
        maskClosable = {false}
        onCancel={()=>{
            setChoseHead(false)
        }}
        children={<>
            <Tabs activeTab={headKey} destroyOnHide={false} onChange={(key)=>{
                console.log(key)
                setHeadKey(key)
            }} type='card-gutter'>
                {
                    Object.keys(headImgMap).map(key=>{
                        return <TabPane key={key} title={key}>
                            <div className='head-img-box'>
                                {
                                    headImgs.map((img, idx)=>{
                                        return <Image key={idx} className={headIndex === idx?'arco-image-active':''} preview={false} onClick={()=>{
                                            setHeadIndex(idx)
                                            setHeadType(headKey)
                                            setChoseHead(false)
                                        }} src={img} width={60} height={60}/>
                                    })
                                }
                            </div>
                        </TabPane>
                    }) 
                }
            </Tabs>
        </>}
    />
</div>
}
export default BodyMain