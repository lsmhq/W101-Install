import { useState } from "react"
import { Avatar, Grid, Button, Message } from '@arco-design/web-react'
import { api } from "../util/http";
const Row = Grid.Row;
const Col = Grid.Col;
function UserInfo(props){
    let { close } = props
    const [userInfo, setuserInfo] = useState(JSON.parse(sessionStorage.getItem('userInfo')))
    // console.log(userInfo)
    return <div>
        <Row>
            <Col style={{textAlign:'center'}} span={24}>
                <Avatar>
                    <img src={userInfo.avatarUrl} alt={userInfo.nickname}/>
                </Avatar>
            </Col>
        </Row>
        <Row>
            <Col style={{textAlign:'center'}} span={24}>
                {userInfo.nickname}
            </Col>
        </Row>
        <Row>
            <Col style={{textAlign:'center'}} span={24}>
                {userInfo.signature}
            </Col>
        </Row>
        {/* <Row>
            <Count title="粉丝" count={0}/>
            <Count title="粉丝" count={0}/>
            <Count title="粉丝" count={0}/>
        </Row> */}
        <Row style={{marginTop:'10px'}}>
            <Col style={{textAlign:'center'}} span={24}>
                <Button style={{width:'100%'}}  onClick={()=>{
                    localStorage.removeItem('cookie')
                    sessionStorage.clear()
                    api.logout({}).then(res=>{
                        console.log(res)
                        if(res.data.code === 200){
                            // navigate('/', {replace: true})
                            window.location.hash = '/'
                            Message.success({
                                style:{top:'20px'},
                                content:'退出成功',
                                duration:1000,
                                onClose:close
                            })
                        }
                    })
                }} type='text'status='danger'>退出登录</Button>
            </Col>
        </Row>
    </div>
}
export default UserInfo


function Count(props){
    let { title, count } = props
    return <Col span={8}>
        <Row>
            <Col style={{textAlign:'center'}} span={24}>{title}</Col>
        </Row>
        <Row>
            <Col style={{textAlign:'center'}} span={24}>{count}</Col>
        </Row>
    </Col>
}