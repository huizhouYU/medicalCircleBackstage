import request from '@/utils/request'

//获取品牌列表
export function brandList() {
  return request({
    url: 'brand/list',
    method: 'get',
  })
}

//新建需求
export function createDemand(data) {
  return request({
    url: 'article/create',
    method: 'post',
    data
  })
}
//获取需求列表
export function demandList(data) {
  return request({
    url: 'article/list',
    method: 'get',
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
