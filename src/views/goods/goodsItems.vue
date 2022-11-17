<template>
  <div class="app-container">
    <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%;min-height:200px"
      :height="tableHeight" @selection-change="handleSelectionChange" class="el-table-box">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="goodsCode" label="产品编码" min-width="120"></el-table-column>
      <el-table-column label="商品图" min-width="100">
        <template slot-scope="scope">
          <img :src="scope.row.defaultImage" alt="图片加载失败" class="item-img">
        </template>
      </el-table-column>
      <el-table-column label="商品名称" min-width="200">
        <template slot-scope="scope">
          <span class="goods-name-span" :title="scope.row.goodsName">{{scope.row.goodsName}} </span>
        </template>
      </el-table-column>
      <el-table-column prop="cateName" label="商品分类"min-width="200"></el-table-column>
      <el-table-column prop="brand" label="品牌" min-width="120"></el-table-column>
      <el-table-column prop="price" label="价格" min-width="100"></el-table-column>
      <el-table-column prop="specQty" label="库存" min-width="100"></el-table-column>
      <el-table-column label="上架" min-width="100">
        <template slot-scope="scope">
          <el-switch class="tableScopeSwitch" @change="changePutState(scope.$index, scope.row)" active-text="上架"
            inactive-text="下架" v-model="scope.row.ifShow">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="推荐" min-width="100">
        <template slot-scope="scope">
          <el-switch class="tableScopeSwitch" @change="changeRecommendState(scope.$index, scope.row)" active-text="推荐"
            inactive-text="推荐" v-model="scope.row.recommended">
          </el-switch>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="isForbid" label="禁售" min-width="100">
        <template slot-scope="scope">
          <el-switch class="tableScopeSwitch" @change="handleStatusChange(scope.$index, scope.row)" active-text="禁售"
            inactive-text="禁售" v-model="scope.row.isForbid" active-color="#FF7575">
          </el-switch>
        </template>
      </el-table-column> -->
      <el-table-column fixed="right" label="操作" min-width="120">
        <template slot-scope="scope">
          <el-button @click.native.prevent="editRow(scope.$index, tableData)" type="text" size="small">
            编辑
          </el-button>
          <el-button @click.native.prevent="deleteRow(scope.$index, tableData)" type="text" size="small">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="bottoms-box">
      <div class="left">
        <el-checkbox v-model="isAddAllTerminalStatus" @change="allSelectTerminal">全选</el-checkbox>
        <el-button type="danger" class="public-el-btn" @click="deleteChoosed">删除</el-button>
      </div>
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :page-sizes="[1,5,10, 15, 20, 25]" :pager-count="5" :page-size="currentSize.pageSize"
        :background="false" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
      <!-- <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" /> -->
    </div>
  </div>
</template>

<script>
  import {
    getDynamicHeight,
    debounce
  } from "../utils/elTableAutoHeight.js";
  import {
    updateRecommend,updateShow
  } from '@/api/goods'
  // import axios from 'axios';

  // const a = require("../../../src/json/goods.json")
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
    props: ['tableData','total'],
    watch: {
      tableData(val) {
        this.tableData = val;
        console.log(val);
      }
    },
    data() {
      return {
        tableHeight: 0,
        pagerCount: 4, //设置页码显示最多的数量
        isAddAllTerminalStatus: false,
        currentPage: 1, //当前页
        pageSize: 20, //当前显示条数
        multipleSelection: [],
        currentSize: {
          pageNo: 1,
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
        this.currentSize.pageNo= val
        this.$emit("getList",this.currentSize)
        console.log("handleCurrentChange:",val)
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
        this.$confirm('确定删除 1 个选择项吗？ 删除的选择项将进入回收站中', '提示', {
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
        console.log("rows", rows[index])
        this.$router.replace({
          path: 'publishGood',
          query: {
            eidtData: rows[index]
          }
        })
      },
      //批量删除
      deleteChoosed() {
        if (this.multipleSelection.length > 0) {
          this.$confirm('数据删除后将无法找回, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$message({
              type: 'success',
              message: '请求后台接口删除数据，先暂且算作删除成功？'
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除1'
            });
          });
        } else {
          this.$message({
            type: 'info',
            message: '您还没有选择数据，请先选择您要删除的数据？'
          });
        }
      },
      //改变上架状态
      changePutState(index, rows) {
        // console.log(rows[index].id)
        rows[index].ifShow = !rows[index].ifShow;
        var params = {
          goodsId:rows[index].goodsId,
          show:rows[index].ifShow
        }
        //数据提交给后台保存
        updateShow(JSON.stringify(params)).then(response => {
          var res = response.data.data
          if(response.data.code != '10000'){//失败
            this.$message.error(response.data.message)
            // rows[index].ifShow = rows[index].ifShow;
          }else{//成功
            // rows[index].ifShow = !rows[index].ifShow;
          }
         })
      },
      //改变推荐状态
      changeRecommendState(index, rows) {
        rows[index].recommended = !rows[index].recommended;
        //数据提交给后台保存
        var params = {
          goodsId:rows[index].goodsId,
          recommend:rows[index].recommended
        }
        //数据提交给后台保存
        updateRecommend(JSON.stringify(params)).then(response => {
          var res = response.data.data
          if(response.data.code != '10000'){//失败
            this.$message.error(response.data.message)
            // rows[index].recommended = rows[index].recommended;
          }else{//成功
            // rows[index].recommended = !rows[index].recommended;
          }
         })
      },
      //改变禁售状态
      // changeForbidState(index, rows) {
      //   rows[index].isForbid = !rows[index].isForbid;
      //   //数据提交给后台保存
      // },
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
