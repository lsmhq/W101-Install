
const puppeteer = require('puppeteer')
const userAgent = require('user-agents')
const puppeteerTest = async (pageData={
    userName:'123',
    password: '123',
    code:'222'
}) => {
    const browser = await puppeteer.launch({
        headless: false,
        // defaultViewport: { width: 500, height: 800 }, 
        args: ['--start-maximized'],
        // args: [
        //     '--no-sandbox',
        //     '--disable-setuid-sandbox'
        // ],
    });
    const page = await browser.newPage()
    await page.setDefaultNavigationTimeout(0)
    // await page.setRequestInterception(true)
    await page.setUserAgent(userAgent.toString())
    console.log('goto wizard')
    await page.goto("https://www.wizard101.com/game")
    const input_area_username = await page.$('#loginUserName') // 定位输入框
    await input_area_username.type(pageData.userName) // 输入文本
    
    const input_area_password = await page.$('#loginPassword') // 定位输入框
    await input_area_password.type(pageData.userName) // 输入文本

    await page.evaluate(() => {
        // 登录
        console.log('执行脚本')
        window.blockButtonClicks && window.blockButtonClicks();
    })
}

puppeteerTest()