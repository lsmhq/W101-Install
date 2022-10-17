import { Spin, Carousel, Tabs, List, Button, Progress, Notification, AutoComplete, Form, Input, Checkbox, Modal  } from '@arco-design/web-react'
import { useEffect, useState } from 'react'
let carouselIndex = 0
let { TabPane } = Tabs
let style = {
    right:'50px',
    top:'20px'
}
function BodyMain(props){
    let { logo, imgs, loading, loading1, nav, btnLoading, percent, current, total, play, subataShow } = props
    const [data, setData] = useState(JSON.parse(localStorage.getItem('accounts'))||[]);
    const [showLogin, setShowLogin] = useState(false)
    let [password, setPassword] = useState('')
    let [account, setAccount] = useState('')
    let [save, setSave] = useState(false)
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
                        showArrow='never'
                        indicatorClassName="indicatorClassName"
                        // indicatorPosition='outer'
                        arrowClassName='arrowClassName'
                        // animation='card'
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
                        }} type='primary' className='right-openGame' size='large'>
                            中文攻略
                        </Button>
                    </div>
                }
                <div className='subata-right-btn'>
                        <Button status='success' onClick={()=>{
                            setShowLogin(true)
                        }} type='primary' className='right-openGame' size='large'>
                            开始游戏
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
        title='登录'
        footer={null}
        hideCancel={true}
        onCancel={()=>{
            setShowLogin(false)
        }}
        children={<div className='login-right'>
        {play==='true' && <Form>
               <Form.Item  style={{display:'flex',justifyContent:'center'}} label=''>
                   <AutoComplete 
                       placeholder='账号' 
                       value={account}
                       data={data}
                       onSearch={(val)=>{
                           console.log(val)  
                           setAccount(val)
                       }}
                   />
               </Form.Item>
               <Form.Item label=''  style={{display:'flex',justifyContent:'center'}}>
                   <Input.Password placeholder='密码' value={password} onChange={(val)=>{
                       setPassword(val)
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
           <div className='op-btn'>
               <Button onClick={()=>{
                   // ws.send(JSON.stringify({msg:'1111', title:'123123'}))
                   console.log(localStorage.getItem('wizInstall'))
                   if(localStorage.getItem('wizInstall') === 'true'){
                       window.tools.startGame((err)=>{
                           Notification.error({
                               id:'notInstallWizard101',
                               style,
                               title:'未检测到Wizard101, 可能是官服或自定义Steam安装路径',
                               content: err.path
                           })
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
</div>
}
export default BodyMain