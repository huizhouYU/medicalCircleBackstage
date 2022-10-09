import request from '@/utils/request'

export function uploadImage(query) {
  return request({
    url: '/attach/uploadImage',
    method: 'post',
    params: {'file':query},
    // headers: {'Content-Type': 'multipart/form-data'}
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
