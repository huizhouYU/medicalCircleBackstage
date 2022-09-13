<template>
  <div>
    <!-- 编辑商品区域 -->
    <div class="eidt-box">
      <!-- 产品类目 -->
      <div class="classifyTitle">
        <span class="title-span">产品类目：</span>
        <span @click="preStep()" class="chooseClassify-span">{{goodInfo.chooseClassify}}</span>
      </div>
      <!-- 产品名称+所属品牌 -->
      <div class="item-name-brand">
        <div class="item">
          <span class="title-span">产品名称：</span>
          <input type="text" placeholder="请输入商品名称" v-model="goodInfo.name" maxlength="40">
        </div>
        <div class="item2 item-brand">
          <span class="title-span">所属品牌：</span>
          <el-select v-model="goodInfo.brand" class="select-brand" v-show="!customBrand">
            <el-option v-for="item in brandsOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <input type="text" placeholder="请输入商品品牌" v-model="goodInfo.brand" maxlength="40" v-show="customBrand">
          <el-checkbox v-model="customBrand" @change='goodInfo.brand= ""'>自定义品牌</el-checkbox>
        </div>

      </div>
      <!-- 产品规格： -->
      <div class="product-specs">
        <span class="title-span">产品规格：</span>
        <div class="choose-item">
          <div class="item">
            <div class="title">销售类型</div>
            <div class="content">
              <el-select v-model="goodInfo.chosedXS" class="select-item" @change="isEditPrice()">
                <el-option v-for="item in xsOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="item">
            <div class="title">价格</div>
            <div class="content">
              <input type="number" name="" id="" placeholder="请输入价格" :disabled="!isEditPriceFlag">
            </div>
          </div>
          <div class="item">
            <div class="title">商品编码</div>
            <div class="content">
              <input type="text" name="" id="" placeholder="产品P/N码或识别码">
            </div>
          </div>
          <div class="item">
            <div class="title">库存</div>
            <div class="content">
              <input type="number" name="" id="" placeholder="请输入商品库存">
            </div>
          </div>
          <div class="item">
            <div class="title">新旧程度</div>
            <div class="content">
              <el-select v-model="goodInfo.chosedDegree" class="select-item" placeholder="请选择">
                <el-option v-for="item in newOrOrdDegreeOptions" :key="item.value" :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="item">
            <div class="title">保质期限</div>
            <div class="content shelf-life">
              <input type="number" name="" id="" placeholder="请输入">
              <el-select v-model="goodInfo.chosedShelfLife" class="select-item" placeholder="请选择">
                <el-option v-for="item in shelfLifeOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
      </div>
      <!-- 产品主图 -->
      <div class="product-images">
        <span class="title-span">产品主图：</span>
        <div label="图片可拖曳排序：" prop="trialImgs" class="content-images">
          <div class="row">
            <DragUpload :allList="ruleForm.trialImgs" v-on:allList="trialImgs" :limit="limit">
            </DragUpload>
            <div class="el-upload__tip gray-tip">请：主图按照图片上传顺序展示，图片支持jpg/png格式，不超过10M，尺寸为800*800，拖拽图片可调整排序</div>
          </div>
        </div>
      </div>
      <!-- 产品详情 -->
      <div class="product-detail">
        <span class="title-span">产品详情：</span>
        <edit class="edit" @getContent="getContentData"></edit>
      </div>
      <!-- 交易方式 -->
      <div class="prodect-fare">
        <span class="title-span">交易方式：</span>
        <el-select v-model="goodInfo.chosedFare" class="select-item">
          <el-option v-for="item in fareOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <!-- 商品标签 -->
      <div class="prodect-tag">
        <span class="title-span">商品标签：</span>
        <div class="content">
          <div class="tags-content">
            <el-tag :key="tag" v-for="tag in goodInfo.tagList" closable :disable-transitions="false"
              @close="handleClose(tag)">
              {{tag}}
            </el-tag>
            <input class="tags-input" placeholder="添加标签" v-model="goodTag" @keyup.enter="addTag()"
              v-show="inputVisible">
          </div>
          <span>最多可填写5个商品标签,每个标签最多4个字</span>
        </div>
      </div>
      <!-- 立即上架 -->
      <div class="prodect-grounding">
        <span class="title-span">立即上架：</span>
        <div class="content">
          <el-switch v-model="goodInfo.groundingValue" active-color="#1890FF">
          </el-switch>
          <span class="isRecommend">是否推荐：</span>
          <el-switch v-model="goodInfo.recommendValue" active-color="#13ce66">
          </el-switch>
          <span class="remarks">被推荐的商品会显示在店铺首页</span>
        </div>
      </div>
      <div class="submit">
        <button class="but-submit" @click="submit">提交</button>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
  // import vabQuill from '@/plugins/vabQuill'
  import edit from '../utils/edit.vue'
  import DragUpload from '../utils/DragUpload.vue'; // 引入vue-draggable
  export default {
    components: {
      DragUpload,
      edit
    },
    // components: { vabQuill },
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
      back() {
        this.$router.replace("/goodsIndex")
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
      //返回上一步
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
  // 头部页面标题
  .header-title {
    display: flex;
    justify-content: flex-start;
    align-items: center;

    // 返回按钮
    .back {
      width: 34px;
      height: 34px;
      background: #FFFFFF;
      box-shadow: 0px 0px 32px 1px rgba(144, 145, 145, 0.15);
      border-radius: 6px 6px 6px 6px;
      text-align: center;
      line-height: 34px;
      cursor: pointer;
    }

    //标题
    .title {
      margin-left: 20px;
      // width: 88px;
      height: 34px;
      padding: 0px 20px;
      background: #1890FF;
      border-radius: 6px 6px 6px 6px;
      font-size: 12px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
      font-weight: 400;
      color: #FFFFFF;
      text-align: center;
      line-height: 34px;

      i {
        padding: 0px 4px;
        font-size: 12px;
      }
    }
  }

  // 编辑商品区域
  .eidt-box {
    background-color: #FFFFFF;
    padding: 20px 35px 30px 15px;
    margin-top: 15px;
    box-shadow: 0px 2px 10px 1px rgba(0, 0, 0, 0.06);
    border-radius: 6px 6px 6px 6px;
    font-size: 12px;
    font-family: Microsoft YaHei-Regular, Microsoft YaHei;
    font-weight: 400;
    color: #333333;

    /deep/ .el-input {
      width: auto;
    }

    .title-span {
      width: 65px;
    }

    // 产品类目
    .classifyTitle {
      margin-right: 30px;

      .chooseClassify-span {
        margin-left: 30px;
        color: #1890FF;
      }
    }

    .item-name-brand {

      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;

      .item,
      .item2 {
        margin-top: 30px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
      }

      .item2 {
        margin-right: 10px;

        //所属品牌的下拉款
        .select-brand {
          margin-left: 30px;

          /deep/ .el-input__inner {
            height: 34px;
            width: 250px;
            font-size: 12px;
          }

          /deep/ .el-input__icon {
            line-height: 34px;
          }
        }
      }

      .item-brand {
        display: flex;
        justify-content: flex-start;
        align-items: center;
      }

      /* WebKit browsers */
      input::-webkit-input-placeholder {
        color: #BBBBBB;
      }

      /* Mozilla Firefox 4 to 18 */
      input:-moz-placeholder {
        color: #BBBBBB;
      }

      /* Mozilla Firefox 19+ */
      input::-moz-placeholder {
        color: #BBBBBB;
      }

      /* Internet Explorer 10+ */
      input:-ms-input-placeholder {
        color: #BBBBBB;
      }

      input {
        margin-left: 30px;
        width: 250px;
        height: 34px;
        background: #FFFFFF;
        border-radius: 4px 4px 4px 4px;
        border: 1px solid #EBEEF5;
        outline: none;
        box-sizing: border-box;
        font-size: 12px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        font-weight: 400;
        color: #333;
        padding-left: 15px;
      }

      .item {
        margin-right: 100px;
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
    margin-top: 30px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    box-sizing: border-box;
    font-size: 12px;
    font-family: Microsoft YaHei-Regular, Microsoft YaHei;
    font-weight: 400;
    color: #333333;

    .choose-item {
      flex: 1;
      margin-left: 30px;
      display: grid;
      grid-template-columns: repeat(auto-fill, 160px);

      .item {
        width: 160px;
        height: 100px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border: 1px solid #EBEEF5;
        box-sizing: border-box;

        .title {
          height: 35px;
          width: 100%;
          box-sizing: border-box;
          border-bottom: 1px solid #EBEEF5;
        }

        .content {
          flex: 1;
        }

        .title,
        .content {
          height: ;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        input {
          height: 32px;
          width: 100px;
          box-sizing: border-box;
          border-radius: 4px 4px 4px 4px;
          border: 1px solid #EBEEF5;
          outline: none;
          text-align: center;
          font-size: 12px;
          font-family: Microsoft YaHei-Regular, Microsoft YaHei;
          font-weight: 400;
          color: #333333;

        }

        .el-select {
          width: 100px;
          height: 32px;
          box-sizing: border-box;
        }

        /deep/ .el-input__icon {
          line-height: 32px;
        }

        /deep/ .el-input__inner {
          border-radius: 4px 4px 4px 4px;
          border: 1px solid #EBEEF5;
          font-size: 12px;
          font-family: Microsoft YaHei-Regular, Microsoft YaHei;
          font-weight: 400;
          color: #333333;
          height: 32px;
          line-height: 32px;
        }

        // 保质期
        .shelf-life {
          input {
            height: 32px;
            width: 70px;
            margin-right: 10px;
            box-sizing: border-box;
          }

          .el-select {
            width: 60px;
            height: 32px;
            box-sizing: border-box;
          }
        }
      }

      .item:first-child {
        border-radius: 4px 0px 0px 4px;
      }

      .item:last-child {
        border-radius: 0px 4px 4px 0px;
      }

    }
  }

  // 产品主图
  .product-images {
    margin-top: 30px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 12px;
    font-family: Microsoft YaHei-Regular, Microsoft YaHei;
    font-weight: 400;
    color: #333333;

    .content-images {
      margin-left: 30px;
    }

    .gray-tip {
      font-size: 12px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
      font-weight: 400;
      color: #BBBBBB;
      margin-top: 5px;
    }
  }

  // 产品详情
  .product-detail {
    margin-top: 30px;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    font-size: 12px;
    font-family: Microsoft YaHei-Regular, Microsoft YaHei;
    font-weight: 400;
    color: #333333;

    span {
      margin-top: 15px;
    }

    .edit {
      flex: 1;
      margin-left: 30px;
      height: 366px;
    }
  }

  // 交易方式
  .prodect-fare {
    margin-top: 30px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 12px;
    font-family: Microsoft YaHei-Regular, Microsoft YaHei;
    font-weight: 400;
    color: #333333;

    .el-select {
      margin-left: 30px;
      width: 250px;
      height: 34px;
      box-sizing: border-box;

      /deep/ .el-input__inner {
        height: 32px;
        line-height: 32px;
      }

      /deep/ .el-input__icon {
        line-height: 32px;
      }
    }

  }

  // 商品标签
  .prodect-tag {
    margin-top: 30px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 12px;
    font-family: Microsoft YaHei-Regular, Microsoft YaHei;
    font-weight: 400;
    color: #333333;

    .content {
      display: flex;
      align-items: flex-start;
      flex-direction: column;
      margin-left: 30px;

      .el-tag {
        margin-bottom: 15px;
      }

      .el-tag+.el-tag {
        margin-left: 10px;
      }

      // .tags-content {
      //   border: 1px solid #D9D9D9;
      //   border-radius: 4px;
      //   font-size: 14px;
      //   color: #333;

      //   ul {
      //     display: flex;
      //     justify-content: flex-start;
      //     align-items: center;
      //     padding: 5px;

      //     li {
      //       padding: 2px;
      //       background-color: #F5F5F5;
      //       margin-right: 20px;

      //       i {
      //         font-size: 10px;
      //         transform: scale(0.83);
      //         cursor: pointer;
      //       }
      //     }
      //   }
      // }

      input {
        width: 424px;
        height: 34px;
        background: #FFFFFF;
        border-radius: 4px 4px 4px 4px;
        border: 1px solid #D9D9D9;
        outline: none;
        box-sizing: border-box;
        font-size: 12px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        font-weight: 400;
        color: #333;
        padding-left: 15px;
      }

      span {
        color: #BBBBBB;
        margin-top: 5px;
      }
    }
  }

  // 立即上架
  .prodect-grounding {
    margin-top: 30px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 12px;
    font-family: Microsoft YaHei-Regular, Microsoft YaHei;
    font-weight: 400;
    color: #333333;

    .content {
      margin-left: 30px;

      .isRecommend {
        margin-left: 280px;
        margin-right: 30px;
      }

      .remarks {
        margin-left: 12px;
        color: #BBBBBB;
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
