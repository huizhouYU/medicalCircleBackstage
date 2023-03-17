<template>
  <div class="goods-relate-content">
    <div class="goods-relate-top">
      <div class="top-search">
        <div class="search-item">
          <span class="search-item-title">类目选择：</span>
          <el-cascader v-model="value" :options="options" placeholder="请选择类目" @change="handleChange"></el-cascader>
        </div>
        <div class="search-item my-search-input-item">
          <span class="search-item-title">系列名称：</span>
          <el-input v-model="input" placeholder="输入系列名称关键字"></el-input>
        </div>
        <el-button type="primary" class="my-search-btn">查询</el-button>
      </div>
      <el-button type="primary" @click="addNewSet">创建新系列</el-button>
    </div>
    <div class="my-table-box">
      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width:100%" class="el-table-box"
        :header-cell-style="{height:'55px',color: '#333333','font-size': '12px','font-weight': 'bold'}"
        :cell-style="{color: '#333333','font-size': '12px'}">
        <el-table-column prop="name" label="系列名称" min-width="200"></el-table-column>
        <el-table-column prop="cart" label="类目" min-width="200"></el-table-column>
        <el-table-column prop="brand" label="品牌名称" min-width="200"></el-table-column>
        <el-table-column fixed="right" label="操作" min-width="120">
          <template slot-scope="scope">
            <el-button @click.native.prevent="editRow(scope.$index, scope.row)" type="text" size="small"
              class="my-opt-btn">
              管理系列商品
            </el-button>
            <el-button @click.native.prevent="deleteRow(scope.$index, scope.row)" type="text" size="small"
              class="my-opt-btn">
              编辑
            </el-button>
            <el-button @click.native.prevent="deleteRow(scope.$index, scope.row)" type="text" size="small"
              class="my-opt-btn">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="my-table-bottoms">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :page-sizes="[1,5,10, 15, 20, 25]" ::page-size="currentSize.pageSize"
          :background="false" layout="total, sizes, prev, pager, next, jumper" :total="currentSize.total">
        </el-pagination>
        <!-- pager-count="currentSize.pageNo" -->
      </div>
    </div>
    <el-dialog title="创建新系列" :visible.sync="dialogVisible" width="950" >
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        input: '',
        value: [],
        dialogVisible: false,
        tableData: [{
            name: '心电监护系列',
            cart: '临床检验/血液分析设备/血细胞分析仪',
            brand: '永康'
          },
          {
            name: '心电监护系列',
            cart: '临床检验/血液分析设备/血细胞分析仪',
            brand: '永康'
          },
          {
            name: '心电监护系列',
            cart: '临床检验/血液分析设备/血细胞分析仪',
            brand: '永康'
          },
          {
            name: '心电监护系列',
            cart: '临床检验/血液分析设备/血细胞分析仪',
            brand: '永康'
          },
          {
            name: '心电监护系列',
            cart: '临床检验/血液分析设备/血细胞分析仪',
            brand: '永康'
          }
        ],
        currentSize: {
          pageSize: 15,
          pageNo: 1,
          total: 50
        },
        options: [{
          value: 'zhinan',
          label: '指南',
          children: [{
            value: 'shejiyuanze',
            label: '设计原则',
            children: [{
              value: 'yizhi',
              label: '一致'
            }, {
              value: 'fankui',
              label: '反馈'
            }, {
              value: 'xiaolv',
              label: '效率'
            }, {
              value: 'kekong',
              label: '可控'
            }]
          }, {
            value: 'daohang',
            label: '导航',
            children: [{
              value: 'cexiangdaohang',
              label: '侧向导航'
            }, {
              value: 'dingbudaohang',
              label: '顶部导航'
            }]
          }]
        }]
      };
    },
    methods: {
      handleChange(value) {
        console.log(value);
      },
      handleSizeChange() {

      },
      handleCurrentChange() {

      },
      addNewSet() {
        this.dialogVisible = true
      }
    }
  }
</script>

<style lang="less" scoped>
  .goods-relate-content {
    .goods-relate-top {
      height: 74px;
      width: 100%;
      background: #FFFFFF;
      box-shadow: 0px 2px 10px 1px rgba(0, 0, 0, 0.06);
      border-radius: 6px 6px 6px 6px;
      opacity: 1;
      padding: 20px 20px 20px 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;

      .top-search {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        font-size: 12px;
        font-weight: 400;
        color: #333333;

        .search-item {
          display: flex;
          justify-content: flex-start;
          align-items: center;

          .search-item-title {
            margin-right: 30px;
            width: -webkit-fill-available;
          }

          /deep/ .el-input--medium .el-input__inner {
            height: 34px;
            width: 300px;
            font-size: 12px;
          }
        }

        .my-search-input-item {
          /deep/ .el-input--medium .el-input__inner {
            width: 210px;
          }
        }

        .search-item+.search-item {
          margin-left: 86px;
        }
      }

      .my-search-btn {
        margin-left: 68px;
      }

      /deep/ .el-button--medium {
        padding: 10px 20px;
        font-size: 12px;
      }
    }

    .my-table-box {
      background: #FFFFFF;
      width: 100%;
      padding: 0px 20px;
      box-shadow: 0px 2px 10px 1px rgba(0, 0, 0, 0.06);
      border-radius: 6px;

      .my-opt-btn {
        color: #1890FF;
      }

      // /deep/ .el-table__header-wrapper {
      //   padding: 0px 20px;
      // }
      .my-table-bottoms {
        padding: 20px 50px 25px 15px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
      }
    }

  }
</style>
