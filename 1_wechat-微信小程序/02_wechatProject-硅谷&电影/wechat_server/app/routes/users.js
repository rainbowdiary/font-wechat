const Router = require("koa-router");
const usersRouter = new Router({ prefix: "/users" });
const { getAll, addUser, getUserById, updateUserById,
  delUserById, login, upload,
  follow, unfollow, listFollowing, listFollowers,
  followTopic, unfollowTopic, listFollowingTopics,
  listQuestions, like, unlike, listAnswerLikes, dislike,
  unDislike, listAnswerDisLikes
} = require("../controllers/users")
const { auth, access, followUserExist, topicExist, answerExist, userExist } = require("../middlewares")

usersRouter.get("/", getAll)
usersRouter.post("/", addUser)
usersRouter.get("/:id", getUserById)
usersRouter.patch("/:id", auth, access, updateUserById)
usersRouter.post("/:id/upload", auth, access, upload)
usersRouter.post("/login", login)
usersRouter.del("/:id", auth, access, delUserById)

/* 用户与粉丝 */
//关注 id:代表你要关注哪个用户!!!
usersRouter.put("/following/:id", auth, followUserExist, follow)
//取消关注
usersRouter.del("/following/:id", auth, followUserExist, unfollow)
// //列出用户底下的关注者
usersRouter.get("/:id/following", listFollowing)
// //列出用户的粉丝
usersRouter.get("/:id/followers", listFollowers)


//关注话题 id:话题的id
usersRouter.put("/followingTopics/:id", auth, topicExist, followTopic)
//取消关注话题 id:话题的id
usersRouter.del("/followingTopics/:id", auth, topicExist, unfollowTopic)
//列出用户关注的话题 id:用户id
usersRouter.get("/:id/followingTopics", auth, access, listFollowingTopics)

//列出用户提出的问题 id:用户id
usersRouter.get("/:id/questions", auth, access, listQuestions)

//对答案进行赞(踩和赞是互斥关系)
usersRouter.put("/like/:answerId", auth, answerExist, like, unDislike)
//对答案取消赞
usersRouter.del("/like/:answerId", auth, answerExist, unlike)
//列出用户赞过的答案 id:用户id
usersRouter.get("/:id/answerLikes", userExist, listAnswerLikes)

//对答案进行踩
usersRouter.put("/dislike/:answerId", auth, answerExist, dislike, unlike)
//对答案取消踩
usersRouter.del("/dislike/:answerId", auth, answerExist, unDislike)
//列出用户踩过的答案
usersRouter.get("/:id/answerDisLikes", userExist, listAnswerDisLikes)


module.exports = usersRouter;