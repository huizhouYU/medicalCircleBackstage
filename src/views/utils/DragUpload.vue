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
    props: ['imgList', 'limit', 'limitWidth', 'limitHeight'],
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
    methods: {

      handlePictureCardPreview(file) {
        this.dialogImageUrl = file;
        this.dialogVisible = true;
      },
      previewFile(e) {
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
            // const isLt3M = files[0].size / 1024  < 3*1024;
            const isLt3M = files[0].size / 1024 / 1024 < 3;
            if (isLt3M) {
              let imgWidth = "";
              let imgHight = "";
              new Promise(function(resolve, reject) {
                let _URL = window.URL || window.webkitURL;
                let img = new Image();
                img.src = _URL.createObjectURL(files[0]);
                img.onload = function() {
                  imgWidth = img.width;
                  imgHight = img.height;
                  let valid = img.width == _this.limitWidth && img.height == _this.limitHeight;
                  valid ? resolve() : reject();
                }
              }).then(() => {
                // 通过 e.target.result 获取到读取的结果，值是 BASE64 格式的字符串
                // 法1
                // this.$refs.imgRef.src = e.target.result
                // 法2
                var temp = {
                  file: files[0],
                  imgUrl: e.target.result,
                  orderNumber: _this.allListChild.length
                };
                _this.allListChild.push(temp) // 启动拖拽功能
                if (_this.allListChild.length >= _this.limit) {
                  _this.isShowUpload = false;
                }
                _this.$emit('allList', _this.allListChild)

                return files[0]
              }, () => {
                _this.$message.warning({
                  message: '上传文件的图片大小不合符标准,宽需要为' + this.limitWidth + 'px，高需要为' + this.limitHeight +
                    'px。当前上传图片的宽高分别为：' + imgWidth + 'px和' + imgHight + 'px',
                  btn: false
                })
                return Promise.reject();
              });
            } else {
              _this.$message.warning({
                message: '上传文件的图片大小不能超过3M!',
                btn: false
              })
            }

          }
        }
      },
      //删除图片
      deleImg(data, index) {
        this.allListChild.splice(index, 1)
        if (this.allListChild.length >= this.limit) {
          this.isShowUpload = false;
        } else {
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
