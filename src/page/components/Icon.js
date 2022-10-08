function Icon(props){
    let {tips, onClick, Child, className} = props
    return <div className={`icon-container ${className}`} onClick={onClick} key={tips}>
        <div className='icon' style={{color: props.color}}>
            {Child}
        </div>
        <div style={props.textStyle} className="icon-content">{props.content}</div>
    </div>
}
export default Icon