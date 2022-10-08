import { Spin, Carousel, Tabs, List, Button, Progress, Notification } from '@arco-design/web-react'
let carouselIndex = 0
let { TabPane } = Tabs
let style = {
    right:'50px',
    top:'20px'
}
function BodyMain(props){
    let { logo, imgs, loading, loading1, nav, btnLoading, percent, current, total, play, subataShow } = props
    return <div className='body-main'>
    <div className='body-main-top'>
        <div className='left'>
            {/* <div className='carousel-main'>
                <Spin dot tip="拼命中" style={{color:'white'}} loading={loading}>
                    <Carousel
                        // showArrow='hover'
                        showArrow='never'
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
            </div> */}
            <div className='tips'>

            </div>
        </div>
        <div className='right'>
        </div>
    </div>
    <div className='body-main-bottom'>
        {percent > 0 && <Progress formatText={()=><span style={{color:'white'}}>{`${(current / 1024 / 1024).toFixed(2)}MB / ${(total / 1024 / 1024).toFixed(2)}MB`}</span>} percent={percent} width='100%' color={'#00b42a'} style={{display:'block'}}/>}
    </div>
</div>
}
export default BodyMain