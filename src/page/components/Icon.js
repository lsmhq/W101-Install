import { Tooltip } from "@arco-design/web-react"

function Icon(props){
    let {tips, onClick, Child} = props
    return <div className='icon-container' onClick={onClick} key={tips}>
        <div className='icon'>
            <Tooltip position='left' content={tips}>
                {Child}
            </Tooltip>
        </div>
    </div>
}
export default Icon