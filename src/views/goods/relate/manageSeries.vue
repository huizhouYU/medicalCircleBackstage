<template>
  <div class="manage-series-box">
    <div class="top-series-info">
      <div class="top-group-info">
        <div class="series-info-item">
          <span class="key">分组名称：</span>
          <span class="value font-bold">心电监护仪系列</span>
        </div>
        <div class="series-info-item">
          <span class="key">类目：</span>
          <span class="value">监护诊察 > 监护附件 > 监护设备配件</span>
        </div>
        <div class="series-info-item">
          <span class="key">品牌：</span>
          <span class="value">康泰</span>
        </div>
      </div>
      <el-button type="primary" @click="addGroupGoods">添加商品</el-button>
    </div>
    <div class="goods-groups-box">
      <div class="groups-top">
        <div class="tip-box">
          <i class="el-icon-warning-outline my-tip-icon"></i>
          <span class="tip-title">
            每个分组最多添加8个商品
          </span>
        </div>
        <div class="top-search-box">
          <el-input placeholder="请输入商品名称" v-model="searchKey">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </div>
      </div>
      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width:100%" class="goods-table-box"
        :header-cell-style="{height:'53px',color: '#333333','font-size': '12px','font-weight': 'bold'}"
        :cell-style="{color: '#333333','font-size': '12px'}">
        <el-table-column label="商品名称" min-width="220">
          <template slot-scope="scope">
            <div class="goods-name-info-row">
              <el-checkbox v-model="scope.row.checked"></el-checkbox>
              <img src="../../../assets/images/shop_logo.png" alt="" class="goods-img">
              <div class="goods-name-box">
                <span>{{scope.row.name}}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="cart" label="商品型号" min-width="180"></el-table-column>
        <!-- <el-table-column label="状态" min-width="180">
          <template slot-scope="scope">
            <template v-if="scope.row.ifShow">上架</template>
            <template v-else>下架</template>
          </template>
        </el-table-column> -->
        <el-table-column fixed="right" label="操作" min-width="160">
          <template slot-scope="scope">
            <div class="my-table-opt-box">
              <div class="opt-btns">
                <!--    <el-button @click.native.prevent="editGroup(scope.$index, scope.row)" type="text" size="small"
                  class="my-opt-btn">
                  修改分组
                </el-button> -->
                <el-button @click.native.prevent="deleteRow(scope.$index, scope.row)" type="text" size="small"
                  class="my-opt-btn">
                  从分组中移除
                </el-button>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="my-goods-table-bottoms">
        <div class="batch-opt-box">
          <el-checkbox v-model="checkedAll">全选</el-checkbox>
          <el-button type="primary" class="my-batch-opt-btn">从分组中移除</el-button>
        </div>
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :page-sizes="[1,5,10, 15, 20, 25]" ::page-size="currentSize.pageSize" :background="false"
          layout="total, sizes, prev, pager, next, jumper" :total="currentSize.total">
        </el-pagination>
        <!-- pager-count="currentSize.pageNo" -->
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
    goodsByGroup
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
        searchKey: '',
        checkedAll: false,
        currentSize: {
          groupId: null,
          pageSize: 20,
          pageNo: 1,
          total: 0
        },
        tableData: [],
        tableHeightDialog: '342'
      }
    },
    mounted() {
      console.log(this.$route)
      this.currentSize.groupId = this.$route.query.groupId
      //获取分组信息
      // this.getGroupInfo()
      //获取该分组下面的商品
      this.getGroupGoods()
    },
    methods: {
      getGroupInfo() {

      },
      getGroupGoods() {
        goodsByGroup(this.currentSize).then(res => {
          console.log("获取分组下的商品：", res)
          this.tableData = res.data.data.list
        })
      },
      addGroupGoods() {
        this.addGoodsDialog = true
      },
      handleSizeChange() {

      },
      handleCurrentChange() {

      },
      editGroup(index, row) {
        this.editGroupDialog = true
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
      padding: 20px 20px 20px 15px;
      background: #FFFFFF;
      box-shadow: 0px 2px 10px 1px rgba(0, 0, 0, 0.06);
      box-sizing: border-box;
      border-radius: 6px;

      .groups-top {
        padding: 0px 15px;
        width: 100%;
        height: 62px;
        background: #F8F8F8;
        border-radius: 6px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;

        .tip-box {
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

        .top-search-box {
          /deep/ .el-input-group {
            width: 430px;
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

        .my-table-opt-box {
          width: 100%;
          height: 40px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: flex-start;
          box-sizing: border-box;

          .groups-info {
            font-size: 12px;
            font-weight: 400;
            color: #BBBBBB;
          }

          .opt-btns {
            line-height: 12px;

            /deep/.el-button {
              padding: 0px;
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

          /deep/ .el-checkbox__inner {
            border-radius: 50%;
          }

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
