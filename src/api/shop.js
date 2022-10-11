import request from '@/utils/request'
//店铺认证
export function storeApply(data) {
  return request({
    url: 'store/apply',
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
