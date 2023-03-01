<template>
  <div class="app-container">
    <el-table ref="multipleTable" :data="currentPageData" tooltip-effect="dark" style="width: 100%;min-height:200px"
      :height="tableHeight" >
      <el-table-column label="ID" prop="id">
      </el-table-column>
      <el-table-column prop="specName" label="规格名称"></el-table-column>
      <el-table-column prop="specStringValues" label="规格值"></el-table-column>
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
  export default {
    props: ['dataList', 'currentPage', 'pageSize', 'totalPage', 'totalNum'],
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
      dataList(val) { //列表数据
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
      //删除需求
      deleteRow(index, rows) {
        this.$confirm('确定删除这个规格设置吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param={
            id:rows[index].articleId
          }
          //删除操作
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      //编辑需求
      editRow(index, rows) {
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
