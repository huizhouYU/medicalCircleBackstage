<template>
  <div class="detail-box">

    <!-- 订单状态 -->
    <div class="order-item order-info">
      <!-- 订单状态 -->
      <div class="order-info-item order-statue">
        <span class="order-left-title">订单状态：</span>
        <span class="order-right-statue">
          <template v-if="orderInfo.OrderStatus==1"> 商家待审核</template>
          <template v-else-if="orderInfo.OrderStatus==2">买家待付款</template>
          <template v-else-if="orderInfo.OrderStatus==3">买家已付款</template>
          <template v-else-if="orderInfo.OrderStatus==4">商品运输中</template>
          <template v-else-if="orderInfo.OrderStatus==5">订单已完成</template>
          <template v-else-if="orderInfo.OrderStatus==6">订单已取消</template>
          <template v-else-if="orderInfo.OrderStatus==7">订单已关闭</template>
        </span>
      </div>
      <!-- 订单编号 -->
      <div class="order-info-item order-statue">
        <span class="order-left-title">订单编号：</span>
        <span class="order-right-span">{{ orderInfo.number }}</span>
      </div>
      <!-- 下单时间 -->
      <div class="order-info-item order-statue">
        <span class="order-left-title">下单时间：</span>
        <span class="order-right-span">{{ orderInfo.orderTime }}</span>
      </div>
    </div>
    <!-- 订单详情 -->
    <div class="order-item order-detail">
      <!-- 操作一栏 -->
      <div class="order-operation">
        <span>订单信息</span>
        <!-- 具体操作 -->
        <div class="operatipn-content">
          <template v-if="orderInfo.OrderStatus==1">
            <el-button plain size="mini" icon="el-icon-edit" class="info-span-interval"
              @click="openExamineDialog(orderInfo.number)">审核</el-button>
            <el-button plain size="mini" icon="el-icon-delete" class="info-span-interval"
              @click="cancelOrder(orderInfo.number)">取消订单</el-button>
          </template>
          <template v-else-if="orderInfo.OrderStatus==2">
            <el-button plain size="mini" icon="el-icon-edit" class="info-span-interval"
              @click="openPirceDialog(orderInfo.number)">修改价格</el-button>
            <el-button plain size="mini" icon="el-icon-delete" class="info-span-interval"
              @click="cancelOrder(orderInfo.number)">取消订单</el-button>
          </template>
          <template v-else-if="orderInfo.OrderStatus==3">
            <el-button plain size="mini" icon="el-icon-edit" class="info-span-interval"
              @click="openDeliverDialog(orderInfo.number)">发货</el-button>
          </template>
        </div>
      </div>
      <!-- 三个模块 -->
      <div class="detail-module">
        <!-- 订单时间 -->
        <div class="refundDetail">
          <div class="refundDetail-time">
            <div class="module-item">订单完成时间 : <span> 2022-08-22 15:27:38</span></div>
            <div class="module-item">商品出库时间 : <span> 2022-08-22 15:27:38</span></div>
            <div class="module-item">支付时间 : <span> 2022-08-22 15:27:38</span></div>
            <div class="module-item">下单时间 : <span> 2022-08-22 15:27:38</span></div>
          </div>
          <div class="refundDetail-reason">
            <img src="../../../public/imgs/goods/icon_edit.png" alt="备注" @click="openNotesDialog(orderInfo.number)">
            <div class="module-item">买家备注：<span>撒库拉莱卡棉没啥吃的可</span></div>
            <div class="module-item">商家备注：<span>撒库拉莱卡棉没啥吃的可按时到校三星色卡了</span></div>
            <div class="module-item">评价：<span>打上来看监控两三年群殴我怕去街上我就不能续魔...</span></div>
          </div>
        </div>
        <!-- 发货信息 -->
        <div class="detail-module-item">
          <div class="module-item">收货人：<span> 丁小军</span></div>
          <div class="module-item">用户昵称：<span> 风清扬</span></div>
          <div class="module-item">联系电话：<span> 17812653659</span></div>
          <div class="module-item">配送方式：<span> 普通配送</span></div>
          <div class="module-item">快递公司：<span> 韵达</span></div>
          <div class="module-item">快递单号：<span> 12345678911253648</span></div>
          <div class="module-item module-item-address">收货地址：<span> 安徽省合肥市蜀山区莲花智谷哈哈街 道哈哈便利店北区南门128号右手边第二间</span></div>
        </div>
        <!-- 物流信息 -->
        <div class="detail-module-item">
          <el-timeline>
            <el-timeline-item v-for="(activity, index) in orderInfo.activities" :key="index" :icon="activity.icon"
              :type="activity.type" :color="activity.color" :size="activity.size" :timestamp="activity.timestamp"
              class="last-timeline">
              <!--   :class="{'last-timeline':index == 0}"> -->
              {{ activity.content }}
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
      <!-- 商品列表 -->
      <div class="order-goods">
        <!-- 相当于表头 -->
        <div class="order-goods-title">
          <div class="order-goods-title-item order-goods-title-item-name">商品名称</div>
          <div class="order-goods-title-item">数量</div>
          <div class="order-goods-title-item">价格</div>
        </div>
        <div v-for="(item,index) in orderInfo.goods" :key="index" class="order-goods-content">
          <div class="order-goods-content-item order-goods-content-item-name">
            <img :src="item.imgUrl">
            <div class="item-name-title">
              <span>{{ item.name }}</span>
              <span>{{ item.goodNo }}</span>
            </div>
          </div>
          <div class="order-goods-content-item">{{ item.num }}</div>
          <div class="order-goods-content-item">{{ item.price }}</div>
        </div>
      </div>
      <!-- 订单价格详情 -->
      <div class="order-sum-price">
        <div class="order-price">
          <div class="order-price-item">商品总额：<span>￥99.99</span></div>
          <div class="order-price-item">+运费：<span>￥0.00</span></div>
        </div>
        <div class="sum-price">
          实际支付：<span>￥99.99</span>
        </div>
        <div class="payWay">
          支付方式：<span>支付宝</span>
        </div>
      </div>
    </div>

    <!-- 修改价格 或者 审核 -->
    <el-dialog :title="pirceDialogTitle" :close-on-click-modal="false" :visible.sync="pirceDialogVisible" width="500px"
      class="el-dialog-box">
      <el-form :model="orderPirceForm" label-position="right">
        <el-form-item label="订单价格:" :label-width="formLabelWidth">
          <el-input v-model="orderPirceForm.oldPrice" placeholder="--" :disabled="true" />
        </el-form-item>
        <el-form-item label="新价格:" :label-width="formLabelWidth">
          <el-input v-model="orderPirceForm.newPrice" autocomplete="off" size="medium" />
          <span class="dialog-notes">{{ notes }}</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="closePirceDialog">取 消</el-button>
        <el-button size="medium" type="primary" @click="surePirceDialog">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 发货 弹框 -->
    <el-dialog title="发货信息" :close-on-click-modal="false" :visible.sync="deliverDialogVisible" width="500px"
      class="el-dialog-box el-dialog-deliver">
      <el-form :model="orderDeliverForm" label-position="right">
        <el-form-item label="选择类型:" :label-width="formLabelWidth">
          <el-radio-group v-model="orderDeliverForm.deliverWay" @change="clearDeliverForm">
            <el-radio :label="1">物流发货</el-radio>
            <el-radio :label="2">商家自配</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="物流公司:" :label-width="formLabelWidth" v-show="orderDeliverForm.deliverWay == 1">
          <el-input v-model="orderDeliverForm.logisticsCompany" placeholder=""
            :disabled="orderDeliverForm.deliverWay == 2" />
        </el-form-item>
        <el-form-item label="快递单号:" :label-width="formLabelWidth" v-show="orderDeliverForm.deliverWay == 1">
          <el-input v-model="orderDeliverForm.expressNo" autocomplete="off" size="medium"
            :disabled="orderDeliverForm.deliverWay == 2" />
        </el-form-item>
        <div class="span-info">
          <el-form-item label="收货人:" :label-width="formLabelWidth" v-show="orderDeliverForm.deliverWay == 2">
            <span>张楚岚</span>
          </el-form-item>
          <el-form-item label="联系电话:" :label-width="formLabelWidth" v-show="orderDeliverForm.deliverWay == 2">
            <span>123 4567 6988</span>
          </el-form-item>
          <el-form-item label="卖家地址:" :label-width="formLabelWidth" v-show="orderDeliverForm.deliverWay == 2">
            <span>安徽省合肥市蜀山区蜀山区蜀山街道枫叶产业园128号999室</span>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="closeDeliverDialog">取 消</el-button>
        <el-button size="medium" type="primary" @click="sureDeliverDialog">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 备注 弹框 -->
    <el-dialog title="备注信息" :close-on-click-modal="false" :visible.sync="notesDialogVisible" width="500px"
      class="el-dialog-box">
      <el-form :model="orderNotesForm" label-position="right">
        <el-form-item label="买家备注:" :label-width="formLabelWidth">
          <el-input v-model="orderNotesForm.mNotes" placeholder="" type="textarea" :disabled="true" />
        </el-form-item>
        <el-form-item label="商家备注:" :label-width="formLabelWidth">
          <el-input v-model="orderNotesForm.sNotes" autocomplete="off" size="medium" type="textarea" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="closeNotesDialog">取 消</el-button>
        <el-button size="medium" type="primary" @click="sureNotesDialog">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        formLabelWidth: '100px',
        notes: '', // 修改价格弹框备注
        pirceDialogTitle: '', // 审核和修改价格是同一个弹框，用标题区分是什么操作
        pirceDialogVisible: false, // 修改价格弹框
        deliverDialogVisible: false, // 发货弹框
        notesDialogVisible: false, // 备注弹框
        // 要修改价格的订单信息
        orderPirceForm: {
          id: '', // 订单唯一标识
          oldPrice: '100', // 订单原来的价格
          newPrice: '' // 新的价格
        },
        // 要发货的订单信息
        orderDeliverForm: {
          id: '', // 订单唯一标识
          deliverWay: 1, // 发货方式
          logisticsCompany: '', // 物流公司
          expressNo: '' // 快递单号
        },
        orderNotesForm: {
          id: '', // 订单唯一标识
          mNotes: '买家备注，无法更改', // 买家备注
          sNotes: '' // 商家备注
        },

        orderId: '', // 订单Id
        orderInfo: {
          // id: 1,
          number: '45257457890123456',
          orderTime: '2021-10-13  16:28:56',
          payWay: '支付宝',
          buyer: '白龙',
          consignee: '张三',
          phone: '15145298654',
          OrderStatus: '1',
          orderPrice: '1080.00',
          evaluate: '',
          activities: [{
            content: '合肥市：您的包裹已送达哈哈便利店南门第二间，签收人：丁小军',
            timestamp: '2021-12-16   12:58:26',
            color: '#0bbd87'
            // size: 'large',
            // type: 'primary',
            // icon: 'el-icon-more'
          }, {
            content: '合肥市：您的包裹已送达分拨交付中心',
            timestamp: '2021-12-16   12:58:26'
            // color: '#0bbd87'
          }, {
            content: '上海市：您的包裹已离开华东枢纽分拨；发往安徽省合肥市蜀山区',
            timestamp: '2021-12-16   12:58:26',
            size: 'large'
          }, {
            content: '您提交了订单，快递揽件中',
            timestamp: '2021-12-16   12:58:26'
          }],
          goods: [{
              name: '飞利浦核磁共振专业设备医用型号ur125ow飞利浦核磁共振专业设备医用型号磁共振专业设备医用型您的包裹已离开华东枢纽分拨',
              goodNo: '123',
              imgUrl: '../../../static/img/brand03.png',
              num: '30',
              price: '36.00'
            },
            {
              name: '飞利浦核磁共振专业设备医用型号ur125ow飞利ur125ow',
              goodNo: '123',
              imgUrl: '../../../static/img/brand03.png',
              num: '30',
              price: '36.00'
            }

          ]
        }
      }
    },
    mounted() {
      this.getOrderId()
    },
    methods: {
      getOrderId() {
        this.orderId = this.$route.query.id
      },
      back() {
        this.$router.replace('/orderManage')
      },
      // 取消订单
      cancelOrder(val) {
        console.log('取消订单')
        // 根据传值给的订单唯一标识，请求后端接口
        this.$confirm('是否取消该订单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '模拟数据取消成功!'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: ''
          })
        })
      },

      clearDeliverForm() {
        if (this.orderDeliverForm.deliverWay == 2) {
          this.orderDeliverForm.logisticsCompany = ''
          this.orderDeliverForm.expressNo = ''
        }
      },
      openExamineDialog(val) {
        // 传过来的值应该是订单编号，根据订单编号，请求后端接口，获取改订单的价格，放到弹框对应的位置中
        this.pirceDialogTitle = '审核'
        this.notes = '注：默认修改价格成功后，审核通过！'
        this.pirceDialogVisible = true
      },
      openPirceDialog(val) {
        // 传过来的值应该是订单编号，根据订单编号，请求后端接口，获取改订单的价格，放到弹框对应的位置中
        this.pirceDialogTitle = '修改价格'
        this.notes = ''
        this.pirceDialogVisible = true
      },
      closePirceDialog() {
        this.pirceDialogTitle = ''
        this.notes = ''
        this.pirceDialogVisible = false
      },
      surePirceDialog() {
        // 请求后端接口数据，保存信息
        this.closePirceDialog()
      },
      openDeliverDialog(val) {
        // 传过来的值应该是订单编号，根据订单编号，请求后端接口，获取改订单的信息，放到弹框对应的位置中
        this.deliverDialogVisible = true
      },
      closeDeliverDialog() {
        this.deliverDialogVisible = false
      },
      sureDeliverDialog() {
        // 请求后端接口数据，保存信息
        this.closeDeliverDialog()
      },
      openNotesDialog(val) {
        // 传过来的值应该是订单编号，根据订单编号，请求后端接口，获取改订单的信息，放到弹框对应的位置中
        this.notesDialogVisible = true
      },
      closeNotesDialog() {
        this.notesDialogVisible = false
      },
      sureNotesDialog() {
        // 请求后端接口数据，保存信息
        this.closeNotesDialog()
      }
    }

  }
</script>

<style lang="less" scoped>
  .detail-box {
    font-size: 12px;
    font-family: Microsoft YaHei-Regular, Microsoft YaHei;
    font-weight: 400;
    color: #333333;

    //订单状态一栏和订单详情一栏 共用的样式
    .order-item {
      background-color: #fff;
      box-shadow: 0px 2px 10px 1px rgba(0, 0, 0, 0.06);
      border-radius: 6px 6px 6px 6px;
      padding: 0px 15px;
      margin-bottom: 20px;
    }

    //订单状态一栏样式
    .order-info {
      display: flex;
      justify-content: flex-start;
      align-items: center;

      //每一个小项
      .order-info-item {
        margin: 20px 0;
        flex: 1;
      }

      // 针对订单状态的样式
      .order-right-statue {
        font-weight: bold;
        color: #1890FF;
      }
    }

    //订单详情
    .order-detail {
      padding-bottom: 15px;

      //操作一栏
      .order-operation {
        display: flex;
        justify-content: space-between;
        padding: 20px 0px;

        span {
          display: flex;
          align-items: center;
        }
      }

      // 三个模块
      .detail-module {
        border-radius: 4px;
        border: 1px solid #EBEEF5;
        height: 260px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        // 每个模块公共的样式
        .detail-module-item {
          box-sizing: border-box;
          padding: 20px;
          height: 100%;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          overflow: auto;

          .module-item {
            margin-bottom: 20px;
          }

          .module-item-address {
            display: flex;

            span {
              flex: 1;
            }
          }

        }

        .refundDetail {
          box-sizing: border-box;
          height: 100%;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          overflow: auto;

          .module-item {
            margin-bottom: 20px;
          }

          .refundDetail-time {
            height: 150px;
            overflow: auto;
            padding: 20px 0px 10px 20px;
          }

          .refundDetail-reason {
            position: relative;
            padding: 10px 20px;
            border-top: 1px solid #EBEEF5;
            height: 110px;
            overflow: auto;

            img {
              width: 14px;
              height: 14px;
              position: absolute;
              top: 6px;
              right: 14px;
              cursor: pointer;
            }

            .module-item {
              margin-bottom: 20px;
              display: flex;
              justify-content: flex-start;
            }

            span {
              flex: 1;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
        }

        //更改每个模块滚动条样式
        .refundDetail-time::-webkit-scrollbar,
        .refundDetail-reason::-webkit-scrollbar,
        .detail-module-item::-webkit-scrollbar {
          width: 2px;
        }

        .refundDetail-time::-webkit-scrollbar-thumb,
        .refundDetail-reason::-webkit-scrollbar-thumb,
        .detail-module-item::-webkit-scrollbar-thumb {
          border-radius: 10px;
          box-shadow: inset 0 0 0px rgba(0, 0, 0, 0.2);
          background: rgba(0, 0, 0, 0.2);
        }

        .refundDetail-time::-webkit-scrollbar-track,
        .refundDetail-reason::-webkit-scrollbar-thumb,
        .detail-module-item::-webkit-scrollbar-track {
          box-shadow: inset 0 0 0px rgba(0, 0, 0, 0.2);
          border-radius: 0;
          background: rgba(0, 0, 0, 0);
        }

        //更改物流信息的时间线的字体大小 颜色等样式
        /deep/.el-timeline-item__content,
        /deep/ .el-timeline-item__timestamp,
        /deep/.el-timeline {
          font-size: 12px;
          color: #777777;
        }

        .last-timeline {
          color: #e33636 !important;
        }

        .detail-module-item:nth-child(2) {
          border-left: 1px solid #EBEEF5;
          border-right: 1px solid #EBEEF5;
        }
      }

      // 商品列表
      .order-goods {
        border-radius: 4px;
        border: 1px solid #EBEEF5;
        margin-top: 20px;
        display: flex;
        flex-direction: column;

        // 相当于表头
        .order-goods-title,
        .order-goods-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 15px 20px 15px;
          box-sizing: border-box;
          border-bottom: 1px solid #EBEEF5;

          .order-goods-content-item,
          .order-goods-title-item {
            display: flex;
            justify-content: center;
            align-items: center;
            flex: 1;
            font-weight: bold;
            color: #333333;
          }

          .order-goods-content-item-name,
          .order-goods-title-item-name {
            flex: 2;
            box-sizing: border-box;
          }
        }

        .order-goods-content .order-goods-content-item {
          font-weight: 400;
        }

        .order-goods-content {
          .order-goods-content-item-name {
            justify-content: flex-start;
            overflow: hidden;

            img {
              width: 70px;
              height: 70px;
            }

            .item-name-title {
              height: 70px;
              padding: 10px;
              display: flex;
              box-sizing: border-box;
              justify-content: space-between;
              flex-direction: column;

              span {
                width: 100%;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
            }
          }
        }

        .order-goods-content:last-child {
          border: none;
        }
      }

      // 订单价格详情
      .order-sum-price {
        margin-top: 20px;
        padding-right: 20px;
        display: flex;
        flex-direction: column;
        align-items: flex-end;

        .order-price {
          border-bottom: 1px solid #707070;

          .order-price-item {
            margin-bottom: 15px;
            display: flex;
            justify-content: flex-end;
          }
        }

        .sum-price {
          margin-top: 15px;
          font-size: 14px;
          font-family: Microsoft YaHei-Bold, Microsoft YaHei;
          font-weight: bold;
          color: #333333;
        }

        .payWay {
          margin-top: 8px;
        }

      }
    }
  }
</style>
