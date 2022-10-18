<template>
  <div class="app-container">
    <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%;min-height:200px"
      :height="tableHeight"  class="el-table-box" >
      <el-table-column  width="55">
      </el-table-column>
      <el-table-column prop="name" label="邀请名单" min-width="120"></el-table-column>
      <el-table-column prop="username" label="用户名" min-width="200"></el-table-column>
      <el-table-column prop="time" label="邀请时间" min-width="120"></el-table-column>
      <el-table-column fixed="right" label="操作" min-width="120">
        <template slot-scope="scope">
          <el-button @click.native.prevent="editRow(scope.$index, tableData)" type="text" size="small">
            成交信息
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="bottoms-box">
      <div class="left"></div>
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :page-sizes="[1,5,10, 15, 20, 25]" :pager-count="5" :page-size="currentSize.pageSize"
        :background="false" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import {
    getDynamicHeight,
    debounce
  } from "../utils/elTableAutoHeight.js";
  import axios from 'axios';
  import {
    fetchList
  } from '@/api/article'
  import {
    goodsList
  } from '@/api/goods'
  export default {
    name: 'GoodsItem',
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
    watch: {
    },
    data() {
      return {
        tableData:[{
          id:'1',
          name:'张楚岚',
          username:'血糯米奶茶',
          time:'2021-10-28  16:28:56'
        },
        {
          id:'2',
          name:'杨岚',
          username:'生椰拿铁',
          time:'2021-10-28  16:28:56'
        },
        {
          id:'3',
          name:'王浩',
          username:'皮蛋',
          time:'2021-10-28  16:28:56'
        },
        {
          id:'4',
          name:'陶名',
          username:'卡布奇洛',
          time:'2021-10-28  16:28:56'
        }],
        total:100,
        tableHeight: 0,
        pagerCount: 4, //设置页码显示最多的数量
        isAddAllTerminalStatus: false,
        currentPage: 1, //当前页
        pageSize: 20, //当前显示条数
        currentSize: {
          page: 1,
          pageSize: 20
        }
      }
    },
    created() {
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
      handleSizeChange(val) {
        console.log("handleSizeChange:",val)
        this.currentSize.pageSize = val
        this.$emit("getList",this.currentSize)
      },
      handleCurrentChange(val) {
        this.currentSize.page = val
        this.$emit("getList",this.currentSize)
        console.log("handleCurrentChange:",val)
      },
      editRow(index, rows) {
        console.log("index", index)
        console.log("rows", rows[index])
        this.$router.replace({
          path: 'contractList',
          query: {
            eidtData: rows[index]
          }
        })
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
