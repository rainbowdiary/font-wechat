import routes from "../routes/index.js.js.js"; //拿到所有的路由信息

/*   支持三种调用方式
 1. router.push("atguigu")
 2. router.push("atguigu",{
   query:{
     a:"a",
     b:"b"
   },
   type:"switchTab",
   duration:3000 //毫秒值
 })
 3. router.push({
   path: "atguigu",
   query: {
     a: "a",
     b: "b"
   },
   type: "switchTab",    //跳转类型，跳转普通页，或者tabBar页
   duration: 3000 //毫秒值
 })
*/
class Router {
  // 打平所有调用方式的差异，最终所有配置项都组合到option中
  push(path, option = {}) {
    //  第一个path不管是字符串还是对象，都按照option的方式处理
    if (typeof path === "string") {  //说明是前面两种方式调用，转换成第三种方式
      option.path = path
    } else {  //说明是第三种方式调用
      option = path
    }
    const { query, type = "navigateTo", duration } = option
    const queryStr = this.parseQuery(query) ? "?" + this.parseQuery(query) : ""
    const url = routes[option.path] + queryStr
    duration > 0 ? setTimeout(() => {
      this.to(type, url)
    }, duration) : this.to(type, url)
  };

  // 定义跳转方法
  to(type, url) {
    const urlObj = { url }
    switch (type) {
      case "switchTab":
        console.log(urlObj);
        wx.switchTab(urlObj)
        break;
      case "redirectTo":
        wx.redirectTo(urlObj)
        break;
      case "navigateTo":
        wx.redirectTo(navigateTo)
        break;
      case "back":
        wx.navigateBack({
          delta: 1
        })
        break;
    }
  }
  //  转换查询字符串  {a:"a",b:"b"} ==> a=a&b=b
  parseQuery(query) {
    for (const key in query) {
      let arr = []
      if (query.hasOwnProperty(key)) {
        arr.push(`${key}=${query[key]}`)  // {a:"a",b:"b"} ==> ["a=a","b=b"]
      }
      arr.join("&")  //["a=a","b=b"] ==> a=a&b=b
      return arr;
    }
  }
}

export default new Router()