
import { Grid, Message } from '@arco-design/web-react'
import {  IconHeart, IconHeartFill } from '@arco-design/web-react/icon';
import { api } from '../../util/http';
const Row = Grid.Row;
const Col = Grid.Col;
function MusicBox(props){
    // 歌名、id、歌手、发布日期、时长
    let {name, id, ar, dt, onChange, onClick, isLike } = props
    return <Row onClick={(e)=>{
            e.stopPropagation()
            console.log('歌曲id-->', id)
            // getMusic(id)
            onClick(id)
        }}>
        <Col style={{color:'rgb(207, 0, 0)'}} span={1}>
            {isLike ? <IconHeartFill onClick={()=>{
                api.likeMusic({id,like: false}).then(res=>{
                    onChange && onChange()
                    Message.success({
                        content:'删除成功',
                        style:{top:'10px'},
                    })
                })
            }}/>:<IconHeart onClick={()=>{
                api.likeMusic({id}).then(res=>{
                    onChange && onChange()
                    Message.success({
                        content:'添加成功',
                        style:{top:'10px'}
                    })
                })
            }}/>}

        </Col>
        <Col style={{ textOverflow:'ellipsis', overflow:'hidden' }} span={9}>
            {name}
        </Col>
        <Col style={{ textOverflow:'ellipsis', overflow:'hidden' }} span={11}>
            {ar.map((a, idx)=><span key={idx} onClick={(e)=>{
                console.log('歌手id-->', a.id)
                e.stopPropagation()
            }}>{a.name}</span>)}
        </Col>
        <Col span={3}>
            {formatSeconds(dt/1000)}
        </Col>
    </Row>
}

export default MusicBox

function formatSeconds(value) {
    var theTime = parseInt(value);// 秒
    var theTime1 = 0;// 分
    var theTime2 = 0;// 小时
    if (theTime > 60) {
        theTime1 = parseInt(theTime / 60);
        theTime = parseInt(theTime % 60);
        if (theTime1 > 60) {
            theTime2 = parseInt(theTime1 / 60);
            theTime1 = parseInt(theTime1 % 60);
        }
    }
    var result = "" + parseInt(theTime);
    if(result < 10){
        result = '0' + result;
    }
    if (theTime1 > 0) {
        result = "" + parseInt(theTime1) + ":" + result;
        if(theTime1 < 10){
            result = '0' + result;
        }
    }else{
        result = '00:' + result;
    }
    if (theTime2 > 0) {
        result = "" + parseInt(theTime2) + ":" + result;
        if(theTime2 < 10){
            result = '0' + result;
        }
    }else{
        result = '00:' + result;
    }
    let res = result.split(':')
    let hour = res[0]
    let min = res[1]
    let sec = res[2]
    result = `${hour==='00' ? '': hour + ':'}${min}:${sec}`
    return result;
}