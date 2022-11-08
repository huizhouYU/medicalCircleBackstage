<template>
  <div class="invitation-box">
    <div class="invitation-info">
      <!-- 搜索部分 -->
      <div class="invitation">
        <span class="title">邀请链接：</span>
        <div class="content">
          <div class="link">{{regUrl}}</div>
          <div class="copy" @click="copy">复制链接</div>
        </div>
      </div>
      <!-- 添加商品 -->
      <el-button type="primary" class="apply-withdrawal" @click="applyWithdrawal">申请提款</el-button>
    </div>
    <router-view></router-view>
    <!--申请提款 弹框 -->
    <el-dialog title="申请提款" :close-on-click-modal="false" :visible.sync="applyDialogVisible" width="600px"
      class="el-dialog-box">
      <el-form :model="applyForm" label-position="right" ref="applyForm" :rules="applyRules">
        <el-form-item label="可提取余额:" :label-width="formLabelWidth">
          <div class="get-money-div">
            <el-input v-model="applyForm.amount" placeholder="--" :disabled="true" />
            <span class="remarks">最低提现金额不得低于50元</span>
          </div>

        </el-form-item>
        <el-form-item label="真实姓名:" :label-width="formLabelWidth" prop="accountName">
          <el-input v-model="applyForm.accountName" autocomplete="off" size="medium" placeholder="请输入真实姓名" />
        </el-form-item>
        <el-form-item label="银行卡号:" :label-width="formLabelWidth" prop="accountNo">
          <el-input v-model="applyForm.accountNo" autocomplete="off" size="medium" placeholder="请输入本人的银行卡号" />
        </el-form-item>
        <el-form-item label="银行名称:" :label-width="formLabelWidth" prop="bankName">
          <el-input v-model="applyForm.bankName" autocomplete="off" size="medium" placeholder="请输入本人的银行卡号" />
        </el-form-item>
        <el-form-item label="开户行:" :label-width="formLabelWidth" prop="bankArea">
          <el-input v-model="applyForm.bankArea" autocomplete="off" size="medium" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="验证码:" :label-width="formLabelWidth" prop="captcha">
          <div class="get-captcha-div">
            <el-input v-model="applyForm.captcha" autocomplete="off" size="medium" placeholder="请输入短信验证码" />
            <!-- <span class="get-captcha">获取短信验证码</span> -->
            <span v-show="showGetVCode" @click="getVCode" class="get-captcha">获取短信验证码</span>
            <span v-show="!showGetVCode" class="countDown">{{countdown}} s</span>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="closeApplyDialog">取 消</el-button>
        <el-button size="medium" type="primary" @click="sureApplyDialog">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {
    bankInfo,
    apply,
    sendSms
  } from '@/api/member'
  import {
    mapGetters
  } from 'vuex'
  export default {
    computed: {
      ...mapGetters([
        'name',
        'avatar',
        'roles',
        'regUrl',
        'balance'
      ])
    },
    data() {
      return {
        showGetVCode: true,
        countdown: '',
        formLabelWidth: '100px',
        applyDialogVisible: false,
        applyForm: {
          amount: '',
          accountNo: '',
          accountName: '',
          bankName: '',
          bankArea: '',
          captcha: ''
        },
        applyRules: {
          accountNo: [{
            required: true,
            message: '请输入本人的银行卡号',
            trigger: 'blur',

          }],
          accountName: [{
            required: true,
            message: '请输入真实姓名',
            trigger: 'blur'
          }],
          bankArea: [{
            required: true,
            message: '请输入开户行',
            trigger: 'blur'
          }],
          bankName: [{
            required: true,
            message: '请输入银行名称',
            trigger: 'blur'
          }],
          captcha: [{
            required: true,
            message: '请输入短信验证码',
            trigger: 'blur'
          }],
        },
      }
    },
    mounted() {
      this.$router.push({
        path: '/invitationList'
      })
    },
    methods: {
      // 复制操作
      copy() {
        // 创建输入框元素
        let oInput = document.createElement('input');
        // 将想要复制的值
        oInput.value = this.regUrl;
        // 页面底部追加输入框
        document.body.appendChild(oInput);
        // 选中输入框
        oInput.select();
        // 执行浏览器复制命令
        document.execCommand('Copy');
        // 弹出复制成功信息
        this.$message.success('复制成功');
        // 复制后移除输入框
        oInput.remove();
      },
      applyWithdrawal() {
        var _this = this
        //获取最近使用的提款账号
        bankInfo().then(response => {
          console.log("获取最近使用的提款账号:", response)
          if (response.data.data != null) {
            _this.applyForm = response.data.data
          }
          _this.$set(_this.applyForm, 'amount', _this.balance)
          _this.$set(_this.applyForm, 'captcha', '')
        })

        // this.applyForm.amount = this.balance
        this.applyDialogVisible = true
      },
      closeApplyDialog() {
        this.applyDialogVisible = false
      },
      sureApplyDialog() {
        // 申请提现
        apply(JSON.stringify(this.applyForm)).then(response => {
          console.log(response)
          if (response.data.code == 10000) {
            this.$message.success(response.data.message)
          } else {
            this.$message.warning(response.data.message)
          }
          this.closeApplyDialog()
        })
      },
      //获取手机短信验证码
      getVCode() {
        sendSms(JSON.stringify({})).then(response => {
          console.log(response.data.data)
        })
        // 验证码倒计时
        if (!this.timer) {
          this.countdown = 60;
          this.showGetVCode = false;
          this.timer = setInterval(() => {
            if (this.countdown > 0 && this.countdown <= 60) {
              this.countdown--;
            } else {
              this.showGetVCode = true;
              clearInterval(this.timer);
              this.timer = null;
            }
          }, 1000);
        }
      },
    }
  }
</script>

<style lang="less" scoped>
  .invitation-box {
    .invitation-info {
      margin-bottom: 20px;
      height: 74px;
      background: #FFFFFF;
      box-shadow: 0px 2px 10px 1px rgba(0, 0, 0, 0.06);
      border-radius: 6px 6px 6px 6px;
      padding: 0px 20px 0 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;

      .invitation {
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .title {
          margin-right: 30px;
          font-size: 12px;
          font-family: Microsoft YaHei-Regular, Microsoft YaHei;
          font-weight: 400;
          color: #333333;
        }

        .content {
          width: 320px;
          height: 34px;
          background: #FFFFFF;
          border-radius: 4px 4px 4px 4px;
          border: 1px solid #EBEEF5;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-left: 14px;

          .link {
            width: 232px;
            font-size: 12px;
            font-family: Microsoft YaHei-Regular, Microsoft YaHei;
            color: #666666;
          }

          .copy {
            cursor: pointer;
            width: 88px;
            height: 34px;
            background: #1890FF;
            border-radius: 0px 4px 4px 0px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 12px;
            font-family: Microsoft YaHei-Regular, Microsoft YaHei;
            font-weight: 400;
            color: #FFFFFF;
          }
        }
      }

      .apply-withdrawal {
        width: 88px;
        height: 34px;
        background: #1890FF;
        border-radius: 6px 6px 6px 6px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 12px;
      }
    }

    .get-captcha-div {
      display: flex;
      justify-content: flex-start;
      align-items: center;

      /deep/ .el-input {
        width: 150px;
      }

      .get-captcha {
        cursor: pointer;
        margin-left: 50px;
        color: #1890FF;
      }

      .countDown {
        margin-left: 50px;
        color: #DBDBDB;
      }
    }
    // .el-form-item__content{
    //   position: relative;

    // }
    .get-money-div{
      /deep/ .el-input {
        width: 150px;
      }

      .remarks{
        // position: absolute;
        // top: 76%;
        // left: 0;
        margin-left: 15px;
        color: #999;
        font-size: 12px;
      }
    }



    /deep/ .el-dialog {
      height: 450px !important;
    }
  }
</style>
