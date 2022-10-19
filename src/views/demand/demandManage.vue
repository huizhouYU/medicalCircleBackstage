<template>
  <div class="content">

    <!-- 模块二 搜索条件 + 发布需求 -->
    <div class="search-add">
      <!-- 搜索部分 -->
      <div class="search">
        <!-- 本店分类 -->
        <el-select v-model="articleType" placeholder="信息类型" class="public-select-box">
          <el-option v-for="item in infoOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <!-- 输入关键字 -->
        <el-input placeholder="请输入信息标题/设备名称关键字" v-model="keyword"
          class="input-with-select search-select-input public-interval">
          <el-select v-model="keyType" slot="prepend" placeholder="请选择">
            <el-option v-for="item in keyTypeOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="initData"></el-button>
        </el-input>
      </div>
      <!-- 添加商品 -->
      <el-button type="primary" class="public-el-btn" @click="toAddDemand">发布需求</el-button>
    </div>
    <!-- 模块三 需求列表 -->
    <demands-items class="items" @changePageSize="changePageSize" @changePage="changePage" :demandList="demandList"
      :currentPage="currentPage" :pageSize="pageSize" :totalPage="totalPage" :totalNum="totalNum"></demands-items>
  </div>
</template>

<script>
  import {
    brandList,
    demandList
  } from '@/api/demand'
  import DemandsItems from '../demand/demandsItems.vue'
  export default {
    components: {
      DemandsItems
    },
    data() {
      return {
        ///搜索关键字类型
        keyTypeOptions: [{
          value: 'title',
          label: '信息标题'
        }, {
          value: 'equipmentName',
          label: '设备名称'
        }],
        keyType: '', //选择的搜索关键字类型
        //输入的标题/设备型号 关键字
        keyword: '',
        //选择的信息类型
        articleType: '',
        demandList: '',
        //信息类型
        infoOptions: [{
            value: 1,
            label: '求购设备'
          },
          {
            value: 2,
            label: '项目外包'
          },
          {
            value: 3,
            label: '灵活兼职'
          }
        ],
        currentPage: 1, //当前页
        pageSize: 10, //当前显示条数
        totalPage: 0, //总页数
        totalNum: 0, //总条数

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
          articleType: this.articleType,
          keyType: this.keyType,
          keyword: this.keyword
        }
        demandList(data).then(response => {
          console.log(response.data.data)
          this.demandList = response.data.data.list
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
      //发布需求
      toAddDemand() {
        this.$router.push('publishDemand')
      }
    }
  }
</script>

<style scoped lang="less">
  // 模块二 搜索条件 + 发布需求
  .search-add {
    background-color: #fff;
    box-shadow: 0px 2px 10px 1px rgba(0, 0, 0, 0.06);
    border-radius: 6px 6px 6px 6px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    // 搜索部分
    .search {
      display: flex;
      justify-content: flex-start;
      align-items: center;

      /deep/.el-input__icon {
        line-height: 34px;
      }

      // // 信息类型
      // .public-select-box {
      //   width: 112px;
      //   height: 34px;
      //   margin: 20px 25px 20px 15px;
      //   border-radius: 6px 6px 6px 6px;
      //   box-sizing: border-box;

      //   /deep/ .el-input__inner {
      //     height: 34px;
      //     line-height: 34px;
      //   }
      // }

      // 请输入标题/设备型号关键字
      .search-select-input {
        width: 400px;

        // /deep/.el-input {
        //   width: 110px;
        // }

        // /deep/ .el-input__icon {
        //   line-height: 34px;
        // }

        //输入的关键字的类型
        // .key-selectType {
        //   height: 34px;
        //   width: 140px;
        //   box-sizing: border-box;
        //   font-size: 12px;
        //   margin-left: -1px;

        //   //下拉框的样式修改
        //   /deep/ .el-input__inner {
        //     height: 34px;
        //     line-height: 34px;
        //     font-size: 12px;
        //     border-radius: 6px 0px 0px 6px;
        //   }

        //   //下拉框的箭头修改
        //   /deep/ .el-input__icon {
        //     line-height: 34px;
        //   }
        // }

        // input 输入框
        // .input-search {
        //   width: 320px;
        //   height: 34px;
        //   margin-left: -1px;

        //   /deep/ .el-input__inner {
        //     height: 34px;
        //     line-height: 34px;
        //     border-radius: 0px 6px 6px 0px;
        //   }

        // }
      }
    }

    // 发布需求
    .btn-add {
      width: 88px;
      height: 34px;
      background: #1890FF;
      border-radius: 6px 6px 6px 6px;
      border: none;
      margin-right: 20px;
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
</style>
