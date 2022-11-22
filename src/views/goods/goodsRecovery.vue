<template>
  <div class="content">
    <!-- 搜索部分 -->
    <div class="search">
      <!-- input 输入关键字  -->
      <el-input placeholder="请输入关键字" v-model="listQuery.keyword" class="input-with-select search-select-input public-interval">
        <el-select v-model="listQuery.keyType" slot="prepend" placeholder="请选择" clearable>
          <el-option v-for="item in inputKeyOptions" :key="item.value" :label="item.label" :value="item.value" >
          </el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="selectData()"></el-button>
      </el-input>
    </div>
    <goods-recovery-items class="items" :tableData="tableData" :total="total" @getList="getNewList"></goods-recovery-items>
  </div>
</template>
<script>
  import {
    goodsList
  } from '@/api/goods'
  import GoodsRecoveryItems from '../goods/goodsRecoveryItems.vue'
  export default {
    components: {
      GoodsRecoveryItems
    },
    data() {
      return {
        //商品状态
        inputKeyOptions: [{
          value: 1,
          label: '产品编码'
        }, {
          value: 2,
          label: '产品名称'
        }],
        listQuery: {
          isDeleted: 1, //是否回收站 0-普通列表 1-回收站列表
          keyType: null, //搜索类型 1-商品编码 2-商品名称
          keyword: "", //搜索关键字
          pageNo: 1, //页码,示例值(1)
          pageSize: 20, //每页显示数量,示例值(10)
        },
        tableData: [],
        total: null,
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      //根据条件筛选数据
      selectData() {
        this.getList()
      },
      getList(){
        goodsList(JSON.stringify(this.listQuery)).then(response => {
          var res = response.data.data
          if (response.data.code != '10000') {
            this.$message.error(response.data.message)
          } else {
            this.tableData = res.list
            for (var index in this.tableData) {
              this.tableData[index].defaultImage = "https://images.weserv.nl/?url=" + this.tableData[index]
                .defaultImage
              if (this.tableData[index].ifShow == 1) {
                this.tableData[index].ifShow = true
              } else {
                this.tableData[index].ifShow = false
              }
              if (this.tableData[index].recommended == 1) {
                this.tableData[index].recommended = true
              } else {
                this.tableData[index].recommended = false
              }
            }
            this.total = res.totalCount
          }
        })
      },
      getNewList(data) {
        this.listQuery.pageNo = data.pageNo
        this.listQuery.pageSize = data.pageSize
        this.getList()
      },
    }
  }
</script>

<style scoped lang="less">
  // 模块二 搜索条件
  .search {
    height: 74px;
    background-color: #fff;
    box-shadow: 0px 2px 10px 1px rgba(0, 0, 0, 0.06);
    border-radius: 6px 6px 6px 6px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding-left: 15px;

    // 输入关键字
    .search-select-input {
      width: 400px;
    }
  }

  // 模块三 商品列表
  .items {
    margin-top: 20px;
  }
</style>
