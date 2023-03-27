<template>
  <div class="add-goods-to-groups-box">
    <div class="top-search-good-box">
      <el-input placeholder="请输入商品名称" v-model="searchKey">
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </div>
    <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width:100%" class="goods-table-box"
      height="260" @selection-change="handleSelectionChange"
      :header-cell-style="{height:'53px',color: '#333333','font-size': '12px','font-weight': 'bold','background-color':'#FAFAFA'}"
      :cell-style="{color: '#333333','font-size': '12px'}">
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column label="商品名称" min-width="400">
        <template slot-scope="scope">
          <div class="goods-name-info-row">
            <!-- <el-checkbox v-model="scope.row.checked"></el-checkbox> -->
            <img :src="scope.row.defaultImage" alt="" class="goods-img">
            <div class="goods-name-box">
              <span>{{scope.row.goodsName}}</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="goodsModel" label="商品型号" min-width="180"></el-table-column>
      <el-table-column fixed="right" label="操作" min-width="50">
        <template slot-scope="scope">
          <el-button @click.native.prevent="addRow(scope.$index, scope.row)" type="text" size="small"
            class="my-opt-btn">
            添加
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="my-goods-table-bottoms">
      <div class="batch-opt-box">
        <el-checkbox v-model="checkedAll" @change="allSelectTerminal">全选</el-checkbox>
        <el-button type="primary" class="my-batch-opt-btn" @click="batchAdd">批量加入</el-button>
      </div>
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :page-sizes="[1,5,10, 15, 20, 25]" ::page-size="currentSize.pageSize" :background="false"
        layout="total, sizes, prev, pager, next, jumper" :total="currentSize.total">
      </el-pagination>
      <!-- pager-count="currentSize.pageNo" -->
    </div>
  </div>
</template>

<script>
  import {
    goodsList,
    goodsBandGroup
  } from '@/api/goods'
  export default {
    props: ['groupId'],
    data() {
      return {
        searchKey: '',
        checkedAll: false,
        currentSize: {
          groupId: null,
          pageSize: 20,
          pageNo: 1,
          total: 0
        },
        tableData: [],
        multipleSelection: []
      }
    },

    mounted() {
      console.log("groupId:", this.groupId)
      this.currentSize.groupId = this.groupId
      this.getGoodsData()
    },
    methods: {
      getGoodsData() {
        goodsList(this.currentSize).then(res => {
          this.tableData = res.data.data.list
          this.currentSize.total = res.data.data.totalCount
        })
      },
      handleSizeChange(val) {
        this.currentSize.pageSize = val
        this.currentSize.pageNo = 1
        this.getGoodsData()

      },
      handleCurrentChange(val) {
        this.currentSize.pageNo = val
        this.getGoodsData()
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      allSelectTerminal(e) {
        if (e === true) {
          this.$refs.multipleTable.toggleAllSelection()
        } else {
          this.$refs.multipleTable.clearSelection()
        }
      },
      batchAdd() {
        var params = {
          goodsIdList: [],
          groupId: this.currentSize.groupId,
        }
        for (var index in this.multipleSelection) {
          params.goodsIdList.push(this.multipleSelection[index].goodsId)
        }
        if (this.multipleSelection.length > 0) {
          this.$confirm('是否确定要批量加入这些商品?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            goodsBandGroup(params).then(res => {
              if (res.data.code == 10000) {
                this.$message.sucess("添加成功")
                this.getGoodsData()
              } else {
                this.$message.error(res.data.message)
              }
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消添加'
            });
          });
        } else {
          this.$message({
            type: 'info',
            message: '您还没有选择数据，请先选择您要添加的商品？'
          });
        }
      },
      addRow(index, row) {
        // console.log("addRow:", row)
        const param = {
          groupId: this.currentSize.groupId,
          goodsIdList: []
        }
        param.goodsIdList.push(row.goodsId)
        goodsBandGroup(param).then(res => {
          if (res.data.code == 10000) {
            this.$message.sucess("添加成功")
            this.getGoodsData()
          } else {
            this.$message.error(res.data.message)
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .add-goods-to-groups-box {
    width: 950px;
    height: 100%;
    padding: 15px 30px 20px 45px;
    background: #FFFFFF;
    box-sizing: border-box;
    border-radius: 6px;

    .top-search-good-box {
      width: 100%;
      border-radius: 6px;
      box-sizing: border-box;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-bottom: 25px;

      /deep/ .el-input-group {
        width: 380px;
        height: 34px;
        border-radius: 6px;
        font-size: 12px;
        color: #999999;
        box-sizing: border-box;
      }

      /deep/ .el-input--medium .el-input__inner {
        height: 34px;
        line-height: 34px;
      }

      /deep/ .el-button--medium {
        font-size: 18px !important;
        padding: inherit !important;
      }

      /deep/ .el-input__inner {
        border-radius: 6px;
        border-bottom-right-radius: 0px;
        border-top-right-radius: 0px;
      }

      /deep/ .el-input-group__append {
        border-radius: 6px;
        border-bottom-left-radius: 0px;
        border-top-left-radius: 0px;
        width: 60px;
        background-color: #1890FF;
        border: 1px solid #1890FF;
        color: #fff;
        font-size: 20px;
      }

      /deep/ .el-input-group__append:hover {
        background-color: #46a6ff;
        border-color: #46a6ff;
      }
    }


    .goods-table-box {
      .goods-name-info-row {
        width: 100%;
        font-size: 12px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        font-weight: 400;
        color: #333333;
        display: flex;
        align-items: center;
        justify-content: flex-start;

        /deep/ .el-checkbox__inner {
          border-radius: 50%;
        }

        .goods-img {
          margin-left: 8px;
          width: 40px;
          height: 40px;
          background: #FFFFFF;
          border-radius: 4px 4px 4px 4px;
          box-sizing: border-box;
        }

        .goods-name-box {
          line-height: 12px;
          height: 40px;
          padding: 4px 8px 4px 16px;
          flex: 1;

          span {
            text-overflow: -o-ellipsis-lastline;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;

          }
        }
      }
    }

    .my-goods-table-bottoms {
      background-color: #fafafa;
      // margin-top: 45px;
      height: 45px;
      margin-bottom: 35px;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-left: 18px;

      .batch-opt-box {
        /deep/ .el-checkbox__label {
          font-weight: 400;
          color: #555555;
          font-size: 12px;
        }

        // /deep/ .el-checkbox__inner {
        //   border-radius: 50%;
        // }

        .my-batch-opt-btn {
          margin-left: 20px;
        }

        /deep/ .el-button {
          padding: 4px 12px;
          font-size: 12px;
        }
      }
    }
  }
</style>
