// 1. 封装公共的缓存工具类
// 2. 封装公共的路由工具类
// 3. 封装公共的请求工具类

//获取系统信息
const getSystemInfo = () => {
  return wx.getSystemInfoSync()
}


const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//  定义评星数据
const LENGTH = 5;
const getStarsArr = stars => {
  let arr = [];
  stars = stars / 10;
  let ON = Math.floor(stars);
  let HALF = (stars % 1 === 0 ? false : true)

  for (let i = 0; i < ON; i++) {
    arr.push('ON')
  }
  if (HALF) {
    arr.push('HALF')
  }
  while (arr.length < LENGTH) {
    arr.push('OFF')
  }
  return arr
}

// 封装发请求的函数,作用工具类封装起来 ,之前的getMovies
const http = (url, callBack, ...arg) => {
  wx.showNavigationBarLoading();  //请求显示导航栏加载 
  wx.request({
    url,
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: res => {
      wx.hideNavigationBarLoading();
      //  函数柯里化
      callBack(res.data, ...arg) //将拿到的未过滤的原始数据传给封装函数=>finalData
    }
  })
}

module.exports = {
  formatTime,
  getStarsArr,
  http,
  getSystemInfo
}
