<template>
  <div class="app-container">
    <el-table ref="multipleTable" :data="currentPageData" tooltip-effect="dark" style="width: 100%;min-height:200px"
      :height="tableHeight" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column label="信息类型">
        <template slot-scope="scope">
          <span v-if="scope.row.articleType == 1">求购设备</span>
          <span v-else-if="scope.row.articleType == 2">项目外包</span>
          <span v-else-if="scope.row.articleType == 3">灵活兼职</span>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="信息标题"></el-table-column>
      <el-table-column prop="brandName" label="设备品牌"></el-table-column>
      <el-table-column prop="equipmentName" label="设备名称"></el-table-column>
      <el-table-column prop="createdAt" label="发布时间"></el-table-column>
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
        <!-- <el-checkbox v-model="isAddAllTerminalStatus" @change="allSelectTerminal">全选</el-checkbox> -->
        <!-- <el-button type="danger" class="public-el-btn" @click="deleteChoosed"> 取消任务</el-button> -->
      </div>
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :page-sizes="[1,5,10, 15, 20, 25]" :page-size="currentSize" :current-page.sync="pageNum" :pager-count="5"
        :background="false" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import {
    getDynamicHeight,
    debounce
  } from "../utils/elTableAutoHeight.js";
  import {
    demandList
  } from '@/api/demand'
  import axios from 'axios';
  export default {
    props: ['demandList', 'currentPage', 'pageSize', 'totalPage', 'totalNum'],
    data() {
      return {
        tableHeight: 0,
        pagerCount: 4, //设置页码显示最多的数量
        isAddAllTerminalStatus: false, //是否全选
        pageNum: 1, //当前页
        currentSize: 10, //当前显示条数
        pageCount: 0, //总页数
        totalCount: 0, //总条数
        currentPageData: [], //当前页显示内容
        multipleSelection: []
      }
    },
    watch: {
      demandList(val) { //列表数据
        this.currentPageData = val
      },
      currentPage(val) { //当前页
        this.pageNum = val
      },
      pageSize(val) { //当前显示条数
        this.currentSize = val
      },
      totalPage(val) { //总页数
        this.pageCount = val
      },
      totalNum(val) { //总条数
        this.totalCount = val
      }
    },
    mounted() {
      // 初始化给table高度赋值
      this.getHeight();
      // 屏幕resize监听方法
      this.screenMonitor();
    },
    methods: {
      screenMonitor() {
        let resize = debounce(() => {
          this.getHeight();
        }, 100);
        // 屏幕resize监听事件：一旦屏幕宽高发生变化，就会执行resize
        window.addEventListener("resize", resize, true);
        // 将屏幕监听事件移除
        // 这步是必须的。离开页面时不移除，再返回，或者进入到别的有相同元素的页面会报错
        // 或者将这里的方法直接写在beforeDestroy函数中也可，不过我感觉这样写更明了些
        this.$once("hook:beforeDestroy", () => {
          window.removeEventListener("resize", resize, true);
        });
      },
      getHeight() {
        // 为什么设置了一个定时器我忘却了。。。。大概因为在获取元素时还没有元素吧哈哈哈哈我真的讲不明白但是得有这个定时器
        setTimeout(() => {
          // this.tableHeight = getDynamicHeight(this.$refs.searchContainer).height;
          this.tableHeight = getDynamicHeight(200).height;
        }, 400);
      },
      //改变一页显示数量
      handleSizeChange(val) {
        this.currentSize = val
        this.$emit("changePageSize", val)
      },
      //换页
      handleCurrentChange(val) {
        this.$emit("changePage", val)
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
          
          demandDelete({id: rows[index].id}).then(response => {
            if (response.data.code == 10000) {
              rows.splice(index, 1);
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            }
          })

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
        this.$router.replace({
          path: 'publishDemand',
          query: {
            eidtData: rows[index]
          }
        })
      },
      //批量删除
      deleteChoosed() {
        console.log(this.multipleSelection)
        // rows.splice(index, 1);
      },
    }
  }
</script>
<style scoped lang="less">
  .app-container {
    box-shadow: 0px 2px 10px 1px rgba(0, 0, 0, 0.06);
  }

  .el-table {
    font-size: 12px;
    box-sizing: border-box;
    border-radius: 6px 6px 0px 0px;
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
    box-sizing: border-box;
    border-radius: 0px 0px 6px 6px;

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
