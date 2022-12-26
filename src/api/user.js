import request from '@/utils/request'
//登录
export function login(data) {
  return request({
    // url: '/vue-element-admin/user/login',
    url: '/login',
    method: 'post',
    data:data
  })
}
//短信验证码登录
export function msgLogin(data) {
  return request({
    // url: '/vue-element-admin/user/login',
    url: '/msgLogin',
    method: 'post',
    data:data
  })
}
//获取用户信息
export function getInfo(token) {
  return request({
    // url: '/vue-element-admin/user/info',
    url: '/user/info',
    method: 'get',
    // params: { token }
  })
}
//发送登录短信
export function sendMsg(data) {
  return request({
    url: '/user/sendMsg',
    method: 'post',
    data:data
  })
}
//发送注册短信
export function registerMsg(data) {
  return request({
    url: '/user/registerMsg',
    method: 'post',
    data:data
  })
}
//注册
export function register(data) {
  return request({
    url: '/user/register',
    method: 'post',
    data:data
  })
}


//退出登录
export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
