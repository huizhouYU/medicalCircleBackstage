<template>
  <div>
    <!-- 编辑商品区域 -->
    <el-form ref="goodInfo" :model="goodInfo" label-width="100px" class="eidt-box" label-position="right">
      <!-- 产品类目 -->
      <el-form-item label="产品类目：">
        <span @click="preStep()" class="chooseClassify-span">{{goodInfo.chooseClassify}}</span>
      </el-form-item>
      <!-- 产品名称 -->
      <el-form-item label="产品名称：" class="item-name">
        <el-input v-model="goodInfo.name" placeholder="请输入商品名称" maxlength="40" show-word-limit></el-input>
      </el-form-item>
      <!-- 所属品牌 -->
      <el-form-item label="所属品牌：" class="item-brand">
        <el-select v-model="goodInfo.brand" class="select-brand" v-show="!customBrand">
          <el-option v-for="item in brandsOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-input v-model="goodInfo.brand" placeholder="请输入商品品牌" maxlength="40" show-word-limit v-show="customBrand">
        </el-input>
        <el-checkbox v-model="customBrand" @change='goodInfo.brand= ""'>自定义品牌</el-checkbox>
      </el-form-item>
      <!-- 产品规格： -->
      <el-form-item label="产品规格：" class="product-specs">
        <el-form-item label="销售类型" class="product-specs-item">
          <el-select v-model="goodInfo.chosedXS" class="select-item" @change="isEditPrice()">
            <el-option v-for="item in xsOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="价格" class="product-specs-item">
          <el-input type="number" v-model="goodInfo.price" placeholder="请输入价格" :disabled="!isEditPriceFlag"></el-input>
        </el-form-item>
        <el-form-item label="商品编码" class="product-specs-item">
          <el-input v-model="goodInfo.PN" placeholder="产品P/N码或识别码"></el-input>
        </el-form-item>
        <el-form-item label="库存" class="product-specs-item">
          <el-input type="number" v-model="goodInfo.kc" placeholder="请输入商品库存"></el-input>
        </el-form-item>
        <el-form-item label="新旧程度" class="product-specs-item">
          <el-select v-model="goodInfo.chosedDegree" class="select-item" placeholder="请选择">
            <el-option v-for="item in newOrOrdDegreeOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="保质期限" class="product-specs-item shelf-life">
          <el-input type="number" v-model="goodInfo.bzq" placeholder=""></el-input>
          <el-select v-model="goodInfo.chosedShelfLife" class="select-item" placeholder="请选择">
            <el-option v-for="item in shelfLifeOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form-item>
      <!-- 产品主图 -->
      <el-form-item label="产品主图：" class="">
        <div label="图片可拖曳排序：" prop="trialImgs" class="">
          <div class="">
            <DragUpload :allList="ruleForm.trialImgs" v-on:allList="trialImgs" :limit="limit">
            </DragUpload>
            <div class="gray-tip">请：主图按照图片上传顺序展示，图片支持jpg/png格式，不超过10M，尺寸为800*800，拖拽图片可调整排序</div>
          </div>
        </div>
      </el-form-item>
      <!-- 产品详情 -->
      <el-form-item label="产品详情：" class="product-detail">
        <edit class="edit" @getContent="getContentData"></edit>
      </el-form-item>
      <!-- 交易方式 -->
      <el-form-item label="交易方式：">
        <el-select v-model="goodInfo.chosedFare" class="select-item">
          <el-option v-for="item in fareOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <!-- 商品标签 -->
      <el-form-item label="商品标签：" class="prodect-tag">
        <div class="content">
          <div class="tags-content">
            <el-tag :key="tag" v-for="tag in goodInfo.tagList" closable :disable-transitions="false"
              @close="handleClose(tag)">
              {{tag}}
            </el-tag>
            <el-input v-model="goodTag" placeholder="添加标签" maxlength="4" @keyup.enter.native="addTag()"
              v-show="inputVisible"></el-input>
          </div>
          <span class="gray-tip">最多可填写5个商品标签,每个标签最多4个字</span>
        </div>
      </el-form-item>
      <!-- 立即上架 -->
      <el-form-item label="立即上架：" class="prodect-grounding-item">
        <el-switch v-model="goodInfo.groundingValue" active-color="#1890FF">
        </el-switch>
      </el-form-item>
      <!-- 是否推荐 -->
      <el-form-item label="是否推荐：" class="prodect-recommendValue">
        <el-switch v-model="goodInfo.recommendValue" active-color="#13ce66">
        </el-switch>
        <span class="gray-tip">被推荐的商品会显示在店铺首页</span>
      </el-form-item>
      <div class="submit">
        <el-button type="primary" class="public-el-submit-btn" @click="submit">提交</el-button>
      </div>
    </el-form>
  </div>
  </div>
</template>

<script>
  import edit from '../utils/edit.vue'
  import DragUpload from '../utils/DragUpload.vue'; // 引入vue-draggable
  export default {
    components: {
      DragUpload,
      edit
    },
    data() {
      return {
        inputVisible: true,
        goodTag: '', //添加的商品标签
        customBrand: false, //是否自定义品牌
        isBack: true, //只有新增商品才能返回上一步
        limit: 5,
        //商品信息
        goodInfo: {
          name: '', //商品名称
          brand: '', //所属品牌
          chooseClassify: '', //选择的类目【拼接字符串】
          chosedData: [], //选择的类目
          chosedDegree: '', //选择的新旧程度
          chosedXS: '1', //选择的销售方式
          price: '', //价格
          PN: '', //商品编码
          kc: '', //库存
          bzq: '', //保质期
          chosedShelfLife: '1', //选择的保质期【年、月、日】
          content: '', //产品详情
          chosedFare: "1", //选择的交易方式
          tagList: ['模板一', '模板二'], //商品标签
          groundingValue: true, //是否立即上架
          recommendValue: false, //是否推荐
        },
        brandsOptions: [],
        //是否允许输入价格
        isEditPriceFlag: true,
        //交易方式
        fareOptions: [{
          value: '1',
          label: '当面交易'
        }, {
          value: '2',
          label: '物流发货'
        }],
        // 销售类型
        xsOptions: [{
            value: '1',
            label: '在线销售'
          },
          {
            value: '2',
            label: '咨询议价'
          }
        ],
        //新旧程度
        newOrOrdDegreeOptions: [{
            value: '1',
            label: '一成新'
          },
          {
            value: '2',
            label: '两成新'
          },
          {
            value: '3',
            label: '三成新'
          },
          {
            value: '4',
            label: '四成新'
          },

          {
            value: '5',
            label: '五成新'
          },
          {
            value: '6',
            label: '六成新'
          },
          {
            value: '7',
            label: '七成新'
          },
          {
            value: '8',
            label: '八成新'
          },
          {
            value: '9',
            label: '九成新'
          },
          {
            value: '10',
            label: '十成新'
          }
        ],
        //保质期类型【日、月、年】
        shelfLifeOptions: [{
            value: '1',
            label: '日'
          },
          {
            value: '2',
            label: '月'
          },
          {
            value: '3',
            label: '年'
          }
        ],
        ruleForm: {
          imgUrl: '',
          trialImgs: [],
        },
      }
    },
    mounted() {
      this.getParams()
    },
    methods: {
      getParams() {
        //添加商品  跳转过来 传递的数据
        var chosedDataString = this.$route.query.chosedData //商品类别
        if (chosedDataString != undefined) {
          this.goodInfo.chosedData = JSON.parse(chosedDataString)
          this.goodInfo.chooseClassify = this.goodInfo.chosedData[0].label
          if (this.goodInfo.chosedData[1].label != '') {
            this.goodInfo.chooseClassify += " > " + this.goodInfo.chosedData[1].label
            if (this.goodInfo.chosedData[2].label != '') {
              this.goodInfo.chooseClassify += " > " + this.goodInfo.chosedData[2].label
            }
          }
        }
        //编辑商品 跳转过来 传递的数据
        var editGoodData = this.$route.query.eidtData //要编辑商品的数据
        if (editGoodData != undefined) {
          this.isBack = false
          this.goodInfo.chooseClassify = editGoodData.sort //商品类目
          this.goodInfo.name = editGoodData.name //商品名称
          this.goodInfo.brand = editGoodData.brand //商品品牌
          this.$message({
            type: 'info',
            message: '此处应该根据商品ID去请求后端接口，获取商品数据，填充页面'
          })
        }

      },
      //当选择“咨询议价”时，商品价格禁止输入
      isEditPrice() {
        console.log("this.isEditPriceFlag", this.isEditPriceFlag)
        if (this.goodInfo.chosedXS == 2) {
          this.isEditPriceFlag = false
        } else {
          this.isEditPriceFlag = true
        }
        console.log("this.isEditPriceFlag", this.isEditPriceFlag)
      },
      //点击‘类目’返回上一步
      preStep() {
        if (this.isBack) {
          this.$router.replace({
            path: 'addGoods',
            query: {
              chosedData: JSON.stringify(this.goodInfo.chosedData)
            }
          })
        }
      },
      // 图片可拖曳排序
      trialImgs(allList) {
        this.ruleForm.trialImgs = allList
      },
      getContentData(content) {
        this.goodInfo.content = content
        console.log(this.goodInfo)
        console.log(this.ruleForm)
      },
      submit() {
        console.log('商品信息', this.goodInfo)
        console.log('图片信息', this.ruleForm)
        alert("核对要提交给后台的数据后，再请求接口提交数据，暂定提交成功！")
        this.$router.replace("/success")
      },
      deletTag(index) {
        this.goodInfo.tagList.splice(index, 1)
        if (this.goodInfo.tagList.length < 5) {
          this.inputVisible = true
        } else {
          this.inputVisible = false
        }
      },
      addTag() {
        if (this.goodInfo.tagList.length < 5) {
          this.goodInfo.tagList.push(this.goodTag.substring(0, 4))
        }
        if (this.goodInfo.tagList.length < 5) {
          this.inputVisible = true
        } else {
          this.inputVisible = false
        }
        this.goodTag = ''
      },
      handleClose(key) {
        this.goodInfo.tagList.splice(this.goodInfo.tagList.indexOf(key), 1);
        if (this.goodInfo.tagList.length < 5) {
          this.inputVisible = true
        } else {
          this.inputVisible = false
        }
      }

    }
  }
</script>

<style scoped lang="less">
  // 编辑商品区域
  .eidt-box {
    background-color: #FFFFFF;
    padding: 20px 35px 30px 15px;
    box-shadow: 0px 2px 10px 1px rgba(0, 0, 0, 0.06);
    border-radius: 6px 6px 6px 6px;
    font-size: 12px;
    font-family: Microsoft YaHei-Regular, Microsoft YaHei;
    font-weight: 400;
    color: #333333;

    /deep/ .el-form-item {
      margin-bottom: 30px;
    }

    /deep/ .el-form-item__label {
      padding-right: 30px;
    }

    /deep/ .el-input {
      width: 250px;
    }

    /deep/ .el-input--medium .el-input__inner {
      height: 34px;
      line-height: 34px;
    }

    // 产品类目
    .chooseClassify-span {
      color: #1890FF;
      font-size: 12px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
      font-weight: 400;
    }

    .item-brand {
      /deep/.el-form-item__content {
        display: flex;
        justify-content: flex-start;
        align-items: center;
      }

      //自定义品牌
      /deep/.el-checkbox {
        display: flex;
        align-items: center;
        margin-left: 15px;
      }

      /deep/ .el-checkbox__label {
        font-size: 12px;
        color: #333;
      }
    }
  }

  // 产品规格
  .product-specs {
    /deep/ .el-form-item__content {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: wrap;
    }

    /deep/ .el-input {
      width: 160px;
    }

    /deep/ .el-form-item {
      margin-bottom: 0px;
    }

    .product-specs-item {
      border: 1px solid #EBEEF5;
      height: 100px;
      width: 215px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      flex-direction: column;
      margin-left: -1px;

      /deep/.el-form-item__label {
        flex: 1;
      }

      /deep/.el-form-item__content {
        width: 100%;
        border-top: 1px solid #EBEEF5;
        flex: 2;
        margin-left: 0px !important;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    .shelf-life {
      /deep/ .el-input {
        width: 80px;
      }
    }
  }

  //下标 注释
  .gray-tip {
    font-size: 12px;
    font-family: Microsoft YaHei-Regular, Microsoft YaHei;
    font-weight: 400;
    color: #BBBBBB;
    margin-top: 5px;
  }

  // 商品标签
  .prodect-tag {
    .content {
      display: flex;
      align-items: flex-start;
      flex-direction: column;

      .el-tag {
        margin-right: 10px;
      }
    }
  }

  // 是否推荐
  .prodect-recommendValue {
    .gray-tip {
      margin-left: 10px;
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
