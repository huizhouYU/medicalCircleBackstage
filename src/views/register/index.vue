<template>
  <div class="login-container">
    <vue-particles class="login-bg" color="#fff" :particleOpacity="0.7" :particlesNumber="60" shapeType="circle"
      :particleSize="4" linesColor="#cfdbe3" :linesWidth="1" :lineLinked="true" :lineOpacity="0.4" :linesDistance="150"
      :moveSpeed="3" :hoverEffect="true" hoverMode="grab" :clickEffect="true" clickMode="push">
    </vue-particles>
    <div class="left">
      <img src="../../../public/imgs/login/register-bg.png" alt="" class="registerBgImg">
    </div>
    <div class="right">
      <!-- <div :class="[{flipLogin:isRegister},'login-content','public-content']"> -->
      <!-- <div class="login-content public-content">

      </div> -->
      <!-- 注册 -->
      <div class=" flipRegister register-content public-content">
        <div class="owl" id="owl" :class="[{password:isHide},'owl']">
          <div class="hand"></div>
          <div class="hand hand-r"></div>
          <div class="arms">
            <div class="arm"></div>
            <div class="arm arm-r"></div>
          </div>
        </div>
        <span class="form-title">欢迎注册</span>
        <div class="checking">
          <el-form label-position="top" label-width="80px" :model="registerForm" class="modular-form" ref="registerForm"
            :rules="registerRules">
            <el-form-item label="" class="form-label" prop="mobile">
              <el-input v-model="registerForm.mobile" placeholder="请输入手机号" :disabled="!showRegisterGetVCode" oninput ="value=value.replace(/[^\d]/g,'')" clearable>
                <template #prefix>
                  <div class="prefix"><img src="../../../public/imgs/login/user.png" alt=""></div>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="" prop="activation" style="display: none;">
              <el-input v-model="registerForm.activation">
              </el-input>
            </el-form-item>
            <div class="getCode-item">
              <el-form-item label="" class="form-label" prop="captcha">
                <el-input v-model="registerForm.captcha" placeholder="请输入验证码" oninput ="value=value.replace(/[^\d]/g,'')" clearable>
                  <template #prefix>
                    <div class="prefix"><img src="../../../public/imgs/login/shield.png" alt=""></div>
                  </template>
                </el-input>
              </el-form-item>
              <span v-show="showRegisterGetVCode" @click="getVCode">获取验证码</span>
              <span v-show="!showRegisterGetVCode" class="countDown">{{registerCount}} s</span>
            </div>
            <!-- 《用户服务协议》 -->
            <div class="agree-item">
              <div class="agree-left">
                <el-checkbox label="我已阅读同意" v-model="isAgree"></el-checkbox>
                <a class="agreement" target="_brank" href="http://www.yijiequan.com/#/residencyAgreement" >《用户服务协议》</a>
              </div>
              <span class="login-left" @click="login">立即登录</span>
            </div>
            <el-button type="primary" round class="from-btn" :class="[{greyBtn:!isAgree},'from-btn']"
              @click="immedRegister('registerForm')">注册</el-button>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    validUsername
  } from '@/utils/validate'
  import {
    registerMsg
  } from '@/api/user'
import utils from'../../utils/get-url-key.js'//获取url中参数
  export default {
    name: 'register',
    data() {
      const validateUsername = (rule, value, callback) => {
        // if (!validUsername(value)) {
        if (value.trim().length < 0) {
          callback(new Error('请输入用户名'))
        } else {
          callback()
        }
      }
      const validatePassword = (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error('请输入密码'))
        } else {
          callback()
        }
      }
      var validatePhone = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入手机号'))
        } else if (!this.isCellPhone(
            value)) { // 引入methods中封装的检查手机格式的方法 callback(new Error('请输入正确的手机号!'))          } else {
          callback(new Error('请输入正确的手机号!'))
        } else {
          callback()
        }
      }
      var validateVerCode = (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error('请输入验证码'))
        } else {
          callback()
        }
      }
      var validatePhoneCode = (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error('请输入短信验证码'))
        } else {
          callback()
        }
      }
      return {
        registerCount: '', //获取验证码倒计时【注册页】
        showRegisterGetVCode: true, //是否显示获取验证码【注册页】
        isHide: false,
        //登录
        registerForm: {
          mobile: '',
          captcha: '',
          activation:''
        },
        registerRules: {
          mobile: [{
            required: true,
            trigger: 'blur',
            validator: validatePhone
          }],
          captcha: [{
            required: true,
            message: '请输入短信验证码',
            trigger: 'change'
          }]
        },
        verifyCode: '',
        show_num: '',
        isAgree: false,
      }
    },
    watch: {},
    mounted() {
      let activation = utils.getUrlKey('activation')
      console.log("推广码：",activation)
      this.registerForm.activation= activation
    },
    created() {
      //设置点击回车键直接登录
      document.onkeydown = (e) => {
        var e = event || window.event;
        if (e && e.keyCode == 13) {
          // this.login('loginForm');
        }
      }
    },
    methods: {
      isCellPhone(val) {
        if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(val)) {
          return false
        } else {
          return true
        }
      },
      login() {
        this.$router.push({
          path:'/login'
        })
      },
      //注册
      // register() {
      //   // alert("正在做呢，催啥？？？");
      //   //还原登录页和注册页 获取短信验证码等信息
      //   // this.clearData()


      // },

      //获取手机短信验证码
      getVCode() {
        if (!this.isCellPhone(this.registerForm.mobile)) {
          this.$message.error('请先输入正确的手机号码！')
          return
        }
        //axios请求
        let data = {
          mobile: this.registerForm.mobile
        }
        registerMsg(data).then(response => {
          console.log(response.data.code)
          if(response.data.code != 10000){
            this.$message.error(response.data.message)
          }else{
            this.$message.success(response.data.data)
          }
        })
        // 验证码倒计时
        if (!this.timer) {
          this.registerCount = 60;
          this.showRegisterGetVCode = false;
          this.timer = setInterval(() => {
            if (this.registerCount > 0 && this.registerCount <= 60) {
              this.registerCount--;
            } else {
              this.showRegisterGetVCode = true;
              clearInterval(this.timer);
              this.timer = null;
            }
          }, 1000);
        }


      },
      immedRegister(formName) {
        if (this.isAgree && this.validityForm(formName)) {
          this.$store.dispatch('user/register', this.registerForm)
            .then((response) => {
              if(response.code ==10000){
                this.$router.push({
                  path: this.redirect || '/',
                  query: this.otherQuery
                })
                this.loading = false
                console.log("成功")
              }else{
                this.$message.error(response.message)
              }

            }).catch(() => {
              this.loading = false
              console.log("失败")
            })
        }
      },
      validityForm(formName) {
        var result = false
        this.$refs[formName].validate((valid) => {
          if (valid) {
            result = true
          } else {
            console.log('validity error!!');
            result = false
          }
        })
        return result
      }
    }
  }
</script>

<style lang="scss">
  /* 修复input 背景不协调 和光标变色 */
  /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

  $bg:#283443;
  $light_gray:#fff;
  $cursor: #fff;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
      color: $cursor;
    }
  }
</style>

<style lang="scss" scoped>
  $bg:#2d3a4b;
  $dark_gray:#889aa4;
  $light_gray:#eee;

  .login-container {
    min-height: 100%;
    width: 100%;
    // background-color: $bg;
    overflow: hidden;
    display: flex;
    position: relative;

    .login-bg {
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, .02);
      position: absolute;
      z-index: 10;
    }

    .left {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .left {
      position: relative;
      overflow: hidden;

      img {
        width: 90%;
        height: 90%;
        transition: 1.5s ease-in-out;
        position: absolute;

      }

      // .loginBgImg {
      //   top: 50%;
      //   left: 50%;
      //   transform: translate(-50%, -50%);
      // }

      .registerBgImg {
        // top: 1000px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }

      // .loginImg {
      //   top: -1000px;
      //   opacity: 0;
      // }

      // .registerImg {
      //   top: 50%;
      //   transform: translate(0, -50%);
      //   opacity: 1;
      // }
    }

    @media only screen and (max-width: 470px) {
      .thirdparty-button {
        display: none;
      }
    }
  }
</style>
<style lang="less" scoped>
  .right {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

    /* 接下来是猫头鹰的样式 */
    /* 接下来是猫头鹰的样式 */
    .owl {
      width: 211px;
      height: 108px;
      /* 背景图片 */
      background: url("../../assets/login_images/owl-login.png") no-repeat;
      /* 绝对定位 */
      position: absolute;
      top: -100px;
      /* 水平居中 */
      left: 50%;
      transform: translateX(-50%);
    }

    .owl .hand {
      width: 34px;
      height: 34px;
      border-radius: 40px;
      background-color: #39b4ff;
      /* 绝对定位 */
      position: absolute;
      left: 12px;
      bottom: -8px;
      /* 沿Y轴缩放0.6倍（压扁） */
      transform: scaleY(0.6);
      /* 动画过渡 */
      transition: 0.3s ease-out;
    }

    .owl .hand.hand-r {
      left: 170px;
    }

    .owl.password .hand {
      transform: translateX(42px) translateY(-15px) scale(0.7);
    }

    .owl.password .hand.hand-r {
      transform: translateX(-42px) translateY(-15px) scale(0.7);
    }

    .owl .arms {
      position: absolute;
      top: 58px;
      width: 100%;
      height: 41px;
      overflow: hidden;
    }

    .owl .arms .arm {
      width: 40px;
      height: 65px;
      position: absolute;
      left: 20px;
      top: 40px;
      background: url("../../assets/login_images/owl-login-arm.png") no-repeat;
      transform: rotate(-20deg);
      transition: 0.3s ease-out;
    }

    .owl .arms .arm.arm-r {
      transform: rotate(20deg) scaleX(-1);
      left: 158px;
    }

    .owl.password .arms .arm {
      transform: translateY(-40px) translateX(40px);
    }

    .owl.password .arms .arm.arm-r {
      transform: translateY(-40px) translateX(-40px) scaleX(-1);
    }

    /*猫头鹰的样式  结束 */
    .public-content {
      margin-top: 60px;
      position: relative;
      background: #FFFFFF;
      box-shadow: 0 0 16px 0 rgba(0, 0, 0, .08);
      width: 400px;
      height: 535px;
      padding: 25px 30px 35px 30px;
      box-sizing: border-box;
      perspective: 1000px;

      .form-title {
        font-size: 28px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #333333;
      }
    }



    //注册
    .register-content {
      z-index: 11;
      transition: 1.5s ease-in-out;
      transform: rotateY(-180deg);
      backface-visibility: hidden;

      // 用户服务协议 + 立即登录
      .agree-item {
        margin-top: 98px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .agree-left {
          display: flex;
          justify-content: flex-start;
          align-items: center;

          /deep/.el-checkbox__label {
            font-size: 12px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #DBDBDB;
          }

          .agreement {
            font-size: 12px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #1890FF;
            cursor: pointer;
          }
        }

        .login-left {
          cursor: pointer;
          font-size: 12px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #1890FF;
        }
      }
    }

    .flipRegister {
      transform: rotateY(-360deg);
    }

    // .flipLogin {
    //   transform: rotateY(180deg);
    // }

    //表单公共样式
    .modular-form {
      margin-top: 30px;

      /deep/.el-input__inner {
        height: 50px;
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #333;
        border-radius: 10px;
        border-color: #eee;
        background: #fff;
      }

      /deep/.el-input__inner:focus {
        border-color: #1890FF;
      }


      /deep/ .el-input__prefix {
        height: 50px;
        display: flex;
        align-items: center;
        left: 10px;
        top: 4px;
      }

      /deep/.el-input--prefix .el-input__inner {
        padding-left: 40px;
      }

      // 登录 、 下一步 按钮
      .from-btn {
        margin-top: 30px;
        width: 100%;
        border-radius: 10px;
        height: 50px;
        background: #1890FF;
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #FFFFFF;
        letter-spacing: 4px;
        border: none;
        outline: none;

      }

      .greyBtn {
        background: #bbbbbb !important;
      }

      //填写手机验证码
      .getCode-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 22px;

        // /deep/.form-label {
        //   margin-bottom: 0px;
        // }
        /deep/ .el-form-item {
          margin-bottom: 0px;
        }

        span {
          cursor: pointer;
          font-size: 12px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #1890FF;
        }

        //获取验证码倒计时
        .countDown {
          color: #DBDBDB;
        }
      }

    }

    // 三方登录
    .other {
      margin-top: 50px;
      font-size: 12px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #DBDBDB;
      display: flex;
      flex-direction: column;
      align-items: center;

      ul {
        margin-top: 20px;
        display: flex;
        justify-content: center;
        align-items: center;

        li {
          margin: 0px 25px;

          img {
            cursor: pointer;
          }

        }
      }
    }

  }
</style>
