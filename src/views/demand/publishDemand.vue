<template>
  <div>
    <!-- 编辑需求区域 -->
    <el-form ref="demandInfo" label-position="right" label-width="90px" class="demo-demandInfo eidt-box"
      :model="demandInfo" :rules="demandInfoRules">
      <!-- 信息类型 -->
      <div class="demand-item-title">信息类型</div>
      <!-- 主体类型： -->
      <el-form-item label="主体类型：" prop="articleType">
        <div class="demand-type">
          <div :class="demandInfo.articleType == 1?'typeItemChosed':'type-item'" @click="demandInfo.articleType=1">
            <span class="title">求购设备</span>
            <span class="remarks">我需要求购配件</span>
            <span class="eg">例：我的一个设备急需配件</span>
            <div class="statue" />
          </div>
          <div :class="demandInfo.articleType == 2?'typeItemChosed':'type-item'" @click="demandInfo.articleType=2">
            <span class="title">项目外包</span>
            <span class="remarks">我是第三方维修公司</span>
            <span class="eg">例：需要寻找工程师帮我去现场维修设备</span>
            <div class="statue" />
          </div>
          <div :class="demandInfo.articleType == 3?'typeItemChosed':'type-item'" @click="demandInfo.articleType=3">
            <span class="title">灵活兼职</span>
            <span class="remarks">我是医疗设备维修工程师</span>
            <span class="eg">例：我可以帮你去现场维修设备</span>
            <div class="statue" />
          </div>
        </div>
      </el-form-item>
      <!-- 基本信息 -->
      <div class="demand-item-title">基本信息</div>
      <div v-show="demandInfo.articleType ==1 || demandInfo.articleType ==2">
        <!-- 需求标题 -->
        <el-form-item label="需求标题：" prop="title">
          <el-input v-model="demandInfo.title" type="text" class="input-title" placeholder="请输入需求标题" maxlength="20"
            show-word-limit />
        </el-form-item>
        <div class="item3">
          <el-form-item label="设备名称：" class="demandInfo-item" prop="equipmentName">
            <el-input v-model="demandInfo.equipmentName" type="text" placeholder="请输入设备名称" maxlength="30"
              show-word-limit />
          </el-form-item>
          <el-form-item label="设备品牌：" class="demandInfo-item" prop="brandId">
           <!-- <el-select v-model="demandInfo.brandId" class="select-brand" @change="selectBrand">
              <el-option v-for="item in brandsOptions" :key="item.brandId" :label="item.brandName" :value="item.brandId"
                ref="brandSelect">
              </el-option>
            </el-select> -->
            <el-input v-model="demandInfo.brandName" type="text" placeholder="请输入设备品牌" />
          </el-form-item>
          <el-form-item label="设备型号：" class="demandInfo-item">
            <el-input v-model="demandInfo.equipmentType" type="text" placeholder="请输入设备型号" />
          </el-form-item>
          <el-form-item label="P/N码：" class="demandInfo-item">
            <el-input v-model="demandInfo.pnCode" type="text" placeholder="请输入P/N码" show-word-limit />
          </el-form-item>
        </div>
        <!-- 相关图片 -->
        <el-form-item label="相关图片：" class="product-images">
          <div label="图片可拖曳排序：" prop="trialImgs" class="content-images">
            <div class="row">
              <DragUpload :limit="limit" @allList="trialImgs" :imgList="imgList" :limitWidth="800" :limitHeight="800" />
              <div class="el-upload__tip gray-tip">请：图片上传不超过5张，图片支持jpg/png格式，不超过3M，尺寸为800*800</div>
            </div>
          </div>
        </el-form-item>
        <!-- 详情描述 -->
        <el-form-item label="详情描述：" class="product-detail">
          <edit class="edit" :description="demandInfo.description" @getContent="getDescription" />
        </el-form-item>
      </div>
      <div v-show="demandInfo.articleType ==2">
        <!-- 维修区域 -->
        <el-form-item label="维修区域：" prop="regionIdList">
          <el-cascader v-model="demandInfo.regionIdList" :options="cities" @change="changeFormat('cascaderRegion2')"
            ref="cascaderRegion2" />
        </el-form-item>
      </div>
      <div v-show="demandInfo.articleType ==3">
        <!-- 需求标题 -->
        <el-form-item label="需求标题：" prop="title">
          <el-input v-model="demandInfo.title" type="text" class="input-title" placeholder="请输入需求标题" maxlength="20"
            show-word-limit />
        </el-form-item>
        <!-- 维修区域 -->
        <el-form-item label="维修区域：" prop="regionIdList">
          <el-cascader v-model="demandInfo.regionIdList" :options="cities" @change="changeFormat('cascaderRegion3')"
            :props="{ multiple: true }" collapse-tags ref="cascaderRegion3" clearable />
        </el-form-item>
        <!-- 个人图片 -->
        <el-form-item label="个人图片：" class="product-images">
          <div label="图片可拖曳排序：" prop="trialImgs" class="content-images">
            <div class="row">
              <DragUpload :limit="limit" @allList="trialImgs" :imgList="imgList" :limitWidth="800" :limitHeight="800" />
              <div class="el-upload__tip gray-tip">请：图片上传不超过5张，图片支持jpg/png格式，不超过3M，尺寸为800*800</div>
            </div>
          </div>
        </el-form-item>
        <!-- 个人简述 -->
        <el-form-item label="个人简述：" class="product-detail">
          <edit class="edit" :description="demandInfo.description" @getContent="getDescription" />
        </el-form-item>
      </div>
      <!-- 联系信息 -->
      <div class="demand-item-title">联系信息</div>
      <div class="item3">
        <el-form-item label="联系人员：" class="demandInfo-item" prop="linkMan">
          <el-input v-model="demandInfo.linkMan" type="text" placeholder="请输入联系人员" show-word-limit />
        </el-form-item>
        <el-form-item label="联系手机：" class="demandInfo-item">
          <el-input v-model="demandInfo.linkTel" type="text" placeholder="请输入联系手机" show-word-limit />
        </el-form-item>
      </div>

      <div class="submit">
        <el-button type="primary" class="public-el-submit-btn" @click="publish">发布</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
  import {
    brandList,
    createDemand,
    demandDetail,
    updateDemand
  } from '@/api/demand'
  import {
    mapGetters
  } from 'vuex'
  import {
    uploadImage
  } from '@/api/public'
  const city = require('../../../src/json/citys.json')
  import axios from 'axios'
  import edit from '../utils/edit.vue'
  import DragUpload from '../utils/DragUpload.vue' // 引入vue-draggable
  export default {
    components: {
      DragUpload,
      edit
    },
    computed: {
      ...mapGetters([
        'realName',
        'mobile'
      ])
    },
    data() {
      var checkphone = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入手机号'))
        } else if (!this.isCellPhone(
            value)) { // 引入methods中封装的检查手机格式的方法 callback(new Error('请输入正确的手机号!'))          } else {
          callback(new Error('请输入正确的手机号!'))
        } else {
          callback()
        }
      }
      return {
        isUpdate: false,
        cities: [],
        imgList: [],
        limit: 5,
        // 发布信息
        demandInfo: {
          articleType: 1, // 信息类型
          equipmentName: '', // 设备名称
          brandId: '', // 品牌ID
          brandName: '', //品牌名称,示例值(联影)
          description: '', //详情描述
          pnCode: '', // P/N码
          linkMan: '', // 联系人员
          linkTel: '', // 联系电话,示例值(18899990000)
          regionIdList: '', //维修区域
          region: '', //维修区域
          title: '', // 需求标题,示例值(需求标题)
          imageList: [], //图片列表
        },
        brandsOptions: [],
        demandInfoRules: {
          linkTel: [{
            required: true,
            validator: checkphone,
            trigger: 'blur'
          }]
        },
        ruleForm: {
          imgUrl: '',
          trialImgs: []
        }
      }
    },
    mounted() {
      this.initData()
      this.getParams()
    },
    methods: {
      //初始化数据
      initData() {
        // brandList().then(response => {
        //   this.brandsOptions = response.data.data
        // })
        this.demandInfo.linkMan = this.realName
        this.demandInfo.linkTel = this.mobile
        this.cities = city
      },
      // //选择 设备品牌
      // selectBrand(value) {
      //   let obj = {};
      //   obj = this.brandsOptions.find((item) => {
      //     return item.brandId === value;
      //   });
      //   this.demandInfo.brandName = obj.brandName
      // },
      //获取详情 内容
      getDescription(val) {
        this.demandInfo.description = val
      },
      //发布
      publish() {
        this.$refs['demandInfo'].validate((valid) => {
          if (valid) {
            if (this.checkData()) {
              this.submitDemand()
            }
          } else {
            // console.log('error submit!!')
            return false
          }
        })
      },
      //区域 转换格式
      changeFormat(key) {
        this.demandInfo.region = []
        var list = this.$refs[key].getCheckedNodes()
        console.log("list:",this.$refs[key])
        for (var index in list) {
          if(!list[index].parent.checked){
            var item = {
              name: '',
              id: ''
            }
            item.id = list[index].path
            item.name = list[index].pathLabels
            this.demandInfo.region.push(item)
          }
        }
      },
      //深复制对象方法
      cloneObj(obj) {
        var newObj = {};
        if (obj instanceof Array) {
          newObj = [];
        }
        for (var key in obj) {
          var val = obj[key];
          newObj[key] = typeof val === 'object' ? cloneObj(val) : val;
        }
        return newObj;
      },
      //发布请求接口
      async submitDemand() {
        this.demandInfo.regionIdList = null
        this.demandInfo.region = JSON.stringify(this.demandInfo.region)
        if (this.demandInfo.brandId == '') {
          this.demandInfo.brandId = 0
        }
        this.demandInfo.imageList = []
        for (var item of this.ruleForm.trialImgs) {
          if (item.file != '') {
            let param = new FormData(); //创建form对象
            param.append('file', item.file); //通过append向form对象添加数据
            await uploadImage(param).then(response => {
              this.demandInfo.imageList.push(response.data.data)
            })
          } else {
            // var newImgUrl = item.imgUrl.split("https://images.weserv.nl/?url=").join("");
            // this.demandInfo.imageList.push(newImgUrl)
            this.demandInfo.imageList.push(item.imgUrl)
          }
        }
        // console.log("发送的数据：", JSON.stringify(this.demandInfo))
        // 编辑
        if (this.isUpdate) {
          await updateDemand(JSON.stringify(this.demandInfo)).then(response => {
            if (response.data.code == 10000) {
              this.$message.success("更新成功！")
              this.$router.replace({
                path: 'demandManage'
              })
            } else {
              this.$message.error(response.data.message)
            }
          })
        } else { //新建
          await createDemand(JSON.stringify(this.demandInfo)).then(response => {
            if (response.data.code == 10000) {
              this.$message.success("发布成功！")
              this.$router.replace({
                path: 'demandManage'
              })
            } else {
              this.$message.error(response.data.message)
            }
          })
        }
      },
      //检查必填项
      checkData() {
        if (this.demandInfo.articleType == null || this.demandInfo.articleType == "") {
          this.$message.error("请选择信息类型")
          return false
        }
        if (this.demandInfo.title == null || this.demandInfo.title == "") {
          this.$message.error("请输入需求标题")
          return false
        }
        if (this.demandInfo.articleType != 3) {
          if (this.demandInfo.equipmentName == null || this.demandInfo.equipmentName == "") {
            this.$message.error("请输入设备名称")
            return false
          }
          if (this.demandInfo.brandName == null || this.demandInfo.brandName == "") {
            this.$message.error("请输入设备品牌")
            return false
          }
          if (this.demandInfo.equipmentType == null || this.demandInfo.equipmentType == "") {
            this.$message.error("请选择设备型号")
            return false
          }
          // if (this.demandInfo.pnCode == null || this.demandInfo.pnCode == "") {
          //   this.$message.error("请输入P/N码")
          //   return false
          // }
        }
        if (this.demandInfo.articleType != 1) {
          if (this.demandInfo.regionIdList == null || this.demandInfo.regionIdList.length < 1) {
            this.$message.error("请选择维修区域")
            return false
          }
        }
        if (this.demandInfo.linkMan == null || this.demandInfo.linkMan == "") {
          this.$message.error("请输入联系人")
          return false
        }
        if (this.demandInfo.linkTel == null || this.demandInfo.linkTel == "") {
          this.$message.error("请输入联系电话")
          return false
        }
        return true
      },
      //获取要编辑的需求id来获取需求详情
      async getParams() {
        //编辑需求 跳转过来 传递的数据
        var editDemandData = this.$route.query.eidtData //要编辑需求的数据
        if (editDemandData != undefined) {
          await demandDetail({
            id: editDemandData.articleId
          }).then(response => {
            this.isUpdate = true
            this.demandInfo = response.data.data
            var reg = JSON.parse(this.demandInfo.region)
            //维修区域
            this.demandInfo.regionIdList = []
            if (this.demandInfo.articleType == 2) { //项目外包
              if (reg.length > 0) {
                this.demandInfo.regionIdList = reg[0].id
              }
            } else if (this.demandInfo.articleType == 3) { //灵活兼职
              this.demandInfo.regionIdList.length = reg.length
              for (var index in reg) {
                this.demandInfo.regionIdList[index] = reg[index].id
              }
            }
            //相关图片
            this.imgList = this.demandInfo.imageList
          })
        }
      },
      //校验手机号码
      isCellPhone(val) {
        if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(val)) {
          return false
        } else {
          return true
        }
      },
      // 图片可拖曳排序
      trialImgs(allList) {
        this.ruleForm.trialImgs = allList
      }

    }
  }
</script>

<style scoped lang="less">
  // 编辑需求区域
  .eidt-box {
    font-size: 12px;
    font-family: Microsoft YaHei-Regular, Microsoft YaHei;
    font-weight: 400;
    color: #333333;
    background-color: #FFFFFF;
    padding: 20px 35px 30px 15px;
    box-shadow: 0px 2px 10px 1px rgba(0, 0, 0, 0.06);
    border-radius: 6px 6px 6px 6px;

    // 标题
    .demand-item-title {
      font-weight: bold;
      color: #1890FF;
      padding: 1px 0px 1px 15px;
      border-left: 2px solid #1890FF;
      margin: 35px 0px 30px 0px;
    }

    .demand-item-title:first-child {
      margin-top: 0px;
    }

    // 主体类型
    .demand-type {
      display: flex;
      justify-content: flex-start;

      //选中样式
      .typeItemChosed {
        position: relative;
        width: 252px;
        height: 112px;
        border-radius: 4px 4px 4px 4px;
        background: linear-gradient(180deg, #FFFFFF 0%, #E6F7FF 100%);
        border: 1px solid #1890FF;
        margin-right: 40px;
        display: flex;
        flex-direction: column;
        padding: 20px 0px 15px 25px;
        box-sizing: border-box;

        .title {
          font-weight: bold;
          color: #1890FF;
          line-height: 28px;
          font-size: 12px;
        }

        .remarks {
          font-weight: 400;
          color: #333333;
          line-height: 28px;
          font-size: 12px;
        }

        .eg {
          font-weight: 400;
          color: #69C0FF;
          line-height: 28px;
          font-size: 12px;
        }

        .statue {
          position: absolute;
          width: 57px;
          height: 25px;
          right: 0px;
          top: 0px;
          background-image: url('../../../public/imgs/demand/icon_selected.png');
        }
      }

      //未选中样式
      .type-item {
        position: relative;
        width: 252px;
        height: 112px;
        border-radius: 4px 4px 4px 4px;
        border: 1px solid #EBEEF5;
        margin-right: 40px;
        display: flex;
        flex-direction: column;
        padding: 20px 0px 15px 25px;
        box-sizing: border-box;

        .title {
          font-weight: bold;
          color: #333333;
          line-height: 28px;
          font-size: 12px;
        }

        .remarks {
          font-weight: 400;
          color: #333333;
          line-height: 28px;
          font-size: 12px;
        }

        .eg {
          font-weight: 400;
          color: #999999;
          line-height: 28px;
          font-size: 12px;
        }

        .statue {
          position: absolute;
          width: 57px;
          height: 25px;
          right: 0px;
          top: 0px;
          background-image: url('../../../public/imgs/demand/icon_unselected.png');
        }
      }
    }

    /deep/.el-form-item__label {
      font-size: 12px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
      font-weight: 400;
      color: #333333;
    }

    /deep/.el-input__inner {
      height: 34px;
      font-size: 12px;
    }

    //设备品牌
    /deep/ .el-select>.el-input {
      width: 260px;
    }

    //需求标题
    .input-title {
      width: 300px;
    }

    .el-cascader {
      width: 270px;
      height: 36px;
    }

    .item3 {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;

      .el-input {
        width: 260px;
      }

      .demandInfo-item {
        margin-right: 40px;
      }
    }

    // 产品主图
    .product-images {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      font-size: 12px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
      font-weight: 400;
      color: #333333;

      .gray-tip {
        font-size: 12px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        font-weight: 400;
        color: #BBBBBB;
        margin-top: 5px;
      }

      /deep/.el-form-item__content {
        margin-left: 0px !important;
      }
    }

    // 详情描述
    .product-detail {
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      font-size: 12px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
      font-weight: 400;
      color: #333333;
      margin-bottom: 40px;

      /deep/.el-form-item__content {
        margin-left: 0px !important;
      }

    }
  }

  // 提交
  .submit {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 30px;
  }
</style>
