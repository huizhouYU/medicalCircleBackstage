<template>
  <div class="goods-relate-content">
    <div class="goods-relate-top">
      <div class="top-search">
        <div class="search-item">
          <span class="search-item-title">类目选择：</span>
          <el-cascader v-model="value" :options="options" :props="TagProps" placeholder="请选择类目" @change="handleChange">
          </el-cascader>
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
            <el-button @click.native.prevent="editSeriesGroup(scope.$index, scope.row)" type="text" size="small"
              class="my-opt-btn">
              管理系列商品
            </el-button>
            <el-button @click.native.prevent="editSeries(scope.$index, scope.row)" type="text" size="small"
              class="my-opt-btn">
              编辑
            </el-button>
            <el-button @click.native.prevent="deleteSeries(scope.$index, scope.row)" type="text" size="small"
              class="my-opt-btn">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="my-table-bottoms">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :page-sizes="[1,5,10, 15, 20, 25]" ::page-size="currentSize.pageSize" :background="false"
          layout="total, sizes, prev, pager, next, jumper" :total="currentSize.total">
        </el-pagination>
        <!-- pager-count="currentSize.pageNo" -->
      </div>
    </div>
    <el-dialog :title="seriesDialogTitle" :visible.sync="dialogVisible" width="950" class="my-new-set-dialog">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="85px" class="demo-ruleForm">
        <el-form-item label="系列名称：" prop="name" class="input-long-item">
          <el-input v-model="ruleForm.name" maxlength="20" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="类目：" prop="cate" class="input-long-item">
          <el-cascader v-model="ruleForm.cate" :options="options" :props="TagProps" :disabled="editFlag"></el-cascader>
        </el-form-item>
        <el-form-item label="品牌：" prop="brand" class="input-short-item">
          <el-select v-model="ruleForm.brand" placeholder="请选择品牌" :disabled="editFlag">
            <el-option v-for="item in brandsOptions" :key="item.brandId" :label="item.brandName||'-'"
              :value="item.brandId">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureAddSet">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import {
    cartListByPid,
    goodsCategoryList
  } from '@/api/goods'
  import {
    brandList
  } from '@/api/demand'
  export default {
    data() {
      return {
        editFlag: true,
        seriesDialogTitle: '创建新系列',
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
        TagProps: {
          value: 'cateId',
          label: 'cateName',
          children: 'children'
        },
        options: [],
        brandsOptions: [],
        ruleForm: {
          name: '',
          cate: '',
          brand: ''
        },
        rules: {
          name: [{
              required: true,
              message: '请输入系列名称',
              trigger: 'blur'
            },
            {
              min: 0,
              max: 20,
              message: '长度在 0 到 20 个字符',
              trigger: 'blur'
            }
          ],
          cate: [{
            required: true,
            message: '请选择类目',
            trigger: 'change'
          }],
          brand: [{
            required: true,
            message: '请选择品牌',
            trigger: 'change'
          }]
        }
      };
    },
    mounted() {
      //获取类目（只获取第一级类目）
      this.getFristCartData()
      this.getBrandData()

    },
    methods: {
      getFristCartData() {
        // cartListByPid({
        //   pid: 0
        // }).then(res => {
        //   console.log("获取的第一级分类：", res)
        // })
        goodsCategoryList().then(response => {
          this.options = this.getTreeData(response.data.data)
        })
      },
      getBrandData() {
        brandList().then(response => {
          this.brandsOptions = response.data.data
        })
      },
      getTreeData(data) {
        for (var i = 0; i < data.length; i++) {
          if (data[i].children.length < 1) {
            // children若为空数组，则将children设为undefined
            data[i].children = undefined;
          } else {
            // children若不为空数组，则继续 递归调用 本方法
            this.getTreeData(data[i].children);
          }
        }
        return data;
      },

      handleChange(value) {
        console.log(value);
      },
      handleSizeChange() {

      },
      handleCurrentChange() {

      },

      addNewSet() {
        this.seriesDialogTitle = "创建新系列"
        this.editFlag = false
        this.dialogVisible = true
      },
      sureAddSet() {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            this.dialogVisible = false
            this.$router.push({
              path: 'manageSeries'
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });

      },
      editSeries() {
        this.seriesDialogTitle = "系列编辑"
        this.editFlag = true
        this.dialogVisible = true
      },
      editSeriesGroup(index, row) {
        this.$router.push({
          path: 'manageSeries'
        })
      },
      deleteSeries(index, row) {
        this.$confirm('确定删除这个系列吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
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

      .my-table-bottoms {
        padding: 20px 50px 25px 15px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
      }
    }


    .my-new-set-dialog {

      /deep/ .el-dialog {
        height: 257px;
        width: 950px;
      }

      /deep/ .el-dialog__header {
        height: 50px;
        background: #FAFAFA;
        border-radius: 4px 4px 0px 0px;
        font-size: 14px;
        font-family: Microsoft YaHei-Bold, Microsoft YaHei;
        font-weight: bold;
        color: #333333;
        padding-left: 22px;
      }

      /deep/ .el-dialog__headerbtn {
        top: 16px;
      }

      /deep/ .el-dialog__body {
        padding: 15px 20px 0px 55px;
      }

      .input-long-item {
        /deep/.el-input--medium {
          width: 480px;
        }

        /deep/ .el-input--medium .el-input__inner {
          width: 480px;
          height: 34px;
        }
      }

      .input-short-item {
        /deep/.el-input--medium {
          width: 340px;
        }

        /deep/ .el-input--medium .el-input__inner {
          width: 340px;
          height: 34px;
        }
      }

      /deep/ .el-button--medium {
        padding: 10px 15px;
        font-size: 12px;
      }

      /deep/ .el-button+.el-button {
        margin-left: 14px;
      }
    }

  }
</style>
