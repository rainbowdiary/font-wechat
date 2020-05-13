import store from "../utils/store";
//  const uid =  store.getItem("uid", "userInfo"); //uid到底能不能获取到，  uid是不能获取到的
export default {
  "getOpenId": "/wx_users/getOpenId",
  saveUserInfo() { //使用函数这个uid才有效
    //执行时间问题会导致Storage中还没拿到uid
    const uid = store.getItem("uid", "userInfo");
    return `/wx_users/${uid}/saveUserInfo`;
  }
}