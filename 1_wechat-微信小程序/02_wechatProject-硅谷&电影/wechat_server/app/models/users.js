const mongoose = require("mongoose");
const { Schema, model } = mongoose;
// 对数据库数据进行校验
const usersSchema = Schema({
  /* 用户基本信息 */
  __v: { type: Number, select: false },  //type必填
  name: { type: String, required: true },
  password: { type: String, required: true, select: false }, //select:false 密码不可返回
  gender: { type: String, require: true, enum: ["male", "female"] }, //enum: 数组 创建验证器检查这个值是否包含于给定数组
  avatarUrl: String,
  headline: String,
  business: String,
  locations: {
    type: [String], //类型为数据,数组里面只能放字符串,
    select: false
  },
  employments: {
    type: [{
      company: String,
      job: String
    }],
    select: false
  },
  educations: {
    type: [{
      school: String,
      major: String,
      diploma: { //文凭
        type: Number,
        enum: [1, 2, 3, 4, 5]
      },
      entrance_year: Number,
      graduation_year: Number
    }],
    select: false
  },
  /* 用户与粉丝 */
  //代表当前的用户关注了谁?
  //代表当前用户的粉丝?
  following: {  //用户关注的对象(有限的数据)
    type: [{
      type: Schema.Types.ObjectId,
      ref: "Users"   //查询显示的时候可以通过populate : 链接查询(外链接);查到id相关的信息  
    }]
  },
  //代表的是用户关注了哪些话题
  followingTopics: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "Topics"
      }
    ],
    select: false
  },
  likeAnswers: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: "Answers"
    }],
    select: false,
    default: []
  },
  disLikeAnswers: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: "Answers"
    }],
    select: false,
    default: []
  }
});
module.exports = model('Users', usersSchema);