
import { Grid, Message } from '@arco-design/web-react'
import {  IconHeart, IconHeartFill } from '@arco-design/web-react/icon';
import { api } from '../../util/http';
import { formatSeconds } from '../../util/util';
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
            {isLike ? <IconHeartFill onClick={(e)=>{
                e.stopPropagation()
                api.likeMusic({id,like: false}).then(res=>{
                    onChange && onChange()
                })
            }}/>:<IconHeart onClick={(e)=>{
                e.stopPropagation()
                api.likeMusic({id}).then(res=>{
                    onChange && onChange()
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

