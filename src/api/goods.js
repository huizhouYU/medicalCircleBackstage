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
    params: query
  })
}
//编辑需求  提交
export function goodsUpdate(data) {
  return request({
    url: 'goods/update',
    method: 'post',
    data
  })
}
//删除商品
export function goodsDelete(data) {
  return request({
    url: 'goods/delete',
    method: 'post',
    data
  })
}
//还原商品
export function goodsRenew(data) {
  return request({
    url: 'goods/renew',
    method: 'post',
    data
  })
}
//分类列表(树形)
export function goodsCategoryList() {
  return request({
    url: 'goodsCategory/list',
    method: 'get',
  })
}
// 根据Pid查找下级分类
export function cartListByPid() {
  return request({
    url: 'goodsCategory/listByPid',
    method: 'get',
  })
}
//规格列表
export function specList(query) {
  return request({
    url: 'spec/list',
    method: 'get',
    params: query
  })
}
//新增规格
export function specCreate(data) {
  return request({
    url: 'spec/create',
    method: 'post',
    data
  })
}
//规格值列表
export function specValueList(query) {
  return request({
    url: 'spec/valueList',
    method: 'get',
    params: query
  })
}

//更新规格
export function specUpdate(data) {
  return request({
    url: 'spec/update',
    method: 'post',
    data
  })
}

//删除规格
export function specDelete(data) {
  return request({
    url: 'spec/delete',
    method: 'post',
    data
  })
}
// 商品关联
//分组列表
export function goodsGroupList(data) {
  return request({
    url: 'goodsGroup/list',
    method: 'post',
    data
  })
}
//创建分组
export function goodsGroupCreate(data) {
  return request({
    url: 'goodsGroup/create',
    method: 'post',
    data
  })
}
//更新分组
export function goodsGroupUpdate(data) {
  return request({
    url: 'goodsGroup/update',
    method: 'post',
    data
  })
}
//删除分组
export function goodsGroupDelete(data) {
  return request({
    url: 'goodsGroup/delete',
    method: 'post',
    data
  })
}
//查询分组详情
export function goodsGroupDetail(query) {
  return request({
    url: 'goodsGroup/detail',
    method: 'get',
    params: query
  })
}
//查询分组下的商品
export function goodsByGroup(query) {
  return request({
    url: 'goodsGroup/goodsByGroup',
    method: 'get',
    params: query
  })
}
//分组绑定商品
export function goodsBandGroup(data) {
  return request({
    url: 'goodsGroup/bandGoods',
    method: 'post',
    data
  })
}
//删除分组下的商品
export function groupRemoveGoods(data) {
  return request({
    url: 'goodsGroup/removeGoods',
    method: 'post',
    data
  })
}

