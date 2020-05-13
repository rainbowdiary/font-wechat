/*
    1. 将damulaopzdy静态资源服务器换成了koa-static
    2. 将自己实现的后台路由的批量注册功能 换成了require-directory的形式
*/

const Koa = require("koa");
const app = new Koa();
const koaBody = require("koa-body") //解析上传的图片
const Router = require("koa-router");  //后台路由
const error = require('koa-json-error')//处理错误
const _ = require("lodash")
const parameter = require('koa-parameter');//参数的校验(只校验body中的数据)
const serve = require('koa-static'); // koa提供的静态资源服务器
const path = require('path');
const requireDirectory = require('require-directory');//获取一个目录底下所有文件暴露出来的模块
const config = require("./config");  //配置文件

//  使用koa-static的静态资源服务器
app.use(serve(__dirname, "public"));

//连接数据库
require("./db");

//参数的校验(只校验body中的数据)
parameter(app);

app.use(error({
  postFormat: (e, obj) => process.env.NODE_ENV === 'production' ? _.omit(obj, 'stack') : obj
}))

//解析body中上传的图片
app.use(koaBody({
  multipart: true,   //处理文件类型
  formidable: {
    uploadDir: path.join(__dirname, '/public/img'),  //body中上传的图片往哪里放
    keepExtensions: true
  }
}));

// 后台路由批量注册 (需要放在最下面,该解析的都可以解析)
requireDirectory(module, './routes', {
  visit: (router) => {   //遍历并注册路由
    if (router instanceof Router) {
      //allowedMethods : 预请求(options) 返回接口所支持的http方法
      app.use(router.routes()).use(router.allowedMethods())
    }
  }
});

// 启动服务
app.listen(config.port, config.host, () => {
  console.log('\x1b[34m', `Server is listenning http://${config.host}:${config.port}`)
});
