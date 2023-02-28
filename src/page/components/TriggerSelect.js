function TriggerSelect(props){
    let {onClick} = props
    return <div className="trigger">
        <div className="trigger-bg"></div>
        <div className="trigger-select" onClick={()=>{onClick('max')}}>
            <div className="trigger-select-max">

            </div>
        </div>  
        <div className="trigger-select" onClick={()=>{onClick('normal')}}>
            <div className="trigger-select-normal">

            </div>
        </div>
        <div className="trigger-select" onClick={()=>{onClick('mini')}}>
            <div className="trigger-select-mini">

            </div>
        </div>
    </div>
}

export default TriggerSelect