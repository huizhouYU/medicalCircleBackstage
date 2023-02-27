<template>
  <div class="publish-good-box">
    <!-- 编辑商品区域 -->
    <el-form ref="goodInfo" :model="goodInfo" label-width="100px" class="eidt-form" label-position="right">
      <!-- 产品类目 -->
      <el-form-item label="产品类目：" class="cart-item">
        <span @click="preStep()" class="chooseClassify-span">{{goodInfo.chooseClassify||'请重新选择类目'}}</span>
      </el-form-item>
      <div class="eidt-box">
        <el-tabs v-model="activeName" @tab-click="handleClick" class="publish-good-tabs">
          <!-- TAB:基本信息 -->
          <el-tab-pane label="基本信息" name="first">
            <!-- 展示区域 -->
            <div label="展示区域：" class="my-item">
              <div class="my-item-key">展示区域：</div>
              <span class="bule-font">
                <template v-if="goodInfo.type == 'material' ">配件专区</template>
                <template v-else-if="goodInfo.type == 'equipment' ">医疗器械</template>
              </span>
            </div>
            <!-- 销售类型 -->
            <el-form-item label="销售类型：" class="item-name">
              <div class="sell-type-select">
                <div :class="['sell-type-item',{'select':goodInfo.saleType == '1'}]" @click="goodInfo.saleType = '1'">
                  <span class="type-title">咨询议价</span>
                  <span class="type-remark">无需填写价格</span>
                  <div class="img-box">
                    <img src="../../assets/images/pic_yijia_def.png" alt="" v-show="goodInfo.saleType != '1'">
                    <img src="../../assets/images/pic_yijia_sel.png" alt="" v-show="goodInfo.saleType == '1'">
                  </div>
                </div>
                <div :class="['sell-type-item',{'select':goodInfo.saleType == '2'}]" @click="goodInfo.saleType = '2'">
                  <span class="type-title">线上销售</span>
                  <span class="type-remark">需填写价格</span>
                  <div class="img-box">
                    <img src="../../assets/images/pic_xiaoshou_def.png" alt="" v-show="goodInfo.saleType != '2'">
                    <img src="../../assets/images/pic_xiaoshou_sel.png" alt="" v-show="goodInfo.saleType == '2'">
                  </div>
                </div>
              </div>
            </el-form-item>
            <!-- 产品名称 -->
            <el-form-item label="产品名称：" class="item-name">
              <el-input v-model="goodInfo.goodsName" placeholder="请输入商品名称" maxlength="40" show-word-limit></el-input>
            </el-form-item>
            <!-- 所属品牌 -->
            <el-form-item label="所属品牌：" class="item-brand">
              <el-select v-model="goodInfo.brandId" class="select-brand" v-show="!goodInfo.brandInputType">
                <el-option v-for="item in brandsOptions" :key="item.brandId" :label="item.brandName||'-'"
                  :value="item.brandId">
                </el-option>
              </el-select>
              <el-input v-model="goodInfo.brandName" placeholder="请输入商品品牌" maxlength="40" show-word-limit
                v-show="goodInfo.brandInputType">
              </el-input>
              <el-checkbox v-model="goodInfo.brandInputType">自定义品牌</el-checkbox>
            </el-form-item>
            <!-- 产品主图 -->
            <el-form-item label="产品主图：" class="">
              <div label="图片可拖曳排序：" prop="trialImgs" class="">
                <div class="">
                  <!-- <DragUpload @allList="trialImgs" :limit="limit" :limitWidth="800" :limitHeight="800" :imgList="imgList"> -->
                  <DragUpload @allList="trialImgs" :limit="limit" :imgList="imgList">
                    <!-- <DragUpload :imgList="imgList" :limit="5" @allList="trialImgs"  :limitWidth="800" :limitHeight="800"/> -->
                  </DragUpload>
                  <div class="gray-tip">注：主图按照图片上传顺序展示，图片支持jpg/png格式，尺寸建议为800*800(1：1)，拖拽图片可调整排序</div>
                </div>
              </div>
            </el-form-item>
            <!-- 产品长图 -->
            <!-- <el-form-item label="产品长图：" class="">
              <div label="图片可拖曳排序：" prop="longTrialImgs" class="">
                <div class="">
                  <DragUpload @allList="longTrialImgs" :limit="longLimit" :imgList="longImages">
                  </DragUpload>
                  <div class="gray-tip">请：图片支持jpg/png格式，不超过3M，尺寸最大为750*1000，拖拽图片可调整排序</div>
                </div>
              </div>
            </el-form-item> -->
            <!-- 商品标签 -->
            <el-form-item label="商品标签：" class="prodect-tag">
              <div class="content">
                <el-input v-model="goodTag" placeholder="请输入商品名称" maxlength="15" show-word-limit></el-input>
                <span class="gray-tip">填写商品卖点，最多不超过15个字</span>
              </div>

              <!-- <div class="content">
                <div class="tags-content">
                  <el-tag :key="tag" v-for="tag in goodInfo.tagList" closable :disable-transitions="false"
                    @close="handleClose(tag)">
                    {{tag}}
                  </el-tag>
                  <el-input v-model="goodTag" placeholder="添加标签" maxlength="4" @keyup.enter.native="addTag()"
                    v-show="inputVisible"></el-input>
                </div>
              </div> -->
            </el-form-item>
            <!-- 立即上架 -->
            <div class="my-item">
              <div class="my-item-key">立即上架：</div>
              <el-switch v-model="goodIfShow" active-color="#1890FF">
              </el-switch>
            </div>
            <!-- 是否推荐 -->
            <div class="my-item">
              <div class="my-item-key">是否推荐：</div>
              <div class="prodect-recommendValue">
                <el-switch v-model="goodRecommended" active-color="#13ce66">
                </el-switch>
                <span class="gray-tip">被推荐的商品会显示在店铺首页</span>
              </div>
            </div>
            <div class="submit">
              <el-button type="primary" class="public-el-submit-btn" @click="activeName = 'second'">下一步</el-button>
            </div>
          </el-tab-pane>
          <!-- TAB:商品规格 -->
          <el-tab-pane label="规格库存" name="second">
            <!-- 选择规格 -->
            <el-form-item label="选择规格：" class="">
              <el-select v-model="specs.value" filterable placeholder="请选择">
                <el-option v-for="item in specs.options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
              <el-button type="primary">确定</el-button>
              <el-button class="add-spaces-btn" @click="openSpecs">添加规格模板</el-button>
            </el-form-item>
            <div class="tent-spec-box">
              <el-form-item label="" prop="" v-for="(sp,ind) in tentSpecList" :key="ind">
                <div class="edit-spec-detail-box">
                  <div class="specName-div">
                    {{sp.specName}}
                    <i class="iconfont my-close" @click="delSpec(ind)">&#xe8dc;</i>
                  </div>
                  <div class="specValues-div">
                    <div class="specValue-item" v-for="(item,index) in sp.specStringValues" :key="index">
                      <div class="round"></div>
                      <span>{{item}}</span>
                      <i class="iconfont my-close-font" @click="delValues(ind,index)">&#xe630;</i>
                    </div>
                    <el-input v-model.trim="sp.tent" placeholder="请输入规格值" @keyup.native.enter="addValues(ind)"
                      class="my-add-value-input">
                      <el-button slot="append" @click="addValues(ind)">添加</el-button>
                    </el-input>
                  </div>
                </div>
              </el-form-item>
            </div>
            <el-form-item v-show="showDialogSpecsItem">
              <!-- 规格名称 + 规格值 -->
              <el-form class="add-specs" :model="tentSpecsRuleForm" :rules="tentSpecsRules" ref="tentSpecsRuleForm"
                label-width="130px">
                <el-form-item label="规格名称:" prop="tentSpecName">
                  <el-input v-model.trim="tentSpecsRuleForm.tentSpecName" placeholder="请填写规格名称"></el-input>
                </el-form-item>
                <el-form-item label="规格值:" prop="specValues">
                  <el-input v-model.trim="tentSpecsRuleForm.specValues" placeholder="请填写规格值"
                    @keyup.native.enter="tentSpecSure('tentSpecsRuleForm')"></el-input>
                </el-form-item>
                <el-button type="primary" class="sure-specs-btn" @click="tentSpecSure('tentSpecsRuleForm')">确定
                </el-button>
                <el-button @click="showDialogSpecsItem = false">取消</el-button>
              </el-form>
            </el-form-item>
            <!-- 添加新规格 -->
            <el-form-item label="" class="" v-show="!showDialogSpecsItem">
              <el-button type="primary" icon="el-icon-plus" @click="addNewSpec">添加新规格</el-button>
              <el-button type="success" class="add-spaces-btn" @click="showSetting = true">立即生成</el-button>
            </el-form-item>
            <el-form-item label="批量设置：" v-show="showSetting">

            </el-form-item>

            <!-- 产品规格： -->
            <!-- <el-form-item label="产品规格：" class="product-specs">
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
                <el-input v-model="goodInfo.goodsPn" placeholder="产品P/N码或识别码"
                  onkeyup="value=value.replace(/[^\w\.\/]/ig,'')">
                </el-input>
              </el-form-item>
              <el-form-item label="库存" class="product-specs-item">
                <el-input type="text" v-model="goodInfo.qty" placeholder="请输入商品库存"
                  onkeyup="this.value=this.value.replace(/\D/g,'')"></el-input>
              </el-form-item>
              <el-form-item label="新旧程度" class="product-specs-item" v-show="goodInfo.type == 'material'">
                <el-select v-model="goodInfo.degree" class="select-item" placeholder="请选择">
                  <el-option v-for="item in newOrOrdDegreeOptions" :key="item.value" :label="item.label"
                    :value="item.value">
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
            </el-form-item> -->
            <div class="submit">
              <el-button class="public-el-submit-btn" @click="activeName = 'first'">上一步</el-button>
              <el-button type="primary" class="public-el-submit-btn" @click="activeName = 'third'">下一步</el-button>
            </div>
          </el-tab-pane>
          <!-- TAB:商品详情 -->
          <el-tab-pane label="商品详情" name="third">
            <!-- 产品详情 -->
            <el-form-item label="产品详情：" class="product-detail">
              <edit class="edit" ref="edit" @getContent="getContentData" :description="goodInfo.content"></edit>
            </el-form-item>
            <div class="submit">
              <el-button class="public-el-submit-btn" @click="activeName = 'second'">上一步</el-button>
              <el-button type="primary" class="public-el-submit-btn" @click="submit" :disabled="!isSubmit">提交
              </el-button>
            </div>
          </el-tab-pane>
        </el-tabs>
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
    <!-- 添加规格模板 -->
    <specs-mould-dialog :specsDialogVisible="specsDialogVisible" @closeSpecs="closeSpecs"></specs-mould-dialog>
  </div>

  <!-- </div> -->
</template>

<script>
  import {
    goodCreate,
    goodsUpdate,
    goodsDetail,
    specList
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
  import specsMouldDialog from '../../../src/views/goods/specsMouldDialog.vue'
  import {
    mapGetters
  } from 'vuex'
  export default {
    components: {
      DragUpload,
      edit,
      addGoods,
      specsMouldDialog
    },
    computed: {
      ...mapGetters([
        'roles',
      ])
    },

    data() {
      return {
        specs: {
          options: [{
            value: '选项1',
            label: '黄金糕'
          }, {
            value: '选项2',
            label: '双皮奶'
          }, {
            value: '选项3',
            label: '蚵仔煎'
          }, {
            value: '选项4',
            label: '龙须面'
          }, {
            value: '选项5',
            label: '北京烤鸭'
          }],
          value: ''
        },
        specsDialogVisible: false, //添加规格模板 -- 弹框
        showDialogSpecsItem: false,
        tentSpecList: [],
        tentSpecsRuleForm: {
          tentSpecName: '', //规格名称
          specValues: '' //规格值
        },
        tentSpecsRules: {
          tentSpecName: [{
              required: true,
              message: '请输入规格名称',
              trigger: 'blur'
            },
            {
              min: 0,
              max: 25,
              message: '长度在 0 到 25 个字符',
              trigger: 'blur'
            }
          ],
          specValues: [{
              required: true,
              message: '请输入规格值',
              trigger: 'blur'
            },
            {
              min: 0,
              max: 25,
              message: '长度在 0 到 25 个字符',
              trigger: 'blur'
            }
          ]
        },
        //批量设置
        showSetting: false,




        activeName: 'first',
        isSubmit: true,
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
        goodIfShow: false,
        goodRecommended: false,
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
          longImages: [], //长图
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
      this.getSpecList() //获取规格列表
      this.getParams()
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      },
      //获取规格列表
      getSpecList() {
        let params = {
          pageNo: 1,
          pageSize: 9999
        }
        specList(JSON.stringify(params)).then(response => {
          console.log("获取规格列表：", response)
        })
      },
      getParams() {
        // 销售类型
        if (this.roles.includes('personal')) {
          this.xsOptions = [{
            value: 2,
            label: '咨询议价'
          }]
          this.goodInfo.saleType = 2
          this.isEditPrice()
        }
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
            this.goodIfShow = this.goodInfo.ifShow == 1 ? true : false
            //是否推荐
            this.goodRecommended = this.goodInfo.recommended == 1 ? true : false
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
        this.isSubmit = false
        var flag = true
        var params = {
          chosedData: this.goodInfo.chosedData,
          chooseClassify: this.goodInfo.chooseClassify
        }
        this.goodInfo.category = JSON.stringify(params)
        var i = this.goodInfo.chosedData.length - 1
        for (i; i >= 0; i--) {
          if (this.goodInfo.chosedData[i].value != '') {
            this.goodInfo.cateName = this.goodInfo.chosedData[i].label
            this.goodInfo.cateId = Number(this.goodInfo.chosedData[i].value)
            i = -1
          }
        }
        this.goodInfo.ifShow = Number(this.goodIfShow)
        this.goodInfo.recommended = Number(this.goodRecommended)
        this.goodInfo.price = Number(this.goodInfo.price)
        this.goodInfo.qualityTime = Number(this.goodInfo.qualityTime)
        this.goodInfo.saleType = Number(this.goodInfo.saleType)
        this.goodInfo.qty = Number(this.goodInfo.qty)

        //相关图片
        if (this.ruleForm.trialImgs.length > 0) {
          this.goodInfo.imageList = []
          for (var item of this.ruleForm.trialImgs) {
            if (flag) {
              if (item.file != '') {
                let param = new FormData(); //创建form对象
                param.append('file', item.file); //通过append向form对象添加数据
                await uploadImage(param).then(response => {
                  if (response.data.code != 10000) {
                    this.isSubmit = true
                    this.$message.error(response.data.message)
                    flag = false
                  } else {
                    this.goodInfo.imageList.push(response.data.data)
                  }
                })
              } else {
                this.goodInfo.imageList.push(item.imgUrl)
              }
            }
          }
        }
        //长图
        if (this.ruleForm.longTrialImgs.length > 0 && flag) {
          this.goodInfo.longImages = []
          for (var item of this.ruleForm.longTrialImgs) {
            if (flag) {
              if (item.file != '') {
                let param = new FormData(); //创建form对象
                param.append('file', item.file); //通过append向form对象添加数据
                await uploadImage(param).then(response => {
                  if (response.data.code != 10000) {
                    this.$message.error(response.data.message)
                    this.isSubmit = true
                    flag = false
                  } else {
                    this.goodInfo.longImages.push(response.data.data)
                  }
                })
              } else {
                this.goodInfo.longImages.push(item.imgUrl)
              }
            }
          }
        }
        //再次获取富文本信息
        this.$refs.edit.putContent()
        if (flag) {
          this.goodInfo.defaultImage = this.goodInfo.imageList[0]
          if (this.goodInfo.goodsId != undefined) { //编辑商品
            goodsUpdate(JSON.stringify(this.goodInfo)).then(response => {
              var res = response.data.data
              if (response.data.code != '10000') { //失败
                this.$message.error(response.data.message)
                this.isSubmit = true
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
                this.isSubmit = true
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
        if (this.goodInfo.tagList == null) {
          this.goodInfo.tagList = []
        }
        if (this.goodInfo.tagList.length < 5) {
          this.goodTag = this.trim(this.goodTag)
          if (this.goodTag != '') {
            this.goodInfo.tagList.push(this.goodTag.substring(0, 4))
          }
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
      },
      trim(str) {
        return str.replace(/(^\s*)|(\s*$)/g, "");
      },
      openSpecs() {
        this.specsDialogVisible = true
      },
      //关闭添加规格模板弹窗
      closeSpecs() {
        this.specsDialogVisible = false
      },
      addNewSpec() {
        this.tentSpecsRuleForm = {
          tentSpecName: '', //规格名称
          specValues: '' //规格值
        }
        this.showDialogSpecsItem = true
      },
      tentSpecSure(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var param = {
              specName: this.tentSpecsRuleForm.tentSpecName,
              specStringValues: [],
              tent: ''
            }
            param.specStringValues.push(this.tentSpecsRuleForm.specValues)
            this.tentSpecList.push(param)
            this.showDialogSpecsItem = false
          } else {
            return false;
          }
        });
      },
      clearTentData() {
        this.tentSpecsRuleForm.tentSpecName = ''
        this.tentSpecsRuleForm.specValues = ''
      },
      delSpec(key) {
        this.tentSpecList.splice(key, 1)
        this.clearTentData()
      },
      delValues(ind, key) {
        this.tentSpecList[ind].specStringValues.splice(key, 1)
      },
      addValues(ind) {
        if (this.tentSpecList[ind].tent) {
          this.tentSpecList[ind].specStringValues.push(this.tentSpecList[ind].tent)
          this.tentSpecList[ind].tent = ''
        }
      },
    }
  }
</script>

<style scoped lang="less">
  .publish-good-box {

    //修改el-tab样式
    /deep/ .el-tabs__item {
      font-weight: 400;
    }

    //修改产品类目的el-dialog弹框样式
    /deep/.el-dialog {
      height: auto !important;
    }

    /deep/.el-dialog__footer {
      bottom: 10px;
    }

    /deep/ .el-dialog__header {
      height: 50px;
      background: #FAFAFA;
      border-radius: 4px 4px 0px 0px;
      font-size: 14px;
      font-family: Microsoft YaHei-Bold, Microsoft YaHei;
      font-weight: bold;
      color: #333333;
      display: flex;
      align-items: center;
      padding: 0px 0px 0px 22px;
    }

    /deep/.el-dialog__body {
      padding-top: 0px;
    }
  }

  .bule-font {
    color: #1890FF;
  }

  // 产品类目
  .cart-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 74px;
    background: #FFFFFF;
    box-shadow: 0px 2px 10px 1px rgba(0, 0, 0, 0.06);
    border-radius: 6px 6px 6px 6px;
    box-sizing: border-box;
    margin-bottom: 32px;
    padding-left: 15px;

    // 产品类目
    .chooseClassify-span {
      color: #1890FF;
      font-size: 12px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
      font-weight: 400;
    }

    /deep/.el-form-item__content {
      margin-left: 0px !important;
    }
  }

  // 编辑商品信息区域
  .eidt-box {
    background-color: #FFFFFF;
    padding: 0px 35px 30px 15px;
    box-shadow: 0px 2px 10px 1px rgba(0, 0, 0, 0.06);
    border-radius: 6px 6px 6px 6px;
    font-size: 12px;
    font-family: Microsoft YaHei-Regular, Microsoft YaHei;
    font-weight: 400;
    color: #333333;
    width: 100%;

    .my-item:first-child {
      margin-top: 30px;
    }

    .my-item {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin: 0px 0px 25px;

      .my-item-key {
        box-sizing: border-box;
        padding-left: 10px;
        width: 100px;
        font-size: 12px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        font-weight: 400;
        color: #333333;
      }
    }

    // 销售类型
    .sell-type-select {
      display: flex;
      align-items: center;
      justify-content: flex-start;

      .sell-type-item {
        position: relative;
        box-sizing: border-box;
        width: 140px;
        height: 65px;
        background: #FFFFFF;
        border-radius: 4px 4px 4px 4px;
        opacity: 1;
        border: 1px solid #EBEEF5;
        padding-left: 20px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;

        .type-title {
          line-height: 12px;
          font-size: 12px;
          font-family: Microsoft YaHei-Regular, Microsoft YaHei;
          font-weight: 400;
          color: #333333;
        }

        .type-remark {
          line-height: 16px;
          font-size: 12px;
          font-family: Microsoft YaHei-Regular, Microsoft YaHei;
          font-weight: 400;
          color: #999999;
        }

        .img-box {
          position: absolute;
          bottom: 5px;
          right: 6px;
          width: 40px;
          height: 40px;
          display: flex;
          justify-content: center;
          align-items: center;

          img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
          }
        }
      }

      .sell-type-item+.sell-type-item {
        margin-left: 40px;
      }

      .select {
        border: 1px solid #1890FF;
      }
    }

    //修改el-input样式
    /deep/.el-form-item__label {
      font-size: 12px;
      padding-right: 30px;
      color: #333333;
    }

    /deep/.el-form-item {
      margin-bottom: 25px;
    }

    /deep/.el-input {
      width: 420px;
    }

    /deep/.el-input--medium .el-input__inner {
      height: 34px;
      line-height: 34px;
      padding-right: 50px;
    }

    // 所属品牌
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

      /deep/ .el-select>.el-input {
        width: 420px;
      }
    }
  }

  //添加规格模板
  .add-spaces-btn {
    margin-left: 20px;
  }

  .tent-spec-box {

    margin-bottom: 5px;

    /deep/.el-input {
      width: 200px;
    }

    /deep/ .el-form-item {
      margin-bottom: 0px;
    }

    .edit-spec-detail-box {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;

      .specName-div {
        margin-bottom: 15px;
        font-size: 12px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        font-weight: 400;
        color: #333333;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        line-height: 12px;

        .my-close {
          color: #BBBBBB;
          margin-left: 8px;
          margin-top: 4px;
          cursor: pointer;
          font-size: 10px;
        }

        .my-close:hover {
          color: #1890FF;
        }
      }

      // 规格值
      .specValues-div {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-wrap: wrap;

        .specValue-item {
          margin-right: 10px;
          margin-bottom: 15px;
          box-sizing: border-box;
          padding: 0px 10px 0px 15px;
          height: 34px;
          background: #FFFFFF;
          border-radius: 4px 4px 4px 4px;
          opacity: 1;
          border: 1px solid #EBEEF5;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 12px;
          font-family: Microsoft YaHei-Regular, Microsoft YaHei;
          font-weight: 400;
          color: #999999;

          .round {
            width: 10px;
            height: 10px;
            background: #1890FF;
            border-radius: 50%;
            margin-right: 12px;
          }

          .my-close-font {
            cursor: pointer;
            margin-left: 20px;
            font-size: 12px;
            font-family: Microsoft YaHei-Regular, Microsoft YaHei;
            font-weight: 400;
            color: #999999;
          }

          .my-close-font:hover {
            color: #1890FF;
          }

        }

        .my-add-value-input {
          margin-bottom: 15px;
        }

        /deep/ .el-input-group__append {
          background: #1890FF;
          border: none;
          color: #fff;
        }
      }
    }

  }

  .add-specs {
    display: flex;
    justify-content: flex-start;
    align-items: center;

    /deep/.el-input {
      width: 200px;
    }

    /deep/ .el-form-item {
      margin: 0px;
    }

    .sure-specs-btn {
      margin-left: 45px;
      margin-right: 20px;
    }

    /deep/.el-button+.el-button {
      margin-left: 0px;
    }

  }

  /deep/ .el-button--medium {
    padding: 10px 15px;
    font-size: 12px;
  }

  // 产品规格
  // .product-specs {
  //   /deep/ .el-form-item__content {
  //     display: flex;
  //     justify-content: flex-start;
  //     align-items: center;
  //     flex-wrap: wrap;
  //   }

  //   /deep/ .el-input {
  //     width: 160px;
  //   }

  //   /deep/ .el-form-item {
  //     margin-bottom: 0px;
  //   }

  //   .product-specs-item {
  //     border: 1px solid #EBEEF5;
  //     height: 100px;
  //     width: 215px;
  //     display: flex;
  //     justify-content: space-around;
  //     align-items: center;
  //     flex-direction: column;
  //     margin-left: -1px;

  //     /deep/.el-form-item__content {
  //       width: 100%;
  //       border-top: 1px solid #EBEEF5;
  //       flex: 2;
  //       margin-left: 0px !important;
  //       display: flex;
  //       justify-content: center;
  //       align-items: center;
  //     }
  //   }

  //   .shelf-life {
  //     /deep/ .el-input {
  //       width: 80px;
  //     }
  //   }
  // }

  //下标 注释
  .gray-tip {
    font-size: 12px;
    font-family: Microsoft YaHei-Regular, Microsoft YaHei;
    font-weight: 400;
    color: #BBBBBB;
    margin-top: 5px;
    line-height: 12px;
  }

  // 商品标签
  .prodect-tag {
    .content {
      display: flex;
      align-items: flex-start;
      flex-direction: column;
    }
  }

  // 是否推荐
  .prodect-recommendValue {
    .gray-tip {
      margin-left: 20px;
    }
  }

  // 提交
  .submit {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 30px;

    .public-el-submit-btn+.public-el-submit-btn {
      margin-left: 40px;
    }
  }
</style>
