<template>
  <div class="box">

    <!-- 第一步:定义出4个步骤 -->
    <div v-show="!isLook" class="steps-content">
      <!-- <el-steps :active="active"  finish-status="success">
        <el-step title="认证信息" />
        <el-step title="证明材料" />
        <el-step title="联系信息" />
      </el-steps> -->
      <el-steps :active="active" finish-status="success">
        <el-step title="认证信息" />
        <el-step title="证明材料" />
        <el-step title="联系信息" />
      </el-steps>
    </div>

    <!-- 第二步:定义form表单 -->
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-position="left"
      label-width="100px"
      class="el-form-content "
    >
      <div v-show="isLook" class="sign">
        <i v-show="examineResult == '0'" class="iconfont" style="color: #FF7575">&#xe6cd;</i>
        <i v-show="examineResult == '-1'" class="iconfont" style="color: #40A9FF">&#xe6ce;</i>
        <i v-show="examineResult == '1'" class="iconfont" style="color: #13ce66">&#xe6d1;</i>
      </div>
      <!-- 认证信息 -->
      <div v-show="active == 0 || isLook" :class="[{publicStepHeight:!isLook},'rz-info','public-step']">
        <div class="item-title">认证信息</div>
        <!-- 主体类型 -->
        <div class="item-both">
          <el-form-item label="主体类型" prop="shopType">
            <el-select v-model="ruleForm.shopType" placeholder="请选择主体类型" @change="adjustLayout">
              <el-option v-for="item in shopTypeOption" :key="item.value" :label="item.label" :value="item.value" :disabled="isLook" />
            </el-select>
          </el-form-item>
          <div class="tip">注：主体类型设置后无法更改</div>
        </div>
        <div class="inpout-content">
          <el-form-item v-show="ruleForm.shopType == 1" label="真实姓名" prop="name" class="item-left">
            <el-input v-model="ruleForm.name" :disabled="isLook" />
          </el-form-item>
          <el-form-item v-show="ruleForm.shopType == 2" label="企业名称" prop="name" class="item-left">
            <el-input v-model="ruleForm.name" placeholder="请与营业执照的公司名称保持一致" :disabled="isLook" />
          </el-form-item>
          <el-form-item v-show="ruleForm.shopType == 1" label="身份证号码" prop="idNo" class="item-right">
            <el-input v-model="ruleForm.engineer.idNo" :disabled="isLook" />
          </el-form-item>
          <el-form-item label="店铺名称" prop="shopName" class="item-left">
            <el-input v-model="ruleForm.shopName" :disabled="isLook" />
          </el-form-item>
          <el-form-item label="所属分类" prop="shopSort" class="item-right">
            <el-select v-model="ruleForm.shopSort" placeholder="请选择所属分类">
              <el-option v-for="item in shopSortOption" :key="item.value" :label="item.label" :value="item.value" :disabled="isLook" />
            </el-select>
          </el-form-item>
          <el-form-item label="所属地区" prop="area" class="item-left">
            <el-cascader v-model="ruleForm.areaValue" :options="cities" :disabled="isLook" />
          </el-form-item>
          <el-form-item label="邮政编码" prop="postalCode" class="item-right">
            <el-input v-model="ruleForm.postalCode" :disabled="isLook" />
          </el-form-item>
          <el-form-item label="详细地址" prop="address" class="address-input">
            <el-input v-model="ruleForm.address" :disabled="isLook" />
          </el-form-item>
        </div>
        <!-- 下一步 -->
        <div v-show="!isLook" class="item-btn">
          <el-button class="public-el-submit-btn" type="primary" plain @click="next">下一步</el-button>
        </div>
      </div>
      <!-- 证明材料 -->
      <div v-show="active == 1 || isLook" :class="[{publicStepHeight:!isLook},'zm-info','public-step']">
        <div class="item-title">证明材料</div>
        <!-- 上传证件 -->
        <el-form-item label="上传证件" prop="name" class="">

          <div class="img-list">
            <!-- 身份证正面 -->
            <upload-one-img :mr-src="cardFront.cardImg" :title="cardFront.cardTitle" :remark="cardFront.cardRemark" />
            <!-- 身份证反面 -->
            <upload-one-img :mr-src="cardBack.cardImg" :title="cardBack.cardTitle" :remark="cardBack.cardRemark" />
            <!-- 手持身份证 -->
            <upload-one-img
              v-show="ruleForm.shopType == 1"
              :mr-src="cardHold.cardImg"
              :title="cardHold.cardTitle"
              :remark="cardHold.cardRemark"
            />
            <!-- 其他证件 -->
            <upload-one-img
              v-show="ruleForm.shopType == 1"
              :mr-src="cardOther.cardImg"
              :title="cardOther.cardTitle"
              :remark="cardOther.cardRemark"
            />
            <!-- 营业执照 -->
            <upload-one-img
              v-show="ruleForm.shopType == 2"
              :mr-src="businessLicense.cardImg"
              :title="businessLicense.cardTitle"
              :remark="businessLicense.cardRemark"
            />
            <!-- 医疗器械生产许可证 -->
            <upload-one-img
              v-show="ruleForm.shopType == 2"
              :mr-src="licenceOne.cardImg"
              :title="licenceOne.cardTitle"
              :remark="licenceOne.cardRemark"
            />
            <!-- 医疗器械生产许可证 -->
            <upload-one-img
              v-show="ruleForm.shopType == 2"
              :mr-src="licenceTwo.cardImg"
              :title="licenceTwo.cardTitle"
              :remark="licenceTwo.cardRemark"
            />

          </div>
        </el-form-item>
        <!-- 上一步 下一步 -->
        <div v-show="!isLook" class="item-btn zm-btn-pre-next">
          <el-button class="public-el-submit-btn pre-but" @click="pre">上一步</el-button>
          <el-button class="public-el-submit-btn" type="primary" plain @click="next">下一步</el-button>
        </div>

      </div>
      <!-- 联系信息 -->
      <div v-show="active == 2 || isLook" :class="[{publicStepHeight:!isLook},'lx-info','public-step']">
        <div class="item-title">联系信息</div>
        <!-- 联系电话 -->
        <el-form-item label="联系电话" prop="phone" class="phone-input">
          <el-input v-model="ruleForm.phone" placeholder="请与身份证姓名保持一致" :disabled="isLook" />
        </el-form-item>
        <!-- 验证码 -->
        <el-form-item v-show="!isLook" label="验证码" prop="vCode" class="vcode-input">
          <el-input v-model="ruleForm.vCode" placeholder="请填写" />
          <el-button class="getVcode-btn" type="primary" plain :disabled="!show" @click="getVcode">
            <span v-show="show">获取验证码</span>
            <span v-show="!show" class="count">{{ count }} s</span>
          </el-button>
        </el-form-item>
        <!-- 上一步 下一步 -->
        <div v-show="!isLook" class="item-btn lx-btn-pre-sub">
          <el-button class="public-el-submit-btn pre-but" @click="pre">上一步</el-button>
          <el-button class="public-el-submit-btn" type="primary" plain @click="submitForm">确认提交</el-button>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios'
import UploadOneImg from '../shop/uploadOneImg.vue'
export default {
  components: {
    UploadOneImg
  },
  data() {
    var checkphone = (rule, value, callback) => {
      // let phoneReg = /(^1[3|4|5|6|7|8|9]\d{9}$)|(^09\d{8}$)/;
      if (value === '') {
        callback(new Error('请输入手机号'))
      } else if (!this.isCellPhone(value)) {
        // 引入methods中封装的检查手机格式的方法
        callback(new Error('请输入正确的手机号!'))
      } else {
        callback()
      }
    }
    return {
      examineResult: '-1', // 审核状态
      cities: [],
      isLook: false, // 是否查看
      show: true,
      count: '',
      cardFront: {
        cardImg: '../../../public/imgs/sjrz/pic_card_z.png',
        cardTitle: '身份证正面',
        cardRemark: '请上传本人（法人）身份证原件图'
      },
      cardBack: {
        cardImg: '../../../public/imgs/sjrz/pic_card_f.png',
        cardTitle: '身份证反面',
        cardRemark: '请上传本人（法人）身份证原件图'
      },
      cardHold: {
        cardImg: '../../../public/imgs/sjrz/pic_card_s.png',
        cardTitle: '手持身份证',
        cardRemark: '请上传手持身份证'
      },
      cardOther: {
        cardImg: '../../../public/imgs/sjrz/pic_card_other.png',
        cardTitle: '其他证件',
        cardRemark: '请上传证件原件图'
      },
      businessLicense: {
        cardImg: '../../../public/imgs/sjrz/pic_card_other.png',
        cardTitle: '营业执照',
        cardRemark: '请上传企业营业执照原件图'
      },
      licenceOne: {
        cardImg: '../../../public/imgs/sjrz/pic_card_other.png',
        cardTitle: '医疗器械生产许可证',
        cardRemark: '请上传企业医疗器械生产许可证原件图，如果是医疗器械生产企业必传'
      },
      licenceTwo: {
        cardImg: '../../../public/imgs/sjrz/pic_card_other.png',
        cardTitle: '医疗器械生产许可证',
        cardRemark: '请上传企业医疗器械生产许可证原件图，如果是医疗器械生产企业必传'
      },

      isShowCardFrontDiv: false, // 是否展示【身份证正面】隐藏div
      active: 0,
      // 主体类型选项
      shopTypeOption: [{
        value: '1',
        label: '个人工程师'
      },
      {
        value: '2',
        label: '企业'
      }
      ],
      // 所属分类选项
      shopSortOption: [{
        value: '1',
        label: '分类一'
      },
      {
        value: '2',
        label: '分类二'
      }
      ],
      ruleForm: {
        shopType: '1', // 主体类型
        name: '', // 个人工程师：姓名；企业：企业姓名
        shopName: '', // 店铺名称
        shopSort: '', // 所属分类
        areaValue: [], // 所在地区
        postalCode: '', // 邮政编码
        address: '', // 详细地址
        cardFront: '1', // 身份证正面
        cardBack: '', // 身份证反面
        engineer: {
          idNo: '', // 身份证号码
          cardHold: '', // 手持身份证
          cardOther: '' // 其他证件
        },
        business: {
          businessLicense: '', // 营业执照
          licenceOne: '', // 许可证
          licenceTwo: '' // 许可证
        },
        phone: '', // 联系电话
        vCode: '' // 验证码
      },
      rules: {
        shopType: [{
          required: true,
          message: '请选择主体类型',
          trigger: 'change'
        }],
        name: [{
          required: true,
          message: '请输入真实姓名',
          trigger: 'blur'
        }],
        idNo: [{
          required: true,
          message: '请输入身份证号码',
          trigger: 'blur'
        }],
        shopName: [{
          required: true,
          message: '请输入店铺名称',
          trigger: 'blur'
        },
        {
          min: 3,
          max: 5,
          message: '长度在 3 到 5 个字符',
          trigger: 'blur'
        }
        ],
        phone: [{
          required: true,
          validator: checkphone,
          trigger: 'blur'
        }],
        vCode: [{
          required: true,
          message: '请输入验证码',
          trigger: 'blur'
        }]

      }
    }
  },
  mounted() {
    axios.get('../../../static/testData/citys.json').then(res => {
      console.log(res)
      if (res.status == 200) {
        this.cities = res.data
      } else {
        this.$message.error('数据请求失败，请稍后再试！')
      }
    })
  },
  methods: {
    // 根据选择的主体类型不同，显示不同的信息
    adjustLayout() {
      // if(this.ruleForm.shopType == 1){
      // }
    },
    isCellPhone(val) {
      if (!/^1(3|4|5|6|7|8)\d{9}$/.test(val)) {
        return false
      } else {
        return true
      }
    },
    showCardFrontDiv() {
      this.isShowCardFrontDiv = true
    },
    hideCardFrontDiv() {
      this.isShowCardFrontDiv = false
    },
    // 步骤条下一步的方法
    next() {
      if (this.active++ > 2) this.active = 0
      // if (this.active++ > 3) this.active = 1
    },
    // 步骤条上一步的方法
    pre() {
      if (this.active-- < 2) this.active = 0
    },
    // 获取验证码
    getVcode() {
      // axios请求
      console.log(this.ruleForm.phone)
      // 验证码倒计时
      if (!this.timer) {
        this.count = 60
        this.show = false
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= 60) {
            this.count--
          } else {
            this.show = true
            clearInterval(this.timer)
            this.timer = null
          }
        }, 1000)
      }
    },
    // 提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }

  }
}
</script>

<style scoped lang="less">
  .box {
    height: 100%;
  }

  /deep/.el-step__line {
    background: transparent;
    border-top: 2px dotted;

    .el-step__line-inner {
      border-width: 0 !important;
    }
  }

  /deep/ .el-step__icon {
    font-size: 12px;
  }

  /deep/ .el-step__title {
    font-size: 12px;
  }

  .steps-content {
    height: 74px;
    width: 100%;
    display: flex;
    align-items: center;
    background-color: #fff;
    box-shadow: 0px 2px 10px 1px rgba(0, 0, 0, 0.06);
    border-radius: 6px 6px 6px 6px;
    box-sizing: border-box;
    padding: 10px 20px;
    margin-bottom: 20px;

    .el-steps {
      width: 100%;
    }
    /deep/ .el-step__title{
      font-weight: bold;
    }
    /deep/ .el-step__line{
      border-top:1px dashed;
    }
    /deep/ .el-step__head.is-process{
      color: #ccc;
    }
    /deep/ .el-step__icon.is-text{
      border: 1px solid;
    }
    /deep/ .el-step__title.is-process{
      // font-weight: 700;
      color: #999999;
    }
    /deep/ .el-step__head.is-success,
    /deep/ .el-step__title.is-success{
      color: #1890FF;
      border-color: #1890FF;
    }
    /deep/ .el-step__head.is-success .is-text{
      background-color: #1890FF;
      .el-step__icon-inner{
        color: #fff;
      }

    }
  }

  //表单
  .el-form-content {
    position: relative;
    width: 100%;
    // margin-top: 20px;
    height: calc(100% - 80px);
    font-size: 12px;
    font-family: Microsoft YaHei-Bold, Microsoft YaHei;

    //审核章
    .sign {
      width: 80px;
      height: 80px;
      position: absolute;
      top: 40px;
      left: 670px;
      z-index: 2;

      .iconfont {
        font-size: 50px;
      }
    }

    .publicStepHeight {
      height: calc(100% - 20px);
    }

    // 分步公共样式[高度,背景颜色]
    .public-step {
      background-color: #fff;
      border-radius: 6px;
      box-sizing: border-box;
      padding: 20px 15px;
      overflow: auto;
    }

    //分步公共的步骤名称样式
    .item-title {
      border-left: 2px solid #1890FF;
      font-weight: bold;
      color: #1890FF;
      padding-left: 15px;
      margin-bottom: 30px;
    }

    // 分步公共的修改input输入框的高度
    /deep/ .el-input__inner {
      height: 34px;
      line-height: 34px;
    }

    // 分步公共的修改input输入框的字体大小和颜色
    /deep/ .el-input {
      width: 270px;
      font-size: 12px;
      font-family: Microsoft YaHei-Bold, Microsoft YaHei;
      color: #333333;
    }

    // 分步公共的"上一步","下一步"按钮
    .item-btn {
      margin-top: 100px;
      display: flex;
      justify-content: center;
      align-items: center;

      .pre-but {
        margin-right: 40px;
      }

    }

    // 认证信息
    .rz-info {
      /deep/ .el-form-item__label {
        font-size: 12px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        font-weight: 400;
        color: #333333;
      }

      /deep/ .el-form-item__content {
        line-height: 34px;
        box-sizing: border-box;
      }

      .address-input /deep/ .el-input {
        width: 380px;
      }

      .inpout-content {
        display: grid;
        grid-template-columns: repeat(2, 398px);
      }

      // 一行放两个输入框
      .item-both {
        display: flex;
        justify-content: flex-start;

        /deep/ .el-select {
          width: 100%;
        }

        .item-left {
          flex: 1;
          box-sizing: border-box;
        }

        .item-right {
          flex: 2;
          box-sizing: border-box;
        }

        // 右边的布局
        .item-right {
          margin-left: 30px;
        }

        .tip {
          display: flex;
          align-items: center;
          margin-left: 15px;
          font-size: 12px;
          font-family: Microsoft YaHei-Regular, Microsoft YaHei;
          font-weight: 400;
          color: #999999;
          margin-bottom: 28px;
          box-sizing: border-box;
        }
      }

    }

    // 证明材料
    .zm-info {

      // 四张上传图片列表
      .img-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, 460px);
        justify-content: flex-start;
        grid-row-gap: 40px;

      }

      // 第二步 【证明材料】下面的按钮距离上面的高度
      .zm-btn-pre-next {
        margin-top: 120px;
      }
    }

    //联系信息
    .lx-info {
      .phone-input {
        /deep/ .el-input {
          width: 300px;
        }
      }

      .vcode-input {
        /deep/ .el-form-item__content {
          display: flex;
          align-items: center;
        }

        /deep/ .el-input {
          width: 100px;
        }

        .getVcode-btn {
          margin-left: 30px;
          height: 34px;
          font-size: 12px;
          font-family: Microsoft YaHei-Regular, Microsoft YaHei;
          font-weight: 400;
        }
      }

      .lx-btn-pre-sub {
        margin-top: 200px;
      }
    }
  }
</style>
