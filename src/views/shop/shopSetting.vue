<template>
  <div class="box">
    <!-- 编辑区域 -->
    <el-form :model="shopInfo" label-width="100px" label-position="left" class="eidt-box">
      <!-- 产品主图 -->
      <el-form-item label="店铺店标：">
        <div label="图片可拖曳排序：" prop="trialImgs" class="content-images">
          <div class="row">
          <!--  <DragUpload :allList="ruleForm.trialImgs" v-on:allList="trialImgs" :limit="limit">
            </DragUpload> -->
            <div class="gray-tip">请上传300*300的图片，大小不超过2m</div>
          </div>
        </div>
      </el-form-item>
      <!-- 店铺横幅 -->
      <el-form-item label="更换店铺横幅：">
        <div class="banner-tip">
          <img src="../../..//public/imgs/brand03.png" alt="">
          <span class="gray-tip">请上传300*300的图片，大小不超过2m</span>
        </div>
      </el-form-item>
      <!-- 店铺名称 + 联系电话 -->
      <div class="div-item-both">
        <el-form-item label="店铺名称：">
          <el-input placeholder="请输入店铺名称" v-model="shopInfo.address" autocomplete="off" size="medium" type="text">
          </el-input>
        </el-form-item>
        <el-form-item label="联系电话：">
          <el-input placeholder="请输入联系电话" v-model="shopInfo.address" autocomplete="off" size="medium" type="text">
          </el-input>
        </el-form-item>
      </div>
      <!-- 店铺地址 -->
      <el-form-item label="店铺地址：">
        <el-input placeholder="请输入店铺地址" v-model="shopInfo.address" autocomplete="off" size="medium" type="text">
        </el-input>
      </el-form-item>
      <!-- 服务内容 -->
      <el-form-item label="服务内容：">
        <el-input placeholder="可以描述一下您提供的服务" v-model="shopInfo.address" autocomplete="off" size="medium"
          type="textarea">
        </el-input>
      </el-form-item>
      <el-form-item label="资质证书：">
        <div label="图片可拖曳排序：" prop="certificates" class="content-images">
          <div class="row">
            <!-- <DragUpload :allList="ruleForm.certificates" v-on:allList="certificates" :limit="5">
            </DragUpload> -->
            <div class="gray-tip">请：图片上传不超过5张，图片支持jpg/png格式，不超过500kb，尺寸为800*800</div>
          </div>
        </div>
      </el-form-item>
      <!-- 店铺简介： -->
      <el-form-item label="店铺简介：">
        <!-- <edit class="edit"></edit> -->
      </el-form-item>
      <el-form-item class="submmit-form-item">
        <el-button type="primary">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  // import edit from '../../components/unit/edit.vue'
  // import DragUpload from '../../components/unit/DragUpload'; // 引入vue-draggable
  export default {
    // components: {
    //   DragUpload,
    //   edit
    // },
    data() {
      return {
        limit: 1, //上传限制图片数量
        shopInfo: {
          logoUrl: '', //店铺logo
          bannerUrl: '', //店铺横幅
          name: '', //店铺名称
          tel: '', //联系电话
          address: '', //店铺地址
        },
        // 发布信息
        demandInfo: {
          infoType: '', //信息类型
          infoBrand: '', //设备品牌
          infoModel: '', //设备型号
          infoTitle: '', //信息标题
        },
        //信息类型
        infoTypeOptions: [{
          value: '1',
          label: '类型一'
        }, {
          value: '2',
          label: '类型二'
        }],
        infoModelOptions: [{
          value: '1',
          label: '型号一'
        }, {
          value: '2',
          label: '型号二'
        }],
        ruleForm: {
          imgUrl: '',
          trialImgs: [],
          certificates: []
        },
      }
    },
    mounted() {},
    methods: {
      back() {
        this.$router.back()
      },
      // 图片可拖曳排序
      trialImgs(allList) {
        this.ruleForm.trialImgs = allList
      },

    }
  }
</script>

<style scoped lang="less">
  .box {
    height: 100%;
  }

  // 编辑区域
  .eidt-box {
    background-color: #FFFFFF;
    box-shadow: 0px 2px 10px 1px rgba(0, 0, 0, 0.06);
    border-radius: 6px 6px 6px 6px;
    padding: 20px 35px 30px 15px;
    margin-top: 15px;

    /deep/ .el-form-item__label {
      font-size: 12px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
      font-weight: 400;
      color: #333333;
    }

    /deep/ .el-textarea__inner {
      font-size: 12px;
      height: 80px;
    }

    /deep/ .el-input--medium .el-input__inner {
      height: 34px;
      line-height: 34px;
      font-size: 12px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
      font-weight: 400;
      color: #333333;
    }

    /deep/ .el-input--medium,
    /deep/ .el-input {
      width: 400px;
    }

    .gray-tip {
      font-size: 12px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
      font-weight: 400;
      color: #BBBBBB;
    }

    // 更换店铺横幅
    .banner-tip {
      display: flex;
      flex-direction: column;

      img {
        width: 500px;
        height: 70px;
      }
    }

    .div-item-both {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;

      /deep/ .el-input {
        width: 300px;
        margin-right: 60px;
      }
    }

    .edit {
      height: 366px;
    }

    .submmit-form-item {
      display: flex;
      justify-content: center;

      /deep/ .el-button {
        height: 34px;
        width: 92px;
        font-size: 12px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        padding: 0px;
      }
    }

  }
</style>
