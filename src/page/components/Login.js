import { Tabs, Form, Input, Button, Message } from "@arco-design/web-react";
import { useEffect, useState } from "react";
import { api } from "../util/http";
const TabPane = Tabs.TabPane;
let timer_login = null
// let phone, code
function Login(props){
    let { closed, close } = props
    let [img, setImg] = useState('')
    let [status, setStatus] = useState('')
    useEffect(()=>{
        // createQr()
        return ()=>{
            clearInterval(timer_login)
        }
    },[])
    useEffect(()=>{
        if(closed === false)
            clearInterval(timer_login)
        if(closed){
            createQr()
        }
    }, [closed])
    useEffect(()=>{
        if(status.code === 803){
            localStorage.setItem('cookie', status.cookie)
            clearInterval(timer_login)
            Message.success({
                id:'login',
                content:'登录成功',
                style:{
                    top:'20px'
                },
                duration:1000,
                onClose:close
            })
        }
        if(status.code === 800){
            api.checkLogin({}).then(res=>{
                // console.log(res.data)
                if(res.data.data.code !== 200){
                    createQr()
                }
            })
        }
    }, [status])
    function createQr(){
        clearInterval(timer_login)
        api.geQrtKey({}).then(res=>{
            if(res.data.code === 200){
                // console.log(res.data.data.unikey)
                let key = res.data.data.unikey
                api.createQr({key, qrimg:true}).then(res=>{
                    // console.log(res.data)
                    if(res.data.code === 200){
                        setImg(res.data.data.qrimg)
                        clearInterval(timer_login)
                        timer_login = setInterval(() => {
                            api.checkQr({key}).then(res=>{
                                // console.log(res.data)
                                setStatus({...res.data})
                            })
                        }, 1000);
                    }
                })
            }
        })
    }
    return <div className="login">
        <Tabs>
            {/* <TabPane title="验证码登录" key={1}>
                <Form>
                    <Form.Item style={{justifyContent:'center'}} label='' field='phone' rules={[{require:true}]}>
                        <Input placeholder="请输入手机号" onChange={(e)=>{
                            phone = e
                        }} />
                    </Form.Item>
                    <Form.Item style={{justifyContent:'center'}} label='' field='code' rules={[{require:true}]}>
                        <Input placeholder="请输入验证码" onChange={(e)=>{
                            code = e
                        }} />
                    </Form.Item>
                    <Form.Item style={{justifyContent:'center'}}>
                        <Button style={{width:'100%'}} type='primary'status='danger' onClick={()=>{
                            let params = {
                                phone, code
                            }
                            console.log(params)
                        }} htmlType='submit'>
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </TabPane> */}
            <TabPane style={{display:'flex', flexDirection:'column', alignContent:'space-around', justifyContent:'center'}} title="二维码登录" key={0}>
                <div onClick={()=>{
                    if(status.code === 800){
                        createQr()
                    }
                }} style={{width:'100%', textAlign:'center'}}>
                    <img style={{width:'180px'}} src={img} alt=''/>
                </div>
                <div style={{width:'100%', textAlign:'center'}}>
                    <span>{status.message}</span>
                </div>
            </TabPane>
        </Tabs>
    </div>
}
export default Login