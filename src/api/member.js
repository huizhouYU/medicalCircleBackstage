import request from '@/utils/request'


//查询邀请的用户列表
export function activationUsers(query) {
  return request({
    url: 'user/activationUsers',
    method: 'get',
    params:query
  })
}
//最近使用的提款账号
export function bankInfo(query) {
  return request({
    url: 'withdraw/bankInfo',
    method: 'get',
    params:query
  })
}
//发送提现申请短信
export function sendSms(data) {
  return request({
    url: '/withdraw/sendSms',
    method: 'post',
    data
  })
}
//申请提现
export function apply(data) {
  return request({
    url: 'withdraw/apply',
    method: 'post',
    data
  })
}
//查询提现记录
export function applyList(query) {
  return request({
    url: 'withdraw/applyList',
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
