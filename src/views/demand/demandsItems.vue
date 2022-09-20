<template>
  <div>
    <el-table ref="multipleTable" :data="currentPageData" tooltip-effect="dark" style="width: 100%" height="439"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="infoType" label="信息类型"></el-table-column>
      <el-table-column prop="infoTitle" label="信息标题"></el-table-column>
      <el-table-column prop="brand" label="设备品牌"></el-table-column>
      <el-table-column prop="model" label="设备型号"></el-table-column>
      <el-table-column prop="publishTime" label="发布时间"></el-table-column>
      <el-table-column fixed="right" label="操作" width="120">
        <template slot-scope="scope">
          <el-button @click.native.prevent="editRow(scope.$index, currentPageData)" type="text" size="small">
            编辑
          </el-button>
          <el-button @click.native.prevent="deleteRow(scope.$index, currentPageData)" type="text" size="small">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="bottoms-box">
      <div class="left">
        <el-checkbox v-model="isAddAllTerminalStatus" @change="allSelectTerminal">全选</el-checkbox>
        <!-- <button @click="deleteChoosed" class="pl-delete-btn">
          取消任务
        </button> -->
        <el-button type="danger" class="public-el-btn"  @click="deleteChoosed"> 取消任务</el-button>
      </div>

      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :page-sizes="[1,5,10, 15, 20, 25]" :page-size="pageSize" :current-page.sync="currentPage" :pager-count="5"
        :background="false" layout="total, sizes, prev, pager, next, jumper" :total="totalNum">
      </el-pagination>

    </div>

  </div>

</template>

<script>
  const a = require("../../../src/json/demands.json")
  import axios from 'axios';
  export default {
    data() {
      return {
        pagerCount: 4, //设置页码显示最多的数量
        isAddAllTerminalStatus: false,
        currentPage: 1, //当前页
        totalPage: 0, //总页数
        totalNum: 0, //总条数
        pageSize: 10, //当前显示条数
        tableData: [], //总数据内容
        currentPageData: [], //当前页显示内容
        multipleSelection: []
      }
    },
    created() {

    },
    mounted() {
      this.loadData()

    },
    methods: {
      // 计算页码等
      computeSize() {
        this.totalNum = this.tableData.length
        this.totalPage = Math.ceil(this.totalNum / this.pageSize);
        // 计算得0时设置为1
        this.totalPage = this.totalPage == 0 ? 1 : this.totalPage;
        this.setCurrentPageData();
      },
      // 设置当前页面数据，对数组操作的截取规则为[0~10],[10~20]...,
      setCurrentPageData() {
        let begin = (this.currentPage - 1) * this.pageSize;
        let end = this.currentPage * this.pageSize;
        this.currentPageData = this.tableData.slice(
          begin,
          end
        );
      },
      async loadData() {
        this.tableData = a.demandsData
        this.computeSize()
        // await axios.get("http://192.168.0.110:8080/static/testData/demands.json").then(res => {
        //   console.log(res);
        //   if (res.status == 200) {
        //     this.tableData = res.data.demandsData
        //     console.log(this.tableData)
        //     console.log(this.tableData.length)
        //   } else {
        //     this.$message.error("数据请求失败，请稍后再试！")
        //   }
        //   this.computeSize()
        // })
      },
      handleSizeChange(val) {
        this.pageSize = val
        this.loadData();
      },
      handleCurrentChange(val) {
        this.setCurrentPageData();
      },
      allSelectTerminal(e) {
        if (e === true) {
          this.$refs.multipleTable.toggleAllSelection()
        } else {
          this.$refs.multipleTable.clearSelection()
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      deleteRow(index, rows) {
        this.$confirm('该条数据删除后将无法找回, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          rows.splice(index, 1);
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },
      editRow(index, rows) {
        console.log("index", index)
        console.log("rows", rows)
      },
      //批量删除
      deleteChoosed() {
        console.log(this.multipleSelection)
        // rows.splice(index, 1);
      },
      //改变上架状态
      changePutState(index, rows) {
        console.log(rows[index].id)
        rows[index].isPut = !rows[index].isPut;
        //数据提交给后台保存
      },
      //改变推荐状态
      changeRecommendState(index, rows) {
        rows[index].isRecommend = !rows[index].isRecommend;
        //数据提交给后台保存
      },
      //改变禁售状态
      changeForbidState(index, rows) {
        rows[index].isForbid = !rows[index].isForbid;
        //数据提交给后台保存
      },
    }
  }
</script>
<style scoped lang="less">
  .el-table {
    font-size: 12px;
  }

  // 列表中商品圈图片
  .item-img {
    width: 50px;
    height: 50px;
  }

  .check-div {
    width: 16px;
    height: 16px;
    border-radius: 50%;
  }

  // 列表底部的部分
  .bottoms-box {
    padding: 20px 50px 25px 15px;
    background-color: #fff;
    font-size: 12px;
    display: flex;
    justify-content: space-between;

    .left {

      //批量删除按钮
      .pl-delete-btn {
        width: 72px;
        height: 24px;
        background: #FF7575;
        border-radius: 4px 4px 4px 4px;
        margin-left: 20px;
        text-align: center;
        line-height: 24px;
        border: none;
        color: #fff;
        font-size: 12px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        font-weight: 400;
      }
    }
  }

  //修改页码样式
  .el-pagination.is-background .el-pager li {
    background-color: #fff !important;
    border: 1px solid #f4f4f5;
  }
</style>
