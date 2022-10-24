import { useEffect, useState } from "react"
import { api } from "../util/http"
import { Carousel, Grid } from '@arco-design/web-react'
import { useNavigate  } from 'react-router-dom'
import './css/home.css'
const Row = Grid.Row;
const Col = Grid.Col;
function Home(){
    let [banners, setBanner] = useState([])
    const navigate = useNavigate();
    useEffect(()=>{
        api.getBanner({}).then(res=>{
            console.log(res.data)
            if(res.data.code === 200){
                let banners = res.data.banners.map(banner=>banner.pic)
                setBanner([...banners])
            }
        })
    },[])
    return <div className="home">
        <Row style={{display:'flex', alignItems:'center', justifyContent:'center', paddingTop:'20px', height:'150px'}}>
            <Carousel
                autoPlay
                animation='card'
                showArrow='never'
                indicatorPosition='outer'
                style={{ width: '60%' }}
                >
                {banners.map((src, index) => (
                    <div
                    key={index}
                    style={{ width: '60%', borderRadius:'5px', overflow:'hidden' }}
                    >
                    <img
                        src={src}
                        style={{ width: '100%' }}
                        alt=""
                    />
                    </div>
                ))}
            </Carousel>
        </Row>
        <Row>
            <Col span={4} className='dailySong' onClick={()=>{
                navigate("/daysongs", { replace: true });
            }}>
                日推歌单
            </Col>
            {/* <Col className='dailySong' offset={1} span={4}>
                歌手榜
            </Col>
            <Col className='dailySong' offset={1} span={4}>
                歌曲榜
            </Col> */}
        </Row>
    </div>
}

export default Home