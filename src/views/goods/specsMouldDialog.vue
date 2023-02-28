<template>
  <!-- 添加规格模板 -->
  <el-dialog title="规格模板" :close-on-click-modal="false" :visible.sync="specsDialogVisible" width="950px"
    class="my-space-el-dialog-box" @close="closeDialog">
    <el-form :model="specsRuleForm" :rules="specsRules" ref="specsRuleForm" label-width="130px" class="specs-ruleForm">
      <el-form-item label="规格名称:" prop="specName">
        <el-input v-model.trim="specsRuleForm.specName" placeholder="请填写规格名称"></el-input>
      </el-form-item>
      <div class="spec-box">
        <el-form-item label="" prop="">
          <div class="specValues-div" v-show="specsRuleForm.specStringValues.length>0">
            <div class="specValue-item" v-for="(item,index) in specsRuleForm.specStringValues" :key="index">
              <div class="round"></div>
              <span>{{item}}</span>
              <i class="iconfont my-close-font" @click="delValues(index)">&#xe630;</i>
            </div>
            <el-input v-model.trim="specsRuleForm.specValues" placeholder="请输入规格值" @keyup.native.enter="addValues()"
              class="my-add-value-input">
              <el-button slot="append" @click="addValues()">添加</el-button>
            </el-input>
          </div>
        </el-form-item>
      </div>
      <el-form-item label="规格值:" prop="" v-show="!specsRuleForm.specStringValues.length>0">
        <el-input v-model.trim="specsRuleForm.specValues" placeholder="请填写规格值" @keyup.native.enter="tentSpecSure()">
        </el-input>
        <el-button type="primary" @click="tentSpecSure()" class="add-spacesValue-btn">添加</el-button>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitSpec('specsRuleForm')">确 定</el-button>
      <el-button type="" @click="closeDialog()">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {
    specCreate
  } from '@/api/goods'
  export default {
    props: {
      'specsDialogVisible': {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        specsRuleForm: {
          specName: '', //规格模板名称
          specStringValues: [], //规格值
          specValues: ''
        },
        specsRules: {
          specName: [{
              required: true,
              message: '请输入规格名称',
              trigger: 'blur'
            },
            {
              min: 0,
              max: 25,
              message: '长度在 0 到 25 个字符',
              trigger: 'blur'
            }
          ]
        }

      }
    },
    methods: {
      tentSpecSure() {
        if (this.specsRuleForm.specValues) {
          this.specsRuleForm.specStringValues.push(this.specsRuleForm.specValues)
          this.specsRuleForm.specValues = ''
        }
      },
      delValues(key) {
        this.specsRuleForm.specStringValues.splice(key, 1)
      },
      addValues() {
        this.tentSpecSure()
      },
      closeDialog() {
        this.specsRuleForm = {
          specName: '', //规格模板名称
          specStringValues: [], //规格值
          specValues: ''
        }
        this.$emit("closeSpecs")
      },
      submitSpec(formName) {
        try {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              if (this.specsRuleForm.specStringValues.length > 0) {
                console.log("最后数据：", this.specsRuleForm)
                specCreate(this.specsRuleForm).then(response => {
                  if (response.data.code == 10000) {
                    this.closeDialog()
                  } else {
                    this.$message.error("规格保存失败：" + response.data.message)
                  }
                })
                // this.closeDialog()
              } else {
                this.$message.error("请输入规格值")
              }
            } else {
              return false;
            }
          });
        } catch (e) {
          console.log(e)
          //TODO handle the exception
        }


      },

    }
  }
</script>

<style lang="less" scoped>
  //添加规格模板弹框
  .my-space-el-dialog-box {

    /deep/ .el-dialog__header {
      height: 50px;
      background: #FAFAFA;
      border-radius: 4px 4px 0px 0px;
      font-size: 14px;
      font-family: Microsoft YaHei-Bold, Microsoft YaHei;
      font-weight: bold;
      color: #333333;
      display: flex;
      align-items: center;
      padding: 0px 0px 0px 22px;
    }

    /deep/ .el-dialog__body {
      padding: 0px 0px 60px !important;
    }

    /deep/ .el-dialog__footer {
      bottom: 20px !important;
    }

    /deep/.el-button--medium {
      padding: 10px 15px;
      font-size: 12px;
    }

    //改变滚动条样式  start
    .specs-ruleForm::-webkit-scrollbar {
      padding: 2px 0px;
      width: 2px;
    }

    .specs-ruleForm::-webkit-scrollbar-thumb {
      border-radius: 10px;
      box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      background: rgba(0, 0, 0, 0);
    }

    .specs-ruleForm::-webkit-scrollbar-track {
      box-shadow: inset 0 0 5px rgba(0, 0, 0, 0);
      border-radius: 0;
      background: rgba(0, 0, 0, 0);
    }

    //改变滚动条样式  end
    .specs-ruleForm {
      min-height: 207px;
      max-height: 400px;
      overflow-y: scroll;
      padding: 14px 22px;

      /deep/ .el-form-item__label {
        font-size: 12px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        font-weight: 400;
        color: #333333;
      }

      /deep/ .el-input {
        width: 200px;
        height: 34px;
      }

      .spec-box {
        margin-bottom: 5px;

        /deep/ .el-form-item {
          margin-bottom: 0px;
        }

        // 规格值
        .specValues-div {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          flex-wrap: wrap;

          .specValue-item {
            margin-right: 10px;
            margin-bottom: 15px;
            box-sizing: border-box;
            padding: 0px 10px 0px 15px;
            height: 34px;
            background: #FFFFFF;
            border-radius: 4px 4px 4px 4px;
            opacity: 1;
            border: 1px solid #EBEEF5;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 12px;
            font-family: Microsoft YaHei-Regular, Microsoft YaHei;
            font-weight: 400;
            color: #999999;

            .round {
              width: 10px;
              height: 10px;
              background: #1890FF;
              border-radius: 50%;
              margin-right: 12px;
            }

            .my-close-font {
              cursor: pointer;
              margin-left: 20px;
              font-size: 12px;
              font-family: Microsoft YaHei-Regular, Microsoft YaHei;
              font-weight: 400;
              color: #999999;
            }

            .my-close-font:hover {
              color: #1890FF;
            }

          }

          .my-add-value-input {
            margin-bottom: 15px;
          }

          /deep/ .el-input-group__append {
            background: #1890FF;
            border: none;
            color: #fff;
          }
        }
      }

      .add-spacesValue-btn {
        margin-left: 20px;
      }
    }
  }
</style>
