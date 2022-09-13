<template>
  <div>
    <!-- 编辑需求区域 -->
    <!-- <div class="eidt-box"> -->
    <el-form label-position="left" label-width="90px" class="eidt-box">
      <!-- 信息类型 -->
      <div class="demand-item-title">信息类型</div>
      <!-- 主体类型： -->
      <el-form-item label="主体类型：">
        <div class="demand-type">
          <div :class="chosedType == 1?'typeItemChosed':'type-item'" @click="chosedType=1">
            <span class="title">求购设备</span>
            <span class="remarks">我需要求购配件</span>
            <span class="eg">例：我的一个设备急需配件</span>
            <div class="statue"></div>
          </div>
          <div :class="chosedType == 2?'typeItemChosed':'type-item'" @click="chosedType=2">
            <span class="title">项目外包</span>
            <span class="remarks">我有设备要维修</span>
            <span class="eg">例：我有现场维修服务要做</span>
            <div class="statue"></div>
          </div>
          <div :class="chosedType == 3?'typeItemChosed':'type-item'" @click="chosedType=3">
            <span class="title">灵活兼职</span>
            <span class="remarks">我有维修设备技能</span>
            <span class="eg">例：我能到设备现场进行维修</span>
            <div class="statue"></div>
          </div>
        </div>
      </el-form-item>
      <!-- 基本信息 -->
      <div class="demand-item-title">基本信息</div>
      <div v-show="chosedType ==1 || chosedType ==2">
        <!-- 需求标题 -->
        <el-form-item label="需求标题：">
          <el-input type="text" class="input-title" placeholder="请输入需求标题" v-model="demandInfo.infoTitle" maxlength="20"
            show-word-limit>
          </el-input>
        </el-form-item>
        <div class="item3">
          <el-form-item label="设备名称：" class="demandInfo-item">
            <el-input type="text" placeholder="请输入设备名称" v-model="demandInfo.equipmentName" show-word-limit>
            </el-input>
          </el-form-item>
          <el-form-item label="设备品牌：" class="demandInfo-item">
            <el-input type="text" placeholder="请输入设备名称" v-model="demandInfo.equipmentName" show-word-limit>
            </el-input>
          </el-form-item>
          <el-form-item label="P/N码：" class="demandInfo-item">
            <el-input type="text" placeholder="请输入设备名称" v-model="demandInfo.equipmentName" show-word-limit>
            </el-input>
          </el-form-item>
        </div>
        <!-- 商品图片 -->
        <el-form-item label="商品图片：" class="product-images">
          <div label="图片可拖曳排序：" prop="trialImgs" class="content-images">
            <div class="row">
              <DragUpload :allList="ruleForm.trialImgs" v-on:allList="trialImgs" :limit="limit">
              </DragUpload>
              <div class="el-upload__tip gray-tip">请：图片上传不超过5张，图片支持jpg/png格式，不超过500kb，尺寸为800*800</div>
            </div>
          </div>
        </el-form-item>
        <!-- 详情描述 -->
        <el-form-item label="详情描述：" class="product-detail">
          <edit class="edit"></edit>
        </el-form-item>
      </div>
      <div v-show="chosedType ==2">
        <!-- 维修区域 -->
        <el-form-item label="维修区域：">
          <el-cascader v-model="areaValue" :options="cities"></el-cascader>
        </el-form-item>
      </div>
      <div v-show="chosedType ==3">
        <!-- 需求标题 -->
        <el-form-item label="需求标题：">
          <el-input type="text" class="input-title" placeholder="请输入需求标题" v-model="demandInfo.infoTitle" maxlength="20"
            show-word-limit>
          </el-input>
        </el-form-item>
        <!-- 维修区域 -->
        <el-form-item label="维修区域：">
          <el-cascader v-model="areaValue" :options="cities"></el-cascader>
        </el-form-item>
        <!-- 个人图片 -->
        <el-form-item label="个人图片：" class="product-images">
          <div label="图片可拖曳排序：" prop="trialImgs" class="content-images">
            <div class="row">
             <DragUpload :allList="ruleForm.trialImgs" v-on:allList="trialImgs" :limit="limit">
              </DragUpload>
              <div class="el-upload__tip gray-tip">请：图片上传不超过5张，图片支持jpg/png格式，不超过500kb，尺寸为800*800</div>
            </div>
          </div>
        </el-form-item>
        <!-- 个人简述 -->
        <el-form-item label="个人简述：" class="product-detail">
          <edit class="edit"></edit>
        </el-form-item>
      </div>
      <!-- 联系信息 -->
      <div class="demand-item-title">联系信息</div>
      <div class="item3">
        <el-form-item label="联系人员：" class="demandInfo-item">
          <el-input type="text" placeholder="请输入联系人员" v-model="demandInfo.equipmentName" show-word-limit>
          </el-input>
        </el-form-item>
        <el-form-item label="联系手机：" class="demandInfo-item">
          <el-input type="text" placeholder="请输入联系手机" v-model="demandInfo.equipmentName" show-word-limit>
          </el-input>
        </el-form-item>
      </div>


      <div class="submit">
        <button class="but-submit">发布</button>
      </div>

      <!-- </div> -->
    </el-form>

  </div>
</template>

<script>
  const a = require("../../../src/json/citys.json")
  import axios from 'axios'
  import edit from '../utils/edit.vue'
  import DragUpload from '../utils/DragUpload.vue'; // 引入vue-draggable
  export default {
    components: {
      DragUpload,
      edit
    },

    data() {
      return {
        cities: [],
        areaValue: [],
        chosedType: 1,
        limit: 5,
        // 发布信息
        demandInfo: {
          equipmentName: '', //设备名称
          infoType: '', //信息类型
          infoBrand: '', //设备品牌
          infoModel: '', //设备型号
          infoTitle: '', //信息标题
        },
        //信息类型
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
          trialImgs: [],
        },
      }
    },
    mounted() {
      this.cities = a
      // axios.get("../../../static/testData/citys.json").then(res => {
      //   console.log(res);
      //   if (res.status == 200) {
      //     this.cities = res.data
      //   } else {
      //     this.$message.error("数据请求失败，请稍后再试！")
      //   }
      // })
    },
    methods: {
      back() {
        this.$router.back()
      },
      // 图片可拖曳排序
      trialImgs(allList) {
        this.ruleForm.trialImgs = allList
      },

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
    margin-top: 15px;
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
        height: 400px;
      }
    }
  }

  // 提交
  .submit {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 30px;

    .but-submit {
      width: 92px;
      height: 34px;
      background: #1890FF;
      border-radius: 6px 6px 6px 6px;
      font-size: 12px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
      font-weight: 400;
      color: #FFFFFF;
      border: none;
      outline: none;
    }
  }
</style>
