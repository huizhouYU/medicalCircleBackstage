<template>
  <div>
    <!-- 编辑需求区域 -->
    <el-form
      ref="demandInfo"
      label-position="right"
      label-width="90px"
      class="demo-demandInfo eidt-box"
      :model="demandInfo"
      :rules="demandInfoRules"
    >
      <!-- 信息类型 -->
      <div class="demand-item-title">信息类型</div>
      <!-- 主体类型： -->
      <el-form-item label="主体类型：" prop="infoType">
        <div class="demand-type">
          <div :class="demandInfo.infoType == 1?'typeItemChosed':'type-item'" @click="demandInfo.infoType=1">
            <span class="title">求购设备</span>
            <span class="remarks">我需要求购配件</span>
            <span class="eg">例：我的一个设备急需配件</span>
            <div class="statue" />
          </div>
          <div :class="demandInfo.infoType == 2?'typeItemChosed':'type-item'" @click="demandInfo.infoType=2">
            <span class="title">项目外包</span>
            <span class="remarks">我是第三方维修公司</span>
            <span class="eg">例：需要寻找工程师帮我去现场维修设备</span>
            <div class="statue" />
          </div>
          <div :class="demandInfo.infoType == 3?'typeItemChosed':'type-item'" @click="demandInfo.infoType=3">
            <span class="title">灵活兼职</span>
            <span class="remarks">我是医疗设备维修工程师</span>
            <span class="eg">例：我可以帮你去现场维修设备</span>
            <div class="statue" />
          </div>
        </div>
      </el-form-item>
      <!-- 基本信息 -->
      <div class="demand-item-title">基本信息</div>
      <div v-show="demandInfo.infoType ==1 || demandInfo.infoType ==2">
        <!-- 需求标题 -->
        <el-form-item label="需求标题：" prop="infoTitle">
          <el-input
            v-model="demandInfo.infoTitle"
            type="text"
            class="input-title"
            placeholder="请输入需求标题"
            maxlength="20"
            show-word-limit
          />
        </el-form-item>
        <div class="item3">
          <el-form-item label="设备名称：" class="demandInfo-item" prop="equipmentName">
            <el-input v-model="demandInfo.equipmentName" type="text" placeholder="请输入设备名称" show-word-limit />
          </el-form-item>
          <el-form-item label="设备品牌：" class="demandInfo-item" prop="infoBrand">
            <el-input v-model="demandInfo.infoBrand" type="text" placeholder="请输入设备品牌" show-word-limit />
          </el-form-item>
          <el-form-item label="P/N码：" class="demandInfo-item">
            <el-input v-model="demandInfo.equipmentName" type="text" placeholder="请输入P/N码" show-word-limit />
          </el-form-item>
        </div>
        <!-- 商品图片 -->
        <el-form-item label="商品图片：" class="product-images">
          <div label="图片可拖曳排序：" prop="trialImgs" class="content-images">
            <div class="row">
              <DragUpload :all-list="ruleForm.trialImgs" :limit="limit" @allList="trialImgs" />
              <div class="el-upload__tip gray-tip">请：图片上传不超过5张，图片支持jpg/png格式，不超过500kb，尺寸为800*800</div>
            </div>
          </div>
        </el-form-item>
        <!-- 详情描述 -->
        <el-form-item label="详情描述：" class="product-detail">
          <edit class="edit" />
        </el-form-item>
      </div>
      <div v-show="demandInfo.infoType ==2">
        <!-- 维修区域 -->
        <el-form-item label="维修区域：" prop="areaValue">
          <el-cascader v-model="areaValue" :options="cities" :props="{value: 'Id',label: 'name'}" />
        </el-form-item>
      </div>
      <div v-show="demandInfo.infoType ==3">
        <!-- 需求标题 -->
        <el-form-item label="需求标题：" prop="infoTitle">
          <el-input
            v-model="demandInfo.infoTitle"
            type="text"
            class="input-title"
            placeholder="请输入需求标题"
            maxlength="20"
            show-word-limit
          />
        </el-form-item>
        <!-- 维修区域 -->
        <el-form-item label="维修区域：" prop="areaValue">
          <el-cascader v-model="demandInfo.areaValue" :options="cities" :props="{value: 'Id',label: 'name'}" />
        </el-form-item>
        <!-- 个人图片 -->
        <el-form-item label="个人图片：" class="product-images">
          <div label="图片可拖曳排序：" prop="trialImgs" class="content-images">
            <div class="row">
              <DragUpload :all-list="ruleForm.trialImgs" :limit="limit" @allList="trialImgs" />
              <div class="el-upload__tip gray-tip">请：图片上传不超过5张，图片支持jpg/png格式，不超过500kb，尺寸为800*800</div>
            </div>
          </div>
        </el-form-item>
        <!-- 个人简述 -->
        <el-form-item label="个人简述：" class="product-detail">
          <edit class="edit" />
        </el-form-item>
      </div>
      <!-- 联系信息 -->
      <div class="demand-item-title">联系信息</div>
      <div class="item3">
        <el-form-item label="联系人员：" class="demandInfo-item" prop="contactPerson">
          <el-input v-model="demandInfo.contactPerson" type="text" placeholder="请输入联系人员" show-word-limit />
        </el-form-item>
        <el-form-item label="联系手机：" class="demandInfo-item" prop="contactPhone">
          <el-input v-model="demandInfo.contactPhone" type="text" placeholder="请输入联系手机" show-word-limit />
        </el-form-item>
      </div>

      <div class="submit">
        <el-button type="primary" class="public-el-submit-btn">发布</el-button>
      </div>
    </el-form>

  </div>
</template>

<script>
const a = require('../../../src/json/citys.json')
import axios from 'axios'
import edit from '../utils/edit.vue'
import DragUpload from '../utils/DragUpload.vue' // 引入vue-draggable
export default {
  components: {
    DragUpload,
    edit
  },

  data() {
    var checkphone = (rule, value, callback) => {
      if (value === '') {
        // let phoneReg = /(^1[3|4|5|6|7|8|9]\d{9}$)|(^09\d{8}$)/; if (value === '') {
        callback(new Error('请输入手机号'))
      } else if (!this.isCellPhone(value)) { // 引入methods中封装的检查手机格式的方法 callback(new Error('请输入正确的手机号!'))          } else {
        callback()
      }
    }
    // 地区选择验证
    var validArea = (rule, value, callback) => {
      // 直接用value 获取不到选中的值
      // 所以直接 用HTML中 v-model 绑定的值来判断 是否有值
      if (this.demandInfo.areaValue.length == 0) {
        callback(new Error('请选择维修区域'))
      } else {
        callback()
      }
    }
    return {
      cities: [],
      areaValue: [],
      // chosedType: 1,
      limit: 5,
      // 发布信息
      demandInfo: {
        equipmentName: '', // 设备名称
        infoType: 1, // 信息类型
        infoBrand: '', // 设备品牌
        infoModel: '', // 设备型号
        infoTitle: '', // 信息标题
        pn: '', // P/N码
        areaValue: [], // 维修区域
        contactPerson: '', // 联系人员
        contactPhone: '' // 联系手机
      },
      demandInfoRules: {
        infoTitle: [{
          required: true,
          message: '请输入标题',
          trigger: 'blur'
        },
        {
          min: 3,
          max: 20,
          message: '长度在 3 到 20 个字符',
          trigger: 'blur'
        }
        ],
        infoType: [{
          required: true,
          message: '请选择信息类型',
          trigger: 'change'
        }],
        equipmentName: [{
          required: true,
          message: '请输入设备名称',
          trigger: 'blur'
        },
        {
          min: 3,
          max: 20,
          message: '长度在 3 到 20 个字符',
          trigger: 'blur'
        }
        ],
        infoBrand: [{
          required: true,
          message: '请输入设备品牌',
          trigger: 'blur'
        },
        {
          min: 3,
          max: 20,
          message: '长度在 3 到 20 个字符',
          trigger: 'blur'
        }
        ],
        areaValue: [{
          required: true,
          validator: validArea,
          tirgger: 'blur'
        },
        {
          type: 'array',
          message: '请选择维修区域'
        }
        ],
        contactPerson: [{
          required: true,
          message: '请输入联系人',
          trigger: 'blur'
        },
        {
          min: 0,
          max: 10,
          message: '长度在 0 到 10 个字符',
          trigger: 'blur'
        }
        ],
        contactPhone: [{
          required: true,
          validator: checkphone,
          trigger: 'blur'
        }]
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
        trialImgs: []
      }
    }
  },
  // mounted(){
  //   this.getData()
  //   // this.cities = a;
  //   // axios.get("../../../static/testData/citys.json").then(res => {
  //   //   console.log(res);
  //   //   if (res.status == 200) {
  //   //     this.cities = res.data
  //   //   } else {
  //   //     this.$message.error("数据请求失败，请稍后再试！")
  //   //   }
  //   // })
  // },
  mounted() {
    this.getParams()
  },
  methods: {
    getParams() {
      //编辑商品 跳转过来 传递的数据
      var editDemandData = this.$route.query.eidtData //要编辑需求的数据
      if (editDemandData != undefined) {
        this.$message({
          type: 'info',
          message: '此处应该根据需求ID去请求后端接口，获取需求数据，填充页面'
        })
      }

    },
    getData() {
      this.cities = a
    },

    isCellPhone(val) {
      if (!/^1(3|4|5|6|7|8)\d{9}$/.test(val)) {
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

    //需求标题
    .input-title {
      width: 300px;
    }

    .el-cascader {
      width: 260px;
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

      .edit {
        // height: 400px;
      }
    }
  }

  // 提交
  .submit {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 30px;

    // .but-submit {
    //   width: 92px;
    //   height: 34px;
    //   background: #1890FF;
    //   border-radius: 6px 6px 6px 6px;
    //   font-size: 12px;
    //   font-family: Microsoft YaHei-Regular, Microsoft YaHei;
    //   font-weight: 400;
    //   color: #FFFFFF;
    //   border: none;
    //   outline: none;
    // }
  }
</style>
