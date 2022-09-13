<template>
  <div v-loading="loading" class="images-content">
    <el-upload ref='upload' class="upload-add" list-type="picture-card"  :show-file-list="false" multiple
      action="#" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :auto-upload="false"
      :file-list="fileList" :on-success="uploadAppSuccess" :on-error="handleImageError"
      :before-upload="beforeAvatarUpload" :on-change="changehandleupload"
      :on-exceed="limitNum()" :limit="limit"
      accept=".gif,.jpeg,.jpg,.JPG,.JPEG,.png,.svg,.ico" title="点击上传" v-show="isShowUpload">
      <!-- <img src="../../assets/images/icon_add-pic.png" alt=""> -->
      <img src="../../../public/imgs/icon_add-pic.png" alt="">
      <span>添加图片</span>
    </el-upload>
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
    props: {
      allList: Array,
      limit:Number
    },
    components: {
      draggable,
    },
    data() {
      return {
        isShowUpload: true, //是否展示上传图片
        loading: false,
        allListChild: [],
        imgUrl: '',
        drag: false,
        qiniuUploadForm: {}, // 七牛图片的上传对象
        dialogVisible: false,
        dialogImageUrl: '',
        fileList: []
      };
    },
    methods: {
      beforeAvatarUpload(file) {
        this.loading = true;
        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isLt10M) {
          this.$message.error('图片大小不超过10M')
          return
        }
        // return api.getQiniuToken().then((res) => {   // 这里需要配置自己的七牛云api接口
        //   // 配置上传的七牛token
        //   this.qiniuUploadForm = {
        //     token: res.retInfo,
        //     name: file.name,
        //     key: Math.floor(Math.random() * 10 + 1) + file.name,
        //   };
        // });
      },

      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file;
        this.dialogVisible = true;
      },
      uploadAppSuccess(file) {
        coonsole.log("uploadAppSuccess")
        var temp = {
          imgUrl: 'https://XXXX.com/' + file.retInfo,
          orderNumber: this.allListChild.length
        };
        this.allListChild.push(temp) // 启动拖拽功能
        this.$emit('allList', this.allListChild)
        setTimeout(this.loading = false, 10000)
      },
      // 上传图片失败
      handleImageError(err, file) {
        coonsole.log("handleImageError")
        if (err.status == 614) {
          alert("七牛云上已存在同名称图片！");
        } else {
          alert(JSON.stringify(err));
        }
        this.loading = false
      },
      changehandleupload(file) {
        console.log("handleupload");
        console.log(file);
        var temp = {
          imgUrl: 'https://XXXX.com/' + file.retInfo,
          orderNumber: this.allListChild.length
        };
        this.allListChild.push(temp) // 启动拖拽功能
        this.$emit('allList', this.allListChild)
        setTimeout(this.loading = false, 10000)
        this.isShow()
      },
      handlePreview(file) {
        console.log(file);
        this.dialogVisible = true;
      },
      //删除图片
      deleImg(data, index) {
        this.allListChild.splice(index, 1)
        this.isShow()
      },
      limitNum(files, fileList){
        console.log("files",files)
        console.log("fileList",fileList)
      },
      // 拖动排序
      datadragEnd(evt) {
        // console.log('拖动前的索引 :' + evt.oldIndex)
        // console.log('拖动后的索引 :' + evt.newIndex)
        this.allListChild.map((item, index) => {
          item.orderNumber = index
        })
        this.$emit('allList', this.allListChild)
      },
      isShow(){
        if(this.allListChild.length >=5){
          this.isShowUpload = false
        }else{
          this.isShowUpload = true
        }
      }

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
      allList(newVal) {
        this.allListChild = newVal;
      }
    }
  }
</script>
<style lang="less" scoped>
  .images-content {
    display: flex;
    justify-content: flex-start;
    align-items: center;

  }

  .img-list {
    display: inline-block;
  }

  .img-wrapper {
    float: left;
    position: relative;
    margin-right: 20px;
    // margin-bottom: 20px;
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
    // margin-right: 5px;
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
