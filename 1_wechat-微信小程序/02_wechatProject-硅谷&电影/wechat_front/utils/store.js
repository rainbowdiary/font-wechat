/*  操作微信的Storage
"模块名": { uid: "123"，token:"1234" } 
 setItem(key,val,模块名) */
class Store {
  //  getItem("uid","userInfo") / getItem("userInfo")
  getItem(key, modelName) {
    if (modelName) {
      const modelObj = this.getItem(modelName)
      if (modelObj) return modelObj[key]
      return ""
    } else {
      return wx.getStorageSync(key)
    }
  };
  setItem(key, val, modelName) {
    if (modelName) {
      let modelObj = this.getItem(modelName)
      modelObj ? "" : modelObj = {}
      modelObj[key] = val
      if (modelObj) {
        wx.setStorageSync(modelName, modelObj)
      } else {
        wx.setStorageSync(key, val)
      }
    }
  };
  clear(key) {
    key ? wx.removeStorageSync(key) : wx.clearStorageSync()
  }
}

export default new Store()