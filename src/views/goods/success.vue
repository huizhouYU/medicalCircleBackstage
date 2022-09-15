<template>
  <div class="success-box">
    <div class="success-content">
      <div class="title">
        <img src="../../../static/img/goods/icon_Successful launch.png" alt="">
        <span>发布成功</span>
      </div>
      <div class="btns">
        <el-button type="primary" class="btn" plain @click="lookGood">查看商品</el-button>
        <el-button type="primary" class="btn" plain @click="back">返回列表</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {}
    },
    methods: {
      back() {
        this.$router.replace("/goodsIndex")
      },
      lookGood() {
        alert('后端提供商品链接直接跳转？')
      }
    }
  }
</script>

<style scoped lang="less">

  .success-box {
    height: 100%;
  }

  .success-content {
    height: 90%;
    background-color: #fff;
    border-radius: 6px 6px 6px 6px;
    font-size: 12px;
    font-family: Microsoft YaHei-Regular, Microsoft YaHei;
    font-weight: 400;
    color: #333333;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .title {
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        width: 46px;
        height: 46px;
        margin-right: 10px;
      }
    }

    .btns {
      margin-top: 45px;
      display: flex;
      align-items: center;
      justify-content: center;

      .btn {
        margin-right: 30px;
      }

      /deep/ .el-button {
        width: 99px;
        height: 34px;
        display: flex;
        justify-content: center;
        align-self: center;
        font-size: 14px;
      }
    }


  }
</style>
