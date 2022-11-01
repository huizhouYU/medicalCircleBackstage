import request from '@/utils/request'
//店铺认证
export function storeApply(data) {
  return request({
    url: 'store/apply',
    method: 'post',
    data
  })
}
//商家认证重新提交
export function applyUpdate(data) {
  return request({
    url: '/store/applyUpdate',
    method: 'post',
    data
  })
}
//获取店铺分类
export function storeCategoryList() {
  return request({
    url: '/store/category',
    method: 'get',
  })
}
//获取店铺详情
export function storeDetail() {
  return request({
    url: 'store/detail',
    method: 'get',
  })
}

//更新店铺基本信息
export function storeUpdate(data) {
  return request({
    url: '/store/update',
    method: 'post',    data
  })
}

//短信验证码登录
export function applyMsg(data) {
  return request({
    url: '/user/applyMsg',
    method: 'post',
    data
  })
}

// export function fetchPv(pv) {
//   return request({
//     url: '/vue-element-admin/article/pv',
//     method: 'get',
//     params: { pv }
//   })
// }

// export function createArticle(data) {
//   return request({
//     url: '/vue-element-admin/article/create',
//     method: 'post',
//     data
//   })
// }

// export function updateArticle(data) {
//   return request({
//     url: '/vue-element-admin/article/update',
//     method: 'post',
//     data
//   })
// }
