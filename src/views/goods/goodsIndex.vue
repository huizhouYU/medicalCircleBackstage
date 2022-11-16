<template>
  <div class="app-container">
    <!-- 模块二 搜索条件 + 添加商品 -->
    <div class="search-add">
      <!-- 搜索部分 -->
      <div class="search">
        <!-- 商品分类 -->
        <!-- <el-cascader v-model="sortValue" placeholder="商品分类" :options="options" @change="handleChange"
          class="public-select-box" clearable :filterable="true">
        </el-cascader> -->
        <!-- 商品状态 -->
        <el-select v-model="listQuery.ifShow" placeholder="商品状态" class="public-select-box choose-shop-state" clearable>
          <el-option v-for="item in shopStateOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <!-- input 输入关键字  -->
        <el-input placeholder="请输入关键字" v-model="listQuery.keyword" class="input-with-select search-select-input">
          <el-select v-model="listQuery.keyType" slot="prepend" placeholder="请选择">
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
        tableData: [],
        flag: false,
        //商品分类
        // options: [],
        //商品状态
        shopStateOptions: [{
          value: 1,
          label: '上架'
        }, {
          value: 0,
          label: '下架'
        }],
        //搜索关键字类型
        inputKeyOptions: [{
          value: 1,
          label: '产品编码'
        }, {
          value: 2,
          label: '产品名称'
        }],
        // inputKeyType: '1', //搜索的关键字的类型
        // inputKey: '', //输入商品名称/关键字
        // value: '', //商品状态
        // sortValue: '', //选择的商品分类
        //////////////////
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          ifShow:'',//商品状态：上架 下架
          isDeleted: 0,//是否回收站 0-普通列表 1-回收站列表
          keyType: null,//搜索类型 1-商品编码 2-商品名称
          keyword: "",//搜索关键字
          pageNo: 1,//页码,示例值(1)
          pageSize: 20,//每页显示数量,示例值(10)
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        this.tableData = []
        goodsList(JSON.stringify(this.listQuery)).then(response => {
          var res = response.data.data
          if(response.data.code != '10000'){
            this.$message.error(response.data.message)
          }else{
            this.tableData = res.list
            this.total = response.data.totalCount
            this.listLoading = false
            this.flag = true
          }
          // console.log("response.data:",response.data)

         })
      },
      getNewList(data) {
        console.log("data:", data)
        this.listQuery.pageNo = data.pageNo
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
      // handleChange() {

      // }
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
    padding-left: 15px;

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
