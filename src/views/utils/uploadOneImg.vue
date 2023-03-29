<template>
  <div class="images-content">
    <label>
      <div class="upload-img" v-show="isShowUpload" v-loading="loading">
        <i class="iconfont">&#xe622;</i>
        <input type="file" id="inputFile" accept="image/png, image/jpeg, image/gif, image/jpg" @change="previewFile"
          style="display: none; " class="hiddenInput" multiple="multiple">
      </div>
    </label>
    <div class="img-wrapper" v-show="!isShowUpload">
      <el-image :src="imgObj">
      </el-image>
      <!-- 鼠标经过图片放大icon和删除icon -->
      <div class="operate-wrap" :title="'拖曳图片可排序'">
        <div class="operate-bg"></div> <!-- 遮罩 -->
        <i class="el-icon-delete del-icon" @click="deleImg(imgObj)"></i> <!-- 删除图片 -->
        <i class="el-icon-zoom-in preview-icon" @click="handlePictureCardPreview(imgObj)"></i>
        <!-- 点击显示原图 -->
      </div>
      <!-- 原图显示弹框 -->
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import {
    uploadImage
  } from '@/api/public'
  export default {
    name: "uploadOneImg",
    props: ['imgList'],
    data() {
      return {
        limit: 1,
        isShowUpload: true, //是否展示上传图片
        imgObj: '',
        dialogVisible: false,
        dialogImageUrl: '',
        loading: false
      };
    },
    mounted() {
      this.imgObj = this.imgList
      if (this.imgObj) {
        this.isShowUpload = false
      } else {
        this.isShowUpload = true;
      }
    },
    methods: {
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file;
        this.dialogVisible = true;
      },
      previewFile(e) {
        try {
          this.loading = true
          // 1.获取用户选择的文件对象
          const files = e.target.files
          if (files.length === 0) {
            // 2.1用户没有选择图片(使用默认图片)
          } else {
            // 2.2用户选择了图片(使用选择的图片)
            // ◆将 File 对象 转成 BASE64 字符串
            // 1.创建 FileReader 对象
            const fr = new FileReader()
            // 2.调用 readAsDataURL 函数，读取文件内容
            fr.readAsDataURL(files[0])
            // 3.监听 fr 的 onload 事件
            fr.onload = (e) => {
              let _this = this;
              //上传图片
              let param = new FormData(); //创建form对象
              param.append('file', files[0]); //通过append向form对象添加数据
              uploadImage(param).then(response => {
                if (response.data.code != 10000) {
                  _this.$message.error(response.data.message)
                } else {
                  _this.imgObj = response.data.data

                  _this.$emit('imgObj', _this.imgObj)
                }
                _this.loading = false
              })
            }
          }
        } catch (e) {
          this.message.error("图片上次失败：",e)
          this.loading = false
        } finally {
          if (this.imgObj) {
            this.isShowUpload = false;
          } else {
            this.isShowUpload = true;
          }
        }
      },
      //删除图片
      deleImg(data, index) {
        this.imgObj = ''
        this.isShowUpload = true;
        this.$emit('imgObj', this.imgObj)
      },
    },
    watch: {
      //监听   商品图片
      imgList(newVal) {
        this.imgObj = newVal
        if (this.imgObj) {
          this.isShowUpload = false
        } else {
          this.isShowUpload = true;
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  /deep/.el-dialog__body {
    background-color: #fff;
  }

  .images-content {
    display: flex;
    justify-content: flex-start;
    align-items: center;

    ul {
      margin-left: 0px !important;
    }
  }

  .upload-img {
    width: 40px;
    height: 40px;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 4px 4px 4px 4px;
    border: 1px solid #EBEEF5;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    cursor: pointer;
    font-size: 20px;
    color: #BEBEBE;
    // img {
    //   width: 20px;
    //   height: 20px;
    // }

    .hiddenInput {
      position: absolute;
      width: 100%;
      height: 100%;
      display: none;
    }
  }

  .el-image {
    width: 100%;
    height: 100%;
  }

  .img-list {
    display: inline-block;
  }

  .img-wrapper {
    float: left;
    position: relative;
    border: 1px dashed #c0ccda;
    border-radius: 6px;
    width: 40px;
    height: 40px;
    overflow: hidden;

    &:hover {
      .operate-wrap {
        display: block;
      }
    }
  }

  .operate-wrap {
    display: none;
  }

  .operate-bg {
    background: #000000;
    width: 40px;
    height: 50px;
    opacity: 0.4;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 8;
  }

  .del-icon {
    position: absolute;
    top: 0;
    right: 22px;
    font-size: 10px;
    line-height: 40px;
    color: #ffffff;
    z-index: 10;
  }

  .preview-icon {
    position: absolute;
    top: 0;
    left: 22px;
    font-size: 10px;
    line-height: 40px;
    color: #ffffff;
    z-index: 10;
  }

  .upload-add {
    margin-right: 15px;

    /deep/ .el-upload--picture-card {
      width: 70px;
      height: 70px;
      background: #FFFFFF;
      border-radius: 4px 4px 4px 4px;
      border: 1px solid #EBEEF5;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      line-height: normal;

      img {
        width: 20px;
        height: 20px;
      }

      span {
        margin-top: 8px;
        font-size: 12px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        font-weight: 400;
        color: #BBBBBB;
      }
    }
  }
</style>
