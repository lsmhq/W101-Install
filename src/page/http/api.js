import { Message } from '@arco-design/web-react'
import axios from 'axios'
let basePath = 'https://www.fastmock.site/mock/b5b6645016e18efee03631edb9ec9123/config'
let serverPath = 'http://localhost:4000'
serverPath = 'http://101.43.216.253:3001'
// let servicePath = ''
let instance = axios.create({
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    }
  })
// http response 拦截器
instance.interceptors.response.use(
    response => {
      //拦截响应，做统一处理 
      // console.log(response)
      if (response.data.code) {
        switch (response.data.code) {
          case 200:
            // Toast.show('成功')
            break
          default:
            // Toast.show(response.data.message)
            Message.error('网络出现错误')
            break
        }
      }
      return response
    },
)
let http = {
    get: async (path, params, cookie = false)=>{
        return await instance.get(basePath + path, {
            params,
        })
    },
    post: async (path, params, cookie = false)=>{
        return await instance.post(basePath + path, {
            params,
        }) 
    },
    getServer: async (path, params, cookie = false)=>{
      return await instance.get(serverPath + path, {
          params,
      })
  },
}

let apiPath = {
    // 登录
    mainPage: params => http.get('/list', params, true), // 获取列表信息
    getCurl: params=> http.getServer('/curl/lunbo', params), // 获取轮播
    getMessage: params =>http.getServer('/curl/messages',params),// 获取通知
    delMessage: params=>http.getServer('/curl/delmessage', params), // 删除通知
}

export default apiPath