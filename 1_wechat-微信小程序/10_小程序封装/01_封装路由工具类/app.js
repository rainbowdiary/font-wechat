import store from "./utils/store.js.js.js";
// import http from "./utils/http.js";
// import api from "./api/index.js";
App({
  globalData: {
    BASEURL: "http://t.yushu.im",
    userMessage: null
  },
  onLaunch() {//小程序初始化的时候得到openid；每个微信用户访问小程序都对应唯一一个openid
    //拿到code 向我们自己的服务器发送请求 让自己的服务器去访问微信的服务器 换取openid
    // if (!wx.getStorageSync('uid')) {
    if (!store.getItem('uid', "userInfo")) {
      wx.login({
        success(res) {
          if (res.code) {  //拿到code 0231TgZd1jiizw0qucYd1RT6Zd11TgZB
            //向微信服务器发起请求，用code换openID
            wx.request({
              url: 'http://localhost:8080/wx_users/getOpenId',
              method: "POST",
              data: {
                code: res.code
              },
              success(res) {
                // 返回的uid保存到Storage中
                // wx.setStorageSync('uid', res.data.uid)
                store.setItem('uid', res.data.uid, "userInfo")
              }
            })
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })
    };

    //  业务逻辑：如果用户已经授权则显示用户信息
    //  获取用户的当前设置。返回值中只会出现小程序已经向用户请求过的权限
    wx.getSetting({
      success: (res) => {
        if (res.authSetting["scope.userInfo"]) {//如果用户已经授权则为true
          //拿到用户信息
          wx.getUserInfo({
            success: (res) => {
              //异步的  是page里的onload先执行 还是当前这个回调的先执行?
              // 确保当前这个回调 一定要在page的onload之前执行
              this.globalData.userMessage = res.userInfo
              // 订阅发布
              if (this.getUserInfoReadyCallback) {
                this.getUserInfoReadyCallback(res)
              }
            }
          })
        }
      }
    });


  },

})