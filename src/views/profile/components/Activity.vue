<template>
  <el-form  :model="editForm" label-position="right" label-width="80px" ref="ruleForm" :rules="formRules" >
    <el-form-item label="手机号:">
      <el-input v-model.trim="user.mobile" disabled />
    </el-form-item>
    <el-form-item label="修改密码:" prop="password">
      <el-input v-model.trim="editForm.password" type="password"/>
    </el-form-item>
    <el-form-item label="确认密码:" prop="newPassword" >
      <el-input v-model.trim="editForm.newPassword" type="password"/>
    </el-form-item>
    <el-form-item label="验证码:" prop="captcha">
      <div class="code-input">
        <el-input v-model.trim="editForm.captcha" />
        <el-button @click="getCode" v-show="countDown == 0">获取短信验证码</el-button>
        <!-- <span class="get-code" @click="getCode" v-show="countDown == 0">获取验证码</span> -->
        <span class="count-down" v-show="countDown>0">{{countDown}}s</span>
      </div>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" class="public-el-submit-btn" @click="onSubmit('ruleForm')">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import {
    updatePwdMsg,
    updatePwd
  } from '@/api/user'
  export default {
    props: {
      user: {
        type: Object,
        default: () => {
          return {
            name: '',
            email: '',
            mobile: ''
          }
        }
      }
    },
    data() {
      return {
        countDown: 0,
        editForm: {
          mobile: '',
          newPassword: '',
          password: '',
          captcha: ''
        },
        formRules: {
          password: [{
            required: true,
            message: '请输入新密码',
            trigger: 'blur'
          }],
          newPassword: [{
            required: true,
            message: '请再次输入密码',
            trigger: 'blur'
          }],
          captcha: [{
            required: true,
            message: '请输入短信验证码',
            trigger: 'blur'
          }],
        }
      }
    },
    methods: {
      //获取手机短信验证码
      getCode() {
        //axios请求
        updatePwdMsg({}).then(response => {
          if (response.data.code != 10000) {
            this.$message.error(response.data.message)
          } else {
            this.$message.success(response.data.data)
          }
        })
        // 验证码倒计时
        if (!this.timer) {
          this.countDown = 60;
          // this.showRegisterGetVCode = false;
          this.timer = setInterval(() => {
            if (this.countDown > 0 && this.countDown <= 60) {
              this.countDown--;
            } else {
              // this.showRegisterGetVCode = true;
              clearInterval(this.timer);
              this.timer = null;
            }
          }, 1000);
        }
      },
      onSubmit(ruleForm) {
        this.editForm.mobile = this.user.mobile
        this.$refs[ruleForm].validate((valid) => {
          if (valid) {
            if (this.editForm.captcha == '') {
              this.$message.error("请填写短信验证码！")
              return false
            } else {
              updatePwd(this.editForm).then(response => {
                if (response.data.code == 10000) {
                  this.$message.success("密码修改成功！")
                  this.$router.push({
                    path: '/',
                    replace: true
                  })
                } else {
                  this.$message.error(response.data.message)
                }
              })
            }
          } else {
            return false;
          }
        });
      }
    }
  }
</script>

<style lang="less">
  .code-input {
    width: 300px;
    display: flex;
    justify-content: flex-start;

    .el-input__inner {
      width: 120px;
    }
  }
</style>
