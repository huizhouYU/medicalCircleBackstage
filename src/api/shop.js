import request from '@/utils/request'

export function goodsList(query) {
  return request({
    url: 'goods/list',
    method: 'post',
    params: query
  })
}

export function storeCategoryList() {
  return request({
    url: '/store/category',
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
