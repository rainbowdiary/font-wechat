// pages/movies/more/more.js
const util = require("../../../utils/util")
const app = getApp()
const { BASEURL } = app.globalData

Page({
  data: {
    movies: [],
    navigationBarTitle: "",  //电影分类对应的标题
    currentUrl: "", //当前分类对应的URL
    start: 0,  //发请求所需参数
    count: 20,   //发请求所需参数
    isFirstReq: true // 是不是第一次发送请求(下拉算第一次请求)
  },
  // 上拉更新  拉到底部触发回调
  onReachBottom() {
    const { currentUrl, start, count, isFirstReq } = this.data
    util.http(`${currentUrl}?start=${start}&count=${count}`, this.cb, isFirstReq)
  },
  //  下拉加载，发送请求
  onPullDownRefresh() {
    const { currentUrl, start, count, isFirstReq } = this.data
    util.http(`${currentUrl}?start=${start}&count=${count}`, this.cb, isFirstReq)
  },
  onLoad: function (query) {
    this.setData({  //setData同步修改数据，异步渲染页面数据
      navigationBarTitle: query.type
    });
    //发送请求，请求数据
    switch (query.type) {
      case "正在热映":
        util.http(`${BASEURL}/v2/movie/in_theaters`, this.cb)
        this.setData({
          currentUrl: `${BASEURL}/v2/movie/in_theaters`
        })
        break;
      case "即将上映":
        util.http(`${BASEURL}/v2/movie/coming_soon`, this.cb)
        this.setData({
          currentUrl: `${BASEURL}/v2/movie/coming_soon`
        })
        break;
      case "Top250":
        util.http(`${BASEURL}/v2/movie/top250`, this.cb)
        this.setData({
          currentUrl: `${BASEURL}/v2/movie/top250`
        })
        break;
      default:
        break;
    }
    // 初始化请求数据为第一次，之后都是false
    this.setData({ isFirstReq: false })
  },

  // 函数柯里化,传给util的第二个函数参数,对数据进行过滤
  cb(resData, isFirstReq) {  //接收请求回来的数据，本次案例中接收 1. 第一次点击“更多”发送的请求 2. 下拉刷新请求的数据
    const { count, start } = this.data
    let movies = resData.subjects.map((movie) => {
      return {
        postImgUrl: movie.images.large,
        name: movie.original_title,
        score: movie.rating.average,
        stars: util.getStarsArr(movie.rating.stars)  //使用评星工具
      }
    });

    if (isFirstReq) {
      this.setData({ isFirstReq: false })
    } else {
      // 下拉完成之后看不到之前的电影数据；需要将下拉请求电影数据和之前的数据进行拼接展示
      movies = this.data.movies.concat(movies)
    }
    this.setData({  //请求回来的数据过滤
      movies,
      start: count + start  //下拉请求成功后修改start请求参数
    }, () => {
      wx.stopPullDownRefresh()  //上拉请求完成之后去掉加载样式
    })
  },
  onReady: function () {
    // 动态设置当前标题
    wx.setNavigationBarTitle({
      title: this.data.navigationBarTitle
    })
  },

})