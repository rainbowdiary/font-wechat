//index.js
//获取应用实例
const app = getApp()
const data = require("./data/data")
Page({
  onLoad() {
    this.setData(data)
  },
  handleDetail(event) {
    wx.navigateTo({
      //  跳转路由带上id
      url: `/pages/index/atguigu/detail/index?id=${event.currentTarget.dataset.newsid}`
    })
  }
})
