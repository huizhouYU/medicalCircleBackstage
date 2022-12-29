<template>
  <div>
    <!-- 编辑商品区域 -->
    <el-form ref="goodInfo" :model="goodInfo" label-width="100px" class="eidt-box" label-position="right">
      <!-- 产品类目 -->
      <el-form-item label="产品类目：">
        <span @click="preStep()" class="chooseClassify-span">{{goodInfo.chooseClassify||'请重新选择类目'}}</span>
      </el-form-item>
      <!-- 展示区域 -->
      <el-form-item label="展示区域：" class="item-name">
        <el-radio v-model="goodInfo.type" label="material">配件专区</el-radio>
        <el-radio v-model="goodInfo.type" label="equipment">医疗器械</el-radio>
      </el-form-item>
      <!-- 产品名称 -->
      <el-form-item label="产品名称：" class="item-name">
        <el-input v-model="goodInfo.goodsName" placeholder="请输入商品名称" maxlength="40" show-word-limit></el-input>
      </el-form-item>
      <!-- 所属品牌 -->
      <el-form-item label="所属品牌：" class="item-brand">
        <el-select v-model="goodInfo.brandId" class="select-brand" v-show="!goodInfo.brandInputType">
          <el-option v-for="item in brandsOptions" :key="item.brandId" :label="item.brandName" :value="item.brandId">
          </el-option>
        </el-select>
        <el-input v-model="goodInfo.brandName" placeholder="请输入商品品牌" maxlength="40" show-word-limit
          v-show="goodInfo.brandInputType">
        </el-input>
        <el-checkbox v-model="goodInfo.brandInputType">自定义品牌</el-checkbox>
      </el-form-item>
      <!-- 产品规格： -->
      <el-form-item label="产品规格：" class="product-specs">
        <el-form-item label="销售类型" class="product-specs-item">
          <el-select v-model="goodInfo.saleType" class="select-item" @change="isEditPrice()">
            <el-option v-for="item in xsOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="价格" class="product-specs-item">
          <el-input type="text" v-model="goodInfo.price" placeholder="请输入价格" :disabled="!isEditPriceFlag"
            onkeyup="if(!this.value.match(/^[\+\-]?\d*?\.?\d*?$/))this.value=this.t_value;else this.t_value=this.value;if(this.value.match(/^(?:[\+\-]?\d+(?:\.\d+)?)?$/))this.o_value=this.value"
            onblur="if(!this.value.match(/^(?:[\+\-]?\d+(?:\.\d+)?|\.\d*?)?$/))this.value=this.o_value;else{if(this.value.match(/^\.\d+$/))this.value=0+this.value;if(this.value.match(/^\.$/))this.value=0;this.o_value=this.value}">
          </el-input>
        </el-form-item>
        <el-form-item label="商品编码" class="product-specs-item">
          <el-input v-model="goodInfo.goodsPn" placeholder="产品P/N码或识别码" onkeyup="value=value.replace(/[^\w\.\/]/ig,'')">
          </el-input>
        </el-form-item>
        <el-form-item label="库存" class="product-specs-item">
          <el-input type="text" v-model="goodInfo.qty" placeholder="请输入商品库存"
            onkeyup="this.value=this.value.replace(/\D/g,'')"></el-input>
        </el-form-item>
        <el-form-item label="新旧程度" class="product-specs-item">
          <el-select v-model="goodInfo.degree" class="select-item" placeholder="请选择">
            <el-option v-for="item in newOrOrdDegreeOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="质保期限" class="product-specs-item shelf-life">
          <el-input type="text" v-model="goodInfo.qualityTime" placeholder=""
            onkeyup="this.value=this.value.replace(/\D/g,'')"></el-input>
          <el-select v-model="goodInfo.qualityTimeUnit" class="select-item" placeholder="请选择">
            <el-option v-for="item in shelfLifeOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form-item>
      <!-- 产品主图 -->
      <el-form-item label="产品主图：" class="">
        <div label="图片可拖曳排序：" prop="trialImgs" class="">
          <div class="">
            <DragUpload @allList="trialImgs" :limit="limit" :limitWidth="800" :limitHeight="800" :imgList="imgList">
              <!-- <DragUpload :imgList="imgList" :limit="5" @allList="trialImgs"  :limitWidth="800" :limitHeight="800"/> -->
            </DragUpload>
            <div class="gray-tip">请：主图按照图片上传顺序展示，图片支持jpg/png格式，不超过3M，尺寸最大为800*800，拖拽图片可调整排序</div>
          </div>
        </div>
      </el-form-item>
      <!-- 产品长图 -->
      <el-form-item label="产品长图：" class="">
        <div label="图片可拖曳排序：" prop="longTrialImgs" class="">
          <div class="">
            <DragUpload @allList="longTrialImgs" :limit="longLimit" :limitWidth="750" :limitHeight="1000"
              :imgList="longImages">
            </DragUpload>
            <div class="gray-tip">请：图片支持jpg/png格式，不超过3M，尺寸最大为750*1000，拖拽图片可调整排序</div>
          </div>
        </div>
      </el-form-item>
      <!-- 产品详情 -->
      <el-form-item label="产品详情：" class="product-detail">
        <edit class="edit" @getContent="getContentData" :description="goodInfo.content"></edit>
      </el-form-item>
      <!-- 交易方式 -->
      <el-form-item label="交易方式：">
        <el-select v-model="goodInfo.tradeMode" class="select-item">
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
        <el-switch v-model="goodInfo.ifShow" active-color="#1890FF">
        </el-switch>
      </el-form-item>
      <!-- 是否推荐 -->
      <el-form-item label="是否推荐：" class="prodect-recommendValue">
        <el-switch v-model="goodInfo.recommended" active-color="#13ce66">
        </el-switch>
        <span class="gray-tip">被推荐的商品会显示在店铺首页</span>
      </el-form-item>
      <div class="submit">
        <el-button type="primary" class="public-el-submit-btn" @click="submit">提交</el-button>
      </div>
    </el-form>
    <!-- 修改类目 -->
    <el-dialog title="选择类目" :close-on-click-modal="false" :visible.sync="cartDialogVisible" width="800px"
      class="el-dialog-box">
      <add-goods :showSearch='showSearch' @getCartData="getCartData"></add-goods>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="closeCartDialog">取 消</el-button>
        <el-button size="medium" type="primary" @click="sureCartDialog">确 定</el-button>
      </span>
    </el-dialog>
  </div>

  <!-- </div> -->
</template>

<script>
  import {
    goodCreate,
    goodsUpdate,
    goodsDetail
  } from '@/api/goods'
  import {
    uploadImage
  } from '@/api/public'
  import {
    brandList
  } from '@/api/demand'
  import edit from '../utils/edit.vue'
  import DragUpload from '../utils/DragUpload.vue'; // 引入vue-draggable
  import addGoods from '../../../src/views/goods/addGoods.vue'
  export default {
    components: {
      DragUpload,
      edit,
      addGoods
    },
    data() {
      return {
        temporaryCartData: '',
        cartDialogVisible: false,
        showSearch: false,
        inputVisible: true,
        goodTag: '', //添加的商品标签
        isBack: true, //只有新增商品才能返回上一步
        limit: 5,
        longLimit: 5,
        imgList: [],
        longImages: '',
        //商品信息
        goodInfo: {
          type: 'material', //商品类型 material-配件 equipment-设备器械
          goodsName: '', //商品名称
          brandInputType: false, //是否自定义品牌,false-选择 true-自定义
          brandId: '', //所属品牌ID 如果自定义就不传
          brandName: '', //品牌名称 如果自定义就传
          category: '', //分类的Json信息
          chooseClassify: '', //选择的类目【拼接字符串】
          chosedData: [], //选择的类目
          cateId: '',
          cateName: '',
          saleType: 1, //选择的销售方式
          degree: '', //选择的新旧程度
          price: '', //价格
          goodsPn: '', //商品编码
          qty: '', //库存
          qualityTime: '', //保质期
          qualityTimeUnit: '日', //选择的保质期【年、月、日】
          defaultImage: '', //主图
          longImages: '', //长图
          imageList: [],
          content: '', //产品详情
          tradeMode: 1, //选择的交易方式
          tagList: [], //商品标签
          ifShow: 0, //是否立即上架
          recommended: 1, //是否推荐
        },
        brandsOptions: [],
        //是否允许输入价格
        isEditPriceFlag: true,
        //交易方式
        fareOptions: [{
          value: 1,
          label: '当面交易'
        }, {
          value: 2,
          label: '物流发货'
        }],
        // 销售类型
        xsOptions: [{
            value: 1,
            label: '在线销售'
          },
          {
            value: 2,
            label: '咨询议价'
          }
        ],
        //新旧程度
        newOrOrdDegreeOptions: [{
            value: 1,
            label: '一成新'
          },
          {
            value: 2,
            label: '两成新'
          },
          {
            value: 3,
            label: '三成新'
          },
          {
            value: 4,
            label: '四成新'
          },

          {
            value: 5,
            label: '五成新'
          },
          {
            value: 6,
            label: '六成新'
          },
          {
            value: 7,
            label: '七成新'
          },
          {
            value: 8,
            label: '八成新'
          },
          {
            value: 9,
            label: '九成新'
          },
          {
            value: 10,
            label: '十成新'
          }
        ],
        //保质期类型【日、月、年】
        shelfLifeOptions: [{
            value: 'day',
            label: '日'
          },
          {
            value: 'month',
            label: '月'
          },
          {
            value: 'year',
            label: '年'
          }
        ],
        ruleForm: {
          imgUrl: '',
          trialImgs: [],
          longTrialImgs: []
        },

      }
    },
    mounted() {
      this.getParams()
    },
    methods: {
      getParams() {
        brandList().then(response => {
          this.brandsOptions = response.data.data
        })
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
          goodsDetail({
            goodsId: editGoodData.goodsId
          }).then(response => {
            var res = response.data.data
            this.goodInfo = res
            //产品类目
            if (res.category != '' && res.category != null && res.category != undefined) {
              var category = JSON.parse(res.category)
              this.goodInfo.chosedData = category.chosedData
              this.goodInfo.chooseClassify = category.chooseClassify
            } else {
              this.goodInfo.chosedData = ''
              this.goodInfo.chooseClassify = ''
            }
            //相关图片
            this.imgList = this.goodInfo.imageList
            this.longImages = this.goodInfo.longImages
            //是否上架
            this.goodInfo.ifShow = this.goodInfo.ifShow == 1 ? true : false
            //是否推荐
            this.goodInfo.recommended = this.goodInfo.recommended == 1 ? true : false
            //判断标签个数
            if (this.goodInfo.tagList != null && this.goodInfo.tagList.length == 5) {
              this.inputVisible = false
            }
            //判断价格是否能输入
            this.isEditPrice()
          })
        }

      },
      getCartData(cartData) {
        console.log("getCartData:", cartData)
        this.temporaryCartData = cartData
      },
      closeCartDialog() {
        this.cartDialogVisible = false
      },
      sureCartDialog() {
        // var category = JSON.parse(this.temporaryCartData)
        this.goodInfo.chosedData = JSON.parse(this.temporaryCartData)
        this.goodInfo.chooseClassify = this.goodInfo.chosedData[0].label
        if (this.goodInfo.chosedData[1].label != '') {
          this.goodInfo.chooseClassify += " > " + this.goodInfo.chosedData[1].label
          if (this.goodInfo.chosedData[2].label != '') {
            this.goodInfo.chooseClassify += " > " + this.goodInfo.chosedData[2].label
          }
        }
        this.closeCartDialog()

      },
      //当选择“咨询议价”时，商品价格禁止输入
      isEditPrice() {
        if (this.goodInfo.saleType == 2) {
          this.isEditPriceFlag = false
        } else {
          this.isEditPriceFlag = true
        }
      },
      //点击‘类目’返回上一步
      preStep() {
        this.cartDialogVisible = true
        // console.log("hhh", this.goodInfo)
        // // if (this.isBack) {
        // this.$store.dispatch('tagsView/delView', this.$route).then(({
        //   visitedViews
        // }) => {
        //   var params = {
        //     chosedData: ''
        //   }
        //   if (this.goodInfo.chosedData != null && this.goodInfo.chosedData != undefined && this.goodInfo
        //     .chosedData != '') {
        //     params.chosedData = JSON.stringify(this.goodInfo.chosedData)
        //   }
        //   this.$router.replace({
        //     path: 'addGoods',
        //     query: {
        //       params
        //       // chosedData: JSON.stringify(this.goodInfo.chosedData)
        //     }
        //   })
        // })

        // }
      },
      // 图片可拖曳排序
      trialImgs(allList) {
        this.ruleForm.trialImgs = allList
      },
      //产品长图
      longTrialImgs(allList) {
        this.ruleForm.longTrialImgs = allList
      },
      getContentData(content) {
        this.goodInfo.content = content
      },
      async submit() {
        var params = {
          chosedData: this.goodInfo.chosedData,
          chooseClassify: this.goodInfo.chooseClassify
        }
        this.goodInfo.category = JSON.stringify(params)
        var i = this.goodInfo.chosedData.length - 1
        for (i; i >= 0; i--) {
          if (this.goodInfo.chosedData[i].value != '') {
            console.log(i + ":" + this.goodInfo.chosedData[i].value)
            this.goodInfo.cateName = this.goodInfo.chosedData[i].label
            this.goodInfo.cateId = Number(this.goodInfo.chosedData[i].value)
            i = -1
          }
        }
        this.goodInfo.ifShow = Number(this.goodInfo.ifShow)
        this.goodInfo.recommended = Number(this.goodInfo.recommended)
        this.goodInfo.price = Number(this.goodInfo.price)
        this.goodInfo.qualityTime = Number(this.goodInfo.qualityTime)
        this.goodInfo.saleType = Number(this.goodInfo.saleType)
        this.goodInfo.qty = Number(this.goodInfo.qty)

        //相关图片
        if (this.ruleForm.trialImgs.length > 0) {
          this.goodInfo.imageList = []
          for (var item of this.ruleForm.trialImgs) {
            if (item.file != '') {
              let param = new FormData(); //创建form对象
              param.append('file', item.file); //通过append向form对象添加数据
              await uploadImage(param).then(response => {
                this.goodInfo.imageList.push(response.data.data)
              })
            } else {
              // var newImgUrl = item.imgUrl.split("https://images.weserv.nl/?url=").join("");
              // this.goodInfo.imageList.push(newImgUrl)
              this.goodInfo.imageList.push(item.imgUrl)
            }
          }
        }
        //长图
        if (this.ruleForm.longTrialImgs.length > 0) {
          this.goodInfo.longImages = []
          console.log("this.ruleForm.longTrialImgs：", this.ruleForm.longTrialImgs)
          for (var item of this.ruleForm.longTrialImgs) {
            if (item.file != '') {
              let param = new FormData(); //创建form对象
              param.append('file', item.file); //通过append向form对象添加数据
              console.log("param：", param)
              await uploadImage(param).then(response => {
                this.goodInfo.longImages.push(response.data.data)
              })
            } else {
              this.goodInfo.longImages.push(item.imgUrl)
            }
          }
        }

        this.goodInfo.defaultImage = this.goodInfo.imageList[0]
        console.log('商品信息', this.goodInfo)
        // console.log(JSON.stringify(this.goodInfo))
        if (this.goodInfo.goodsId != undefined) { //编辑商品
          goodsUpdate(JSON.stringify(this.goodInfo)).then(response => {
            var res = response.data.data
            if (response.data.code != '10000') { //失败
              this.$message.error(response.data.message)
            } else { //成功
              this.$message({
                type: 'success',
                message: '更新成功!'
              });
              this.$store.dispatch('tagsView/delView', this.$route).then(({
                visitedViews
              }) => {
                this.$router.replace("/goodsIndex")
              })
            }
          })
        } else { //新建商品
          goodCreate(JSON.stringify(this.goodInfo)).then(response => {
            var res = response.data.data
            if (response.data.code != '10000') { //失败
              this.$message.error(response.data.message)
            } else { //成功
              this.$message({
                type: 'success',
                message: '发布成功!'
              });
              this.$store.dispatch('tagsView/delView', this.$route).then(({
                visitedViews
              }) => {
                this.$router.replace("/goodsIndex")
              })
            }
          })
        }


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
<style>
  .el-dialog {
    height: auto !important;
  }

  .el-dialog__footer {
    bottom: 10px;
  }
</style>
