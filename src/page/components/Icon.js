import { Tooltip, Badge } from "@arco-design/web-react"

function Icon(props){
    let {tips, onClick, Child, count} = props
    return <div className='icon-container' onClick={onClick} key={tips}>
        <div className='icon'>
            <Tooltip position='left' content={tips}>
                <Badge count={count} dot offset={[2, -2]}>
                    {Child}
                </Badge>
            </Tooltip>
        </div>
    </div>
}
export default Icon