// pages/atguigu/detail/index.js
const data = require("../data/data")
Page({
  onLoad: function (query) {
    // 拿到路径中传过来的id
    // 根据路径中带的id发送请求，请求详情页数据
    setTimeout(() => {
      const detailData = data.templateDatas.find(item => item.newsid === +query.id)
      this.setData({ ...detailData })
    }, 200);
  },

})