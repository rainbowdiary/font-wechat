1. code换openid
2. openid入库
3. 用户uid入微信Storage

1. 用户信息入库，返回token
2. token入Storage

# 获取用户信息
1. ```
  <button wx:if="{{!hasUserInfo}}" class="login-btn" open-type="getUserInfo" bindgetuserinfo="getUserInfo">
    微信登录
  </button>
 ```
2. wx.getUserInfo({success(res){}})

# 获取用户当前授权
wx.getSetting({})