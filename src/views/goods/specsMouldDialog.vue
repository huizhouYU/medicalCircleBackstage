<template>
  <!-- 添加规格模板 -->
  <el-dialog title="规格模板" :close-on-click-modal="false" :visible.sync="specsDialogVisible" width="950px"
    class="my-space-el-dialog-box" @close="closeDialog">
    <el-form :model="specsRuleForm" :rules="specsRules" ref="specsRuleForm" label-width="130px" class="specs-ruleForm">
      <el-form-item label="规格模板名称:" prop="name">
        <el-input v-model.trim="specsRuleForm.name" placeholder="请填写模板名称"></el-input>
      </el-form-item>
      <div class="spec-box">
        <el-form-item label="" prop="" v-for="(sp,ind) in specsRuleForm.spec" :key="ind">
          <div class="edit-spec-detail-box">
            <div class="specName-div">
              {{sp.specName}}
              <i class="iconfont my-close" @click="delSpec(ind)">&#xe8dc;</i>
            </div>
            <div class="specValues-div">
              <div class="specValue-item" v-for="(item,index) in sp.specStringValues" :key="index">
                <div class="round"></div>
                <span>{{item}}</span>
                <i class="iconfont my-close-font" @click="delValues(ind,index)">&#xe630;</i>
              </div>
              <el-input v-model.trim="sp.tent" placeholder="请输入规格值" @keyup.native.enter="addValues(ind)"
                class="my-add-value-input">
                <el-button slot="append" @click="addValues(ind)">添加</el-button>
              </el-input>
            </div>
          </div>
        </el-form-item>
      </div>

      <!-- 规格名称 + 规格值 -->
      <el-form class="add-specs-item" v-show="showDialogSpecsItem" :model="tentSpecsRuleForm" :rules="tentSpecsRules"
        ref="tentSpecsRuleForm" label-width="130px">
        <el-form-item label="规格名称:" prop="tentSpecName">
          <el-input v-model.trim="tentSpecsRuleForm.tentSpecName" placeholder="请填写规格名称"></el-input>
        </el-form-item>
        <el-form-item label="规格值:" prop="specValues">
          <el-input v-model.trim="tentSpecsRuleForm.specValues" placeholder="请填写规格值"
            @keyup.native.enter="tentSpecSure('tentSpecsRuleForm')"></el-input>
        </el-form-item>
        <el-button type="primary" class="sure-specs-btn" @click="tentSpecSure('tentSpecsRuleForm')">确定</el-button>
        <el-button @click="closeDialog">取消</el-button>
      </el-form>

      <el-form-item label="" prop="" v-show="!showDialogSpecsItem">
        <el-button type="primary" icon="el-icon-plus" @click="addSpecs">添加新规格</el-button>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitSpec('specsRuleForm')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
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
          name: '', //规格模板名称
          spec: [], //规格列表
          // specName: '', //规格名称
          // specStringValues: [] //规格值
        },
        specsRules: {
          name: [{
              required: true,
              message: '请输入规格模板名称',
              trigger: 'blur'
            },
            {
              min: 0,
              max: 25,
              message: '长度在 0 到 25 个字符',
              trigger: 'blur'
            }
          ]
        },
        tentSpecsRuleForm: {
          tentSpecName: '', //规格名称
          specValues: '' //规格值
        },
        tentSpecsRules: {
          tentSpecName: [{
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
          ],
          specValues: [{
              required: true,
              message: '请输入规格值',
              trigger: 'blur'
            },
            {
              min: 0,
              max: 25,
              message: '长度在 0 到 25 个字符',
              trigger: 'blur'
            }
          ]
        },
        showDialogSpecsItem: false, //添加规格模板中的 【添加新规格】一栏

      }
    },
    methods: {
      addSpecs() {
        this.showDialogSpecsItem = true
      },
      tentSpecSure(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var param = {
              specName: this.tentSpecsRuleForm.tentSpecName,
              specStringValues: [],
              tent: ''
            }
            param.specStringValues.push(this.tentSpecsRuleForm.specValues)
            this.specsRuleForm.spec.push(param)
            this.showDialogSpecsItem = false
            this.clearTentData()
          } else {
            return false;
          }
        });
      },
      clearTentData() {
        this.tentSpecsRuleForm.tentSpecName = ''
        this.tentSpecsRuleForm.specValues = ''
      },
      delSpec(key) {
        this.specsRuleForm.spec.splice(key, 1)
        this.clearTentData()
      },
      delValues(ind, key) {
        this.specsRuleForm.spec[ind].specStringValues.splice(key, 1)
      },
      addValues(ind) {
        if (this.specsRuleForm.spec[ind].tent) {
          this.specsRuleForm.spec[ind].specStringValues.push(this.specsRuleForm.spec[ind].tent)
          this.specsRuleForm.spec[ind].tent = ''
        }
      },
      closeDialog() {
        this.$emit("closeSpecs")
      },
      submitSpec(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.specsRuleForm.spec.length > 0) {
              console.log("最后数据：", this.specsRuleForm)
            } else {
              this.$message.error("请添加新规格")
            }
            // this.closeDialog()
          } else {
            return false;
          }
        });

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

        .edit-spec-detail-box {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: flex-start;

          .specName-div {
            margin-bottom: 15px;
            font-size: 12px;
            font-family: Microsoft YaHei-Regular, Microsoft YaHei;
            font-weight: 400;
            color: #333333;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            line-height: 12px;

            .my-close {
              color: #BBBBBB;
              margin-left: 8px;
              margin-top: 4px;
              cursor: pointer;
              font-size: 10px;
            }

            .my-close:hover {
              color: #1890FF;
            }
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
      }



      .add-specs-item {
        display: flex;
        justify-content: flex-start;
        align-items: center;

        /deep/ .el-form-item {
          margin: 0px;
        }

        .sure-specs-btn {
          margin-left: 45px;
          margin-right: 20px;
        }

        /deep/.el-button+.el-button {
          margin-left: 0px;
        }
      }


    }
  }
</style>
