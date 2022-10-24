import request from '@/utils/request'


//查询邀请的用户列表
export function activationUsers(query) {
  return request({
    url: 'user/activationUsers',
    method: 'get',
    params:query
  })
}
