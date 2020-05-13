 1. api中如果有动态拼接的接口地址 我们需要使用函数的形式往外提供
 2. 如果微信小程序不支持使用asynx 引入regeneratorRuntime这个库
 3. 请求回来的数据 已经经过剥取了

 微信自动登录
   openid要入库(在整个微信小程序启动时入库  app onLaunch)
   微信的用户信息要入库(在index界面被渲染的时候 入库 index onload)


获取用户信息的方式
 1. <open-data type="userNickName"></open-data> 只能显示
 2.  <button open-type='getUserInfo' bindgetuserinfo = 'getUserInfo' ></button >;
点击这个按钮时 我们可以在getUserInfo回调中拿到用户信息 :ev.detail.userInfo
需要用户点击按钮
 1. wx.getUserInfo() 去获取用户信息  不需要任何点击;前提:必须授权过!!!

实现了几个公共模块
  1. 缓存的公共存储
  2. 路由的搭建
  3. http请求的promise化
  
小程序数据传递
 1. js文件 --> wxml文件 : 
   js文件中的 data: { key: val } key直接在wxml文件上使用  {{key}}
 2. wxml --> wxml
    模板的使用方向模板中传递数据 
     < template data={{key:val}}></template>
     < template data={{...obj }}></template>
     使用 {{key}}
 3. wxml ---> js
  <view data-id="1" bind:Tap="handleTap"></view>
  handleTap(ev){
    var id = ev.currentTarget.dataset.id
  }
 4. url 中的query --> js
    https://127.0.0.1/damu?name=damu&age=18
    onLoad(query){
      var name = query.name;
      var age = query.age;
    }

组件 : view text image swiper swiper-item icon block
配置 : 全局 Page
 生命周期
 数据仓库
 回调函数
 路由
 界面的展示
指令
 {{}}
 wx:for
 wx:if
 wx:elif 
 wx:else
 wx:key
 bind:tap      
API
 wx.navigateTo;
 wx.redirectTo;
 wx.switchTab
 wx.navigateBack
 wx.request 

 page.setData
 
 wx.getUserInfo
 wx.getSystemInfo
 wx.getSetting    获取用户的当前设置。返回值中只会出现小程序已经向用户请求过的权限
 
 wx.getStorageSync
 wx.setStorageSync
 wx.removeStorageSync
 wx.clearStorageSync
 
 wx.showLoading
 wx.hideLoading
 wx.showToast

# 业务
1. code换openid
2. openid入库
3. 用户uid入微信Storage

4. 用户信息入库，返回token
5. token入Storage

# 获取用户信息
1. ```
  <button wx:if="{{!hasUserInfo}}" class="login-btn" open-type="getUserInfo" bindgetuserinfo="getUserInfo">
    微信登录
  </button>
 ``
2. wx.getUserInfo({success(res){}})

# 获取用户当前授权
wx.getSetting({})


# 小程序如何支持npm
点击开发工具导航栏，工具->构建npm
每次下载一个包之后都需要构建
# 微信不允许他的回调函数使用async  --->regeneratorRuntime 
解决: 
使用库 regenerator@0.13.1
app.js 
  import regeneratorRuntime from "regenerator-runtime/index.js";
   
# 注意（坑）
微信小程序执行时间的先后，
不注意会导致很多信息无法获取，
封装函数来解决问题

* day34