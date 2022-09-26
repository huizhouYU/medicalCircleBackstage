<template>
  <div class="box">
    <!-- 编辑区域 -->
    <el-form :model="shopInfo" label-width="100px" label-position="right" class="eidt-box">
      <!-- 产品主图 -->
      <el-form-item label="店铺店标：">
        <div label="图片可拖曳排序：" prop="trialImgs" class="content-images">
          <div class="row">
            <!-- <DragUpload :all-list="ruleForm.trialImgs" :limit="limit" @allList="trialImgs" /> -->
            <uploadOne :mrSrc="shopLogo" :isWhole="true"></uploadOne>
            <div class="gray-tip">请上传300*300的图片，大小不超过2m</div>
          </div>
        </div>
      </el-form-item>
      <!-- 店铺横幅 -->
      <el-form-item label="更换店铺横幅：" class="banner-box">
        <!-- <div class="banner-tip">
          <img src="../../..//public/imgs/brand03.png" alt="">
          <span class="gray-tip">请上传1200*110的图片，大小不超过2m</span>
        </div> -->
        <div class="banner-tip">
          <el-upload action="aaa" list-type="picture-card" :auto-upload="false"
             ref="upload" :on-change="handleChange" :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove" :file-list="fileList" :class="{ hide: hideUploadBtn }">
            <i class="el-icon-plus"></i>
            <!-- <div class="el-upload__tip" slot="tip">请上传950*425的图片，大小不超过2m，最多可上传3张</div> -->
          </el-upload>
          <span class="gray-tip">请上传1200*110的图片，大小不超过2m</span>
        </div>

      </el-form-item>
      <!-- 店铺名称 -->
      <el-form-item label="店铺名称：">
        <el-input v-model="shopInfo.address" placeholder="请输入店铺名称" autocomplete="off" size="medium" type="text" />
      </el-form-item>
      <!-- 联系人 -->
      <el-form-item label="联系人：">
        <el-input v-model="shopInfo.telName" placeholder="请输入联系人" autocomplete="off" size="medium" type="text" />
      </el-form-item>
      <!-- 联系电话 -->
      <el-form-item label="联系电话：">
        <el-input v-model="shopInfo.tel" placeholder="请输入联系电话" autocomplete="off" size="medium" type="text" />
      </el-form-item>
      <!-- 店铺地址 -->
      <el-form-item label="店铺地址：">
        <el-input v-model="shopInfo.address" placeholder="请输入店铺地址" autocomplete="off" size="medium" type="text" />
      </el-form-item>
      <!-- 服务内容 -->
      <el-form-item label="服务内容：">
        <el-input v-model="shopInfo.address" placeholder="可以描述一下您提供的服务" autocomplete="off" size="medium"
          type="textarea" />
      </el-form-item>
      <el-form-item label="资质证书：">
        <div label="图片可拖曳排序：" prop="certificates" class="content-images">
          <div class="row">
            <!-- <DragUpload :all-list="ruleForm.certificates" :limit="5" @allList="certificates" /> -->
            <DragUpload :all-list="ruleForm.certificates" :limit="5" />
            <div class="gray-tip">请：图片上传不超过5张，图片支持jpg/png格式，不超过500kb，尺寸为800*800</div>
          </div>
        </div>
      </el-form-item>
      <!-- 店铺简介： -->
      <el-form-item label="店铺简介：">
        <edit class="edit" />
      </el-form-item>
      <el-form-item label="店铺地址：">
        <v-amap @mapDing="getCoordinate"></v-amap>
      </el-form-item>
      <el-form-item class="submmit-form-item">
        <el-button type="primary" class="public-el-submit-btn">提交</el-button>
      </el-form-item>
    </el-form>
    <!-- 预览图片 -->
    <el-dialog title="图片查看" :visible.sync="dialogVisibleimg" :width="dialogWidth">
      <img :src="dialogImageUrl" alt="" @load="onLoadImg" :width="boxWidth" />
    </el-dialog>
  </div>
</template>

<script>
  import edit from '../utils/edit.vue'
  import DragUpload from '../utils/DragUpload' // 引入vue-draggable
  import uploadOne from '../utils/uploadOne' // 引入vue-draggable
  import amap from '../utils/amap.vue'
  export default {
    components: {
      DragUpload,
      uploadOne,
      edit,
      'v-amap': amap
    },
    data() {
      return {
        shopLogo: require('../../assets/images/shop_logo.png'),
        //上传店铺横幅 开始
        hideUploadBtn:false,
        boxWidth: "",
        dialogWidth: "",
        dialogVisibleimg: false,
        dialogImageUrl: "",
        formdata: new FormData(),
        fileList: [],
        addimg: [],
        ruleForm: {
          csAvatar: "",
        },
        //上传店铺横幅 结束
        limit: 1, // 上传限制图片数量
        shopInfo: {
          logoUrl: '', // 店铺logo
          bannerUrl: '', // 店铺横幅
          name: '', // 店铺名称
          telName: '', //联系人
          tel: '', // 联系电话
          address: '' // 店铺地址
        },
        // 发布信息
        demandInfo: {
          infoType: '', // 信息类型
          infoBrand: '', // 设备品牌
          infoModel: '', // 设备型号
          infoTitle: '' // 信息标题
        },
        // 信息类型
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
    computed: {
      uploadDisabled: function() {
        console.log(this.ruleForm.csAvatar)
        return this.ruleForm.csAvatar != '';
      },
    },
    methods: {
      //预览图片 加载图片之前先设置高度
      onLoadImg: function(e) {
        var img = e.target;
        var width = 0;
        if (img.fileSize > 0 || (img.width > 1 && img.height > 1)) {
          width = img.width;
        }
        if ((img.height > img.width) && width > 370) {
          width = 370
        } else if (width > 600) {
          width = 600
        }
        this.boxWidth = width + 'px';
        this.dialogWidth = width + 40 + 'px';
      },
      // 图片上传尺寸大小检验
      beforeUpload(file) {
        let _this = this
        const is1M = file.size / 1024 / 1024 < 1; // 限制小于1M
        const isSize = new Promise(function(resolve, reject) {
          let width = 654; // 限制图片尺寸为654X270
          let height = 270;
          let _URL = window.URL || window.webkitURL;
          let img = new Image();
          console.log("上传图片:", new Image())
          console.log(_URL)
          img.onload = function() {
            let valid = img.width === width && img.height === height;
            valid ? resolve() : reject();
          }
          img.src = _URL.createObjectURL(file);
        }).then(() => {
          return file;
        }, () => {
          _this.$message.error('图片尺寸限制为654 x 270，大小不可超过1MB')
          return Promise.reject();
        });
        if (!is1M) {
          _this.$message.error('图片尺寸限制为654 x 270，大小不可超过1MB')
        }
        return isSize & is1M
      },
      // 更换店铺横幅
      handleChange(file, fileList) {
        console.log(file)
        const isJPG = file.raw.type === "image/jpeg" || file.raw.type === "image/png";
        const isLt5M = file.size / 1024 / 1024 < 2;
        if (!isJPG) {
          this.$message.error("上传头像图片只能是 JPG 、png 格式!");
          fileList.splice(-1, 1); //移除错误文件
          return false;
        }
        ////////////////////////
        const isSize = new Promise(function(resolve, reject){
            // let width = 750;
            // let height = 1642;
            let _URL = window.URL || window.webkitURL;
            let img = new Image();
            img.onload = function(){
              let valid = img.width / img.height === 1.67;
              valid ? resolve() : reject();
            }
            img.src = _URL.createObjectURL(file);
          }).then(()=>{
            return file;
          }, ()=>{
            // this.$message({
            //   message:'上传图片比例建议为5：3!请重新选择!'
            // });
            this.isLoad = true
            this.errText = '上传图片比例只能为5:3, 请重新选择上传!'
            return Promise.reject()
            return false;//必须加上return false; 才能阻止
          })

        ////////////////////////

        if (!this.isSize(file)) {
          fileList.splice(-1, 1);
          return false;
        }
        if (!isLt5M) {
          this.$message.error("上传头像图片大小不能超过 2MB!");
          fileList.splice(-1, 1);
          return false;
        }
        this.addimg = fileList[0].raw;
        this.ruleForm.csAvatar = this.addimg;
        this.hideUploadBtn= true
      },
      //判断宽高是否满足要求
      isSize(file){
        return true
        // let _this = this;
        // let imgWidth = "";
        // let imgHight = "";
        // const isSize = new Promise(function(resolve, reject) {
        //   let width = 1280;
        //   let height = 800;
        //   let _URL = window.URL || window.webkitURL;
        //   let img = new Image();
        //   img.onload = function() {
        //     imgWidth = img.width;
        //     imgHight = img.height;
        //     let valid = img.width == width && img.height == height;
        //     valid ? resolve() : reject();
        //   }
        //   img.src = _URL.createObjectURL(file);
        // }).then(() => {
        //   return file;
        // }, () => {
        //   _this.$message.warning({
        //     message: '上传文件的图片大小不合符标准,宽需要为1280px，高需要为800px。当前上传图片的宽高分别为：' + imgWidth + 'px和' + imgHight + 'px',
        //     btn: false
        //   })
        //   return Promise.reject();
        // });
        // console.log(isSize);
        // return isSize;
      },
      // 删除活动展示照片
      handleRemove(file, fileList) {
        console.log(fileList)
        this.ruleForm.csAvatar = '';
        this.formdata = new FormData();
        this.hideUploadBtn= false
      },
      // 活动展示照片预览
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisibleimg = true;
      },
      //搜索地址 查询结果
      getCoordinate(data) {
        console.log("getCoordinate:", data)
      },
      back() {
        this.$router.back()
      },
      // 图片可拖曳排序
      trialImgs(allList) {
        this.ruleForm.trialImgs = allList
      }

    }
  }
</script>

<style scoped lang="less">
  .box {
    height: 100%;
  }
  /deep/.el-dialog__body{
    background-color: #fff;
  }
  // 隐藏上传组件
  .hide {
    height: 70px;
    /deep/.el-upload--picture-card {
      display: none !important;
    }
  }


  // 编辑区域
  .eidt-box {
    background-color: #FFFFFF;
    box-shadow: 0px 2px 10px 1px rgba(0, 0, 0, 0.06);
    border-radius: 6px 6px 6px 6px;
    padding: 20px 35px 30px 15px;

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
    .banner-box{
      /deep/.el-upload--picture-card{
        width: 560px;
        height: 70px;
        line-height: 80px;
      }
      /deep/.el-upload-list--picture-card .el-upload-list__item{
        width: 560px;
        height: 70px;
      }
    }
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
