<template>
  <div class="success-box">
    <!-- 头部页面标题 -->
    <div class="header-title">
      <div class="back" @click="back()">
        <i class="iconfont">&#xe610;</i>
      </div>
      <div class="title">
        商品列表
        <i class="iconfont">&#xe62b;</i>
        添加商品
      </div>
    </div>
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
  // 头部页面标题
  .header-title {
    display: flex;
    justify-content: flex-start;
    align-items: center;

    // 返回按钮
    .back {
      width: 34px;
      height: 34px;
      background: #FFFFFF;
      box-shadow: 0px 0px 32px 1px rgba(144, 145, 145, 0.15);
      border-radius: 6px 6px 6px 6px;
      text-align: center;
      line-height: 34px;
      cursor: pointer;
    }

    //标题
    .title {
      margin-left: 20px;
      // width: 88px;
      height: 34px;
      padding: 0px 20px;
      background: #1890FF;
      border-radius: 6px 6px 6px 6px;
      font-size: 12px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
      font-weight: 400;
      color: #FFFFFF;
      text-align: center;
      line-height: 34px;

      i {
        padding: 0px 4px;
        font-size: 12px;
      }
    }
  }

  .success-box {
    height: 100%;
  }

  .success-content {
    height: 90%;
    margin-top: 15px;
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
