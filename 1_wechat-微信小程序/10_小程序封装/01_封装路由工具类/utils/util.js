// 1. 封装公共的缓存工具类
// 2. 封装公共的路由工具类
// 3. 封装公共的请求工具类

//获取平台信息
const getSystemInfo = () => {
  return wx.getSystemInfoSync()
}



module.exports = {
  formatTime,
  getStarsArr,
  http
  // getSystemInfo
}
