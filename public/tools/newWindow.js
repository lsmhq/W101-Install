
const BrowserWindow=require('electron').remote.BrowserWindow

let newWin
function openLive2D(params){
    newWin=new BrowserWindow({
        width: 300,
        height: 500,
        frame: false,
        resizable: false,
        transparent: true, 
        focusable:true,
    })
    newWin.loadFile('child.html')
    newWin.loadURL(`https://static-b9bde1f1-47c6-4ebc-aaab-3c74c2fc6147.bspapp.com/?type=${params.modelName}`)
    newWin.on('close',()=>{
        newWin=null
    })
    newWin.on('will-resize',()=>{
        newWin.setMinimumSize(parseInt(300) , parseInt(500))
        newWin.setMaximumSize(parseInt(300), parseInt(500))
        newWin.setSize(parseInt(300), parseInt(500))
    })
    newWin.on('resize',()=>{
        newWin.setMinimumSize(parseInt(300) , parseInt(500))
        newWin.setMaximumSize(parseInt(300), parseInt(500))
        newWin.setSize(parseInt(300), parseInt(500))
    })
}
function closeLive2D(){
    newWin.close()
}
function moveLive2D(pos){
    newWin.setPosition(parseInt(pos.posX), parseInt(pos.posY), true)
}
window.live2d = {
    openLive2D,
    closeLive2D,
    moveLive2D
}