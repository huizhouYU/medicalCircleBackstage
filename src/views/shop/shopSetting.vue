<template>
  <div class="box">
    <!-- 编辑区域 -->
    <el-form ref="ruleForm" :rules="rules" :model="shopInfo" label-width="100px" label-position="right"
      class="eidt-box">
      <!-- 产品主图 -->
      <el-form-item label="店铺店标：">
        <div label="图片可拖曳排序：" prop="trialImgs" class="content-images">
          <div class="row">
            <uploadOne :mrSrc="storeLogo" :isWhole="true" @getImgFile="getStoreLogoImgFile" :limitWidth="limitWidth"
              :limitHeight="limitHeight"></uploadOne>
            <div class="gray-tip">请上传300*300的图片，大小不超过2m</div>
          </div>
        </div>
      </el-form-item>
      <!-- 店铺横幅 -->
      <el-form-item label="更换店铺横幅：" class="banner-box" v-if="false">
        <div class="banner-tip">
          <el-upload action="aaa" list-type="picture-card" :auto-upload="false" ref="upload" :on-change="handleChange"
            :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :file-list="fileList"
            :class="{ hide: hideUploadBtn }">
            <img v-if="shopInfo.storeBanner" :src="storeBanner" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <span class="gray-tip">请上传1200*110的图片，大小不超过2M</span>
        </div>
      </el-form-item>
      <!-- 店铺名称 -->
      <el-form-item label="店铺名称：" prop="storeName">
        <el-input v-model="shopInfo.storeName" placeholder="请输入店铺名称" autocomplete="off" size="medium" type="text" />
      </el-form-item>
      <!-- 联系人 -->
      <el-form-item label="联系人：">
        <el-input v-model="shopInfo.ownerName" placeholder="请输入联系人" autocomplete="off" size="medium" type="text" />
      </el-form-item>
      <!-- 联系电话 -->
      <el-form-item label="联系电话：" prop="tel">
        <el-input v-model="shopInfo.tel" placeholder="请输入联系电话" autocomplete="off" size="medium" type="text" />
      </el-form-item>
      <!-- 店铺地址 -->
      <el-form-item label="店铺地址：">
        <el-input v-model="shopInfo.address" placeholder="请输入店铺地址" autocomplete="off" size="medium" type="text" />
      </el-form-item>
      <!-- 服务内容 -->
      <!-- <el-form-item label="服务内容：">
        <el-input v-model="shopInfo.serviceContent" placeholder="可以描述一下您提供的服务" autocomplete="off" size="medium"
          type="textarea" />
      </el-form-item> -->
      <el-form-item label="客服二维码：">
        <div label="图片可拖曳排序：" class="content-images">
          <div class="row">
            <DragUpload :imgList="imgQrList" :limit="1" @allList="trialQrImgs" :limitWidth="800" :limitHeight="800" />
            <div class="gray-tip">上传二维码用于客户及时与您咨询和沟通商品详情，图片支持jpg/png格式，不超过3M，尺寸最大不超过800*800</div>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="资质证书：">
        <div label="图片可拖曳排序：" class="content-images">
          <div class="row">
            <DragUpload :imgList="imgList" :limit="8" @allList="trialImgs" :limitWidth="800" :limitHeight="800" />
            <div class="gray-tip">图片上传不超过8张，图片支持jpg/png格式，不超过3M，尺寸最大不超过800*800</div>
          </div>
        </div>
      </el-form-item>
      <!-- 店铺简介： -->
      <el-form-item label="店铺简介：">
        <edit class="edit" :description="shopInfo.description" @getContent="getDescription" />
      </el-form-item>
      <el-form-item label="店铺地址：">
        <v-amap @mapDing="getCoordinate" :longitude="shopInfo.longitude" :latitude="shopInfo.latitude"></v-amap>
      </el-form-item>
      <el-form-item class="submmit-form-item">
        <el-button type="primary" class="public-el-submit-btn" @click="submit" :disabled="!isSubmit">提交</el-button>
      </el-form-item>
    </el-form>
    <!-- 预览图片 -->
    <el-dialog title="图片查看" :visible.sync="dialogVisibleimg" :width="dialogWidth">
      <img :src="dialogImageUrl" alt="" @load="onLoadImg" :width="boxWidth" />
    </el-dialog>
  </div>
</template>

<script>
  import {
    storeDetail,
    storeUpdate
  } from '@/api/shop'
  import {
    uploadImage
  } from '@/api/public'
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
      var checkphone = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入手机号'))
          this.$message.error("请输入手机号")
        } else if (!this.isCellPhone(value)) {
          // 引入methods中封装的检查手机格式的方法
          callback(new Error('请输入正确的手机号!'))
          this.$message.error("请输入正确的手机号!")
        } else {
          callback()
        }
      }
      var checkStoreName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入店铺名称'))
          this.$message.error("请输入店铺名称")
        } else {
          callback()
        }
      }
      return {
        isSubmit: true,
        limitWidth: 300,
        limitHeight: 300,
        imgList: '',
        imgQrList: '',
        storeLogoImgFile: '',
        storeBannerImgFile: '',
        // shopLogo: require('../../assets/images/shop_logo.png'),
        //上传店铺横幅 开始
        hideUploadBtn: false,
        boxWidth: "",
        dialogWidth: "",
        dialogVisibleimg: false,
        dialogImageUrl: "",
        formdata: new FormData(),
        fileList: [],
        addimg: [],
        //上传店铺横幅 结束
        storeLogo: '', // 店铺logo
        storeBanner: '', // 店铺横幅
        limit: 1, // 上传限制图片数量
        shopInfo: {
          storeLogo: '', // 店铺logo
          storeBanner: '', // 店铺横幅
          storeName: '', // 店铺名称
          ownerName: '', //联系人
          tel: '', // 联系电话
          longitude: '', //经纬
          latitude: '', //纬度
          address: '', // 店铺地址
          domain:'',//客服二维码
          certificationList: [], //相关证书
          serviceContent: '', //服务内容
          description: '', //店铺简介
        },
        rules: {
          storeName: [{
            required: true,
            validator: checkStoreName,
            trigger: 'blur'
          }],
          tel: [{
            required: true,
            validator: checkphone,
            trigger: 'blur'
          }]
        },
        ruleForm: {
          trialImgs: [],
          trialQrImgs: []
        },
      }
    },
    mounted() {
      // document.documentElement.scrollTop = 0;
      this.getData()
    },
    methods: {
      getData() {
        //获取店铺详情
        storeDetail().then(response => {
          if (response.data.data != null) {
            this.shopInfo = response.data.data
            if (response.data.data.storeLogo != null) {
              this.storeLogo = this.shopInfo.storeLogo
            }
            if (response.data.data.storeBanner != null) {
              this.storeBanner = this.shopInfo.storeBanner
            }
            this.imgList = this.shopInfo.certificationList
            this.imgQrList = []
            if (this.shopInfo.domain != undefined && this.shopInfo.domain != null) {
              this.imgQrList.push(this.shopInfo.domain)
            }
          }
        })
      },
      //获取店铺简介
      getDescription(val) {
        this.shopInfo.description = val
      },
      submit() {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            this.submitData()
          } else {
            return false
          }
        })
      },
      trialImgs(allList) {
        this.ruleForm.trialImgs = allList
      },
      trialQrImgs(allList) {
        this.ruleForm.trialQrImgs = allList
      },
      async submitData() {
        var flag = true
         this.isSubmit = false
        //上传店铺logo
        if (this.storeLogoImgFile != '') {
          let param = new FormData(); //创建form对象
          param.append('file', this.storeLogoImgFile); //通过append向form对象添加数据
          await uploadImage(param).then(response => {
            if (response.data.code != 10000) {
              this.$message.error(response.data.message)
              flag = false
              this.isSubmit = true
            } else {
              this.shopInfo.storeLogo = response.data.data
            }
          })
        }
        // //上传店铺横幅
        if (flag && this.storeBannerImgFile != '') {
          let param = new FormData(); //创建form对象
          param.append('file', this.storeBannerImgFile); //通过append向form对象添加数据
          await uploadImage(param).then(response => {
            if (response.data.code != 10000) {
              this.$message.error(response.data.message)
              flag = false
              this.isSubmit = true
            } else {
              this.shopInfo.storeBanner = response.data.data
            }
          })
        }
        // 客服二维码
        this.shopInfo.domain = ''
        if (flag && this.ruleForm.trialQrImgs.length > 0) {
          var item = this.ruleForm.trialQrImgs[0]
          if (item.file != '') {
            let param = new FormData(); //创建form对象
            param.append('file', item.file); //通过append向form对象添加数据
            await uploadImage(param).then(response => {
              if (response.data.code != 10000) {
                this.$message.error(response.data.message)
                flag = false
                this.isSubmit = true
              } else {
                this.shopInfo.domain = response.data.data
              }
            })
          } else {
            this.shopInfo.domain = item.imgUrl
          }
        }
        //相关证书
        this.shopInfo.certificationList = []
        for (var item of this.ruleForm.trialImgs) {
          if (flag) {
            if (item.file != '') {
              let param = new FormData(); //创建form对象
              param.append('file', item.file); //通过append向form对象添加数据
              await uploadImage(param).then(response => {
                if (response.data.code != 10000) {
                  this.$message.error(response.data.message)
                  flag = false
                  this.isSubmit = true
                } else {
                  this.shopInfo.certificationList.push(response.data.data)
                }
              })
            } else {
              this.shopInfo.certificationList.push(item.imgUrl)
            }
          }
        }
        if (flag) {
          await storeUpdate(JSON.stringify(this.shopInfo)).then(response => {
            if (response.data.code == 10000) {
              this.$message.success("提交成功！")
              this.isSubmit = true
            } else {
              this.$message.success(response.data.message)
              this.isSubmit = true
            }
          })
        }
      },
      //先存储店铺logo文件
      getStoreLogoImgFile(file) {
        this.storeLogoImgFile = file
      },

      isCellPhone(val) {
        if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(val)) {
          return false
        } else {
          return true
        }
      },
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
      // 更换店铺横幅
      handleChange(file, fileList) {
        const isJPG = file.raw.type === "image/jpeg" || file.raw.type === "image/png";
        const isLt3M = file.size / 1024 / 1024 < 3;
        if (!isJPG) {
          this.$message.error("上传头像图片只能是 JPG 、png 格式!");
          fileList.splice(-1, 1); //移除错误文件
          return false;
        }
        //判断宽高是否符合要求
        if (!this.isSize(fileList[0].raw)) {
          fileList.splice(-1, 1);
          return false;
        }
        //判断图片大小是否符合要求
        if (!isLt3M) {
          this.$message.error("上传图片大小不能超过3MB!");
          fileList.splice(-1, 1);
          return false;
        }
        this.storeBannerImgFile = fileList[0].raw
        this.hideUploadBtn = true
      },
      //判断宽高是否满足要求
      async isSize(file) {
        let imgWidth = "";
        let imgHight = "";
        let valid = false
        await new Promise(function(resolve, reject) {
          let width = 1200;
          let height = 110;
          let _URL = window.URL || window.webkitURL;
          let img = new Image();
          img.src = _URL.createObjectURL(file);
          img.onload = function() {
            imgWidth = img.width;
            imgHight = img.height;
            valid = img.width == width && img.height == height;
            valid ? resolve() : reject();
          }
        }).then(() => {
          return file;
        }, () => {
          this.isLoad = true
          this.$message.warning({
            message: '上传文件的图片大小不合符标准,宽需要为1200px，高需要为110px。当前上传图片的宽高分别为：' + imgWidth + 'px和' + imgHight + 'px',
            btn: false
          })
          return false; //必须加上return false; 才能阻止
          return Promise.reject()
        })
        return valid
      },
      // 删除活动展示照片
      handleRemove(file, fileList) {
        // this.ruleForm.csAvatar = '';
        this.formdata = new FormData();
        this.hideUploadBtn = false
      },
      // 活动展示照片预览
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisibleimg = true;
      },
      //搜索地址 查询结果
      getCoordinate(data) {
        this.shopInfo.longitude = data.lng + ''
        this.shopInfo.latitude = data.lat + ''
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

  /deep/.el-dialog__body {
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
    .banner-box {
      /deep/.el-upload--picture-card {
        width: 560px;
        height: 70px;
        line-height: 80px;
      }

      /deep/.el-upload-list--picture-card .el-upload-list__item {
        width: 560px;
        height: 70px;
      }
    }

    .banner-tip {
      display: flex;
      flex-direction: column;

      img {
        width: 100%;
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
