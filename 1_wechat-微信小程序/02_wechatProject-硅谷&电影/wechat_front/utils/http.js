// 封装发送请求的方法
import config from "../config/index.js";
import util from "./util"
const systemInfo = util.getSystemInfo();
import { merge } from "weapp-utils";
// 设置请求头
const baseHeader = {
  "clientType": "mp",
  "appmp": config.projectName,
  "version": config.version,
  "os": systemInfo.system,    //操作系统及版本	
  "brand": systemInfo.brand,  //设备品牌
  "model": systemInfo.model, //设备型号
  "wx_version": systemInfo.version
}

/* 发送请求的主体方法
url: 接口地址（不带基地址）
data: 携带的数据
option: { loading, isMock, header }
option.loading: 是否出现loading图标
option.isMock: 弃用环境 使用Mock地址
option.header: 请求头 
option.thirdBaseUrl: 调用第三方接口(不需要我们定义的基地址)*/
class Http {
  //  发送请求接口
  request(url, method = "get", data = {}, option = {}) {
    let { loading = true, isMock = false, header = {}, thirdBaseUrl = "" } = option
    return new Promise((resolve, reject) => {
      // 请求一开始加载loading图标
      if (loading) {
        wx.showLoading({
          title: "正在请求数据~~",
          mask: true
        })
      }

      // 获取完整url
      if (thirdBaseUrl) {//  如果是抵用第三方接口
        url = thirdBaseUrl + url
      } else if (isMock) {//使用Mock地址
        url = config.env.mockUrl + url
      } else {//使用环境地址
        url = config.env[config.model].baseUrl + url
      }
      // 发送微信请求
      wx.request({
        url,
        data,
        header: merge(baseHeader, header),// 需要合并baseHeader和header,使用npm库merge
        method,
        success: (res) => {
          if (res.statusCode === 200 || res.statusCode === 204) {//开发者服务器返回的 HTTP 状态码
            if (loading) {
              loading ? wx.hideLoading() : ""  //请求成功隐藏loading
            }
            resolve(res.data)
          } else {
            //请求成功，但是服务器返回数据异常
            wx.showToast({
              title: "接口调用失败~~~~",
              duration: 4000,
              mask: true
            })
            reject(res)
          }
        },
        fail: (err) => {
          wx.showToast({
            title: "请求失败~~~~",
            duration: 4000,
            mask: true
          })
          reject(err)
        }
      })
    })

  };
  get = (url, data, option) => this.request(url, "GET", data, option);  //返回一个promise
  post = (url, data, option) => this.request(url, "POST", data, option);
  put = (url, data, option) => this.request(url, "PUT", data, option);
  patch = (url, data, option) => this.request(url, "PATCH", data, option);
  del = (url, data, option) => this.request(url, "DEL", data, option);
}

export default new Http();