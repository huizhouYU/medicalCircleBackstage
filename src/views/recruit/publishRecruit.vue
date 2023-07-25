<template>
  <div class="publish-recruit-box">
    <!-- <el-form ref="form" :model="form" label-width="100px"> -->
    <div class="term-box">
      <div class="bule-line"></div>
      <span>职位基本信息</span>
    </div>
    <div class="info-item-box">
      <div class="info-title">
        公司：
      </div>
      <span class="info-value">{{name}}</span>
    </div>
    <div class="info-item-box long-input-itme-box">
      <div class="info-title">
        <span class="red-font">*</span>
        招聘类型：
      </div>
      <el-select v-model="form.recruitType" placeholder="请选择招聘类型">
        <el-option label="社招" value="社招"></el-option>
        <el-option label="应届校园招聘" value="应届校园招聘"></el-option>
        <el-option label="实习生招聘" value="实习生招聘"></el-option>
        <el-option label="兼职招聘" value="兼职招聘"></el-option>
      </el-select>
    </div>
    <div class="info-item-box long-input-itme-box">
      <div class="info-title"><span class="red-font">*</span>
        职位类型：
      </div>
      <el-cascader placeholder="请选择职位类型" v-model="form.positionType" :options="options"></el-cascader>
    </div>
    <div class="info-item-box long-input-itme-box">
      <div class="info-title"><span class="red-font">*</span>
        职位名称：
      </div>
      <el-input v-model="form.name" maxlength="30" show-word-limit placeholder="请输入职位名称"></el-input>
    </div>
    <div class="info-item-box long-input-itme-box term-last-item">
      <div class="info-title"><span class="red-font">*</span>
        职位描述：
      </div>
      <el-input type="textarea" :rows="3" v-model="form.describe" placeholder="可以详细描述一下招聘的职位" minlength="10"
        maxlength="5000" show-word-limit @input="limitLength"></el-input>
    </div>
    <div class="term-box">
      <div class="bule-line"></div>
      <span>职位要求</span>
    </div>
    <div class="info-item-box short-input-itme-box">
      <div class="info-title"><span class="red-font">*</span>
        经验需求：
      </div>
      <el-select v-model="form.experience" placeholder="选择经验">
        <el-option label="经验不限" value="经验不限"></el-option>
        <el-option label="1年以内" value="1年以内"></el-option>
        <el-option label="1-3年" value="1-3年"></el-option>
        <el-option label="3-5年" value="3-5年"></el-option>
        <el-option label="5-10年" value="5-10年"></el-option>
        <el-option label="10年以上" value="10年以上"></el-option>
      </el-select>
    </div>
    <div class="info-item-box short-input-itme-box">
      <div class="info-title"><span class="red-font">*</span>
        最低学历：
      </div>
      <el-select v-model="form.education" placeholder="选择学历">
        <el-option label="学历不限" value="学历不限"></el-option>
        <el-option label="初中及以下" value="初中及以下"></el-option>
        <el-option label="中专/中技" value="中专/中技"></el-option>
        <el-option label="高中" value="高中"></el-option>
        <el-option label="大专" value="大专"></el-option>
        <el-option label="本科" value="本科"></el-option>
      </el-select>
    </div>
    <div class="info-item-box short-input-itme-box">
      <div class="info-title"><span class="red-font">*</span>
        薪资范围：
      </div>
      <div class="regional-restrictions-box">
        <el-select v-model="form.lowSalary" placeholder="最低薪资">
          <el-option v-for="(item,index) in 20" :label="item+'k'" :value="item" :disabled=" judgeShow(item)">
          </el-option>
        </el-select>
        <span class="line"></span>
        <el-select v-model="form.heighSalary" placeholder="最高薪资">
          <el-option v-for="(item,index) in 20" :label="item+'k'" :value="item" :disabled="item<=form.lowSalary">
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="info-item-box input-270-item-box">
      <div class="info-title"><span class="red-font">*</span>
        工作地区：
      </div>
      <el-cascader :props="areaDefaultParams" placeholder="请选择职位类型" v-model="form.area" :options="citysOptions">
      </el-cascader>
    </div>
    <div class="info-item-box input-380-item-box">
      <div class="info-title"><span class="red-font">*</span>
        详细地址：
      </div>
      <el-input v-model="form.address" placeholder="请输入"></el-input>
    </div>
    <div class="info-item-box input-270-item-box">
      <div class="info-title"><span class="red-font">*</span>
        联系人：
      </div>
      <el-input v-model="form.telPer" placeholder="请输入"></el-input>
    </div>
    <div class="info-item-box input-270-item-box">
      <div class="info-title">
        联系电话：
      </div>
      <el-input v-model="form.tel" placeholder="请输入联系电话"></el-input>
    </div>
    <div class="info-item-box info-item-center-box input-270-item-box">
      <div class="info-title"><span class="red-font">*</span>
        二维码：
      </div>
      <div class="input-img-box">
        <DragUpload :imgList="imgQrList" :limit="1" @allList="trialQrImgs" />
        <div class="tip">注：上传微信二维码用于求职者及时与您沟通职位，图片支持jpg/png格式，建议图片尺寸按照1：1上传</div>
      </div>
    </div>
    <div class="submit-box">
      <el-button type="primary" class="sub-btn" @click="submitForm">发布</el-button>
    </div>

  </div>
</template>

<script>
  import DragUpload from '../utils/DragUpload'
  const city = require("../../json/myNameCitys.json")
  import {
    mapGetters
  } from 'vuex'
  export default {
    components: {
      DragUpload
    },
    computed: {
      ...mapGetters([
        'sidebar',
        'avatar',
        'device',
        'name'
      ])
    },
    data() {
      return {
        imgQrList: '',
        form: {
          storeName: '', //公司名称
          recruitType: '', //招聘类型
          positionType: '', //职位类型
          name: '', //职位名称
          describe: '', //职位描述
          experience: '', //经验需求
          education: '', //学历
          lowSalary: '', //最低薪资
          heighSalary: '', //最高薪资
          area: "", //地区【建议按照省和市分开保存】
          address: '', //详细地址
          telPer: '', //联系人
          tel: '', //联系电话
          trialQrImgs: '', //二维码
        },
        areaDefaultParams: {
          label: "label",
          value: "label",
          children: "childer",
          multiple: false
        },
        citysOptions: [],
        options: [{
            value: '电子/通信',
            label: '电子/通信',
            children: [{
              value: '电子/半导体',
              label: '电子/半导体',
              children: [{
                  value: '电子工程师',
                  label: '电子工程师'
                },
                {
                  value: '电气设置工程师',
                  label: '电气设置工程师'
                },
                {
                  value: '集成电路IC设计',
                  label: '集成电路IC设计'
                },
                {
                  value: 'IC验证工程师',
                  label: 'IC验证工程师'
                }, {
                  value: '版图设计工程师',
                  label: '版图设计工程师'
                }
              ]
            }],
          },
          {
            value: '医院/临床医疗',
            label: '医院/临床医疗',
            children: [{
                value: '内科',
                label: '内科',
                children: [{
                    value: '普通内科',
                    label: '普通内科'
                  },
                  {
                    value: '消化内科',
                    label: '消化内科'
                  },
                ]
              },
              {
                value: '外科',
                label: '外科',
                children: [{
                    value: '普通外科',
                    label: '普通外科'
                  },
                  {
                    value: '神经内科',
                    label: '神经内科'
                  },
                ]
              }
            ],
          }
        ]

      }
    },
    mounted() {
      this.citysOptions = city
    },
    methods: {
      trialQrImgs(allList) {
        this.form.trialQrImgs = allList
      },
      judgeShow(i) {
        if (this.form.heighSalary != "") {
          return i >= this.form.heighSalary
        } else {
          return false
        }
      },

      limitLength(value) { //value 为获取到的输入框的值
        if (value.length < 10) {
          this.$el.querySelector('.el-textarea .el-input__count').style = 'color:red !important'
        } else {
          this.$el.querySelector('.el-textarea .el-input__count').style = 'color:#909399 !important'
        }
      },
      submitForm() {
        this.form.storeName = this.name
        if (this.checkForm()) {
          this.$message.success("模拟发布成功！")
        }
      },
      //检查数据是填写完整
      checkForm() {
        console.log(this.form)
        console.log(!this.form.trialQrImgs)
        console.log(this.form.trialQrImgs == "")
        console.log(this.form.trialQrImgs.length <= 0)
        if (!this.form.recruitType) {
          this.$message.error("请选择招聘类型！")
          return false
        } else if (!this.form.positionType) {
          this.$message.error("请选择职位类型！")
          return false
        } else if (!this.form.name) {
          this.$message.error("请输入职位名称！")
          return false
        } else if (!this.form.describe) {
          this.$message.error("请输入职位描述！")
          return false
        }else if(this.form.describe.length<10){
          this.$message.error("职位描述至少输入10个字！")
          return false
        } else if (!this.form.experience) {
          this.$message.error("请选择经验需求！")
          return false
        } else if (!this.form.education) {
          this.$message.error("请选择学历要求！")
          return false
        } else if (!this.form.lowSalary) {
          this.$message.error("请选择最低薪资！")
          return false
        } else if (!this.form.area) {
          this.$message.error("请选择工作地区！")
          return false
        } else if (!this.form.address) {
          this.$message.error("请输入详细地址！")
          return false
        } else if (!this.form.telPer) {
          this.$message.error("请输入联系人！")
          return false
        } else if (this.form.tel) {
          if (!this.isCellPhone(this.form.tel)) {
            this.$message.error("请输入正确的联系方式！")
            return false
          }
        }
        if (!this.form.trialQrImgs || this.form.trialQrImgs == "" || this.form.trialQrImgs.length <= 0) {
          this.$message.error("请上传二维码！")
          return false
        }

      },
      //校验手机号码
      isCellPhone(val) {
        if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(val)) {
          return false
        } else {
          return true
        }
      },

    }
  }
</script>

<style lang="less" scoped>
  @term-font-size: 12px;

  .publish-recruit-box {
    width: 100%;
    min-height: 100%;
    background-color: #FFFFFF;
    padding: 13px 15px 40px 15px;

    .term-box {
      margin-bottom: 32px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      font-size: @term-font-size;
      line-height: 12px;
      font-weight: bold;
      color: #1890FF;

      .bule-line {
        width: 2px;
        margin-right: 15px;
        height: 16px;
        border: 1px solid #1890FF;
      }
    }

    //每一项填写的公共样式

    .info-item-box {
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      margin-bottom: 25px;

      .info-title {
        width: 70px;
        height: 34px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        margin-right: 30px;
        font-size: 12px;
        line-height: 12px;
        font-weight: 400;
        color: #333333;

        .red-font {
          color: red;
          margin-right: 4px;
        }
      }

      .info-value {
        font-size: 12px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        font-weight: 400;
        color: #757575;
        height: 34px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
      }

      .regional-restrictions-box {
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .line {
          width: 10px;
          height: 1px;
          opacity: 0.7;
          border: 1px solid #707070;
          margin: 0px 12px;
        }
      }

      .input-img-box {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;

        .tip {
          margin-top: 6px;
          font-size: 12px;
          font-family: Microsoft YaHei-Regular, Microsoft YaHei;
          font-weight: 400;
          color: #BBBBBB;
        }
      }

      /deep/ .el-input--medium .el-input__inner {
        height: 34px;
      }
    }

    .info-item-center-box {
      align-items: center;
    }

    .term-last-item {
      margin-bottom: 78px;
    }

    .long-input-itme-box {

      /deep/ .el-input--medium {
        width: 500px;
      }
    }

    .short-input-itme-box {

      /deep/ .el-input--medium {
        width: 160px;
      }
    }

    .input-270-item-box {

      /deep/ .el-input--medium {
        width: 270px;
      }
    }

    .input-380-item-box {
      /deep/ .el-input--medium {
        width: 380px;
      }
    }

    .submit-box {
      display: flex;
      justify-content: center;
      align-items: center;

      .sub-btn {
        width: 92px;
        height: 34px;
      }
    }
  }
</style>
