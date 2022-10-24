import { Message } from '@arco-design/web-react'
import axios from 'axios'
// let basePath = 'http://192.168.0.105:3000'
let basePath = 'http://101.43.216.253:3000'

// let basePath = ''
// let servicePath = ''
let instance = axios.create({
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    }
  })
  // http request 拦截器
instance.interceptors.request.use(
    config => {
      const token = localStorage.getItem('token')
      if (token ) { // 判断是否存在token，如果存在的话，则每个http header都加上token
        config.headers.authorization = token  //请求头加上token
      }
      return config
    },
    err => {
      return Promise.reject(err)
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
          case 400:
            Message.error(response.data.message || response.data.msg || '请求错误')
            break
          case 801:

            break
          case 802:

            break
          case  803:

            break
          case  800:

            break
          default:
            // Toast.show(response.data.message)
            // Message.error(response.data.message || response.data.msg || '请求错误')
            break
        }
      }
      return response
    },
)
let http = {
    get: async (path, params, cookie = false)=>{
        params.timestamp = new Date().getTime()
        if(!cookie)
          params.cookie = encodeURIComponent(localStorage.getItem('cookie'))
        return await instance.get(basePath + path, {
            params,
            withCredentials: true,
        })
    },
    post: async (path, params, cookie = false)=>{
        params.timestamp = new Date().getTime()
        if(!cookie)
          params.cookie = encodeURIComponent(localStorage.getItem('cookie'))
        return await instance.post(basePath + path, {
            params,
            withCredentials: true,
        }) 
    }
}

let api = {
    // 登录
    loginByphone: params => http.get('/login/cellphone', params, true), // 手机号登录
    sendCode: params => http.get('/captcha/sent', params, true), // 发送验证码
    checkCode:params => http.get('/captcha/verify',params, true), // 检查验证码
    checkPhone: params => http.get('/cellphone/existence/check', params), // 检查电话是否注册
    regist: params => http.get('/register/cellphone',params), // 注册
    checkNickName: params => http.get('/nickname/check', params), // 检测昵称是否重复
    geQrtKey: params=> http.get('/login/qr/key', params), // 获取二维码Key
    createQr: params=>http.get('/login/qr/create', params), // 创建二维码
    checkQr: params=>http.get('/login/qr/check', params), // 二维码状态
    checkLogin: params=>http.get('/login/status', params), // 登录状态
    // 个人中心
    getUserInfo:params => http.get('/user/detail', params), // 获取用户信息
    getLikeList: params => http.get('/likelist', params), // 获取喜欢音乐列表
    getSongs: params => http.get('/song/detail',params), // 获取歌曲详情
    getSongsUrl:params => http.get('/song/url',params), // 获取歌曲Url ?id=33894312 /song/url?id=405998841,33894312
    logout: params => http.get('/logout', params), // 退出登录
    // 首页
    getBanner:params => http.get('/banner?type=2', params), // 获取轮播
    checkMusic: params => http.get('/check/music', params), // 音乐是否可用
    search: params => http.get('/search', params), // 搜索
    cloudsearch:params => http.get('/cloudsearch',params), // 云搜
    //type: 搜索类型；默认为 1 即单曲 , 取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合, 2000:声音(搜索声音返回字段格式会不一样)
    getrecommendSongs:params => http.get('/recommend/songs', params), // 获取推荐歌曲
    getLyric: params => http.get('/lyric', params), // 获取歌词
    likeMusic: params => http.get('/like', params), // 喜欢、不喜欢音乐
    suggest: params => http.get('/search/suggest?type=mobile', params), // 搜索建议
    heartbeatSongs: params => http.get('/playmode/intelligence/list', params), //心动模式
    getComments: params => http.get('/comment/music', params), // 获取评论
    getAlbum: params => http.get('/album', params), // 获取专辑
    getPlayList: params=>http.get('/playlist/detail', params), // 获取歌单
    getPlayListAll: params=>http.get('/playlist/track/all', params), // 获取歌单
    getMvUrl: params=>http.get('/mv/url', params), // 获取mvUrl
    getSongByPerson: params=>http.get('/artist/top/song', params), // 获取歌手前50歌曲
    getSonger: params=>http.get('/artist/detail', params), // 获取歌手详情
    getHotSonger: params=> http.get('/toplist/artist', params), // 获取热门歌手 type : 地区 1: 华语2: 欧美 3: 韩国 4: 日本
    

  }
export {
    http, api
}