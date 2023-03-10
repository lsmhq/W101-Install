let typeArr = ['d', 'r', 'c', 'g', 'f', 'i']
let statusArr = ['warning', 'success', '', 'danger', '', '']
let titleArr = ['测试版安装', '稳定版安装', '聊天纯享安装', '德语补丁包', '法语补丁包', '意语补丁包']
let tipsArr = [
    `全面汉化，包含NPC名称、地图名称、剧情文本，适合体验尝鲜，不方便查阅Wiki(攻略)。`,
    `仅汉化剧情文本内容,npc、地图名等依旧英文, 适合剧情党`,
    `仅支持中文输入聊天的补丁`,
    '德语补丁包', '法语补丁包', '意语补丁包'
]
let smTitleArr = ['BetaText', 'StableText', 'ChatText', 'GermanText', 'FrenchText', 'ItalianaText']
let colorArr=['','','','','#8B7AFF','#DEA800']
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
            margin: '5px',
            backgroundColor:colorArr[idx],
        }
    }
})

export {
    installBtn_config
}