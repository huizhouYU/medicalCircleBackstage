<template>
  <div class="app-container">
    <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%;min-height:200px"
      @selection-change="handleSelectionChange" class="el-table-box">
      <el-table-column label="职位名称" min-width="240" prop="name">
      </el-table-column>
      <el-table-column label="职位要求" min-width="240">
        <template slot-scope="scope">
          <span class="name-span-overflow">
            {{scope.row.city}}
            <span class="line"> | </span>
            {{scope.row.experience}}
            <span class="line"> | </span>
            {{scope.row.education}}
            <span class="line"> | </span>
            {{scope.row.lowSalary}}-{{scope.row.heighSalary}}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="职位状态" min-width="180">
        <template slot-scope="scope">
          <div class="open-statue" v-if="scope.row.statue == 1">
            <span class="green-cirle"></span>
            开放中
            <span class="open-time">（{{scope.row.upadteTime}}）</span>
          </div>
          <div class="close-statue" v-else>
            <span class="gray-cirle"></span>
            已关闭
          </div>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" min-width="120" :header-cell-class-name="{'text-align':'center'}">
        <template slot-scope="scope">
          <el-button @click.native.prevent="editRow(scope.$index, scope.row)" type="text" size="small">
            编辑
          </el-button>
          <el-button @click.native.prevent="closeOrOpenRow(scope.$index, scope.row)" type="text" size="small">
            <span v-if="scope.row.statue == 1">关闭</span>
            <span v-else>开启</span>
          </el-button>
          <el-button @click.native.prevent="deleteRow(scope.$index, scope.row)" type="text" size="small">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="bottoms-box">
      <div class="left">
      </div>
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :page-sizes="[5,10, 20, 40, 60]" :pager-count="5" :page-size="currentSize.pageSize" :background="false"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
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
    updateRecommend,
    updateShow,
    goodsDelete
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
    props: ['tableData', 'total'],
    watch: {
      tableData(val) {
        this.tableData = val;
      }
    },
    data() {
      return {
        pagerCount: 4, //设置页码显示最多的数量
        currentSize: {
          pageNo: 1,
          pageSize: 20
        }
      }
    },
    mounted() {},
    methods: {
      handleSizeChange(val) {
        this.currentSize.pageSize = val
        this.$emit("getList", this.currentSize)
      },
      handleCurrentChange(val) {
        this.currentSize.pageNo = val
        this.$emit("getList", this.currentSize)
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      deleteRow(index, rows) {
        var params = {
          idList: [rows.goodsId]
        }
        this.$confirm('确定删除职位吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteData(params)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },
      editRow(index, rows) {
        this.$router.replace({
          path: 'publishRecruit',
          query: {
            eidtData: rows
          }
        })
      },
      closeOrOpenRow(index, rows){
        var str = "确定关闭职位吗"
        if(rows.statue != 1){
          str = "确定开启职位吗"
        }
        this.$confirm(str, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 请求接口 关闭or开启 职位
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });
        });
      },
      //请求后端接口删除数据
      deleteData(params) {
        console.log("删除:", params)
        // goodsDelete(JSON.stringify(params)).then(response => {
        //   var res = response.data.data
        //   if (response.data.code != '10000') { //失败
        //     this.$message.error(response.data.message)
        //   } else {
        //     this.$message({
        //       type: 'success',
        //       message: '删除成功!'
        //     });
        //     this.$emit("getList", this.currentSize)
        //   }
        // })
      },
    }
  }
</script>

<style scoped lang="less">
  .default-font {
    font-size: 12px;
    font-family: Microsoft YaHei-Regular, Microsoft YaHei;
    font-weight: 400;
    color: #333333;
  }

  .app-container {
    background-color: #fff;
    padding: 0px 15px;
    box-shadow: 0px 2px 10px 1px rgba(0, 0, 0, 0.06);
  }

  .el-table {
    font-size: 12px;
    color: #333333;
    box-sizing: border-box;
    border-radius: 6px 6px 0px 0px;
    // padding: 0px 15px;
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


  .name-span-overflow {
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;

    .line {
      color: #DDDDDD;
    }
  }

  .open-statue {
    color: #333333;
    display: flex;
    justify-content: flex-start;
    align-items: center;

    .green-cirle {
      width: 4px;
      height: 4px;
      background: #13CE66;
      opacity: 1;
      border-radius: 50%;
      margin-right: 6px;
    }

    .open-time {
      color: #C1C5CD;
    }
  }

  .close-statue {
    color: #C1C5CD;
    display: flex;
    justify-content: flex-start;
    align-items: center;

    .gray-cirle {
      width: 4px;
      height: 4px;
      background: #C1C5CD;
      opacity: 1;
      border-radius: 50%;
      margin-right: 6px;
    }
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
