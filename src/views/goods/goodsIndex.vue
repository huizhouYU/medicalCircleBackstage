<template>
  <div class="app-container">
    <!-- 模块二 搜索条件 + 添加商品 -->
    <div class="search-add">
      <!-- 搜索部分 -->
      <div class="search">
        <!-- 商品分类 -->
        <el-cascader v-model="sortValue" placeholder="商品分类" :options="options" @change="handleChange"
          class="public-select-box" clearable :filterable="true">
        </el-cascader>
        <!-- 商品状态 -->
        <el-select v-model="value" placeholder="商品状态" class="public-select-box choose-shop-state" clearable>
          <el-option v-for="item in shopStateOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <!-- input 输入关键字  -->
        <el-input placeholder="请输入关键字" v-model="inputKey" class="input-with-select search-select-input">
          <el-select v-model="inputKeyType" slot="prepend" placeholder="请选择">
            <el-option v-for="item in inputKeyOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="selectData()"></el-button>
        </el-input>
      </div>
      <!-- 添加商品 -->
      <el-button type="primary" class="public-el-btn" @click="toAddGoods">添加商品</el-button>
    </div>
    <!-- 模块三 商品列表 -->
    <!-- <goods-items class="items" :tableData="tableData" :total="total" @getList="getNewList" v-if="tableData&&flag"></goods-items> -->
    <goods-items class="items" :tableData="tableData" :total="total" @getList="getNewList"></goods-items>
    
  </div>
</template>

<script>
  import {
    fetchList
  } from '@/api/article'
  import {
    goodsList
  } from '@/api/goods'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import GoodsItems from '../goods/goodsItems.vue'
  const a = require("../../../src/json/goods.json")
  export default {
    name: 'GoodsList',
    components: {
      Pagination,
      GoodsItems
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'info',
          deleted: 'danger'
        }
        return statusMap[status]
      }
    },
    data() {
      return {
        tableData:[],
        flag:false,
        //商品分类
        options: [{
            value: 'zhinan',
            label: '指南',
            children: [{
              value: 'daohang',
              label: '导航',
              children: [{
                value: 'cexiangdaohang',
                label: '侧向导航'
              }, {
                value: 'dingbudaohang',
                label: '顶部导航'
              }]
            }]
          },
          {
            value: 'ziyuan',
            label: '资源',
            children: [{
              value: 'axure',
              label: 'Axure Components'
            }, {
              value: 'sketch',
              label: 'Sketch Templates'
            }, {
              value: 'jiaohu',
              label: '组件交互文档'
            }]
          }
        ],
        //商品状态
        shopStateOptions: [{
          value: '1',
          label: '上架'
        }, {
          value: '2',
          label: '下架'
        }],
        //搜索关键字类型
        inputKeyOptions: [{
          value: '1',
          label: '产品编码'
        }, {
          value: '2',
          label: '产品名称'
        }],
        inputKeyType: '1', //搜索的关键字的类型
        inputKey: '', //输入商品名称/关键字
        value: '',
        sortValue: '', //选择的商品分类
        //////////////////
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          pageSize: 20
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        this.tableData= []
       // goodsList(this.listQuery).then(response => {
       //   console.log("response.data.count:",response.data.count)
       //    this.tableData = response.data.data
       //    this.total = response.data.count
       //    this.listLoading = false
       //    this.flag = true
       //  })
      },
      getNewList(data) {
       console.log("data:",data)
       this.listQuery.page = data.page
       this.listQuery.pageSize = data.pageSize
       this.getList()
      },
      //添加商品
      toAddGoods() {
        this.$router.push('addGoods')
      },
      //根据条件筛选数据
      selectData() {
        alert("不要点啦！后台接口数据还没做呢。。。")
      },
      handleChange() {

      }
    }
  }
</script>

<style scoped lang="less">
  // 模块二 搜索条件 + 添加商品
  .search-add {
    background-color: #fff;
    box-shadow: 0px 2px 10px 1px rgba(0, 0, 0, 0.06);
    border-radius: 6px 6px 6px 6px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;

    // 搜索部分
    .search {
      display: flex;
      justify-content: flex-start;
      align-items: center;

      .choose-shop-state {
        margin-left: 0px;
      }

      // 输入关键字
      .search-select-input {
        width: 400px;

      }
    }
  }

  // 模块三 商品列表
  .items {
    margin-top: 20px;
  }
</style>
