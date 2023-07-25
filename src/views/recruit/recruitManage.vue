<template>
  <div class="recruit-list-box">
    <!-- 模块二 搜索条件 + 添加商品 -->
    <div class="search-add">
      <!-- 搜索部分 -->
      <div class="search">
        <!-- 职位状态 -->
        <div class="first-select-item">
          <el-select v-model="listQuery.ifShow" placeholder="职位状态" class="public-select-box choose-shop-state"
            clearable>
            <el-option v-for="item in shopStateOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>

        <el-input placeholder="请输入职位名称/关键字" v-model="listQuery.keyword"
          class="input-button-search my-input-button-search ">
          <el-button slot="append" icon="el-icon-search" @click="selectData()"></el-button>
        </el-input>
      </div>
      <!-- 添加商品 -->
      <el-button type="primary" class="public-el-btn" @click="toPublishRecruit">发布职位</el-button>
    </div>
    <!-- 模块三 职位列表 -->
    <recruit-item class="items" :tableData="tableData" :total="total" @getList="getNewList"></recruit-item>

  </div>
</template>

<script>
  import {
    goodsList
  } from '@/api/goods'
  import RecruitItem from '../recruit/recruitItem.vue'
  export default {
    name: 'RecruitList',
    components: {
      RecruitItem
    },
    data() {
      return {
        tableData: [],
        flag: false,
        //商品状态
        shopStateOptions: [{
          value: null,
          label: '全部职位'
        }, {
          value: 1,
          label: '开放中'
        }, {
          value: 0,
          label: '关闭中'
        }],
        //搜索关键字类型
        inputKeyOptions: [{
          value: 1,
          label: '商品型号'
        }, {
          value: 2,
          label: '商品名称'
        }],
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          ifShow: null, //商品状态：上架 下架
          keyword: "", //搜索关键字
          pageNo: 1, //页码,示例值(1)
          pageSize: 20, //每页显示数量,示例值(10)
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        this.tableData = [{
          name:"高级UI设计",
          city:'合肥',
          experience:'经验不限',
          education:'大专',
          lowSalary:'3k',
          heighSalary:'5k',
          statue:1,
          upadteTime:'2023-06-08'
        },{
          name:'数据产品经理',
          city:'合肥',
          experience:'不限',
          education:'大专',
          lowSalary:'3k',
          heighSalary:'5k',
          statue:0,
          upadteTime:'2023-06-08'
        },{
          name:'高级产品经理',
          city:'合肥',
          experience:'不限',
          education:'大专',
          lowSalary:'3k',
          heighSalary:'5k',
          statue:1,
          upadteTime:'2023-06-08'
        }]
        // goodsList(JSON.stringify(this.listQuery)).then(response => {
        //   var res = response.data.data
        //   if (response.data.code != '10000') {
        //     this.$message.error(response.data.message)
        //   } else {
        //     this.tableData = res.list
        //     for (var index in this.tableData) {
        //       this.tableData[index].defaultImage = this.tableData[index].defaultImage
        //       if (this.tableData[index].ifShow == 1) {
        //         this.tableData[index].ifShow = true
        //       } else {
        //         this.tableData[index].ifShow = false
        //       }
        //       if (this.tableData[index].recommended == 1) {
        //         this.tableData[index].recommended = true
        //       } else {
        //         this.tableData[index].recommended = false
        //       }
        //     }
        //     this.total = res.totalCount
        //     this.listLoading = false
        //     this.flag = true
        //   }
        // })
      },
      getNewList(data) {
        this.listQuery.pageNo = data.pageNo
        this.listQuery.pageSize = data.pageSize
        this.getList()
      },
      //添加商品
      toPublishRecruit() {
        this.$router.push('publishRecruit')
      },
      //根据条件筛选数据
      selectData() {
        this.listQuery.pageNo = 1
        this.getList()
        // alert("不要点啦！后台接口数据还没做呢。。。")
      },
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

      .first-select-item {
        width: 112px;
        margin-right: 25px;
      }

      .my-input-button-search {
        width: 380px;

        .el-input {
          width: 320px;
        }

      }

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
