<template>
  <div class="invitation-box">
    <div class="invitation-info">
      <!-- 搜索部分 -->
      <div class="invitation">
        <span class="title">邀请链接：</span>
        <div class="content">
          <div class="link">{{link}}</div>
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
          <el-input v-model="applyForm.balance" placeholder="--" :disabled="true" />
        </el-form-item>
        <el-form-item label="银行卡号:" :label-width="formLabelWidth" prop="bankCardNo">
          <el-input v-model="applyForm.bankCardNo" autocomplete="off" size="medium" placeholder="请输入本人的银行卡号" />
        </el-form-item>
        <el-form-item label="真实姓名:" :label-width="formLabelWidth" prop="name">
          <el-input v-model="applyForm.name" autocomplete="off" size="medium" placeholder="请输入真实姓名" />
        </el-form-item>
        <el-form-item label="开户行:" :label-width="formLabelWidth" prop="deposit">
          <el-input v-model="applyForm.deposit" autocomplete="off" size="medium" placeholder="请输入" />
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
  export default {
    data() {
      return {
        link: 'www.yijiequan.cn',
        formLabelWidth: '100px',
        applyDialogVisible: false,
        applyForm: {
          balance: '9999.99',
          bankCardNo: '',
          name: '',
          deposit: ''
        },
        applyRules: {
          bankCardNo: [{
            required: true,
            message: '请输入本人的银行卡号',
            trigger: 'blur',

          }],
          name: [{
            required: true,
            message: '请输入真实姓名',
            trigger: 'blur'
          }],
          deposit: [{
            required: true,
            message: '请输入开户行',
            trigger: 'blur'
          }]
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
        oInput.value = this.link;
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
        this.applyDialogVisible = true
      },
      closeApplyDialog() {
        this.applyDialogVisible = false
      },
      sureApplyDialog() {
        // 请求后端接口数据，保存信息
        this.closeApplyDialog()
      },
    }
  }
</script>

<style lang="less" scoped>
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
</style>
