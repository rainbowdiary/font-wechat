//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  handleTap: function () {
    wx.redirectTo({   //跳转到主页
      url: '/pages/index/atguigu/index'
    })
  },
})
