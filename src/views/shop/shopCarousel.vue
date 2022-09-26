<template>
  <div class="box">
    <div class="content">
      <span>店铺轮播图：</span>
      <div class="imgs-btn">
        <!-- :before-upload="beforeUpload" -->
        <el-upload action="aaa" list-type="picture-card" :class="{ disabled: uploadDisabled }" :auto-upload="false"
          :multiple="true" :limit="3" ref="upload" :on-change="handleChange" :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove" :file-list="fileList" :on-exceed="limitNum" >
          <i class="el-icon-plus"></i>
          <div class="el-upload__tip" slot="tip">请上传950*425的图片，大小不超过2m，最多可上传3张</div>
        </el-upload>
        <!-- 预览图片 -->
        <el-dialog title="图片查看" :visible.sync="dialogVisibleimg" :width="dialogWidth">
          <img :src="dialogImageUrl" alt=""  @load="onLoadImg" :width="boxWidth"/>
        </el-dialog>
       <!-- <el-dialog title="图片查看" :visible.sync="dialogBigImgVisible" :width="dialogWidth">
        	<img :src="bigImgSrc" @load="onLoadImg" :width="boxWidth"/>
        </el-dialog> -->

        <!-- <button class="btn-save">保存设置</button> -->
        <el-button type="primary" class="btn-save public-el-submit-btn">保存设置</el-button>

      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        boxWidth: "",
        dialogWidth: "",
        dialogVisibleimg: false,
        dialogImageUrl: "",
        formdata: new FormData(),
        fileList: [],
        addimg: [],
        ruleForm: {
          csAvatar: "",
        }
      };
    },
    methods: {
      onLoadImg: function (e) {
        var img = e.target;
        var width = 0;
        if (img.fileSize > 0 || (img.width > 1 && img.height > 1)) {
          width = img.width;
        }
        if ((img.height > img.width) &&  width > 370) {
            width = 370
        } else if (width > 600) {
            width = 600
        }
        this.boxWidth= width + 'px';
        this.dialogWidth = width + 40 + 'px';
        },
      // 图片上传尺寸大小检验
      beforeUpload (file) {
        let _this = this
        const is1M = file.size / 1024 / 1024 < 1; // 限制小于1M
        const isSize = new Promise(function (resolve, reject) {
          let width = 654; // 限制图片尺寸为654X270
          let height = 270;
          let _URL = window.URL || window.webkitURL;
          let img = new Image();
          console.log("上传图片:",new Image())
          console.log(_URL)
          img.onload = function () {
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
        return isSize&is1M
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
      // 添加活动展示照片
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
      },
      limitNum(file, fileList) {
        this.$message.error("当前限制选择 3 张图片，本次选择了 " + file.length + " 张图片，已上传了 " + fileList.length + " 张图片");
      },
      // 删除活动展示照片
      handleRemove(file, fileList) {
        console.log(fileList)
        this.ruleForm.csAvatar = '';
        this.formdata = new FormData();
      },
      // 活动展示照片预览
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisibleimg = true;
      },
      // 渲染编辑获取id
      apply() {
        this.fileList = [{
          url: ""
        }]; //这里是踩坑的点，必须写
        this.fileList[0].url = res.data.csAvatar; //这里是调用接口获取到的值 res.data.csAvatar，赋值就可以回显了
        //this.fileList[0].url 做的是单张图片回显，多张图片回显可以去掉[0]
      },
      // 提交上传按钮
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.formdata = new FormData();
            if (this.ruleForm.csAvatar) { //新增
              this.formdata.append("picture", this.ruleForm.csAvatar); //上传图片要把参数和值放在FormData里
              //如果有其他参数，也要一并放在this.formdata里
              /* 例：
	            this.formdata.append("csLevel", this.ruleForm.serviceLevel);
          		this.formdata.append("csMaximum", this.ruleForm.size);
          		*/
            }
            //上传图片的接口（重要看传参部分怎么传参）
            CustomerServiceController.add(this, this.formdata) //传参直接传this.formdata即可
              .then((res) => {
                if (res.success == true) {
                  this.$message.success("新建成功");
                } else {
                  this.$message.error("新建失败");
                }
              })
              .catch((e) => {});
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      },
    },
    computed: {
      uploadDisabled: function() {
        console.log(this.ruleForm.csAvatar)
        return this.ruleForm.csAvatar != '';
      },
    }
  }
</script>

<style scoped lang="less">
  /deep/.el-dialog__body{
    background-color: #fff;
  }
  .box {
    height: 100%;
  }

  .content {
    height: calc(100% - 100px);
    background: #FFFFFF;
    box-shadow: 0px 2px 10px 1px rgba(0, 0, 0, 0.06);
    border-radius: 6px 6px 6px 6px;
    display: flex;
    justify-content: flex-start;
    font-size: 12px;
    font-family: Microsoft YaHei-Regular, Microsoft YaHei;
    font-weight: 400;
    padding: 25px 15px;

    .imgs-btn {
      margin-left: 15px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;

      //修改上传图片 list的排列方式
      /deep/ .el-upload-list--picture-card {
        display: flex;
        flex-direction: column;
      }

      // 修改上传图片 list的大小以及间距
      /deep/ .el-upload-list--picture-card .el-upload-list__item {
        width: 200px;
        height: 70px;
        margin: 0 8px 25px 0;
      }

      // 修改上传图片(按钮)的大小
      /deep/ .el-upload--picture-card {
        width: 200px;
        height: 70px;
        line-height: 78px;
      }

      // 修改上传图片下面的文字备注的颜色大小等
      /deep/.el-upload__tip {
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        font-weight: 400;
        color: #BBBBBB;
      }
    }

    .btn-save {
      margin-top: 20px;
    }
  }
</style>
