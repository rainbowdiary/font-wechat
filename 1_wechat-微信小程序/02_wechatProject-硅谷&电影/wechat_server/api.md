## 用户: 
**token验证用户是否登录**:
  方式: Basic Auth 
  库:basic-auth 直接解析BasicAuth的token
  使用jsonwebtoken.verify()验证token

1. 获取所有用户信息: 
  http://127.0.0.1:8080/users?pre_page=10&page=1&q=r
  实现了分页功能  模糊搜索
  find({name: q}).skip((page-1)*pre_page).limit(page)
2. 用户注册
   必填name,password 
   password加盐加密后存入数据库;
   返回不带密码的数据
   {
    "_id": "5e3ff1de3a0e3e44a0062e00",
    "name": "hello",
    "gender": "male"
    }
3. 根据id查找用户
  提供按照什么字段查询和显示
  http://127.0.0.1:8080/users/5e3fe773501c44410caa931b?fields=headline,locations 

5. 用户登录 /login
   登录后,返回token 
   {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiZGFtdSIsIl9pZCI6IjVlM2ZlNzczNTAxYzQ0NDEwY2FhOTMxYiIsImlhdCI6MTU4MTI0OTMzNCwiZXhwIjoxNTgxODU0MTM0fQ.9Q2zqbf78f7y_MWgyaMNkD1rSbmDcxd59Yjt6Clbqww"
  }

6. usersRouter.patch("/:id", auth, access, updateUserById)
  条件: auth先登录,拿到token,检测token是否正确
  鉴权: access是否修改的当前登录用户的信息
const auth = require('basic-auth'); // Auth Authorization标头字段解析器。Basic Auth方式是将token通过base64之后再传入,安全性会高些

<!-- 关注与粉丝 -->
多:多
model:
  following: {  //用户关注的对象(有限的数据)
    type: [{
      type: Schema.Types.ObjectId,
      ref: "Users"   //查询显示的时候可以通过populate : 链接查询(外链接);查到id相关的信息  
    }]
  }
control:
  const user = await usersModel.findById(id).select("+following").populate("following");

    /* 
    ["5e3ff1de3a0e3e44a0062e00"]
    ===>
    [{
        "following": [],
        "_id": "5e3ff1de3a0e3e44a0062e00",
        "name": "hello",
        "gender": "male"}]
     */