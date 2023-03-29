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
                <div :class="['sell-type-item',{'select':goodInfo.saleType == '2'}]" @click="goodInfo.saleType = '2'">
                  <span class="type-title">咨询议价</span>
                  <span class="type-remark">无需填写价格</span>
                  <div class="img-box">
                    <img src="../../assets/images/pic_yijia_def.png" alt="" v-show="goodInfo.saleType != '2'">
                    <img src="../../assets/images/pic_yijia_sel.png" alt="" v-show="goodInfo.saleType == '2'">
                  </div>
                </div>
                <div :class="['sell-type-item',{'select':goodInfo.saleType == '1'}]" @click="goodInfo.saleType = '1'"
                  v-if="!this.roles.includes('personal')">
                  <span class="type-title">线上销售</span>
                  <span class="type-remark">需填写价格</span>
                  <div class="img-box">
                    <img src="../../assets/images/pic_xiaoshou_def.png" alt="" v-show="goodInfo.saleType != '1'">
                    <img src="../../assets/images/pic_xiaoshou_sel.png" alt="" v-show="goodInfo.saleType == '1'">
                  </div>
                </div>
              </div>
            </el-form-item>
            <!-- 产品名称 -->
            <el-form-item label="产品名称：" class="item-name">
              <el-input v-model="goodInfo.goodsName" placeholder="请输入商品名称" maxlength="40" show-word-limit></el-input>
            </el-form-item>
            <!-- 产品型号 -->
            <el-form-item label="产品型号：" class="item-name">
              <el-input v-model="goodInfo.goodsModel" placeholder="请输入产品型号" maxlength="40" show-word-limit></el-input>
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
                  <DragUpload @allList="trialImgs" :limit="limit" :imgList="goodInfo.imageList">
                  </DragUpload>
                  <div class="gray-tip">注：主图按照图片上传顺序展示，图片支持jpg/png格式，尺寸建议为800*800(1：1)，拖拽图片可调整排序</div>
                </div>
              </div>
            </el-form-item>
            <!-- 商品标签 -->
            <el-form-item label="商品标签：" class="prodect-tag">
              <div class="content">
                <el-input v-model.trim="goodTag" placeholder="请输入商品名称" maxlength="15" show-word-limit>
                </el-input>
                <span class="gray-tip">填写商品卖点，最多不超过15个字</span>
              </div>

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
            <el-form-item label="选择规格：" class="choose-spec-item">
              <el-select v-model="specs.value" filterable placeholder="请选择" @change="changeSpec">
                <el-option v-for="item in specs.options" :key="item.id" :label="item.specName" :value="item.id">
                  <div class="my-spec-option">
                    {{item.specName}}
                    <span class="tag">
                      <template v-if="item.typeId==1">
                        规
                      </template>
                      <template v-else-if="item.typeId==2">
                        属
                      </template>
                    </span>
                  </div>
                </el-option>
              </el-select>
              <el-button type="primary" @click="sureChosedSpec" v-no-more-click class="sure-btn">确定</el-button>
              <el-button class="add-spaces-btn" @click="openSpecs">添加规格模板</el-button>
            </el-form-item>
            <!-- 规格类型 -->
            <el-form-item label="" class="">
              <div class="whole-spec-item">
                <span class="spec-item-title">
                  规格类型<span class="remark">（最多添加1种属性类型）</span>
                </span>
                <!-- 规格名称 + 规格值 -->
                <el-form class="marginBottom add-specs" :model="tentSpecsRuleForm" :rules="tentSpecsRules"
                  ref="tentSpecsRuleForm" label-width="130px" v-show="tentSpecList.length<=0">
                  <el-form-item label="规格名称:" prop="tentSpecName">
                    <el-input v-model.trim="tentSpecsRuleForm.tentSpecName" placeholder="请填写规格名称"></el-input>
                  </el-form-item>
                  <el-form-item label="规格值:" prop="specValues">
                    <el-input v-model.trim="tentSpecsRuleForm.specValues" placeholder="请填写规格值"
                      @keyup.native.enter="tentSpecSure('tentSpecsRuleForm','1')"></el-input>
                  </el-form-item>
                  <el-button type="primary" class="sure-specs-btn" @click="tentSpecSure('tentSpecsRuleForm','1')">确定
                  </el-button>
                  <el-button @click="">取消</el-button>
                </el-form>
                <div class="tent-spec-box" v-show="tentSpecList.length>0">
                  <draggable :list="tentSpecList" @start="dragging = true" @end="dragging = false" handle=".mover-div">
                    <transition-group>
                      <el-form-item label="" prop="" v-for="(sp,ind) in tentSpecList" :key="ind">
                        <div class="edit-spec-detail-box">
                          <div class="mover-div">
                            <i class="iconfont">&#xe650;</i>
                            <i class="iconfont">&#xe650;</i>
                            <i class="iconfont">&#xe650;</i>
                            <i class="iconfont">&#xe650;</i>
                            <i class="iconfont">&#xe650;</i>
                            <i class="iconfont">&#xe650;</i>
                            <i class="iconfont">&#xe650;</i>
                          </div>
                          <div class="specName-div">
                            {{sp.specName}}
                            <i class="iconfont my-close" @click="delSpec(ind)">&#xe8dc;</i>
                          </div>
                          <div class="specValues-div">
                            <div class="specValue-item" v-for="(item,index) in sp.specStringValues" :key="index">
                              <div class="round"></div>
                              <span>{{item.specValue}}</span>
                              <i class="iconfont my-close-font" @click="delValues(ind,index)">&#xe630;</i>
                            </div>
                            <el-input v-model.trim="sp.tent" placeholder="请输入规格值" @keyup.native.enter="addValues(ind)"
                              class="my-add-value-input">
                              <el-button slot="append" @click="addValues(ind)">添加</el-button>
                            </el-input>
                          </div>
                        </div>
                      </el-form-item>
                    </transition-group>
                  </draggable>
                </div>
              </div>
            </el-form-item>
            <!-- 属性类型 -->
            <el-form-item label="" class="">
              <div class="whole-attr-item">
                <span class="attr-item-title">
                  属性类型<span class="remark">（最多添加5种属性类型）</span>
                </span>
                <div class="tent-attr-box" v-show="tentAttrList.length>0">
                  <draggable :list="tentAttrList" @start="dragging = true" @end="dragging = false" handle=".mover-div">
                    <transition-group>
                      <el-form-item label="" prop="" v-for="(sp,ind) in tentAttrList" :key="ind">
                        <div class="edit-spec-detail-box">
                          <div class="mover-div">
                            <i class="iconfont">&#xe650;</i>
                            <i class="iconfont">&#xe650;</i>
                            <i class="iconfont">&#xe650;</i>
                            <i class="iconfont">&#xe650;</i>
                            <i class="iconfont">&#xe650;</i>
                            <i class="iconfont">&#xe650;</i>
                            <i class="iconfont">&#xe650;</i>
                          </div>
                          <div class="specName-div">
                            {{sp.specName}}
                            <i class="iconfont my-close" @click="delAttr(ind)">&#xe8dc;</i>
                          </div>
                          <div class="specValues-div">
                            <div class="specValue-item" v-for="(item,index) in sp.specStringValues" :key="index">
                              <div class="round"></div>
                              <span>{{item.specValue}}</span>
                              <i class="iconfont my-close-font" @click="delAttrValues(ind,index)">&#xe630;</i>
                            </div>
                            <el-input v-model.trim="sp.tent" placeholder="请输入规格值"
                              @keyup.native.enter="addAttrValues(ind)" class="my-add-value-input">
                              <el-button slot="append" @click="addAttrValues(ind)">添加</el-button>
                            </el-input>
                          </div>
                        </div>
                      </el-form-item>
                    </transition-group>
                  </draggable>
                </div>
                <!-- 规格名称 + 规格值 -->
                <el-form class="marginBottom add-specs" :model="tentAttrRuleForm" :rules="tentAttrRules"
                  ref="tentAttrRuleForm" label-width="130px" v-show="showDialogSpecsItem">
                  <el-form-item label="规格名称:" prop="tentSpecName">
                    <el-input v-model.trim="tentAttrRuleForm.tentSpecName" placeholder="请填写规格名称"></el-input>
                  </el-form-item>
                  <el-form-item label="规格值:" prop="specValues">
                    <el-input v-model.trim="tentAttrRuleForm.specValues" placeholder="请填写规格值"
                      @keyup.native.enter="tentSpecSure('tentAttrRuleForm','2')"></el-input>
                  </el-form-item>
                  <el-button type="primary" class="sure-specs-btn" @click="tentSpecSure('tentAttrRuleForm','2')">确定
                  </el-button>
                  <el-button @click="closeAttr">取消</el-button>
                </el-form>
                <el-button type="primary" icon="el-icon-plus" @click="addNewAttr" v-show="!showDialogSpecsItem">添加新规格
                </el-button>
              </div>
            </el-form-item>

            <el-form-item label="" class="">
              <el-button type="success" class="add-spaces-btn" @click="immediatelyCreate">立即生成</el-button>
            </el-form-item>

            <el-form-item label="批量设置：" v-show="showSetting" class="batch-item">
              <el-form ref="batchForm" :model="batchForm">
                <el-table :data="batchData" style="width: 1075px;" border :header-cell-style="{'text-align':'center'}"
                  :cell-style="{'text-align':'center',backgroundColor: '#fff'}">
                  <el-table-column label="图片">
                    <template slot-scope="scope">
                      <upload-one-img :imgList="batchForm.imgUrl" @imgObj="getImgObj($event,'-1')"></upload-one-img>
                    </template>
                  </el-table-column>
                  <el-table-column label="价格（元）">
                    <template slot-scope="scope">
                      <el-form-item>
                        <el-input v-model="batchForm.price" oninput="value=value.replace(/[^0-9.]/g,'')"
                          :disabled="!isEditPriceFlag"></el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="编码">
                    <template slot-scope="scope">
                      <el-form-item>
                        <el-input v-model="batchForm.pnCode"></el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="库存">
                    <template slot-scope="scope">
                      <el-form-item>
                        <el-input v-model="batchForm.qty" oninput="value=value.replace(/[^\d]/g,'')"></el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <div class="batch-opt-div">
                        <span @click="batchSet">批量添加</span>
                        <span @click="resetForm()">清空</span>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form>
            </el-form-item>

            <el-form-item label="商品规格：" v-show="showSetting" class="batch-item">
              <el-form ref="batchForm" :model="batchForm">
                <el-table :data="batchListData" style="width: 1076px" border
                  :header-cell-style="{'text-align':'center'}"
                  :cell-style="{'text-align':'center',backgroundColor: '#fff'}">
                  <el-table-column width="190" :label="item.specName" v-for="(item,index) in specAttrList" :key="index">
                    <template slot-scope="scope">
                      {{scope.row.goodsSkuItemList[index].specValue}}
                    </template>
                  </el-table-column>
                  <el-table-column label="图片" width="120">
                    <template slot-scope="scope">
                      <upload-one-img :imgList="scope.row.entityImage" @imgObj="scope.row.entityImage = $event">
                      </upload-one-img>
                    </template>
                  </el-table-column>
                  <el-table-column label="价格（元）" width="190">
                    <template slot-scope="scope">
                      <el-form-item>
                        <el-input v-model="scope.row.entityPrice" oninput="value=value.replace(/[^0-9.]/g,'')"
                          :disabled="!isEditPriceFlag">
                        </el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="编码" width="190">
                    <template slot-scope="scope">
                      <el-form-item>
                        <el-input v-model="scope.row.entityPn"></el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="库存" width="190">
                    <template slot-scope="scope">
                      <el-form-item>
                        <el-input v-model="scope.row.entityStock" oninput="value=value.replace(/[^\d]/g,'')"></el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="215" fixed="right">
                    <template slot-scope="scope">
                      <div class="batch-opt-div">
                        <span class="red-font" @click="deleteSpecItem(scope.$index)">删除</span>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form>
            </el-form-item>
            <div class="submit">
              <el-button class="public-el-submit-btn" @click="activeName = 'first'">上一步</el-button>
              <el-button type="primary" class="public-el-submit-btn" @click="activeName = 'third'">下一步</el-button>
            </div>
          </el-tab-pane>
          <!-- TAB:商品详情 -->
          <el-tab-pane label="商品详情" name="third">
            <!-- 产品长图 -->
            <el-form-item label="产品长图：" class="">
              <div label="图片可拖曳排序：" prop="" class="">
                <div class="">
                  <DragUpload @allList="longTrialImgs" :limit="longLimit" :imgList="goodInfo.longImages">
                  </DragUpload>
                  <div class="gray-tip">请：图片支持jpg/png格式，尺寸建议为750*1000，拖拽图片可调整排序</div>
                </div>
              </div>
            </el-form-item>
            <!-- 产品注册证 -->
            <el-form-item label="注册证：" class="">
              <div label="图片可拖曳排序：" prop="" class="">
                <div class="">
                  <DragUpload @allList="registerCardImgs" :limit="1" :imgList="registerCard">
                  </DragUpload>
                  <div class="gray-tip">请：图片支持jpg/png格式</div>
                </div>
              </div>
            </el-form-item>
            <!-- 产品详情 -->
            <el-form-item label="产品详情：" class="product-detail">
              <edit class="edit" ref="edit" @getContent="getContentData" :description="goodInfo.content"></edit>
            </el-form-item>
            <div class="submit">
              <el-button class="public-el-submit-btn" @click="activeName = 'second'">上一步</el-button>
              <el-button type="primary" class="public-el-submit-btn" @click="submit" v-loading="isSubmit">提交
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
    <specs-mould-dialog :specsDialogVisible="specsDialogVisible" @closeSpecs="closeSpecs" @updateData="getSpecList">
    </specs-mould-dialog>
  </div>

</template>

<script>
  import {
    goodCreate,
    goodsUpdate,
    goodsDetail,
    specList,
    specValueList
  } from '@/api/goods'
  import {
    uploadImage
  } from '@/api/public'
  import {
    brandList
  } from '@/api/demand'
  import edit from '../utils/edit.vue'
  import DragUpload from '../utils/DragUpload.vue'; // 引入vue-draggable
  import uploadOneImg from '../utils/uploadOneImg.vue'
  import addGoods from '../../../src/views/goods/addGoods.vue'
  import specsMouldDialog from '../../../src/views/goods/specsMouldDialog.vue'
  import draggable from "vuedraggable";
  import {
    mapGetters
  } from 'vuex'
  export default {
    components: {
      DragUpload,
      uploadOneImg,
      edit,
      addGoods,
      specsMouldDialog,
      draggable
    },
    computed: {
      ...mapGetters([
        'roles',
      ])
    },

    data() {
      return {
        dragging: false,
        specs: {
          options: [],
          value: ''
        },
        specsDialogVisible: false, //添加规格模板 -- 弹框
        showDialogSpecsItem: false,
        chosedSpec: {
          typeId: 1,
          specName: '',
          specId: '',
          specStringValues: [],
          tent: ''
        },
        tentSpecList: [], //存放规格类型
        tentAttrList: [], //存放属性类型
        specAttrList: [], //存放规格+属性
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
        tentAttrRuleForm: {
          tentSpecName: '', //规格名称
          specValues: '' //规格值
        },
        tentAttrRules: {
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
        batchData: [{}],
        batchForm: {
          imgUrl: '',
          price: 0,
          pnCode: '',
          qty: '',
        },
        batchListData: [], //商品规格

        activeName: 'first',
        isSubmit: false,
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
        registerCard: '',
        //商品信息
        goodInfo: {
          type: 'material', //商品类型 material-配件 equipment-设备器械
          goodsName: '', //商品名称
          goodsModel: '', //产品型号
          brandInputType: false, //是否自定义品牌,false-选择 true-自定义
          brandId: '', //所属品牌ID 如果自定义就不传
          brandName: '', //品牌名称 如果自定义就传
          category: '', //分类的Json信息
          chooseClassify: '', //选择的类目【拼接字符串】
          chosedData: [], //选择的类目
          cateId: '',
          cateName: '',
          saleType: 1, //选择的销售方式
          defaultImage: '', //主图
          longImages: [], //长图
          registerCard: '', //注册证
          imageList: [],
          content: '', //产品详情
          tagList: [], //商品标签
          ifShow: 0, //是否立即上架
          recommended: 1, //是否推荐
        },
        brandsOptions: [],
        //是否允许输入价格
        isEditPriceFlag: true,
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
        specList(params).then(response => {
          this.specs.options = response.data.data.list
        })
      },
      // 选择规格
      changeSpec(val) {
        var obj = {}
        obj = this.specs.options.find(function(i) {
          return i.id === val
        });
        this.chosedSpec.typeId = obj.typeId
        this.chosedSpec.specId = obj.id
        this.chosedSpec.specName = obj.specName
      },
      //选择规格模板后确定
      sureChosedSpec() {
        if (this.chosedSpec.typeId == 2) {
          if (this.tentAttrList.length >= 5) {
            this.$message.warning("最多只能添加五种属性规格!")
            return
          }
          var flag = true
          //判断添加属性类型的时候：是否已经添加过相同规格
          this.tentAttrList.forEach(item => {
            if (this.chosedSpec.specId == item.specId) {
              flag = false
            }
          })
          if (!flag) {
            this.$message.warning("不允许添加相同属性类型!")
            return
          }
        }
        if (this.chosedSpec.specId) {
          specValueList({
            specId: this.chosedSpec.specId
          }).then(response => {
            if (response.data.code == 10000) {
              this.chosedSpec.specStringValues = response.data.data
              if (this.chosedSpec.typeId == 1) {
                this.tentSpecList = []
                this.tentSpecList.push(this.utils.cloneObj(this.chosedSpec))
              } else if (this.chosedSpec.typeId == 2) {
                this.tentAttrList.push(this.utils.cloneObj(this.chosedSpec))
              }
            } else {
              this.$message.error("获取规格值列表失败：" + response.data.message)
            }
          })
        }
      },
      // 立即生成
      immediatelyCreate() {
        if (this.tentSpecList.length <= 0) {
          this.$message.error("请先填写规格类型 ！")
          return
        }
        this.specAttrList = []
        this.specAttrList = this.tentSpecList.concat(this.tentAttrList)
        this.showSetting = true
        //开始生成商品规格table数据
        this.batchListData = []
        for (var i = 0; i < this.specAttrList.length; i++) {
          var tentItem = this.specAttrList[i].specStringValues
          if (i == 0) {
            for (var x = 0; x < tentItem.length; x++) {
              var params = {
                entityImage: "",
                entityName: "",
                entityPrice: 0,
                entityStock: '',
                goodsSkuItemList: []
              }
              var item = {
                specId: tentItem[x].specId ? tentItem[x].specId : '',
                specName: this.specAttrList[i].specName,
                specTypeId: 1,
                specValue: tentItem[x].specValue,
                specValueId: tentItem[x].id ? tentItem[x].id : ''
              }
              params.goodsSkuItemList.push(this.utils.cloneObj(item))
              this.batchListData.push(this.utils.cloneObj(params))
            }
          } else {
            var emptyArry = []
            for (var j = 0; j < this.batchListData.length; j++) {
              for (var k = 0; k < tentItem.length; k++) {
                var params = this.utils.cloneObj(this.batchListData[j])
                var item = {
                  specId: tentItem[k].specId ? tentItem[k].specId : '',
                  specName: this.specAttrList[i].specName,
                  specTypeId: 2,
                  specValue: tentItem[k].specValue,
                  specValueId: tentItem[k].id ? tentItem[k].id : ''
                }
                params.goodsSkuItemList.push(this.utils.cloneObj(item))
                emptyArry.push(this.utils.cloneObj(params))
              }
            }
            this.batchListData = this.utils.cloneObj(emptyArry)
          }
        }
      },
      // 批量添加
      batchSet() {
        this.batchListData.forEach(item => {
          item.entityImage = this.batchForm.imgUrl
          item.entityPrice = this.batchForm.price
          item.entityPn = this.batchForm.pnCode
          item.entityStock = this.batchForm.qty
        })
      },
      //商品规格 - 删除
      deleteSpecItem(index) {
        this.batchListData.splice(index, 1)
      },
      getParams() {
        // 销售类型
        if (this.roles.includes('personal')) {
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
          if (this.goodInfo.chosedData[0].typeId == '1') { //商品类型：1-器械 2-配件
            this.goodInfo.type = 'equipment'
          } else {
            this.goodInfo.type = 'material'
          }
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
            // //相关图片
            // this.imgList = this.goodInfo.imageList
            // this.longImages = this.goodInfo.longImages
            //是否上架
            this.goodIfShow = this.goodInfo.ifShow == 1 ? true : false
            //是否推荐
            this.goodRecommended = this.goodInfo.recommended == 1 ? true : false
            //商品标签
            if (this.goodInfo.tagList != undefined && this.goodInfo.tagList != null && this.goodInfo.tagList
              .length > 0) {
              this.goodTag = this.goodInfo.tagList[0]
            }
            //商品注册证
            this.registerCard = []
            this.registerCard.push(this.goodInfo.registerCard)
            //商品实体列表
            this.batchListData = this.goodInfo.goodsEntities
            this.specAttrList = JSON.parse(this.goodInfo.goodsSpecs)
            if (this.specAttrList != undefined && this.specAttrList != null && this.specAttrList.length > 0) {
              this.tentSpecList = this.specAttrList.slice(0, 1)
              this.tentAttrList = this.specAttrList.slice(1)
            }
            this.showSetting = true
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
        this.goodInfo.chosedData = JSON.parse(this.temporaryCartData)
        if (this.goodInfo.chosedData[0].typeId == '1') { //商品类型：1-器械 2-配件
          this.goodInfo.type = 'equipment'
        } else {
          this.goodInfo.type = 'material'
        }
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
        // this.ruleForm.trialImgs = allList
        this.goodInfo.imageList = []
        allList.forEach(res => {
          this.goodInfo.imageList.push(res.imgUrl)
        })
      },
      //产品长图
      longTrialImgs(allList) {
        // this.ruleForm.longTrialImgs = allList
        this.goodInfo.longImages = []
        allList.forEach(res => {
          this.goodInfo.longImages.push(res.imgUrl)
        })
      },
      //产品注册证
      registerCardImgs(imgFile) {
        this.registerCard = []
        if (imgFile != null && imgFile.length > 0) {
          this.registerCard.push(imgFile[0].imgUrl)
        }
      },
      getContentData(content) {
        this.goodInfo.content = content
      },
      async submit() {
        try {
          this.isSubmit = true
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
          //商品实体列表
          this.goodInfo.goodsEntities = this.batchListData
          this.goodInfo.goodsSpecs = JSON.stringify(this.specAttrList)
          //商品标签
          if (this.goodTag) {
            this.goodInfo.tagList = []
            this.goodInfo.tagList.push(this.goodTag)
          }
          //注册证
          if (this.registerCard != '' && this.registerCard.length > 0) {
            this.goodInfo.registerCard = this.registerCard[0]
          }
          //再次获取富文本信息
          this.$refs.edit.putContent()
          this.goodInfo.defaultImage = this.goodInfo.imageList[0]
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
              this.isSubmit = false
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
              this.isSubmit = false
            })
          }
        } catch (e) {
          this.$message.error("商品信息提交失败：",e)
          this.isSubmit = false
        }
      },
      trim(str) {
        return str.replace(/(^\s*)|(\s*$)/g, "");
      },
      //批量设置-清空操作
      resetForm(formName) {
        this.batchForm = {
          imgUrl: '',
          price: 0,
          pnCode: '',
          qty: '',
        }
      },
      //上传图片组件回调函数
      getImgObj(obj, key) {
        if (key == '-1') {
          this.batchForm.imgUrl = obj
        }
      },
      openSpecs() {
        this.specsDialogVisible = true
      },
      //关闭添加规格模板弹窗
      closeSpecs() {
        this.specsDialogVisible = false
      },
      //添加规格、属性
      tentSpecSure(formName, typeId) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (typeId == 1) {
              var param = {
                typeId: 1,
                specName: this.tentSpecsRuleForm.tentSpecName,
                specStringValues: [],
                tent: ''
              }
              var specParam = {
                specValue: this.tentSpecsRuleForm.specValues
              }
              param.specStringValues.push(specParam)
              this.tentSpecList.push(param)
            } else if (typeId == 2) {
              //判断将要添加的属性类型名称是否和已添加的属性类型里面有重复的
              var flag = true
              this.tentAttrList.forEach(item => {
                if (item.specName == this.tentAttrRuleForm.tentSpecName) {
                  flag = false
                }
              })
              if (!flag) {
                this.$message.warning("不允许添加相同属性类型!")
                return
              }
              var param = {
                typeId: 2,
                specName: this.tentAttrRuleForm.tentSpecName,
                specStringValues: [],
                tent: ''
              }
              var specParam = {
                specValue: this.tentAttrRuleForm.specValues
              }
              param.specStringValues.push(specParam)
              this.tentAttrList.push(param)
              this.showDialogSpecsItem = false
            }

          } else {
            return false;
          }
        });
      },
      clearTentData() {
        this.tentSpecsRuleForm.tentSpecName = ''
        this.tentSpecsRuleForm.specValues = ''
      },
      clearTentAttrData() {
        this.tentAttrRuleForm.tentSpecName = ''
        this.tentAttrRuleForm.specValues = ''
      },
      //规格
      delSpec(key) {
        this.tentSpecList.splice(key, 1)
        this.clearTentData()
      },
      delValues(ind, key) {
        this.tentSpecList[ind].specStringValues.splice(key, 1)
      },
      addValues(ind) {
        if (this.tentSpecList[ind].tent) {
          this.tentSpecList[ind].specStringValues.push({
            specValue: this.tentSpecList[ind].tent
          })
          this.tentSpecList[ind].tent = ''
        }
      },
      //属性
      addNewAttr() {
        if (this.tentAttrList.length >= 5) {
          this.$message.warning("最多只能添加五种规格!")
          return
        }
        this.clearTentAttrData()
        this.showDialogSpecsItem = true
      },
      delAttr(key) {
        this.tentAttrList.splice(key, 1)
        this.clearTentAttrData()
      },
      delAttrValues(ind, key) {
        this.tentAttrList[ind].specStringValues.splice(key, 1)
      },
      addAttrValues(ind) {
        if (this.tentAttrList[ind].tent) {
          this.tentAttrList[ind].specStringValues.push({
            specValue: this.tentAttrList[ind].tent
          })
          this.tentAttrList[ind].tent = ''
        }
      },
      closeAttr() {
        this.showDialogSpecsItem = false
        this.clearTentAttrData()
      }
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

    //修改el-input样式
    /deep/.el-form-item__label {
      font-size: 12px;
      padding-right: 30px;
      color: #333333;
    }

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

    /deep/.el-tabs__nav-wrap::after {
      height: 1px;
      background-color: #EBEEF5;
    }

    /deep/.el-tabs__active-bar {
      height: 1px;
    }

    /deep/.el-tabs--top .el-tabs__item.is-top:nth-child(2),
    /deep/.el-tabs--top .el-tabs__item.is-top:nth-child(2),
    /deep/.el-tabs--top .el-tabs__item.is-bottom:nth-child(2),
    /deep/.el-tabs--bottom .el-tabs__item.is-top:nth-child(2),
    /deep/.el-tabs--bottom .el-tabs__item.is-bottom:nth-child(2) {
      padding-left: 20px;
    }


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

  .choose-spec-item {
    /deep/ .el-input__inner {
      border-top-right-radius: 0px;
      border-bottom-right-radius: 0px;
    }

    .sure-btn {
      border-top-left-radius: 0px;
      border-bottom-left-radius: 0px;
    }
  }

  .my-spec-option {
    display: flex;
    align-items: center;
    justify-content: flex-start;

    .tag {
      margin-left: 6px;
      width: 16px;
      height: 15px;
      color: #69C0FF;
      border: 1px solid #69C0FF;
      background-color: #fff;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 2px;
    }
  }

  .whole-spec-item,
  .whole-attr-item {
    border-radius: 8px;
    border: 1px dashed #EBEEF5;
    padding: 35px 0px;
    padding-left: 30px;
    position: relative;

    .spec-item-title,
    .attr-item-title {
      z-index: 1;
      position: absolute;
      top: -8px;
      left: 20px;
      font-size: 14px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
      font-weight: 400;
      color: #333333;
      background: #fff;
      line-height: 14px;

      .remark {
        font-size: 12px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        font-weight: 400;
        color: #BBBBBB;
      }
    }
  }

  .tent-spec-box,
  .tent-attr-box {

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
      position: relative;
      padding-left: 40px;

      .mover-div {
        cursor: move;
        position: absolute;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        color: #EBEEF5;
        font-size: 20px;
        line-height: 5px;
        left: 0px;
        top: 20px;
      }

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

        /deep/ .el-input-group__append {
          background: #1890FF;
          border: none;
          color: #fff;
        }
      }
    }
  }

  .tent-attr-box {
    /deep/ .el-form-item {
      margin-bottom: 20px;
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

  //批量设置
  .batch-item {
    /deep/ .el-table .cell {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    /deep/ .el-input {
      width: auto;
    }

    /deep/ .el-form-item {
      margin-bottom: 0px !important;
    }

    /deep/ .el-input--medium .el-input__inner {
      padding-right: 15px;
    }
  }

  //批量添加操作一栏

  .batch-opt-div {
    display: flex;
    justify-content: center;
    align-items: center;

    .red-font {
      color: #FF7575;
    }

    span {
      font-size: 12px;
      line-height: 12px;
      color: #1890FF;
      cursor: pointer;
    }

    span+span {
      margin-left: 10px;
      padding-left: 10px;
      border-left: 1px solid #DBDBDB;
    }
  }
</style>
