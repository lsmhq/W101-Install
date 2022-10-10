import { Tabs, Form, Input, Button, Message, Grid } from "@arco-design/web-react";
import { useEffect, useState } from "react";
import { api } from "../util/http";
const TabPane = Tabs.TabPane;
let timer_login = null
let { Row, Col } = Grid
// let phone, code
function Login(props){
    let { closed, close } = props
    let [img, setImg] = useState('')
    let [status, setStatus] = useState('')
    let [disabled, setDisable] = useState(false)
    let [deadLine, setDeadLine] = useState(0)
    let [phone, setPhone] = useState()
    const [form] = Form.useForm();
    useEffect(()=>{
        // createQr()
        return ()=>{
            clearInterval(timer_login)
        }
    },[])
    useEffect(()=>{
        if(closed === false)
            clearInterval(timer_login)
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
                if(res.data.data.code === 200 && res.data.data.profile){
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
        <Tabs onChange={(val)=>{
            if(val*1 === 0){
                if(closed){
                    createQr()
                }
            }
            if(val*1 === 1){
                clearInterval(timer_login)
            }
        }}>
            <TabPane title="验证码登录" key={1}>
                <Form 
                    form = {form} 
                    autoComplete='off'
                    validateMessages={{
                        required: (_, { label }) => `必须填写 ${label}`,
                        string: {
                          length: `字符数必须是 #{length}`,
                        } 
                    }}
                >
                    {/* <Form.Item style={{justifyContent:'center', marginBottom:'0px'}} > */}
                     <Row>
                        <Col span={24}>
                            <Form.Item 
                                style={{justifyContent:'center'}} 
                                label='' 
                                field='phone'
                                rules={[
                                    {
                                    required: true,
                                    type: 'string',
                                    minLength: 11
                                    },

                                ]}
                            >
                                <Input value={phone} placeholder="手机号" onChange={(e)=>{
                                    // phone = e
                                    setPhone(e.replace(/[^\d]/g,''))
                                }} />
                            </Form.Item>
                        </Col>
                     </Row>

                    {/* </Form.Item> */}
                    <Form.Item style={{justifyContent:'center', margin:0}} >
                        <Row>
                            <Col span={18}>
                                <Form.Item
                                    style={{justifyContent:'center'}} 
                                    label='' 
                                    field='captcha' 
                                    rules={[
                                        {
                                            required: true,
                                            type: 'string',
                                        }
                                    ]}
                                >
                                    <Input placeholder="验证码"/>
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Button type='text' status='danger' disabled={disabled} onClick={()=>{
                                    form.validate(['phone']).then(res=>{
                                        api.sendCode({phone: form.getFieldValue('phone')}).then(res=>{
                                            console.log(res.data)
                                        })
                                    }).catch((e)=>{
                                        console.log(e)
                                        Message.error({
                                            style:{top:'10px'},
                                            content:'先填写手机号'
                                        })
                                    })
                                }}>发送验证{disabled?`(${deadLine})s`:''}</Button>
                            </Col>
                        </Row>
                    </Form.Item>
                    <Form.Item style={{justifyContent:'center'}}>
                        <Button style={{width:'100%'}} type='primary'status='danger' onClick={()=>{
                            form.validate().then(res=>{
                                api.checkCode({phone: form.getFieldValue('phone'), captcha: form.getFieldValue('captcha')}).then(res=>{
                                    console.log(res.data)
                                    if(res.data.data){
                                        api.loginByphone({phone: form.getFieldValue('phone'), captcha: form.getFieldValue('captcha')}).then(res=>{
                                            console.log(res.data)
                                            if(res.data.code === 200){
                                                // 登录
                                                
                                            }else{
                                                Message.error({
                                                    style:{top:'10px'},
                                                    content:res.data.message
                                                })
                                            }
                                        }).catch(()=>{
                                            Message.error({
                                                style:{top:'10px'},
                                                content:'登录失败'
                                            })
                                        })
                                    }else{
                                        Message.error({
                                            style:{top:'10px'},
                                            content:'验证码错误'
                                        })
                                    }
                                })
                            }).catch((e)=>{
                                console.log(e)
                            })
                        }}>
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </TabPane>
            <TabPane style={{display:'flex', flexDirection:'column', alignContent:'space-around', justifyContent:'center'}} title="二维码（偶尔）" key={0}>
                <div onClick={()=>{
                    if(status.code === 800){
                        createQr()
                    }
                }} style={{width:'100%', textAlign:'center', display:'flex', justifyContent:'center'}}>
                    <img style={{width:'150px'}} src={img} alt=''/>
                </div>
                <div style={{width:'100%', textAlign:'center'}}>
                    <span>{status.message}</span>
                </div>
            </TabPane>
        </Tabs>
    </div>
}
export default Login