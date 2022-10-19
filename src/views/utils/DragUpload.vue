<template>
  <div class="images-content">
    <label>
      <div class="upload-img" v-show="isShowUpload">
        <img src="../../../public/imgs/icon_add-pic.png" alt="">
        <span>添加图片</span>
        <input type="file" id="inputFile" accept="image/png, image/jpeg, image/gif, image/jpg" @change="previewFile"
          style="display: none; " class="hiddenInput" multiple="multiple">
      </div>
    </label>
    <draggable tag="ul" v-model="allListChild" v-bind="dragOptions" @update="datadragEnd" @start="drag = true"
      @end="drag = false" style="margin-left:15px;">
      <div class="img-wrapper" v-for="(item,index) in allListChild" :key="index">
        <el-image :src="item.imgUrl">
        </el-image>
        <!-- 鼠标经过图片放大icon和删除icon -->
        <div class="operate-wrap" :title="'拖曳图片可排序'">
          <div class="operate-bg"></div> <!-- 遮罩 -->
          <i class="el-icon-delete del-icon" @click="deleImg(item.URL,index)"></i> <!-- 删除图片 -->
          <i class="el-icon-zoom-in preview-icon" @click="handlePictureCardPreview(item.imgUrl,index)"></i>
          <!-- 点击显示原图 -->
        </div>
        <!-- 原图显示弹框 -->
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </div>
    </draggable>

  </div>
</template>

<script>
  import draggable from "vuedraggable";
  export default {
    name: "DragUpload",
    props: ['imgList', 'limit'],
    components: {
      draggable,
    },
    data() {
      return {
        isShowUpload: true, //是否展示上传图片
        allListChild: [],
        // imgUrl: '',
        drag: false,
        dialogVisible: false,
        dialogImageUrl: ''
      };
    },
    created() {
      console.log("created")
      console.log("created  allListChild:", this.allListChild)
    },
    mounted() {
      console.log("mounted")
      console.log("mounted  allListChild:", this.allListChild)
    },
    methods: {

      // beforeAvatarUpload(file) {
      //   this.loading = true;
      //   const isLt10M = file.size / 1024 / 1024 < 10;
      //   // if (!isLt10M) {
      //   //   this.$message.error('图片大小不超过10M')
      //   //   return
      //   // }
      //   let _this = this
      //    const is1M = file.size / 1024 / 1024 < 1; // 限制小于1M
      //   const isSize = new Promise(function(resolve, reject) {
      //      let width = 654; // 限制图片尺寸为654X270            let height = 270;
      //     let _URL = window.URL || window.webkitURL;
      //      let img = new Image();
      //      console.log("上传图片:", new Image())
      //      console.log(_URL)
      //      img.onload = function() {
      //        let valid = img.width === width && img.height === height;              valid ? resolve() : reject();
      //     }
      //     img.src = _URL.createObjectURL(file);          }).then(() => {
      //      return file;
      //    }, () => {            _this.$message.error('图片尺寸限制为654 x 270，大小不可超过1MB')
      //      return Promise.reject();          });
      //   if (!is1M) {
      //      _this.$message.error('图片尺寸限制为654 x 270，大小不可超过1MB')
      //    }          return isSize & is1M
      //   // return api.getQiniuToken().then((res) => {   // 这里需要配置自己的七牛云api接口
      //   //   // 配置上传的七牛token
      //   //   this.qiniuUploadForm = {
      //   //     token: res.retInfo,
      //   //     name: file.name,
      //   //     key: Math.floor(Math.random() * 10 + 1) + file.name,
      //   //   };
      //   // });
      // },

      handlePictureCardPreview(file) {
        this.dialogImageUrl = file;
        this.dialogVisible = true;
      },
      previewFile(e) {
        console.log("上传图片")
        console.log("this.allListChild:", this.allListChild)
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
            // 通过 e.target.result 获取到读取的结果，值是 BASE64 格式的字符串
            // 法1
            // this.$refs.imgRef.src = e.target.result
            // 法2
            var temp = {
              file: files[0],
              imgUrl: e.target.result,
              orderNumber: this.allListChild.length
            };
            this.allListChild.push(temp) // 启动拖拽功能
            if (this.allListChild.length >= this.limit) {
              this.isShowUpload = false;
            }
            this.$emit('allList', this.allListChild)
          }
        }
      },
      //删除图片
      deleImg(data, index) {
        this.allListChild.splice(index, 1)
        if (this.allListChild.length >= this.limit) {
          this.isShowUpload = false;
        }else{
           this.isShowUpload = true;
        }
        this.$emit('allList', this.allListChild)
        // this.isShow()
      },
      // 拖动排序
      datadragEnd(evt) {
        this.allListChild.map((item, index) => {
          item.orderNumber = index
        })
        this.$emit('allList', this.allListChild)
      },
    },
    computed: {
      dragOptions() {
        return {
          animation: 200,
          group: "description",
          disabled: false,
          ghostClass: "ghost"
        };
      },
    },
    watch: {
      //监听 需求  商品图片  或者  个人图片
      imgList(newVal) {
        console.log("newVal:", newVal)
        if (newVal != null) {
          for (var item of newVal) {
            var temp = {
              file: '',
              imgUrl: 'https://images.weserv.nl/?url=' + item,
              orderNumber: this.allListChild.length
            };
            this.allListChild.push(temp) // 启动拖拽功能
          }
          if (this.allListChild.length >= this.limit) {
            this.isShowUpload = false;
          }
        }
      },

    }
  }
</script>
<style lang="less" scoped>
  /deep/.el-dialog__body{
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
    width: 70px;
    height: 70px;
    background: #FFFFFF;
    border-radius: 4px 4px 4px 4px;
    border: 1px solid #EBEEF5;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    position: relative;
    cursor: pointer;
    margin-right: 16px;
    img {
      width: 20px;
      height: 20px;
    }
    span {
      height: 12px;
      line-height: 12px;
      font-size: 12px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
      font-weight: 400;
      color: #BBBBBB;
    }
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
    margin-right: 20px;
    border: 1px dashed #c0ccda;
    border-radius: 6px;
    width: 70px;
    height: 70px;
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
    width: 70px;
    height: 70px;
    opacity: 0.4;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 8;
  }
  .del-icon {
    position: absolute;
    top: 0;
    right: 40px;
    font-size: 20px;
    line-height: 70px;
    color: #ffffff;
    z-index: 10;
  }
  .preview-icon {
    position: absolute;
    top: 0;
    left: 40px;
    font-size: 20px;
    line-height: 70px;
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
