<template>
  <div class="goods-spec-content">
    <!-- 模块二 搜索条件 + 添加规格模板 -->
    <div class="search-add">
      <!-- 搜索部分 -->
      <div class="search">
        <!-- 输入关键字 -->
        <span class="title">规格搜索：</span>
        <el-input placeholder="请输入规格名称" v-model="keyword" @keyup.native.enter="initData" class="input-with-select my-search-input public-interval">
          <el-button slot="append" icon="el-icon-search" @click="initData"></el-button>
        </el-input>
      </div>
      <!-- 添加商品 -->
      <el-button type="primary" class="public-el-btn" @click="toAddSpec">添加规格模板</el-button>
    </div>
    <!-- 模块三 规格列表 -->
    <spec-items class="items" @changePageSize="changePageSize" @changePage="changePage" @updateSpec="updateSpec" :dataList="dataList"
      :currentPage="currentPage" :pageSize="pageSize" :totalPage="totalPage" :totalNum="totalNum"></spec-items>
    <!-- 添加规格模板 -->
    <specs-mould-dialog :specsDialogVisible="specsDialogVisible" @closeSpecs="closeSpecs" @updateData='updateData' :editFlag="editSpecFlag" :editSpecsForm="editSpec"></specs-mould-dialog>
  </div>
</template>

<script>
  import {
    specList,
    specValueList
  } from '@/api/goods'
  import specItems from '../goods/specItems.vue'
  import specsMouldDialog from '../../../src/views/goods/specsMouldDialog.vue'
  export default {
    components: {
      specItems,
      specsMouldDialog
    },
    data() {
      return {
        //输入的标题/设备型号 关键字
        keyword: '',
        dataList: '',
        currentPage: 1, //当前页
        pageSize: 20, //当前显示条数
        totalPage: 0, //总页数
        totalNum: 0, //总条数
        specsDialogVisible: false,
        editSpecFlag:false,
        editSpec:{}
      }
    },
    mounted() {
      this.initData()
    },
    methods: {
      initData() {
        let data = {
          pageNo: this.currentPage,
          pageSize: this.pageSize,
          keyword: this.keyword
        }
        specList(data).then(response => {
          this.dataList = response.data.data.list
          this.currentPage = response.data.data.pageNum //当前页
          this.totalPage = response.data.data.pageCount //总页面数
          this.pageSize = response.data.data.pageSize //当前页面条数
          this.totalNum = response.data.data.totalCount //数据总数
        })
      },
      changePageSize(val) {
        this.pageSize = val
        this.initData()
      },
      changePage(val) {
        this.currentPage = val
        this.initData()
      },
      closeSpecs() {
        this.specsDialogVisible = false
      },
      //添加规格模板
      toAddSpec() {
        this.editSpecFlag = false
        this.specsDialogVisible = true
      },
      updateSpec(obj){
        this.editSpecFlag = true
        this.specsDialogVisible = true
        this.editSpec = obj
      },
      updateData(){
        this.initData()
      }
    }
  }
</script>

<style lang="less" scoped>
  .goods-spec-content {

    // 模块二 搜索条件 + 添加规格模板
    .search-add {
      height: 74px;
      background-color: #fff;
      box-shadow: 0px 2px 10px 1px rgba(0, 0, 0, 0.06);
      border-radius: 6px 6px 6px 6px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      padding: 0px 20px 0px 15px;

      // 搜索部分
      .search {
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .title {
          margin-right: 30px;
          font-size: 12px;
          font-family: Microsoft YaHei-Regular, Microsoft YaHei;
          font-weight: 400;
          color: #333333;
        }

        /deep/.el-input__icon {
          line-height: 34px;
        }

        .my-search-input {
          width: 380px;
        }

        // // 请输入标题/设备型号关键字
        // .search-input {
        //   width: 400px;
        // }
      }

      // 添加规格模板
      .btn-add {
        width: 88px;
        height: 34px;
        background: #1890FF;
        border-radius: 6px 6px 6px 6px;
        border: none;
        box-sizing: border-box;
        font-size: 12px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        color: #FFFFFF;
        text-align: center;
        line-height: 34px;
      }
    }

    // 模块三 需求列表
    .items {
      margin-top: 20px;
    }
  }
</style>
