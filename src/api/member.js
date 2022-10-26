import request from '@/utils/request'


//查询邀请的用户列表
export function activationUsers(query) {
  return request({
    url: 'user/activationUsers',
    method: 'get',
    params:query
  })
}

//获取我推广的下级合同列表
export function contractList(query) {
  return request({
    url: '/contract/activation',
    method: 'get',
    params:query
  })
}
