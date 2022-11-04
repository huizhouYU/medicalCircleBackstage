<template>
  <div class="app-container">
    <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%;min-height:200px"
      :height="tableHeight" class="el-table-box" :header-cell-style="{'text-align':'center'}">
      <!--   <el-table-column  width="55">
      </el-table-column> -->
      <el-table-column prop="username" label="申请提款时间" ></el-table-column>
      <el-table-column prop="nickname" label="提款金额" ></el-table-column>
      <el-table-column prop="createdAt" label="提款账号" ></el-table-column>
      <el-table-column prop="nickname" label="提款人" ></el-table-column>
      <el-table-column prop="nickname" label="手机号码" ></el-table-column>
      <el-table-column prop="nickname" label="状态" ></el-table-column>
      <el-table-column prop="createdAt" label="备注" width="180"></el-table-column>
    </el-table>
    <div class="bottoms-box">
      <div class="left"></div>
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :page-sizes="[1,5,10, 15, 20, 25]" :pager-count="5" :page-size="pageSize" :background="false"
        layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  // import {
  //   drawingRecord
  // } from '@/api/member'
  import {
    getDynamicHeight,
    debounce
  } from "../utils/elTableAutoHeight.js";
  export default {
    name: 'DrawingRecord',
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
        tableHeight: 0,
        pagerCount: 4, //设置页码显示最多的数量
        totalCount: 0,
        pageNum: 1, //当前页
        pageSize: 20, //当前显示条数
      }
    },
    created() {},
    mounted() {

      // 初始化给table高度赋值
      this.getHeight();
      // 屏幕resize监听方法
      this.screenMonitor();
      this.initData()
    },
    methods: {
      initData() {
        let data = {
          pageNo: this.pageNum, //页码
          pageSize: this.pageSize
        }
        // drawingRecord(data).then(response => {
        //   console.log(response.data.data)
        //   if(response.data.data != null){
        //     this.tableData = response.data.data.list
        //     this.pageNum = response.data.data.pageNum //当前页
        //     // this.totalPage = response.data.data.pageCount //总页面数
        //     this.pageSize = response.data.data.pageSize //当前页面条数
        //     this.totalCount = response.data.data.totalCount //数据总数
        //   }

        // })
      },


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
      handleSizeChange(val) {
        console.log("handleSizeChange:", val)
        this.pageSize = val
        this.initData()
      },
      handleCurrentChange(val) {
        console.log("handleCurrentChange:", val)
        this.pageNum = val
        this.initData()

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
    color: #333333;
    box-sizing: border-box;
    border-radius: 6px 6px 0px 0px;
  }

  // ----------修改elementui开关的默认样式-----------
  .tableScopeSwitch {
    /deep/.el-switch__label {
      position: absolute;
      display: none;
      color: #fff;
    }

    /*打开时文字位置设置*/
    /deep/.el-switch__label--right {
      z-index: 1;
      right: 20px;
      /*不同场景下可能不同，自行调整*/
    }

    /*关闭时文字位置设置*/
    /deep/.el-switch__label--left {
      z-index: 1;
      left: 20px;
      /*不同场景下可能不同，自行调整*/
    }

    /*显示文字*/
    /deep/.el-switch__label.is-active {
      display: block;
    }

    /deep/ .el-switch__label * {
      font-size: 12px;
    }

    /deep/.el-switch__core,
    /deep/.el-switch.is-checked .el-switch__core {
      width: 55px !important;
    }
  }

  // ----------修改elementui表格的默认样式-----------
  /deep/.el-table__body-wrapper {
    &::-webkit-scrollbar {
      height: 5px;
      width: 5px;
    }

    &::-webkit-scrollbar-track {
      // 轨道颜色
      background-color: #fff;
    }

    &::-webkit-scrollbar-thumb {
      // 滚动块颜色
      background-color: #E6E9ED;
      border-radius: 5px;
    }

    &::-webkit-scrollbar-thumb:hover {
      // hover高亮
      background-color: #d5d8db;
    }
  }

  // 解决表格固定列问题
  /deep/.el-table__fixed,
  /deep/.el-table__fixed-right {
    height: calc(100% - 7px) !important;
    box-shadow: -5px -2px 10px rgba(0, 0, 0, .12) !important;

    .el-table__fixed-body-wrapper {
      height: calc(100% - 36px) !important;
    }
  }

  // 当表格没有滚动条时
  /deep/.el-table__body-wrapper.is-scrolling-none~.el-table__fixed-right {
    height: 100% !important;
    bottom: 0 !important;
    box-shadow: none !important;
  }

  // 当表格有纵向滚动条时
  /deep/ .el-table--scrollable-y .el-table__fixed-right {
    right: 7px !important;
  }

  // 当表格只有横向滚动条，没有纵向滚动条时
  /deep/.el-table--scrollable-x:not(.el-table--scrollable-y) .el-table__fixed-right {
    right: 0 !important;
  }

  //商品名称
  .goods-name-span {
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  // 列表中商品圈图片
  .item-img {
    width: 50px;
    height: 50px;
    border-radius: 4px;
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
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    border-radius: 0px 0px 6px 6px;

    .left {
      /deep/ .el-checkbox__label {
        font-size: 12px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        font-weight: 400;
        color: #555555;
      }
    }
  }

  //修改页码样式
  .el-pagination.is-background .el-pager li {
    background-color: #fff !important;
    border: 1px solid #f4f4f5;
  }
</style>
