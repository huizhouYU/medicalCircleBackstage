<template>
  <el-upload action="aaa" list-type="picture-card" :auto-upload="false"
     ref="upload" :on-change="handleChange" :on-preview="handlePictureCardPreview"
    :on-remove="handleRemove" :file-list="fileList" :class="{ hide: hideUploadBtn }">
    <i class="el-icon-plus"></i>
  </el-upload>
</template>

<script>
  export default{
    data(){
      return{
        //上传店铺横幅 开始
        hideUploadBtn:false,
        fileList: [],
        ruleForm: {
          csAvatar: "",
        },
      }
    },
    methods:{
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
      // 更换店铺横幅
      handleChange(file, fileList) {
        console.log(file)
        const isJPG = file.raw.type === "image/jpeg" || file.raw.type === "image/png";
        const isLt3M = file.size / 1024 / 1024 < 3;
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
        if (!isLt3M) {
          this.$message.error("上传头像图片大小不能超过 3MB!");
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
    }
  }
</script>

<style scoped lang="less">

  // 隐藏上传组件
  .hide {
    /deep/.el-upload--picture-card {
      display: none !important;
    }
  }
</style>
