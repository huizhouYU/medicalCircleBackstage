<template>
  <div class="manage-series-box">
    <div class="top-series-info">
      <div class="top-group-info">
        <div class="series-info-item">
          <span class="key">分组名称：</span>
          <span class="value font-bold">{{groupInfo.groupName||'-'}}</span>
        </div>
        <div class="series-info-item">
          <span class="key">类目：</span>
          <span class="value">{{groupInfo.categoryName||'-'}}</span>
        </div>
        <div class="series-info-item">
          <span class="key">品牌：</span>
          <span class="value">{{groupInfo.brandName||'-'}}</span>
        </div>
      </div>
      <el-button type="primary" @click="addGroupGoods">添加商品</el-button>
    </div>
    <div class="goods-groups-box">
      <div class="tip-box">
        <i class="el-icon-warning-outline my-tip-icon"></i>
        <span class="tip-title">
          每个分组最多添加8个商品
        </span>
      </div>
      <div class="my-el-table-content">
        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width:100%" class="goods-table-box"
          :header-cell-style="{height:'53px',color: '#333333','font-size': '12px','font-weight': 'bold'}"
          @selection-change="handleSelectionChange" :cell-style="{color: '#333333','font-size': '12px'}">
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column label="商品名称" min-width="420">
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
          <el-table-column prop="goodsModel" label="商品型号" min-width="200"></el-table-column>
          <el-table-column fixed="right" label="操作" min-width="100">
            <template slot-scope="scope">
              <el-button @click.native.prevent="deleteRow(scope.$index, scope.row)" type="text" size="small"
                class="my-opt-btn">
                从分组中移除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="my-goods-table-bottoms">
          <div class="batch-opt-box">
            <el-checkbox v-model="checkedAll" @change="allSelectTerminal">全选</el-checkbox>
            <el-button type="danger" class="my-batch-opt-btn" @click="batchDeleteGroup">从分组中移除</el-button>
          </div>
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :page-sizes="[1,5,10, 15, 20, 25]" ::page-size="currentSize.pageSize" :background="false"
            layout="total, sizes, prev, pager, next, jumper" :total="currentSize.total">
          </el-pagination>
        </div>
      </div>

    </div>
    <el-dialog :title="dialogTitle" :visible.sync="editGroupDialog" width="950"
      class="my-public-dialog my-edit-group-dialog">
      <group-goods></group-goods>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editGroupDialog = false">取 消</el-button>
        <el-button type="primary" @click="sureEdit">确 定</el-button>
      </span>
    </el-dialog>
    <div v-if="addGoodsDialog">
      <el-dialog title="添加商品" :visible.sync="addGoodsDialog" width="976"
        class="my-public-dialog my-good-to-group-dialog">
        <add-group-goods :groupId="currentSize.groupId" :tableHeight="tableHeightDialog" v-show="currentSize.groupId">
        </add-group-goods>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addGoodsDialog = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import {
    goodsByGroup,
    goodsGroupDetail,
    groupRemoveGoods
  } from '@/api/goods'
  import groupGoods from '../../../views/goods/relate/groupGoods.vue'
  import addGroupGoods from '../../../views/goods/relate/addGroupGoods.vue'
  export default {
    components: {
      groupGoods,
      addGroupGoods
    },
    data() {
      return {
        groupInfo: {},
        addGoodsDialog: false,
        editGroupDialog: false,
        dialogTitle: '修改分组',
        checkedAll: false,
        currentSize: {
          groupId: null,
          pageSize: 20,
          pageNo: 1,
          total: 0
        },
        tableData: [],
        tableHeightDialog: '342',
        multipleSelection: []
      }
    },
    mounted() {
      this.currentSize.groupId = parseInt(this.$route.query.groupId)
      //获取分组信息
      this.getGroupInfo()
      //获取该分组下面的商品
      this.getGroupGoods()
    },
    methods: {
      getGroupInfo() {
        var param = {
          id: this.currentSize.groupId
        }
        goodsGroupDetail(param).then(res => {
          if (res.data.code == 10000) {
            this.groupInfo = res.data.data
          } else {
            this.$message.error("获取分组详情失败：", res.data.message)
          }
        })
      },
      getGroupGoods() {
        goodsByGroup(this.currentSize).then(res => {
          if (res.data.code == 10000) {
            this.tableData = res.data.data.list
            this.currentSize.total = res.data.data.totalCount
          } else {
            this.$message.error(res.data.message)
          }
        })
      },
      addGroupGoods() {
        this.addGoodsDialog = true
      },
      handleSizeChange(val) {
        this.currentSize.pageSize = val
        this.getGroupGoods()
      },
      handleCurrentChange(val) {
        this.currentSize.pageNo = val
        this.getGroupGoods()
      },
      editGroup(index, row) {
        this.editGroupDialog = true
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
      //批量移除商品
      batchDeleteGroup() {
        var params = {
          goodsIdList: [],
          groupId: this.currentSize.groupId,
        }
        for (var index in this.multipleSelection) {
          params.goodsIdList.push(this.multipleSelection[index].goodsId)
        }
        if (this.multipleSelection.length > 0) {
          this.$confirm('是否确定要批量移除这些商品?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            groupRemoveGoods(params).then(res => {
              if (res.data.code == 10000) {
                this.$message.success("移除成功!")
                this.getGroupGoods()
              } else {
                this.$message.error(res.data.message)
              }
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消移除'
            });
          });
        } else {
          this.$message({
            type: 'info',
            message: '您还没有选择数据，请先选择您要移除的商品？'
          });
        }

      },
      //移除商品
      deleteRow(index, row) {
        this.$confirm('确定要从这个分组中移除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var params = {
            groupId: this.currentSize.groupId,
            goodsIdList:[]
          }
          params.goodsIdList.push(row.goodsId)
          groupRemoveGoods(params).then(res => {
            if (res.data.code == 10000) {
              this.$message({
                type: 'success',
                message: '移除成功'
              });
              this.getGroupGoods()
            } else {
              this.$message.error(res.data.message)
            }
          })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消移除'
          });
        });

      },
      sureEdit() {
        this.editGroupDialog = false
      }
    }
  }
</script>

<style lang="less" scoped>
  .manage-series-box {
    .top-series-info {
      height: 74px;
      width: 100%;
      background: #FFFFFF;
      box-shadow: 0px 2px 10px 1px rgba(0, 0, 0, 0.06);
      border-radius: 6px 6px 6px 6px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0px 20px 0px 15px;
      margin-bottom: 20px;

      .top-group-info {
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .series-info-item {
          display: flex;
          justify-content: flex-start;
          align-items: center;

          .key {
            font-size: 12px;
            font-family: Microsoft YaHei-Regular, Microsoft YaHei;
            font-weight: 400;
            color: #333333;
          }

          .value {
            margin-left: 30px;
            font-size: 14px;
            font-family: Microsoft YaHei-Bold, Microsoft YaHei;
            color: #333333;
          }

          .font-bold {
            font-weight: bold;
          }
        }

        .series-info-item+.series-info-item {
          margin-left: 100px;
        }
      }

      /deep/ .el-button {
        font-size: 12px;
        padding: 10px 20px;
      }
    }

    .goods-groups-box {
      width: 100%;
      padding: 20px 0px;
      background: #FFFFFF;
      box-shadow: 0px 2px 10px 1px rgba(0, 0, 0, 0.06);
      box-sizing: border-box;
      border-radius: 6px;

      .tip-box {
        padding: 0px 15px;
        width: 100%;
        height: 32px;
        background: #F8F8F8;
        border-radius: 6px;
        box-sizing: border-box;
        margin-bottom: 10px;
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .my-tip-icon {
          margin-right: 8px;
          color: #FABB3D;
          font-size: 16px;
          line-height: 16px;
        }

        .tip-title {
          font-size: 12px;
          font-weight: 400;
          color: #BBBBBB;
          line-height: 12px;
        }
      }

      .my-el-table-content {
        padding: 0px 20px;
        box-sizing: border-box;
        width: 100%;

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
      }

      .my-goods-table-bottoms {
        margin-top: 45px;
        margin-bottom: 35px;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .batch-opt-box {

          /deep/ .el-checkbox__label {
            font-weight: 400;
            color: #555555;
            font-size: 12px;
          }
          .my-batch-opt-btn {
            margin-left: 20px;
          }

          /deep/ .el-button {
            padding: 4px 12px;
            font-size: 12px;
          }

          /deep/.el-button--danger {
            background-color: #FF7575;
            border-color: #FF7575;
          }

          /deep/.el-button--danger:hover {
            background-color: #ff4949;
            border-color: #ff4949;
          }
        }
      }
    }

    .my-public-dialog {
      /deep/.el-dialog__header {
        height: 50px;
        background: #FAFAFA;
        border-radius: 4px 4px 0px 0px;
        font-size: 14px;
        font-family: Microsoft YaHei-Bold, Microsoft YaHei;
        font-weight: bold;
        color: #333333;
        border-bottom: 1px solid #EBEEF5;
      }

      /deep/ .el-button--medium {
        padding: 10px 15px;
        font-size: 12px;
      }

      /deep/ .el-button+.el-button {
        margin-left: 14px;
      }
    }

    .my-good-to-group-dialog {
      /deep/ .el-dialog {
        width: 950px;
        height: 597px;
      }

      /deep/ .el-dialog__body {
        height: 547px;
        padding: 0px;
      }
    }

    .my-edit-group-dialog {
      /deep/ .el-dialog {
        width: 950px;
        height: 492px;
      }

      /deep/ .el-dialog__body {
        height: 442px;
        padding: 0px;
      }


    }
  }
</style>
