<template>
  <div class="upload-img-item">
    <div v-if="cardImgUrl != ''" class="upload-img card-img" @mouseenter="showCardDiv" @mouseleave="hideCardDiv">
      <img :src="cardImgUrl" alt="" class="card-img-info">
      <!-- 预览+删除 -->
      <div class="preview-del-div" v-show="isShowCardImgDiv">
        <i class="el-icon-zoom-in" @click="handlePictureCardPreview"></i>
        <i class="el-icon-delete" @click="deleteImg"></i>
      </div>
    </div>
    <label v-else>
      <div class="upload-img upload-img-whole" v-if="isWhole">
        <img :src="mrSrc" alt="">
        <input type="file" id="inputFile" accept="image/png, image/jpeg, image/gif, image/jpg" @change="previewFile"
          style="display: none; " class="hiddenInput" multiple="multiple">
      </div>
      <div class="upload-img" v-else>
        <img :src="mrSrc" alt="">
        <span>添加图片</span>
        <input type="file" id="inputFile" accept="image/png, image/jpeg, image/gif, image/jpg" @change="previewFile"
          style="display: none; " class="hiddenInput" multiple="multiple">
      </div>
    </label>
    <!-- 原图显示弹框 -->
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
  export default {
    props: ["mrSrc", "isWhole"],
    data() {
      return {
        cardImgUrl: "",
        isShowCardImgDiv: false,
        chosedImgUrl: '',
        dialogVisible: false,
        dialogImageUrl: ''
      }
    },
    methods: {
      showCardDiv() {
        this.isShowCardImgDiv = true;
      },
      hideCardDiv() {
        this.isShowCardImgDiv = false;
      },
      handlePictureCardPreview() {
        this.dialogImageUrl = this.cardImgUrl;
        this.dialogVisible = true;
      },
      deleteImg() {
        this.cardImgUrl = this.mrSrc
        this.$emit("getImgFile", "")
      },
      previewFile(e) {
        // 1.获取用户选择的文件对象
        const files = e.target.files
        if (files.length === 0) {
          // 2.1用户没有选择图片(使用默认图片)
          this.cardImgUrl = ""
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
            // 通过 e.target.result 获取到读取的结果，值是 BASE64 格式的字符串
            // 法1
            // this.$refs.imgRef.src = e.target.result
            // 法2
            this.cardImgUrl = e.target.result
            this.$emit("getImgFile", files[0])
            return files[0]
          }
        }
      }
    }
  }
</script>

<style scode lang="less">
  // 每一个上传图片
  .upload-img-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 12px;
    font-family: Microsoft YaHei-Regular, Microsoft YaHei;
    font-weight: 400;
    color: #999999;

    //展示已上传的照片
    .card-img {
      position: relative;
      border-radius: 4px;

      .card-img-info {
        width: 100%;
        height: 100%;
        border-radius: 4px;
      }

      .preview-del-div {
        position: absolute;
        border-radius: 4px;
        border: 1px solid #EBEEF5;
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.4);
        display: flex;
        justify-content: space-around;
        align-items: center;

        i {
          color: #fff;
          font-size: 18px;
          cursor: pointer;
        }
      }
    }

    // 左边上传图片
    .upload-img {
      width: 80px;
      height: 80px;
      border-radius: 4px;
      border: 1px solid #EBEEF5;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      position: relative;
      cursor: pointer;

      img {
        width: 37px;
        height: 37px;
      }

      span {
        font-size: 12px;
        font-weight: 400;
        height: 20px;
        line-height: 20px;
      }

      .hiddenInput {
        position: absolute;
        width: 100%;
        height: 100%;
        display: none;
      }
    }

    .upload-img-whole {
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
