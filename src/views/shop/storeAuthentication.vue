<template>
  <div class="box">

    <!-- 第一步:定义出4个步骤 -->
    <div v-show="!isLook" class="steps-content">
      <el-steps :active="active" finish-status="success">
        <el-step title="认证信息" />
        <el-step title="证明材料" />
        <el-step title="联系信息" />
      </el-steps>
    </div>

    <!-- 第二步:定义form表单 -->
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-position="right" label-width="110px"
      class="el-form-content ">
      <div v-show="isLook" class="sign">
        <i v-show="examineResult == '2'" class="iconfont" style="color: #FF7575">&#xe6cd;</i>
        <i v-show="examineResult == '0'" class="iconfont" style="color: #40A9FF">&#xe6ce;</i>
        <i v-show="examineResult == '1'" class="iconfont" style="color: #13ce66">&#xe6d1;</i>
      </div>
      <!-- 认证信息 -->
      <div v-show="active == 0 || isLook" :class="[{publicStepHeight:!isLook},'rz-info','public-step']">
        <div class="item-title">认证信息</div>
        <!-- 主体类型 -->
        <div class="item-both">
          <el-form-item label="主体类型：" prop="stype">
            <el-select v-model="ruleForm.stype" placeholder="请选择主体类型" @change="adjustLayout">
              <el-option v-for="item in shopTypeOption" :key="item.value" :label="item.label" :value="item.value"
                :disabled="isLook" />
            </el-select>
          </el-form-item>
          <div class="tip">注：主体类型设置后无法更改</div>
        </div>
        <div class="inpout-content">
          <el-form-item v-show="ruleForm.stype == 'personal'" label="真实姓名：" class="item-left">
            <el-input v-model="ruleForm.storeName" :disabled="isLook" />
          </el-form-item>
          <el-form-item v-show="ruleForm.stype == 'company'" label="企业名称：" class="item-left">
            <el-input v-model="ruleForm.storeName" placeholder="请与营业执照的公司名称保持一致" :disabled="isLook" />
          </el-form-item>
          <el-form-item label="店铺分类：" prop="categoryId" class="item-right">
            <el-select v-model="ruleForm.categoryId" placeholder="请选择店铺分类">
              <el-option v-for="item in shopSortOption" :key="item.cateId" :label="item.cateName" :value="item.cateId"
                :disabled="isLook" />
            </el-select>
          </el-form-item>
          <el-form-item label="身份证号码：" class="item-left">
            <el-input v-model="ruleForm.identityCard" :disabled="isLook" />
          </el-form-item>
          <el-form-item label="所属地区：" class="item-left" v-show="!isLook">
            <el-cascader v-model="ruleForm.regionId" :options="cities" :disabled="isLook" @change="changeFormat" ref="cascaderRegion"/>
          </el-form-item>
          <el-form-item label="所属地区：" class="item-left" v-show="isLook">
            <el-input v-model="ruleForm.regionName" placeholder="请选择所属地区" :disabled="isLook" />
          </el-form-item>
          <el-form-item label="详细地址：" prop="address" class="address-input">
            <el-input v-model="ruleForm.address" :disabled="isLook" placeholder="请填写详细的街道地址" />
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
        <el-form-item label="上传证件：" prop="name" class="">

          <div class="img-list">
            <!-- 身份证正面 -->
            <upload-one-img :mr-src="cardFront.cardImg" :title="cardFront.cardTitle" :imgUrl="ruleForm.identityFront" :remark="cardFront.cardRemark"
              @getImgFile="identityFrontImgFile" isLook="isLook"/>
            <!-- 身份证反面 -->
            <upload-one-img :mr-src="cardBack.cardImg" :title="cardBack.cardTitle" :imgUrl="ruleForm.identityBack"  :remark="cardBack.cardRemark"
              @getImgFile="identityBackImgFile"  isLook="isLook"/>
            <!-- 手持身份证 -->
            <upload-one-img v-show="ruleForm.stype == 'personal'" :mr-src="cardHold.cardImg" :title="cardHold.cardTitle" :imgUrl="ruleForm.identityHandle"
              :remark="cardHold.cardRemark" @getImgFile="identityHandleImgFile" isLook="isLook" />
            <!-- 其他证件 -->
            <upload-one-img v-show="ruleForm.stype == 'personal'" :mr-src="cardOther.cardImg"
              :title="cardOther.cardTitle" :imgUrl="ruleForm.otherCertificate"  :remark="cardOther.cardRemark" @getImgFile="otherCertificateImgFile" isLook="isLook" />
            <!-- 营业执照 -->
            <upload-one-img v-show="ruleForm.stype == 'company'" :mr-src="businessLicense.cardImg"
              :title="businessLicense.cardTitle" :imgUrl="ruleForm.businessLicense"  :remark="businessLicense.cardRemark"
              @getImgFile="businessLicenseImgFile" isLook="isLook" />
            <!-- 医疗器械生产许可证 -->
            <upload-one-img v-show="ruleForm.stype == 'company'" :mr-src="licenceOne.cardImg"
              :title="licenceOne.cardTitle" :imgUrl="ruleForm.productionLicense"  :remark="licenceOne.cardRemark" @getImgFile="productionLicenseImgFile" isLook="isLook" />
            <!-- 经营许可证 -->
            <upload-one-img v-show="ruleForm.stype == 'company'" :mr-src="licenceTwo.cardImg"
              :title="licenceTwo.cardTitle" :imgUrl="ruleForm.businessCertificate"  :remark="licenceTwo.cardRemark" @getImgFile="businessCertificateImgFile" isLook="isLook" />
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
        <el-form-item label="联系人：" class="phone-input">
          <el-input v-model="ruleForm.ownerName" placeholder="请输入联系人" :disabled="isLook" />
        </el-form-item>
        <!-- 联系电话 -->
        <el-form-item label="联系电话：" prop="tel" class="phone-input">
          <el-input v-model="ruleForm.tel" placeholder="请输入联系方式" :disabled="isLook" />
        </el-form-item>
        <!-- 验证码 -->
        <el-form-item v-show="!isLook" label="验证码：" prop="vCode" class="vcode-input">
          <el-input v-model="ruleForm.vCode" placeholder="请填写" />
          <el-button class="getVcode-btn" type="primary" plain :disabled="!show" @click="getVcode">
            <span v-show="show">获取验证码</span>
            <span v-show="!show" class="count">{{ count }} s</span>
          </el-button>
        </el-form-item>
        <!-- 上一步 下一步 -->
        <div v-show="!isLook" class="item-btn lx-btn-pre-sub">
          <el-button class="public-el-submit-btn pre-but" @click="pre">上一步</el-button>
          <el-button class="public-el-submit-btn" type="primary" plain @click="submitForm('ruleForm')">确认提交</el-button>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
  import {
    storeCategoryList,
    storeApply,
    storeDetail
  } from '@/api/shop'
  import {
    uploadImage
  } from '@/api/public'
  const city = require("../../../src/json/citys.json")

  import UploadOneImg from '../shop/uploadOneImg.vue'
  export default {
    components: {
      UploadOneImg
    },
    data() {
      var checkphone = (rule, value, callback) => {
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
          cardImg: require('../../assets/images/pic_card_z.png'),
          cardTitle: '身份证正面',
          cardRemark: '请上传本人（法人）身份证原件图'
        },
        cardBack: {
          cardImg: require('../../assets/images/pic_card_f.png'),
          cardTitle: '身份证反面',
          cardRemark: '请上传本人（法人）身份证原件图'
        },
        cardHold: {
          cardImg: require('../../assets/images/pic_card_s.png'),
          cardTitle: '手持身份证',
          cardRemark: '请上传手持身份证'
        },
        cardOther: {
          cardImg: require('../../assets/images/pic_card_other.png'),
          cardTitle: '其他证件',
          cardRemark: '请上传证件原件图'
        },
        businessLicense: {
          cardImg: require('../../assets/images/pic_card_other.png'),
          cardTitle: '营业执照',
          cardRemark: '请上传企业营业执照原件图'
        },
        licenceOne: {
          cardImg: require('../../assets/images/pic_card_other.png'),
          cardTitle: '医疗器械生产许可证',
          cardRemark: '请上传企业医疗器械生产许可证原件图，如果是医疗器械生产企业必传'
        },
        licenceTwo: {
          cardImg: require('../../assets/images/pic_card_other.png'),
          cardTitle: '经营许可证',
          cardRemark: '请上传企业经营许可证原件图，如果是医疗器械生产企业必传'
        },
        active: 0,
        // 主体类型选项
        shopTypeOption: [{
          value: 'personal',
          label: '个人工程师'
        }, {
          value: 'company',
          label: '企业'
        }, ],
        // 所属分类选项
        shopSortOption: [],
        //图片上传之前，file保存的集合
        imgFile: {
          identityFront: '', //身份证正面
          identityBack: '', //身份证背面
          identityHandle: '', //手持身份证，个人工程师必传
          businessCertificate: '', //经营许可证，如果是代理商企业必传
          businessLicense: '', //营业执照
          productionLicense: '', //生产许可证，如果是生产企业必传
          otherCertificate: '', //其他证件
        },
        ruleForm: {
          stype: 'company', // 主体类型:店铺类型 personal-个人 company-企业,示例值(company)
          storeName: '', // 个人工程师：姓名；企业：企业姓名
          identityCard: '', //身份证,示例值(340111199901019876)
          categoryId: '', // 所属分类
          regionId: '', // 所在地区
          regionName:'',//所在地区名称
          address: '', // 详细地址
          identityFront: '', //身份证正面
          identityBack: '', //身份证背面
          identityHandle: '', //手持身份证，个人工程师必传
          businessCertificate: '', //经营许可证，如果是代理商企业必传
          businessLicense: '', //营业执照
          productionLicense: '', //生产许可证，如果是生产企业必传
          otherCertificate: '', //其他证件


          // identityFront: '', // 身份证正面
          // cardBack: '', // 身份证反面
          // engineer: {
          //   idNo: '', // 身份证号码
          //   cardHold: '', // 手持身份证
          //   cardOther: '' // 其他证件
          // },
          // business: {
          //   businessLicense: '', // 营业执照
          //   licenceOne: '', // 许可证
          //   licenceTwo: '' // 许可证
          // },
          ownerName: '', //联系人
          tel: '', // 联系电话
          vCode: '' // 验证码
        },
        rules: {
          // stype: [
          //   {
          //   required: true,
          //   message: '请选择主体类型',
          //   trigger: 'change'
          // }],
          // storeName: [{
          //   required: true,
          //   message: '请输入真实姓名',
          //   trigger: 'blur'
          // }],
          // idNo: [{
          //   required: true,
          //   message: '请输入身份证号码',
          //   trigger: 'blur'
          // }],
          //   {
          //     min: 3,
          //     max: 5,
          //     message: '长度在 3 到 5 个字符',
          //     trigger: 'blur'
          //   }
          // ],
          tel: [{
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
      this.getData()
    },
    methods: {
      getData() {
        //获取店铺分类
        storeCategoryList().then(response => {
          this.shopSortOption = response.data.data
        })
        //获取地区
        this.cities = city
        //获取店铺详情
        this.getStoreDetail()
      },
      //获取店铺详情
      getStoreDetail(){
        storeDetail().then(response => {
          if(response.data.data != null){
            this.ruleForm = response.data.data
            // this.isLook = true
            // 店铺状态 0-待审核 1-审核成功 2-审核失败
            this.examineResult = response.data.data.state
          }
        })
      },
      //身份证正面
      identityFrontImgFile(file) {
        console.log(file)
        this.imgFile.identityFront = file
      },
      //身份证反面
      identityBackImgFile(file) {
        this.imgFile.identityBack = file
      },
      //手持身份证，个人工程师必传
      identityHandleImgFile(file) {
        this.imgFile.identityHandle = file
      },
      //其他证件
      otherCertificateImgFile(file) {
        this.imgFile.otherCertificate = file
      },
      //营业执照
      businessLicenseImgFile(file) {
        this.imgFile.businessLicense = file
      },
      //生产许可证，如果是生产企业必传
      productionLicenseImgFile(file) {
        this.imgFile.productionLicense = file
      },
      //经营许可证，如果是代理商企业必传
      businessCertificateImgFile(file) {
        this.imgFile.businessCertificate = file
      },
      // 根据选择的主体类型不同，显示不同的信息,清空数据
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
      // showCardFrontDiv() {
      //   this.isShowCardFrontDiv = true
      // },
      // hideCardFrontDiv() {
      //   this.isShowCardFrontDiv = false
      // },
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
            if (this.checkData()) {
              //提交数据到后台： 先提交证明材料，再表单提交
              this.postData()
              alert('submit!')
            }

          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      changeFormat() {
        console.log(this.$refs["cascaderRegion"])
        if(this.$refs["cascaderRegion"].getCheckedNodes()[0] != undefined){
          let regionName = this.$refs["cascaderRegion"].getCheckedNodes()[0].pathLabels
          this.ruleForm.regionName = regionName.join("/")
          console.log("jjj", JSON.stringify(this.ruleForm.regionName))
        }

      },
      async postData() {
        //上传身份证正面
        if (this.imgFile.identityFront != '') {
          let param = new FormData(); //创建form对象
          param.append('file', this.imgFile.identityFront); //通过append向form对象添加数据
          await uploadImage(param).then(response => {
            this.ruleForm.identityFront = response.data.data
          })
        }
        //上传身份证反面
        if (this.imgFile.identityBack != '') {
          let param = new FormData(); //创建form对象
          param.append('file', this.imgFile.identityBack); //通过append向form对象添加数据
          await uploadImage(param).then(response => {
            this.ruleForm.identityBack = response.data.data
          })
        }
        //上传手持身份证【个人工程师】
        if (this.ruleForm.stype == 'personal' && this.imgFile.identityHandle != '') {
          let param = new FormData(); //创建form对象
          param.append('file', this.imgFile.identityHandle); //通过append向form对象添加数据
          await uploadImage(param).then(response => {
            this.ruleForm.identityHandle = response.data.data
          })
        }
        //上传其他证件【个人工程师】
        if (this.ruleForm.stype == 'personal' && this.imgFile.otherCertificate != '') {
          let param = new FormData(); //创建form对象
          param.append('file', this.imgFile.otherCertificate); //通过append向form对象添加数据
          await uploadImage(param).then(response => {
            this.ruleForm.otherCertificate = response.data.data
          })
        }
        //经营许可证【企业】
        if (this.ruleForm.stype == 'company' && this.imgFile.businessCertificate != '') {
          let param = new FormData(); //创建form对象
          param.append('file', this.imgFile.businessCertificate); //通过append向form对象添加数据
          await uploadImage(param).then(response => {
            this.ruleForm.businessCertificate = response.data.data
          })
        }
        //营业执照【企业】
        if (this.ruleForm.stype == 'company' && this.imgFile.businessLicense != '') {
          let param = new FormData(); //创建form对象
          param.append('file', this.imgFile.businessLicense); //通过append向form对象添加数据
          await uploadImage(param).then(response => {
            this.ruleForm.businessLicense = response.data.data
          })
        }
        //生产许可证【企业】
        if (this.ruleForm.stype == 'company' && this.imgFile.productionLicense != '') {
          let param = new FormData(); //创建form对象
          param.append('file', this.imgFile.productionLicense); //通过append向form对象添加数据
          await uploadImage(param).then(response => {
            this.ruleForm.productionLicense = response.data.data
          })
        }
        console.log("证件上传后数据：", this.ruleForm)
        console.log("要上传的数据：", JSON.stringify(this.ruleForm))
        await storeApply(JSON.stringify(this.ruleForm)).then(response => {
          console.log(response.data.data)
          if(response.data.code == 10000){
            this.$message.success("提交成功！")
          }else{
            this.$message.success(response.data.message)
          }
        })
      },
      checkData() {
        if (this.ruleForm.stype == null || this.ruleForm.stype == '') {
          this.$message.error('请选择【认证信息】主体类型！')
          return false
        }
        if (this.ruleForm.stype == 'company') {
          if (this.ruleForm.storeName == null || this.ruleForm.storeName == '') {
            this.$message.error('请填写【认证信息】企业名称！')
            return false
          }
        }
        if (this.ruleForm.stype == 'personal') {
          if (this.ruleForm.storeName == null || this.ruleForm.storeName == '') {
            this.$message.error('请填写【认证信息】真实姓名！')
            return false
          }
        }
        if (this.ruleForm.identityCard == null || this.ruleForm.identityCard == '') {
          this.$message.error('请填写【认证信息】身份证号码！')
          return false
        }
        if (this.ruleForm.categoryId == null || this.ruleForm.categoryId == '') {
          this.$message.error('请选择【认证信息】店铺分类！')
          return false
        }
        if (this.ruleForm.regionId.length < 1) {
          this.$message.error('请选择【认证信息】所在地区！')
          return false
        }
        if (this.ruleForm.address == null || this.ruleForm.address == '') {
          this.$message.error('请上传【认证信息】详细地址！')
          return false
        }
        if (this.imgFile.identityFront == null || this.imgFile.identityFront == '') {
          this.$message.error('请上传【证明材料】身份证正面！')
          return false
        }
        if (this.imgFile.identityBack == null || this.imgFile.identityBack == '') {
          this.$message.error('请上传【证明材料】身份证反面！')
          return false
        }
        if (this.ruleForm.stype == 'personal') {
          if (this.imgFile.identityHandle == null || this.imgFile.identityHandle == '') {
            this.$message.error('请上传【证明材料】手持身份证！')
            return false
          }
        }
        if (this.ruleForm.stype == 'company') {
          if (this.imgFile.businessLicense == null || this.imgFile.businessLicense == '') {
            this.$message.error('请上传【证明材料】营业执照！')
            return false
          }
          if (this.imgFile.productionLicense == null || this.imgFile.productionLicense == '') {
            this.$message.error('请上传【证明材料】生产许可证！')
            return false
          }
          if (this.imgFile.businessCertificate == null || this.imgFile.businessCertificate == '') {
            this.$message.error('请上传【证明材料】经营许可证！')
            return false
          }
        }
        if (this.ruleForm.tel == null || this.ruleForm.tel == '') {
          this.$message.error('请填写【联系信息】联系方式！')
          return false
        }
        if (this.ruleForm.tel == null || this.ruleForm.tel == '') {
          this.$message.error('请填写【联系信息】短信验证码！')
          return false
        }
        return true
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

    /deep/ .el-step__title {
      font-weight: bold;
    }

    /deep/ .el-step__line {
      border-top: 1px dashed;
    }

    /deep/ .el-step__head.is-process {
      color: #ccc;
    }

    /deep/ .el-step__icon.is-text {
      border: 1px solid;
    }

    /deep/ .el-step__title.is-process {
      // font-weight: 700;
      color: #999999;
    }

    /deep/ .el-step__head.is-success,
    /deep/ .el-step__title.is-success {
      color: #1890FF;
      border-color: #1890FF;
    }

    /deep/ .el-step__head.is-success .is-text {
      background-color: #1890FF;

      .el-step__icon-inner {
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

    // margin-right: 10px;
    /deep/.el-form-item__label {
      padding-right: 25px;
    }

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
