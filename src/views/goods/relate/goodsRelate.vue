<template>
  <div class="goods-relate-content">
    <div class="goods-relate-top">
      <div class="top-search">
        <div class="search-item">
          <span class="search-item-title">类目选择：</span>
          <el-cascader v-model="value" :options="options" :props="TagProps" placeholder="请选择类目" @change="handleChange"
            clearable>
          </el-cascader>
        </div>
        <div class="search-item my-search-input-item">
          <!-- <span class="search-item-title">系列名称：</span>
          <el-input v-model="input" placeholder="输入系列名称关键字"></el-input> -->
          <el-input placeholder="请输入内容" v-model="keyWord" class="input-with-select">
            <el-select v-model="selectType" slot="prepend" placeholder="请选择">
              <el-option label="商品名称" value="1"></el-option>
              <el-option label="分组名称" value="2"></el-option>
            </el-select>
          </el-input>
        </div>
        <el-button type="primary" class="my-search-btn" @click="toSearchData">查询</el-button>
      </div>
      <el-button type="primary" @click="addNewSet">创建分组</el-button>
    </div>
    <div class="my-table-box">
      <group-list :tableData="tableData" @editGroup="editGroup"></group-list>
      <div class="my-table-bottoms">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :page-sizes="[1,5,10, 15, 20, 25]" ::page-size="currentSize.pageSize" :background="false"
          layout="total, sizes, prev, pager, next, jumper" :total="currentSize.total">
        </el-pagination>
      </div>
    </div>
    <el-dialog :title="seriesDialogTitle" :visible.sync="dialogVisible" width="950" class="my-new-set-dialog">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="85px" class="demo-ruleForm">
        <el-form-item label="分组名称：" prop="groupName" class="input-long-item">
          <el-input v-model="ruleForm.groupName" maxlength="20" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="类目：" prop="categoryIdList" class="input-long-item">
          <el-cascader v-model="ruleForm.categoryIdList" :options="options" :props="TagProps" :disabled="editFlag"
            ref="cascader" @change="changeCate"></el-cascader>
          <!-- @change="changeCate" -->
        </el-form-item>
        <el-form-item label="品牌：" prop="brandId" class="input-short-item">
          <el-select v-model="ruleForm.brandId" placeholder="请选择品牌" :disabled="editFlag">
            <el-option v-for="item in brandsOptions" :key="item.brandId" :label="item.brandName||'-'"
              :value="item.brandId">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureAddSet" v-loading="submitLoading">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import {
    cartListByPid,
    goodsCategoryList,
    goodsGroupList,
    goodsGroupCreate
  } from '@/api/goods'
  import {
    brandList
  } from '@/api/demand'
  import groupList from '../../goods/relate/groupList.vue'
  export default {
    data() {
      return {
        selectType: "2",
        editFlag: true,
        submitLoading: false,
        seriesDialogTitle: '创建新分组',
        keyWord: '',
        value: [],
        dialogVisible: false,
        tableData: [],
        currentSize: {
          categoryId: null,
          pageNo: 1,
          pageSize: 20,
          total: 0
        },
        TagProps: {
          value: 'cateId',
          label: 'cateName',
          children: 'children'
        },
        options: [],
        brandsOptions: [],
        ruleForm: {
          groupName: '',
          categoryIdList: [],
          categoryName: '',
          brandId: null
        },
        rules: {
          groupName: [{
              required: true,
              message: '请输入分组名称',
              trigger: 'blur'
            },
            {
              min: 0,
              max: 20,
              message: '长度在 0 到 20 个字符',
              trigger: 'blur'
            }
          ],
          categoryIdList: [{
            required: true,
            message: '请选择类目',
            trigger: 'change'
          }],
          brandId: [{
            required: true,
            message: '请选择品牌',
            trigger: 'change'
          }]
        }
      };
    },
    components: {
      groupList
    },
    mounted() {
      //获取类目
      this.getCartData()
      this.getBrandData()
      this.getGoodsGroupList()

    },
    methods: {
      getCartData() {
        goodsCategoryList().then(response => {
          this.options = this.getTreeData(response.data.data)
        })
      },
      getBrandData() {
        brandList().then(response => {
          this.brandsOptions = response.data.data
        })
      },
      getGoodsGroupList() {
        goodsGroupList(this.currentSize).then(res => {
          this.currentSize.total = res.data.data.totalCount
          this.tableData = res.data.data.list
        })
      },
      toSearchData() {
        if (this.value && this.value.length > 0) {
          this.currentSize.categoryId = this.value
        } else {
          this.currentSize.categoryId = null
        }
        this.currentSize.groupName = null
        this.currentSize.goodsName = null
        if (this.keyWord) {
          if (this.selectType == 1) {
            this.currentSize.goodsName = this.keyWord
          } else {
            this.currentSize.groupName = this.keyWord
          }
        }
        this.getGoodsGroupList()
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
      changeCate(value) {
        this.ruleForm.categoryName = this.$refs["cascader"].getCheckedNodes()[0].pathLabels.join('/')
      },
      handleChange(value) {},
      handleSizeChange() {

      },
      handleCurrentChange() {

      },

      addNewSet() {
        this.seriesDialogTitle = "创建新分组"
        this.editFlag = false
        this.dialogVisible = true
      },
      sureAddSet() {
        try {
          this.submitLoading = true
          this.$refs['ruleForm'].validate((valid) => {
            if (valid) {
              console.log("ruleForm：", this.ruleForm)
              if (this.editFlag) {
                //编辑分组
                goodsGroupUpdate(this.ruleForm).then(res => {
                  console.log("创建分组：", res)
                  this.submitLoading = false
                })
              } else {
                //创建新的分组
                goodsGroupCreate(this.ruleForm).then(res => {
                  if (res.data.code == 10000) {
                    this.$message.success("分组创建成功！")
                    this.dialogVisible = false
                    this.$router.push({
                      path: 'manageSeries',
                      // params:{
                      //   group:''
                      // }
                    })
                  } else {
                    this.$message.reeor(res.data.message)
                  }
                  this.submitLoading = false
                })
              }
              // this.dialogVisible = false
              // this.$router.push({
              //   path: 'manageSeries'
              // })
            } else {
              console.log('error submit!!');
              this.submitLoading = false
              return false;
            }
          });
        } catch (e) {
          this.submitLoading = false
        }


      },
      editGroup(item) {
        this.seriesDialogTitle = "编辑分组"
        this.ruleForm = item
        this.editFlag = true
        this.dialogVisible = true
      },

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
          /deep/.el-input-group__prepend .el-input--medium .el-input__inner {
            width: 112px;
            height: 34px;
            background-color: #fff;
          }

          /deep/ .el-input-group__prepend {
            overflow: hidden;
          }

          /deep/.el-input-group__prepend .el-input .el-input--suffix .el-input__inner {
            background-color: #fff;
          }

          /deep/ .el-input--medium .el-input__inner {
            width: 298px;
          }
        }

        .search-item+.search-item {
          margin-left: 25px;
        }
      }

      .my-search-btn {
        margin-left: 40px;
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

      // .my-opt-btn {
      //   color: #1890FF;
      // }

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

      /deep/.el-loading-spinner {
        margin-top: -16px;
      }

      /deep/ .el-loading-spinner .circular {
        width: 32px !important;
        height: 32px !important;
      }
    }

  }
</style>
