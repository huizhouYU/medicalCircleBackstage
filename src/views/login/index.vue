<template>
  <div class="login-container">
    <vue-particles class="login-bg" color="#fff" :particleOpacity="0.7" :particlesNumber="60" shapeType="circle"
      :particleSize="4" linesColor="#cfdbe3" :linesWidth="1" :lineLinked="true" :lineOpacity="0.4" :linesDistance="150"
      :moveSpeed="3" :hoverEffect="true" hoverMode="grab" :clickEffect="true" clickMode="push">
    </vue-particles>
    <div class="left">
      <img src="../../../public/imgs/login/left-bg.png" alt="" class="loginBgImg ">
    </div>
    <div class="right">
      <!-- 登录 -->
      <div class="login-content public-content">
        <!-- 猫头鹰 -->
        <div class="owl" id="owl" :class="[{password:isHide},'owl']">
          <div class="hand"></div>
          <div class="hand hand-r"></div>
          <div class="arms">
            <div class="arm"></div>
            <div class="arm arm-r"></div>
          </div>
        </div>
        <!-- 登录 -->
        <div v-show="!isForgotPassword">
          <!-- 登录方式 -->
          <ul class="loginWay-div">
            <li :class="loginWay==1?'chosedWay':''" @click="loginWay=1">密码登录 <span></span> </li>
            <li :class="loginWay==2?'chosedWay':''" @click="loginWay=2">验证码登录<span></span> </li>
          </ul>
          <!-- 密码登录 -->
          <div v-show="loginWay == 1">
            <el-form label-position="top" label-width="80px" ref="loginForm" :model="loginForm" :rules="loginRules"
              class="modular-form">
              <el-form-item label="" prop="username">
                <el-input v-model="loginForm.username" placeholder="请输入用户名" clearable>
                  <template #prefix>
                    <div class="prefix"><img src="../../../public/imgs/login/user.png" alt=""></div>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item label="" prop="password">
                <el-input v-model="loginForm.password" placeholder="请输入密码" show-password @focus="isHide = true"
                  @blur="isHide = false">
                  <template #prefix>
                    <div class="prefix"><img src="../../../public/imgs/login//key.png" alt=""></div>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item label="" prop="verCode">
                <div class="login-code">
                  <el-input v-model="loginForm.verCode" placeholder="请输入验证码" class="login-code-input"></el-input>
                  <canvas id="canvas" width="100" height="40" @click="draw()" style="border-radius: 5px;"></canvas>
                </div>
              </el-form-item>
              <div class="eg-pass public-checkBox">
                <el-checkbox label="记住密码" v-model="isRememberPass"></el-checkbox>
                <ul>
                  <li @click="remberpass()">忘记密码？</li>
                  <li @click="register()">立即注册</li>
                </ul>
              </div>
              <el-button type="primary" round class="from-btn" @click="login('loginForm')">登录</el-button>
            </el-form>
          </div>
          <!-- 验证码登录 -->
          <div v-show="loginWay == 2">
            <el-form label-position="top" label-width="80px" ref="loginCodeForm" :model="loginCodeForm"
              class="modular-form" :rules="loginCodeRules">
              <el-form-item label="" class="form-label" prop="phone">
                <el-input v-model="loginCodeForm.phone" placeholder="请输入手机号" clearable>
                  <template #prefix>
                    <div class="prefix"><img src="../../../public/imgs/login/user.png" alt=""></div>
                  </template>
                </el-input>
              </el-form-item>
              <div class="getCode-item">
                <el-form-item label="" class="form-label" prop="phoneCode">
                  <el-input v-model="loginCodeForm.verCode" placeholder="请输入验证码" clearable>
                    <template #prefix>
                      <div class="prefix"><img src="../../../public/imgs/login/shield.png" alt=""></div>
                    </template>
                  </el-input>
                </el-form-item>
                <span v-show="showLoginGetVCode" @click="getVCode">获取验证码</span>
                <span v-show="!showLoginGetVCode" class="countDown">{{loginCount}} s</span>
              </div>
              <div class="login-to-register">
                <span @click="register()">立即注册</span>
              </div>
              <button class="from-btn code-login" @click="login('loginCodeForm')">登录</button>
            </el-form>
          </div>
          <!-- 选择一下其他方式登录 -->
          <div class="other">
            <span>无需注册，选择一下方式登录</span>
            <ul>
              <li><img src="../../../public/imgs/login/QQ.png" alt="QQ登录" @click="otherLogin(1)"></li>
              <li><img src="../../../public/imgs/login/weixin.png" alt="微信登录" @click="otherLogin(2)"></li>
              <li><img src="../../../public/imgs/login/zfb.png" alt="支付宝登录" @click="otherLogin(3)"></li>
            </ul>
          </div>
        </div>
        <!-- 忘记密码 -->
        <div class="forgot-password-content" v-show="isForgotPassword">
          <div class="form-title">忘记密码</div>
          <el-form label-position="top" label-width="80px" :model="forgotForm" class="modular-form" ref="forgotForm"
            :rules="forgotFormRules">
            <el-form-item label="" prop="phone">
              <el-input v-model="forgotForm.phone" placeholder="请输入手机号" clearable>
                <template #prefix>
                  <div class="prefix"><img src="../../../public/imgs/login/user.png" alt=""></div>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="" prop="newPassword">
              <el-input v-model="forgotForm.newPassword" placeholder="请输入新密码" show-password @focus="isHide = true"
                @blur="isHide = false">
                <template #prefix>
                  <div class="prefix"><img src="../../../public/imgs/login/shield.png" alt=""></div>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="" prop="againPassword">
              <el-input v-model="forgotForm.againPassword" placeholder="再次确认密码" show-password @focus="isHide = true"
                @blur="isHide = false">
                <template #prefix>
                  <div class="prefix"><img src="../../../public/imgs/login/shield.png" alt=""></div>
                </template>
              </el-input>
            </el-form-item>
            <div class="getCode-item">
              <el-form-item label="" prop="phoneCode">
                <el-input v-model="forgotForm.phoneCode" placeholder="请输入验证码" clearable>
                  <template #prefix>
                    <div class="prefix"><img src="" alt=""></div>
                  </template>
                </el-input>
              </el-form-item>
              <span v-show="showForgetGetVCode" @click="getVCode">获取验证码</span>
              <span v-show="!showForgetGetVCode" class="countDown">{{forgetCount}} s</span>
            </div>
            <!-- 立即登录 -->
            <div class="toLogin-item">
              <span class="login-span" @click="flipLogin">立即登录</span>
            </div>
            <el-button type="primary" round class="from-btn" @click="updatePassWord('forgotForm')">确定</el-button>
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
    sendMsg
  } from '@/api/user'

  export default {
    name: 'Login',
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
        if (value.length < 0) {
          callback(new Error('请输入密码'))
        } else {
          callback()
        }
      }
      var validatePhone = (rule, value, callback) => {
        if (value === '') {
          // let phoneReg = /(^1[3|4|5|6|7|8|9]\d{9}$)|(^09\d{8}$)/; if (value === '') {
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
        isForgotPassword: false, //是否忘记密码
        loginCount: '', //获取验证码倒计时【登录页】
        showLoginGetVCode: true, //是否显示获取验证码【登录页】
        forgetCount: '', //获取验证码倒计时【忘记密码】
        showForgetGetVCode: true, //是否显示获取验证码【忘记密码】
        loginWay: 1, //登录方式【1：密码登录，2：短信登录】
        isRememberPass: '', //记住密码
        isHide: false,
        //登录
        loginForm: {
          // username: 'cuiqianming',
          // password: '123456',
          username: '',
          password: '',
          verCode: ''
        },
        loginCodeForm: {
          phone: '',
          phoneCode: ''
        },
        loginRules: {
          username: [{
            required: true,
            trigger: 'blur',
            validator: validateUsername
          }],
          password: [{
            required: true,
            trigger: 'blur',
            validator: validatePassword
          }],
          verCode: [{
            required: true,
            message: '请输入验证码',
            trigger: 'change'
          }]
        },
        loginCodeRules: {
          phone: [{
            required: true,
            trigger: 'blur',
            validator: validatePhone
          }],
          phoneCode: [{
            required: true,
            message: '请输入短信验证码',
            trigger: 'change'
          }]
        },
        forgotForm: {
          phone: '',
          newPassword: '',
          againPassword: '',
          phoneCode: ''
        },
        forgotFormRules: {
          phone: [{
            required: true,
            trigger: 'blur',
            validator: validatePhone
          }],
          newPassword: [{
            required: true,
            message: '请输入新密码',
            trigger: 'change'
          }],
          againPassword: [{
            required: true,
            message: '请再次确认密码',
            trigger: 'change'
          }],
          phoneCode: [{
            required: true,
            message: '请输入短信验证码',
            trigger: 'change'
          }]
        },
        show_num: '',
        isAgree: false,
      }
    },
    watch: {},
    mounted() {
      this.draw();
      this.getCookie()
    },
    created() {
      //设置点击回车键直接登录
      document.onkeydown = (e) => {
        var e = event || window.event;
        if (e && e.keyCode == 13) {
          this.login('loginForm');
        }
      }
    },
    methods: {
      isCellPhone(val) {
        if (!/^1(3|4|5|6|7|8)\d{9}$/.test(val)) {
          return false
        } else {
          return true
        }
      },
      draw() {
        this.show_num = [];
        var canvas_width = document.getElementById('canvas').clientWidth;
        var canvas_height = document.getElementById('canvas').clientHeight;
        var canvas = document.getElementById("canvas"); //获取到canvas的对象，演员
        var context = canvas.getContext("2d"); //获取到canvas画图的环境，演员表演的舞台
        canvas.width = canvas_width;
        canvas.height = canvas_height;
        var sCode =
          "A,B,C,E,F,G,H,J,K,L,M,N,P,Q,R,S,T,W,X,Y,Z,1,2,3,4,5,6,7,8,9,0,q,w,e,r,t,y,u,i,o,p,a,s,d,f,g,h,j,k,l,z,x,c,v,b,n,m";
        var aCode = sCode.split(",");
        var aLength = aCode.length; //获取到数组的长度

        for (var i = 0; i <= 3; i++) {
          var j = Math.floor(Math.random() * aLength); //获取到随机的索引值
          var deg = Math.random() * 30 * Math.PI / 180; //产生0~30之间的随机弧度
          var txt = aCode[j]; //得到随机的一个内容
          this.show_num[i] = txt;
          var x = 10 + i * 20; //文字在canvas上的x坐标
          var y = 20 + Math.random() * 8; //文字在canvas上的y坐标
          context.font = "bold 23px 微软雅黑";

          context.translate(x, y);
          context.rotate(deg);

          context.fillStyle = this.randomColor();
          context.fillText(txt, 0, 0);

          context.rotate(-deg);
          context.translate(-x, -y);
        }
        for (var i = 0; i <= 5; i++) { //验证码上显示线条
          context.strokeStyle = this.randomColor();
          context.beginPath();
          context.moveTo(Math.random() * canvas_width, Math.random() * canvas_height);
          context.lineTo(Math.random() * canvas_width, Math.random() * canvas_height);
          context.stroke();
        }
        for (var i = 0; i <= 30; i++) { //验证码上显示小点
          context.strokeStyle = this.randomColor();
          context.beginPath();
          var x = Math.random() * canvas_width;
          var y = Math.random() * canvas_height;
          context.moveTo(x, y);
          context.lineTo(x + 1, y + 1);
          context.stroke();
        }
      },
      //得到随机的颜色值
      randomColor() {
        var r = Math.floor(Math.random() * 256);
        var g = Math.floor(Math.random() * 256);
        var b = Math.floor(Math.random() * 256);
        return "rgb(" + r + "," + g + "," + b + ")";
      },
      // 验证验证码的函数
      checkCode() {
        if (this.loginForm.verCode.length <= 0) {
          this.$message.error('请输入验证码！')
          return false
        }
        var num = this.show_num.join("");
        var val = this.loginForm.verCode;
        if (val == num) {
          return true
        } else {
          this.$message.error('验证码输入错误！')
          this.loginForm.verCode = '';
          this.draw();
          return false
        }
      },
      //在登录之前先进行数据检查
      checkLoginInfo() {
        //密码登录
        if (this.loginWay == 1) {
          if (this.loginForm.username === '' && this.loginForm.password === '') {
            this.$message.error('用户名和密码不能为空！')
            return false
          }
          if (!this.checkCode()) {
            return false
          }
          //是否记住密码
          if (this.isRememberPass) {
            this.setCookie(this.loginForm.username, this.loginForm.password)
          } else {
            this.clearCookie();
          }
          return true
        } else if (this.loginWay == 2) {
          //验证码登录
          if (this.loginForm.phone === '' && this.loginForm.verCode === '') {
            if (!this.isCellPhone(this.loginForm.phone)) {
              return false
            }
            this.$message.error('请先填写短信验证码！')
            return false
          }
          return true
        }
        return false
      },
      // 登录
      login(formName) {
        console.log("登录")
        if (this.validityForm(formName)) {
          if (this.checkLoginInfo()) {
            this.loading = true
            console.log("登录前验证成功")
            this.$store.dispatch('user/login', this.loginForm)
              .then(() => {
                this.$router.push({
                  path: this.redirect || '/',
                  query: this.otherQuery
                })
                this.loading = false
                console.log("成功")
              }).catch(() => {
                this.loading = false
                console.log("失败")
              })
          } else {
            console.log("登录前验证失败")
          }
        }
      },

      getCookie() {
        this.loginForm.username = localStorage.getItem("yj_UserName")
        this.loginForm.password = localStorage.getItem("yj_Pws")
        this.isRememberPass = Boolean(localStorage.getItem("yj_isRemember"))

      },
      //存储
      setCookie(userName, userPws) {
        localStorage.setItem("yj_UserName",userName)
        localStorage.setItem("yj_Pws",userPws)
        localStorage.setItem("yj_isRemember",this.isRememberPass)
      },
      //如果用户不选择记住密码清除cookie
      clearCookie() {
        this.setCookie("", "");
      },
      //忘记密码
      remberpass() {
        this.isForgotPassword = true
        // alert("正在做呢，催啥？？？");
      },
      //注册
      register() {
        this.$router.push({
          path: '/register'
        })
      },
      flipLogin() {
        this.isForgotPassword = false
        this.isRegister = false
        //还原登录页和注册页 获取短信验证码等信息
        this.clearData()
      },
      //还原登录页和注册页 获取短信验证码等信息
      clearData() {
        clearInterval(this.timer);
        this.timer = null;
        this.loginCount = ''
        this.showLoginGetVCode = true
      },
      //其他方式登录
      otherLogin(val) {
        alert("催啥？点啥？走走走...")
      },
      // 获取短信验证码
      getVCode() {
        if (!this.isForgotPassword) {
          if (!this.isCellPhone(this.loginCodeForm.phone)) {
            this.$message.error('请先输入正确的手机号码！')
            return
          }
          let data = {
            mobile: this.loginCodeForm.phone
          }
          sendMsg(data).then(response => {
            console.log(response.data.data)
          })
          // 验证码倒计时
          if (!this.timer) {
            this.loginCount = 60;
            this.showLoginGetVCode = false;
            this.timer = setInterval(() => {
              if (this.loginCount > 0 && this.loginCount <= 60) {
                this.loginCount--;
              } else {
                this.showLoginGetVCode = true;
                clearInterval(this.timer);
                this.timer = null;
              }
            }, 1000);
          }
        } else { //忘记密码
          if (!this.isCellPhone(this.forgotForm.phone)) {
            this.$message.error('请先输入正确的手机号码！')
            return
          }
          let data = {
            mobile: this.forgotForm.phone
          }
          sendMsg(data).then(response => {
            console.log(response.data.data)
          })
          // 验证码倒计时
          if (!this.timer) {
            this.forgetCount = 60;
            this.showForgetGetVCode = false;
            this.timer = setInterval(() => {
              if (this.forgetCount > 0 && this.forgetCount <= 60) {
                this.forgetCount--;
              } else {
                this.showForgetGetVCode = true;
                clearInterval(this.timer);
                this.timer = null;
              }
            }, 1000);
          }
        }
      },
      //用户服务协议
      lookAgreement() {
        alert("看协议吗？给链接啊！！！")
      },
      //忘记密码 提交
      updatePassWord(formName) {
        if (this.validityForm(formName)) {
          this.$message.success('密码修改成功，请重新登录！')
          this.flipLogin()
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

      .loginBgImg {
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
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

    //登录
    .login-content {
      z-index: 11;
      position: absolute;
      display: flex;
      flex-direction: column;
      transition: 1.5s ease-in-out;

      //登录方式
      .loginWay-div {
        display: flex;
        align-items: center;

        li {
          position: relative;
          font-size: 16px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #DBDBDB;
          margin: 0px 10px;
          cursor: pointer;
          padding-bottom: 5px;
        }

        .chosedWay {
          color: #1890FF;
          font-weight: 600;

          span {
            position: absolute;
            display: block;
            height: 2px;
            width: 40px;
            background-color: #1890FF;
            border-radius: 4px;
            bottom: 0px;
            left: 50%;
            transform: translate(-50%, 0);
          }
        }
      }

      //输入验证码
      .login-code {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .login-code-input {
          width: 210px;
        }

        .v_container {
          height: 40px;
        }
      }

      //记住密码+ 忘记密码
      .eg-pass {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-left: 4px;

        /deep/.el-checkbox__label {
          font-size: 12px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #DBDBDB;
        }

        ul {
          display: flex;
          justify-content: center;
          align-items: center;

          li {
            box-sizing: border-box;
            padding: 0 5px;
            font-size: 12px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #1890FF;
            border-right: 1px solid #EEEEEE;
            cursor: pointer;
          }

          li:last-child {
            border: none;
          }
        }
      }

      //验证码登录【立即注册】
      .login-to-register {
        margin-top: 98px;
        box-sizing: border-box;
        padding: 0 5px;
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #1890FF;
        display: flex;
        justify-content: flex-end;
        align-items: center;

        span {
          cursor: pointer;
        }
      }
    }

    //忘记密码
    .forgot-password-content {

      //验证码登录【立即注册】
      .toLogin-item {
        box-sizing: border-box;
        padding: 0 5px;
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #1890FF;
        display: flex;
        justify-content: flex-end;
        align-items: center;

        span {
          cursor: pointer;
        }
      }
    }

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
