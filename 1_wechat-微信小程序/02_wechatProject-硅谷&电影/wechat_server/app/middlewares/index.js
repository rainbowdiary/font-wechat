const config = require("../config");
const jsonwebtoken = require("jsonwebtoken");
const basicAuth = require('basic-auth');
const usersModel = require("../models/users");

class MiddleWares {
  //登录验证
  async auth(ctx, next) {

    try {
      const token = basicAuth(ctx.req).name;//直接获取Basis Auth的token
      //decoded = jwt.verify(token, secretOrPublicKey, [options, callback])   解token
      const decodeTokenUser = jsonwebtoken.verify(token, config.tokenKey);
      /*  加密传入什么,解密得到什么
      user = {name: 'damu',_id: '5e3fa51e141c3d3ae4e645c3',iat: 1581243663,exp: 1581848463} */
      ctx.state.user = decodeTokenUser;
    } catch (e) {
      ctx.throw(401, "请先登录~~")
    }
    await next()  //返回一个promise
  }

  //权限认证
  /* auth和access是依赖关系
  - 权限认证 判断当前登录的用户 和 当前需要修改的用户 是不是用一个 
    1. 是同一个 允许修改
    2. 不是同一个  不允许修改 
  */
  async access(ctx, next) {
    // 验证当前登录的用户 和 当前需要修改的用户 是不是用一个 
    if (ctx.state.user._id === ctx.params.id) {
      await next()
    } else {
      ctx.throw(403, "权限有误")
    }
  };

  //验证关注的人是否存在
  async followUserExist(ctx, next) {
    const followerId = ctx.params.id;
    const user = await usersModel.findById(followerId)
    if (user) {
      await next()
    } else {
      ctx.throw(403, "关注的用户不存在")
    }
  };

  // 验证话题是否存在
  async topicExist(ctx, next) {
    const topic = await topicsModel.findById(ctx.params.id);
    if (!topic) { ctx.throw(404, "对应的话题不存在") };
    await next()
  };


  //判断一下对应的问题是否存在
  async questionExist(ctx, next) {
    const question = await questionsModel.findById(ctx.params.id);
    if (!question) { ctx.throw(404, "对应的问题不存在") };
    ctx.state.question = question;
    await next()
  }

  //判断一下对应的答案是否存在
  async answerExist(ctx, next) {
    const answer = await answersModel.findById(ctx.params.answerId);
    if (!answer) { ctx.throw(404, "对应的答案不存在") };
    ctx.state.answer = answer;
    await next()
  }

  //判断一下对应的用户是否存在
  async userExist(ctx, next) {
    const question = await usersModel.findById(ctx.params.id);
    if (!question) { ctx.throw(404, "当前用户不存在") };
    await next()
  }

  //判断一下当前问题是不是属于当前用户
  //依赖于auth
  async questionIsLogin(ctx, next) {
    const question = await questionsModel.findById(ctx.params.id);
    if (ctx.state.user._id !== question.questioner.toString()) {
      ctx.throw(401, "当前问题 不属于 当前用户")
    }
    await next()
  }

  //判断一下当前答案是不是当前用户回答的
  async answerIsLogin(ctx, next) {
    const answer = await answersModel.findById(ctx.params.answerId);
    if (ctx.state.user._id !== answer.answer.toString()) {
      ctx.throw(401, "当前答案 不属于 当前用户")
    }
    await next()
  }

  //判断一下当前答案是不是属于当前问题
  //answerIsQuestion依赖于questionExist & answerExist
  async answerIsQuestion(ctx, next) {
    //ctx.params.id
    // answersModel answerid
    console.log(ctx.state.question._id, ctx.state.answer.questionItem.toString())
    if (ctx.state.question._id.toString() !== ctx.state.answer.questionItem.toString()) {
      ctx.throw(401, "当前答案 不属于 当前问题")
    }
    await next()
  }
}


module.exports = new MiddleWares()