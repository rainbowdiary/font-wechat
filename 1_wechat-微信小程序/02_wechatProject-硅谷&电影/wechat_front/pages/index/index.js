// pages/index/index
import store from "../../utils/store";
import router from "../../utils/router";
import http from "../../utils/http";
import api from "../../api/index";
import regeneratorRuntime from "regenerator-runtime/index.js";

const app = getApp(); //获取app.js中globalData数据
Page({
  data: {
    hasUserInfo: false,// true:用户已经授权过 false:用户没有授权
    userInfo: {}
  },
  toAtGuigu() {
    /* wx.switchTab({
      url: "/pages/atguigu/index"
    }) */
    router.push("atguigu", { type: "switchTab" })
  },
  onLoad() {
    if (app.globalData.userMessage) {
      this.setData({
        hasUserInfo: true,
        userInfo: app.globalData.userMessage
      })
    } else {
      /* 如果app.globalData.userMessage为空，
      1. 说明onLoad在app.js的onLunach之前被调用
      2. 说明用户没有授权 */
      //  为了避免第二个情况
      app.getUserInfoReadyCallback = res => {
        this.setData({
          hasUserInfo: true,
          userInfo: res.userInfo
        })
      }
    }

  },
  async getUserInfo(ev) {
    if (ev.detail.userInfo) {
      // const uid = wx.getStorageSync('uid')
      // const uid = store.getItem('uid', "userInfo")
      // 用户信息入库
      /*   wx.request({
          url: `http://localhost:8080/wx_users/${uid}/saveUserInfo`,
          method: "POST",
          data: ev.detail.userInfo,
          success: (res) => {
            const token = res.data
            // 返回token 把token存起来
            // wx.setStorageSync('token', token)
            store.setItem('token', token, "userInfo")
            this.setData({
              hasUserInfo: true,
              userInfo: ev.detail.userInfo
            })
          }
        }) */
      let loading = true
      const result = await http.post(api.saveUserInfo(), ev.detail.userInfo, { loading })
      const token = result
      // 返回token 把token存起来
      // wx.setStorageSync('token', token)
      store.setItem('token', token, "userInfo")
      this.setData({
        hasUserInfo: true,
        userInfo: ev.detail.userInfo
      })
    }
  }
})