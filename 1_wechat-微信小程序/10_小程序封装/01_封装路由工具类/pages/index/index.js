// pages/index/index
import router from "../../utils/router";

const app = getApp(); //获取app.js中globalData数据
Page({
  toAtGuigu() {
    /* wx.switchTab({
      url: "/pages/atguigu/index"
    }) */
    router.push("atguigu", { type: "switchTab" })
  }
})