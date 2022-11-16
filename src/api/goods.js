import request from '@/utils/request'

export function goodsList(data) {
  return request({
    url: 'goods/list',
    method: 'post',
    data
  })
}
// //编辑需求  提交
// export function updateDemand(data) {
//   return request({
//     url: 'article/update',
//     method: 'post',
//     data
//   })
// }

export function goodsCategoryList() {
  return request({
    url: 'goodsCategory/list',
    method: 'get',
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
