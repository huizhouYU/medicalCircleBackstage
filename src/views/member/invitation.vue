<template>
  <div class="invitation-box">
    <div class="invitation-info">
      <!-- 搜索部分 -->
      <div class="invitation">
        <span class="title">邀请链接：</span>
        <div class="content">
          <div class="link">www.yijiequan.cn</div>
          <div class="copy">复制链接</div>
        </div>
      </div>
      <!-- 添加商品 -->
      <el-button type="primary" class="apply-withdrawal" @click="toAddGoods">申请提款</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {

      }
    },
    methods: {
      toAddGoods() {

      }
    }
  }
</script>

<style lang="less" scoped>
  .invitation-info {
    margin: 16px 20px 20px 20px;
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
