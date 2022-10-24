import { useEffect, useState } from 'react';
import { useNavigate, useLocation  } from 'react-router-dom'
import { api } from '../util/http';
import './css/singer.css'
import { Grid, Button, Tabs, List } from '@arco-design/web-react'
import MusicBox from '../components/Music/music';
let { Row, Col } = Grid
let { TabPane } = Tabs
function Singer(props){
    const navigate = useNavigate();
    const params = useLocation()
    const [singer, setSinger] = useState(false)
    const [songs, setSongs] = useState([])
    useEffect(()=>{
        console.log(params.state)
        api.getSonger({id: params.state.id}).then(res=>{
            if(res.data.message === 'ok' || res.data.code === 200){
                setSinger({...res.data.data})
                api.getSongByPerson({id:res.data.data.artist.id}).then(res=>{
                    console.log(res.data)
                    if(res.data.code === 200){
                        setSongs(res.data.songs)
                    }
                })
            }
        })

    },[])
    useEffect(()=>{
        console.log(singer)
    }, [singer])
    return <div className="singer">
        <Button onClick={()=>{
            navigate(`${params.state.path}`,{replace: true})
        }} style={{color:'rgb(255, 180, 180)', position:'absolute', left: '10px', top: '5px', zIndex: 100}} type='text' status='success'>返回</Button>
        {singer &&<>
            <img className='bg-singer' src={singer.artist.cover} alt=""/><img className='bg-singer' src={singer.artist.cover} alt=""/>
            <Row justify='center' align='center'>
                <Col className='singer-cover' span={3}>
                    <img width='100' src={singer.artist.cover} alt=""/>
                </Col>
            </Row>
            <Row justify='center' align='center'>
                <Col className='singer-name' span={24}>
                    {singer.artist.name}
                </Col>
            </Row>
            <Tabs>
                <TabPane title="介绍" key='1'>
                    <Row className='tab-container'>
                        <Col>
                            <div className='singer-desc' dangerouslySetInnerHTML={{__html:singer.artist.briefDesc}}></div>
                        </Col>
                    </Row>
                </TabPane>
                <TabPane title="热门歌曲" key='2'>
                    <Row className='tab-container'>
                        <Col>
                        <List 
                            noDataElement={<></>}
                            dataSource={songs}
                            render={(item, index) => <List.Item style={{color:'white'}} key={index}><MusicBox index={index} grid={[2, 17, 0, 5]} {...item}/>
                            </List.Item>}
                        />
                        </Col>
                    </Row>
                </TabPane>
            </Tabs>

        </>}
    </div>
}

export default Singer