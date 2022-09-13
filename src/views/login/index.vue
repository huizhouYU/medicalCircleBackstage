<template>
  <div class="login-container">
    <div class="left">
      <img src="../../../public/imgs/login/left-bg.png" alt="">
    </div>
    <div class="right">
      <!-- 登录 -->
      <div :class="[{flipLogin:isRegister},'login-content','public-content']">
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
          <ul class="loginWay-div">
            <li :class="loginWay==1?'chosedWay':''" @click="loginWay=1">密码登录</li>
            <li :class="loginWay==2?'chosedWay':''" @click="loginWay=2">验证码登录</li>
          </ul>
          <!-- 密码登录 -->
          <div v-show="loginWay == 1">
            <el-form label-position="top" label-width="80px" :model="loginForm" :rules="loginRules" class="modular-form">
              <el-form-item label="">
                <el-input v-model="loginForm.username" placeholder="请输入用户名" clearable>
                  <template #prefix>
                    <div class="prefix"><img src="../../../public/imgs/login/user.png" alt=""></div>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item label="">
                <el-input v-model="loginForm.password" placeholder="请输入密码" show-password @focus="isHide = true"
                  @blur="isHide = false">
                  <template #prefix>
                    <div class="prefix"><img src="../../../public/imgs/login//key.png" alt=""></div>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item label="">
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
              <el-button type="primary" round class="from-btn" @click="login">登录</el-button>
            </el-form>

          </div>
          <!-- 验证码登录 -->
          <div v-show="loginWay == 2">
            <el-form label-position="top" label-width="80px" :model="loginForm" class="modular-form">
              <el-form-item label="" class="form-label">
                <el-input v-model="loginForm.phone" placeholder="请输入手机号" clearable>
                  <template #prefix>
                    <div class="prefix"><img src="../../../public/imgs/login/user.png" alt=""></div>
                  </template>
                </el-input>
              </el-form-item>
              <div class="getCode-item">
                <el-form-item label="" class="form-label">
                  <el-input v-model="loginForm.verCode" placeholder="请输入验证码" clearable>
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

              <button class="from-btn code-login" @click="login">登录</button>
            </el-form>
          </div>
          <!-- 选择一下方式登录 -->
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
          <el-form label-position="top" label-width="80px" :model="forgotForm" class="modular-form">
            <el-form-item label="">
              <el-input v-model="forgotForm.phone" placeholder="请输入手机号" clearable>
                <template #prefix>
                  <div class="prefix"><img src="../../../public/imgs/login/user.png" alt=""></div>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="">
              <el-input v-model="forgotForm.newPassword" placeholder="请输入新密码" show-password @focus="isHide = true"
                @blur="isHide = false">
                <template #prefix>
                  <div class="prefix"><img src="../../../public/imgs/login/shield.png" alt=""></div>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="">
              <el-input v-model="forgotForm.againPassword" placeholder="再次确认密码" show-password @focus="isHide = true"
                @blur="isHide = false">
                <template #prefix>
                  <div class="prefix"><img src="../../../public/imgs/login/shield.png" alt=""></div>
                </template>
              </el-input>
            </el-form-item>
            <div class="getCode-item">
              <el-form-item label="" class="">
                <el-input v-model="forgotForm.verCode" placeholder="请输入验证码" clearable>
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
            <el-button type="primary" round class="from-btn" @click="immedRegister">确定</el-button>

          </el-form>
        </div>
      </div>

      <!-- 注册 -->
      <div :class="[{flipRegister:isRegister},'register-content','public-content']" v-show="!isForgotPassword">
        <span class="form-title">欢迎注册</span>
        <div class="checking">
          <el-form label-position="top" label-width="80px" :model="registerForm" class="modular-form">
            <el-form-item label="" class="form-label">
              <el-input v-model="registerForm.phone" placeholder="请输入手机号" clearable>
                <template #prefix>
                  <div class="prefix"><img src="" alt=""></div>
                </template>
              </el-input>
            </el-form-item>
            <div class="getCode-item">
              <el-form-item label="" class="form-label">
                <el-input v-model="registerForm.verCode" placeholder="请输入验证码" clearable>
                  <template #prefix>
                    <div class="prefix"><img src="" alt=""></div>
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
                <span class="agreement" @click="lookAgreement">《用户服务协议》</span>
              </div>
              <span class="login-left" @click="flipLogin">立即登录</span>
            </div>
            <el-button type="primary" round class="from-btn" @click="immedRegister">注册</el-button>
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
  import SocialSign from './components/SocialSignin'

  export default {
    name: 'Login',
    components: {
      SocialSign
    },
    data() {
      const validateUsername = (rule, value, callback) => {
        if (!validUsername(value)) {
          callback(new Error('Please enter the correct user name'))
        } else {
          callback()
        }
      }
      const validatePassword = (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error('The password can not be less than 6 digits'))
        } else {
          callback()
        }
      }
      return {
        isForgotPassword: false, //是否忘记密码
        loginCount: '', //获取验证码倒计时【登录页】
        showLoginGetVCode: true, //是否显示获取验证码【登录页】
        registerCount: '', //获取验证码倒计时【注册页】
        showRegisterGetVCode: true, //是否显示获取验证码【注册页】
        forgetCount: '', //获取验证码倒计时【忘记密码】
        showForgetGetVCode: true, //是否显示获取验证码【忘记密码】
        loginWay: 1, //登录方式【1：密码登录，2：短信登录】
        active: 1,
        isRegister: false, //是否在注册页面
        isRememberPass: false, //记住密码
        isHide: false,
        loginForm: {
          username: 'admin',
          password: '111111',
          verCode: '',
          phone: '',
          verCode: ''
        },
        loginRules: {
          username: [{ required: true, trigger: 'blur', validator: validateUsername }],
          password: [{ required: true, trigger: 'blur', validator: validatePassword }]
        },
        registerForm: {
          username: '',
          password: '',
          surePassword: '',
          phone: '',
          verCode: ''
        },
        forgotForm: {
          phone: '',
          newPassword: '',
          againPassword: '',
          verCode: ''
        },
        verifyCode: '',
        show_num: '',
        isAgree: false,
      }
    },
    watch: {
      // $route: {
      //   handler: function(route) {
      //     const query = route.query
      //     if (query) {
      //       this.redirect = query.redirect
      //       this.otherQuery = this.getOtherQuery(query)
      //     }
      //   },
      //   immediate: true
      // }
    },
    mounted() {
      this.draw();
      this.getCookie()
    },
    created() {
      //设置点击回车键直接登录
      document.onkeydown = (e) => {
        var e = event || window.event;
        if (e && e.keyCode == 13) {
          this.login();
        }
      }
    },
    methods: {

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
            this.setCookie(this.loginForm.username, this.loginForm.password, 7)
          } else {
            this.clearCookie();
          }
          return true
        } else if (this.loginWay == 2) {
          //验证码登录
          if (this.loginForm.phone === '' && this.loginForm.verCode === '') {
            this.$message.error('请先填写短信验证码！')
            return false
          }
          return true
        }
        return false
      },
      // 登录
      login() {
        // this.$refs.loginForm.validate(valid => {
        //   if (valid) {
        //     this.loading = true
        //     this.$store.dispatch('user/login', this.loginForm)
        //       .then(() => {
        //         this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
        //         this.loading = false
        //       })
        //       .catch(() => {
        //         this.loading = false
        //       })
        //   } else {
        //     console.log('error submit!!')
        //     return false
        //   }
        // })
        if (this.checkLoginInfo()) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
          // 假设用户名和密码正确
          localStorage.setItem('token', '11111') //保存一个token值
          // 登录成功 跳转首页
          // this.$router.push({
          //   name: 'home'
          // })
        }

        // this.$http.post('login', this.loginForm).then(res => {
        //   console.log(res)
        //   // 对象结构赋值
        //   const {data, meta: {msg, status}} = res.data
        //   if (msg === 200) {
        //     // 登录成功 跳转首页
        //     this.$router.push({
        //       name: 'home'
        //     })
        //   }
        // })

      },
      async newlogin() {
        if (this.loginForm.username === '' && this.loginForm.password === '') {
          this.$message.error('用户名和密码不能为空！')
          return ''
        }
        const res = await this.$http.post('login', this.loginForm)
        // 对象结构赋值
        const {
          data,
          meta: {
            msg,
            status
          }
        } = res.data
        if (msg === 200) {
          // 保存token值
          localStorage.setItem('token', data.token)
          // 登录成功 跳转首页
          this.$router.push({
            name: 'home'
          })
        }
      },
      getCookie() {
        if (document.cookie.length > 0) {
          var arr = document.cookie.split(";");
          for (var i = 0; i < arr.length; i++) {
            var userKey = arr[i].split("=");
            if (userKey[0].trim() == "userName") {
              this.loginForm.username = userKey[1];
            } else if (userKey[0].trim() == "userPws") {
              this.loginForm.password = userKey[1];
            } else if (userKey[0].trim() == "isRemember") {
              this.isRememberPass = Boolean(userKey[1]);
            }
          }
        }
      },
      //存储
      setCookie(userName, userPws, days) {
        var curDate = new Date();
        curDate.setTime(curDate.getTime() + 24 * 60 * 60 * 1000 * days); //设置cookie存储的有效时间
        window.document.cookie = "userName" + "=" + userName + ";path=/;expires=" + curDate.toGMTString();
        window.document.cookie = "userPws" + "=" + userPws + ";path=/;expires=" + curDate.toGMTString();
        window.document.cookie = "isRemember" + "=" + this.isRemember + ";path=/;expires=" + curDate.toGMTString();
      },
      //如果用户不选择记住密码清除cookie
      clearCookie() {
        this.setCookie("", "", -1);
      },
      //忘记密码
      remberpass() {
        this.isForgotPassword = true
        // alert("正在做呢，催啥？？？");
      },
      //注册
      register() {
        // alert("正在做呢，催啥？？？");
        this.active = 1
        this.isRegister = true
        //还原登录页和注册页 获取短信验证码等信息
        this.clearData()
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
        this.registerCount = ''
        this.showRegisterGetVCode = true
      },
      //其他方式登录
      otherLogin(val) {
        alert("催啥？点啥？走走走...")
      },
      nextStep() {
        if (this.active++ > 3) this.active = 1
      },
      getVCode() {
        //登录页获取倒计时
        if (!this.isRegister) {
          //axios请求
          console.log(this.loginForm.phone)

          if (!this.isForgotPassword) {
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


        } else {
          //axios请求
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
        }
      },
      //用户服务协议
      lookAgreement() {
        alert("看协议吗？给链接啊！！！")
      },
      immedRegister() {
        alert("验证码填了吗？你就要注册？？？？")
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
    background-color: $bg;
    overflow: hidden;
    display: flex;

    .left {
      flex: 1;
      display: flex;
      justify-content: center;
    }

    .left {
      position: relative;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        left: 0px;
        transition: 1.5s ease-in-out;
        position: absolute;
      }

      .loginBgImg {
        top: 0px;
      }

      .registerBgImg {
        top: 1000px;
      }

      .loginImg {
        top: -1000px;
        opacity: 0;
      }

      .registerImg {
        top: 0px;
        opacity: 1;
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
      position: absolute;
      display: flex;
      flex-direction: column;
      transition: 1.5s ease-in-out;

      //登录方式
      .loginWay-div {
        display: flex;
        align-items: center;

        li {
          font-size: 16px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #DBDBDB;
          margin: 0px 10px;
          cursor: pointer;
          padding-bottom: 5px;
        }

        .chosedWay {
          color: #06b4fd;
          font-weight: 600;
          border-bottom: 1px solid #06b4fd;

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
        color: #06b4fd;
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
        color: #06b4fd;
        display: flex;
        justify-content: flex-end;
        align-items: center;

        span {
          cursor: pointer;
        }
      }
    }

    //注册
    .register-content {
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

    .flipLogin {
      transform: rotateY(180deg);
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
        background: rgba(230, 247, 255, 0.3);
        border-radius: 10px;
        border-color: #fff;
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
          color: #4ebaff;
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
