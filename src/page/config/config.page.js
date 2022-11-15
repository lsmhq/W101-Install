let typeArr = ['d', 'r', 'c']
let statusArr = ['warning', 'success', '']
let titleArr = ['测试版安装', '稳定版安装', '聊天纯享安装']
let tipsArr = [
    `全面汉化，包含NPC名称、地图名称、剧情文本，适合体验尝鲜，不方便查阅Wiki(攻略)。`,
    `仅汉化剧情文本内容,npc、地图名等依旧英文, 适合剧情党`,
    `仅支持中文输入聊天的补丁`
]
let smTitleArr = ['测试版', '稳定版', '聊天纯享']
let installBtn_config = typeArr.map((type, idx)=>{
    return {
        type:'primary',
        zhType: type,
        desc: titleArr[idx],
        title: titleArr[idx],
        size: 'small',
        status: statusArr[idx],
        tips:tipsArr[idx],
        smTitle: smTitleArr[idx],
        style:{
            margin: '5px'
        }
    }
})

export {
    installBtn_config
}