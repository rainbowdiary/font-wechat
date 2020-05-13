/* # 接口
- http://t.yushu.im/v2/movie/in_theaters?start=0&count=3(正在热映)
- http://t.yushu.im/v2/movie/coming_soon?start=0&count=3(即将上映)
- http://t.yushu.im/v2/movie/top250?start=0&count=3(豆瓣top250)
- http://t.yushu.im/v2/movie/search?q=周冬雨
 */
/* 设计数据：
[
  {type: "top250",
  movies:[
    postImgUrl:"",
    name: "",
    score: 9,
    starts:['ON','ON','ON','HALF','OFF']
  ]
  }
] */

//引入评星工具
import util from "../../utils/util"
// 拿到注册的全局对象
const app = getApp()
const { BASEURL } = app.globalData
let index = -1;
Page({
  data: {
    moviesList: [], //提前定义设计的movies数据
    showRows: true,
    showGrids: false,
    searchValue: "",
    searchMovies: []
  },
  onLoad() {  // 封装发请求的函数,作用工具类封装起来getMovies  函数柯里化
    util.http(`${BASEURL}/v2/movie/in_theaters?start=0&count=3`, this.finalData, "正在热映")
    util.http(`${BASEURL}/v2/movie/coming_soon?start=0&count=3`, this.finalData, "即将上映")
    util.http(`${BASEURL}/v2/movie/top250?start=0&count=3`, this.finalData, "Top250")
  },
  // 封装获取设计好的数据
  finalData(resData, type) {
    index++;
    // 过滤movies数据为3项
    let movies = resData.subjects.map((movie) => {
      return {
        postImgUrl: movie.images.large,
        name: movie.original_title,
        score: movie.rating.average,
        stars: util.getStarsArr(movie.rating.stars)  //使用评星工具
      }
    })
    if (type) {
      this.setData({
        [`moviesList[${index}]`]: {
          type,
          movies,
          stars: ['ON', 'ON', 'ON', 'HALF', 'OFF']
        },
      })
    }
    this.setData({
      searchMovies: movies
    })

  },
  toMore(event) {
    wx.navigateTo({
      url: `/pages/movies/more/more?type=${event.currentTarget.dataset.type}`
    })
  },
  // 鼠标悬停搜索框
  handleFocus() {
    this.setData({
      showRows: false,
      showGrids: true,
      searchMovies: []
    })
  },
  // 鼠标点击搜索框close图标
  handleClear() {
    this.setData({
      showRows: true,
      showGrids: false,
      searchValue: "",
      searchMovies: []
    })
  },
  // 点击确认按钮，enter
  handleConfirm(event) {  //同样传入this.finalData这个函数柯里化进行数据过滤
    // 发送请求
    util.http(`${BASEURL}/v2/movie/search?q=${event.detail.value}`, this.finalData)
  },
})