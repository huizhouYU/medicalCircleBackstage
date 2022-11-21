import request from '@/utils/request'

//新建商品
export function goodCreate(data) {
  return request({
    url: 'goods/create',
    method: 'post',
    data
  })
}

//商品列表
export function goodsList(data) {
  return request({
    url: 'goods/list',
    method: 'post',
    data
  })
}

//更新推荐状态
export function updateRecommend(data) {
  return request({
    url: 'goods/updateRecommend',
    method: 'post',
    data
  })
}
//更新上下架状态
export function updateShow(data) {
  return request({
    url: 'goods/updateShow',
    method: 'post',
    data
  })
}
//根据id获取商品详情
export function goodsDetail(query) {
  return request({
    url: 'goods/detail',
    method: 'get',
    params:query
  })
}
// //编辑需求  提交
//新建商品
export function goodsUpdate(data) {
  return request({
    url: 'goods/update',
    method: 'post',
    data
  })
}

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
