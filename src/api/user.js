import request from '@/utils/request'

export function login(data) {
  console.log("切换到api中请求login")
  return request({
    // url: '/vue-element-admin/user/login',
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    // url: '/vue-element-admin/user/info',
    url: '/user/info',
    method: 'post',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
