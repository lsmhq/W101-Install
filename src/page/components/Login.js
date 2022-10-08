import { Tabs, Form, Input, Button } from "@arco-design/web-react";
import { useState } from "react";
const TabPane = Tabs.TabPane;
function Login(){
    let phone, code
    let [img, setImg] = useState('')
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
                        }} htmlType='submit'>
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </TabPane> */}
            <TabPane title="二维码登录" key={0}>
                <img src={img} alt=''/>
            </TabPane>
        </Tabs>
    </div>
}
export default Login