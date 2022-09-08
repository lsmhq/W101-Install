const puppeteer = require('puppeteer')

const puppeteerTest = async (imgsArr = []) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage()
    await page.setRequestInterception(true)
    await page.on('request',interceptedRequest => {
        //判断加载的url是否以jpg或png结尾，符合条件将不再加载
        if(interceptedRequest.url().endsWith('.jpg') || interceptedRequest.url().endsWith('.png')){
            interceptedRequest.abort();
        }else{
            interceptedRequest.continue();
        }
    })
    await page.goto("https://vless.subata.top/")
    var imgs = await page.$$( 'img.ccCard' );
    for( let img of imgs ) {
        try {
            let src = await ( await img.getProperty( 'src' ) ).jsonValue()
            imgsArr.push(src)
        }catch( e ) {
            console.log( e.message );
        }
    }
    await browser.close()
    return await new Promise((resolve, reject)=>{
        if(imgsArr.length > 0){
            resolve(imgsArr)
        }else{
            reject('爬虫出现错误')
        }
    })
}
function checkUpdate(){

}

window.requestData = {
    getImgs:puppeteerTest,
    checkUpdate:checkUpdate
}
