const usersModel = require("../models/users");
const jsonwebtoken = require("jsonwebtoken");
const config = require("../config")
var bcrypt = require('bcryptjs');  //对密码加盐加密

class Users {
  async getAll(ctx) {
    //分页功能  模糊搜索
    let { pre_page = 10, page = 1, q } = ctx.query
    pre_page = Math.max(+pre_page, 1)
    page = Math.max(+page, 1)
    ctx.body = await usersModel.find({ name: new RegExp(q) }).skip((page - 1) * pre_page).limit(pre_page)
  };
  // 用户注册
  async addUser(ctx) {
    //对body中的数据进行一次校验
    ctx.verifyParams({
      name: { type: "string", required: true },
      password: { type: "string", required: true },
      gender: { type: 'string', required: true },
      avatarUrl: { type: "string", required: false },
      headline: { type: "string", required: false },
      business: { type: "string", required: false },
      locations: { type: "array", itemType: "string", required: false },
      employments: { type: "array", itemType: "object", required: false },
      educations: { type: "array", itemType: "object", required: false }
    });
    //  业务校验是否存在相同用户
    let { name, password } = ctx.request.body
    let dataName = await usersModel.findOne({ name });
    if (dataName) { ctx.throw(409, "用户名已注册") }
    //不能明文存入数据库,需要对密码加盐加密 
    const salt = bcrypt.genSaltSync(10);
    const encryptPassword = bcrypt.hashSync(password, salt); //加盐,得到加密后的密码
    ctx.request.body.password = encryptPassword
    // 存入数据库
    let user = await usersModel.create(ctx.request.body)
    // 注册成功后返回的数据不包含密码(所以需要重新查询(select:false))
    let newUser = await usersModel.findById(user._id);
    ctx.body = newUser;
  };

  //根据id查找用户
  async getUserById(ctx) {
    //locations;;employments;educations
    //[ 'locations', '', 'employments', 'educations' ]
    //[ 'locations', 'employments', 'educations' ]
    //[ '+locations', '+employments', '+educations' ]
    //+locations +employments +educations
    const fields = ctx.query.fields
    const selectFields = fields.split(",").filter(item => item).map(item => `+${item}`).join(" ")
    const id = ctx.params.id;
    const user = await usersModel.findById(id).select(selectFields);
    if (!user) ctx.throw(404, "当前用户不存在")
    ctx.body = user;
  };

  //根据id更新用户
  async updateUserById(ctx) {
    // 对body中数据进行校验
    ctx.verifyParams({
      name: { type: "string", required: false },
      password: { type: "string", required: false },
      gender: { type: "string", required: false },
      avatarUrl: { type: "string", required: false },
      headline: { type: "string", required: false },
      business: { type: "string", required: false },
      locations: { type: "array", itemType: "string", required: false },
      employments: { type: "array", itemType: "object", required: false },
      educations: { type: "array", itemType: "object", required: false }
    });
    //  入库
    let id = ctx.params.id;
    let user = await usersModel.findByIdAndUpdate(id, ctx.request.body)
    if (!user) ctx.throw(404, "当前用户不存在");
    //  返回数据
    let updatedUser = await usersModel.findById(id);
    ctx.body = updatedUser;
  };

  async login(ctx) {
    ctx.verifyParams({
      name: { type: "string", required: true },
      password: { type: "string", required: true }
    });
    const { name, password } = ctx.request.body
    // 验证用户名是否存在
    let user = await usersModel.findOne({ name }).select("+password");  //查询后密码不会返回(因为select:false)
    if (!user) { ctx.throw(401, "用户不存在~") };
    //验证密码是否存在
    const flag = bcrypt.compareSync(password, user.password); // true,解密

    if (!flag) { ctx.throw(401, "密码错误~") }
    // 获取token并返回出去
    //jwt.sign(payload, secretOrPrivateKey, [options, callback])
    const token = jsonwebtoken.sign({ name: user.name, _id: user._id }, config.tokenKey, { expiresIn: config.tokenExpiresIn });
    ctx.body = { token }
  }

  // 上传头像
  async upload(ctx) {
    //  ctx.request.上传的路径files.上传的字段名
    const file = ctx.request.files.file;
    const name = file.path.split("\\").pop();
    ctx.body = {
      path: `http://127.0.0.1:8080/img/${name}`
    }
  }
  //  根据id删除用户
  async delUserById(ctx) {
    let id = ctx.params.id;
    let user = await usersModel.findByIdAndRemove(id);
    if (!user) ctx.throw(404, "当前用户不存在")
    ctx.status = 204;
  };

  /* 用户与粉丝 */
  // 关注用户,你要关注哪个用户
  async follow(ctx) {
    const followerId = ctx.params.id;
    // 将关注的id入库,user.following
    const me = await usersModel.findById(ctx.state.user._id).select("following");
    if (!me.following.includes(followerId)) {
      me.following.push(followerId);
      me.save()
    }
    ctx.status = 204
  }
  // 取消关注
  async unfollow(ctx) {
    const followerId = ctx.params.id;
    // 将关注的id入库,user.following
    const me = await usersModel.findById(ctx.state.user._id).select("following");
    if (me.following.includes(followerId)) {
      const index = me.following.indexOf(followerId);
      me.following.splice(index, 1);
      me.save()
    }
    ctx.status = 204
  }

  // 列出用户关注者
  async unfollow(ctx) {
    const followerId = ctx.params.id;
    // 将关注的id入库,user.following
    const me = await usersModel.findById(ctx.state.user._id).select("following");
    if (me.following.includes(followerId)) {
      const index = me.following.indexOf(followerId);
      me.following.splice(index, 1);
      me.save()
    }
    ctx.status = 204
  }

  async listFollowing(ctx) {
    const id = ctx.params.id;
    /* 
    ["5e3ff1de3a0e3e44a0062e00"]
    ===>
    [{
        "following": [],
        "_id": "5e3ff1de3a0e3e44a0062e00",
        "name": "hello",
        "gender": "male"}]
     */
    //populate : 链接查询(外链接)   //如果没有,只拿得到id,无法拿到id相关的信息
    const user = await usersModel.findById(id).select("+following").populate("following");
    if (!user) { ctx.throw(404, "用户不存在") }
    ctx.body = user.following
  }

  async listFollowers(ctx) {
    const users = await usersModel.find({ following: ctx.params.id });
    ctx.body = users;
  };
  async followTopic(ctx) {
    const me = await usersModel.findById(ctx.state.user._id).select("+followingTopics");
    const followId = ctx.params.id;
    console.log(!me.followingTopics.includes(followId), followId)
    if (!me.followingTopics.includes(followId)) {
      me.followingTopics.push(followId);
      me.save();
    }
    ctx.status = 204;
  }

  async unfollowTopic(ctx) {
    //找到当前的登录者
    const me = await usersModel.findById(ctx.state.user._id).select("+followingTopics");
    const followId = ctx.params.id;
    if (me.followingTopics.includes(followId)) {
      const index = me.followingTopics.indexOf(followId);
      me.followingTopics.splice(index, 1);
      me.save();
    }
    ctx.status = 204;
  }

  async listFollowingTopics(ctx) {
    //用户id
    const id = ctx.params.id;
    const user = await usersModel.findById(id).select("+followingTopics")
      .populate("followingTopics");
    ctx.body = user.followingTopics
  }

  async listQuestions(ctx) {
    const questions = await questionsModel.find({ questioner: ctx.params.id });
    ctx.body = questions;
  }

  async like(ctx, next) {
    //找到当前的登录者
    const me = await usersModel.findById(ctx.state.user._id).select("+likeAnswers");
    const answerId = ctx.params.answerId;
    if (!me.likeAnswers.includes(answerId)) {
      me.likeAnswers.push(answerId);
      await answersModel.findByIdAndUpdate(ctx.params.answerId, { $inc: { favs: 1 } })
      me.save();
    }
    ctx.status = 204;
    await next()
  }

  async unlike(ctx) {
    //找到当前的登录者
    const me = await usersModel.findById(ctx.state.user._id).select("+likeAnswers");
    const answerId = ctx.params.answerId;
    if (me.likeAnswers.includes(answerId)) {
      const index = me.likeAnswers.indexOf(answerId);
      me.likeAnswers.splice(index, 1);
      await answersModel.findByIdAndUpdate(ctx.params.answerId, { $inc: { favs: -1 } })
      me.save();
    }
    ctx.status = 204;
  }

  async listAnswerLikes(ctx) {
    //找到当前的登录者
    const user = await usersModel.findById(ctx.params.id)
      .select("+likeAnswers").populate("likeAnswers");
    ctx.body = user.likeAnswers;
  }

  async dislike(ctx) {
    //找到当前的登录者
    const me = await usersModel.findById(ctx.state.user._id).select("+disLikeAnswers");
    const answerId = ctx.params.answerId;
    if (!me.disLikeAnswers.includes(answerId)) {
      me.disLikeAnswers.push(answerId);
      me.save();
    }
    ctx.status = 204;
    await next()
  }

  async unDislike(ctx) {
    //找到当前的登录者
    const me = await usersModel.findById(ctx.state.user._id).select("+disLikeAnswers");
    const answerId = ctx.params.answerId;
    if (me.disLikeAnswers.includes(answerId)) {
      const index = me.disLikeAnswers.indexOf(answerId);
      me.disLikeAnswers.splice(index, 1);
      me.save();
    }
    ctx.status = 204;
  }

  async listAnswerDisLikes(ctx) {
    //找到当前的登录者
    const user = await usersModel.findById(ctx.params.id)
      .select("+disLikeAnswers").populate("disLikeAnswers");
    console.log(user.disLikeAnswers)
    ctx.body = user.disLikeAnswers;
  }
}

module.exports = new Users();