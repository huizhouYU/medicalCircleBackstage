<template>
  <div class="detail-box">
    <!-- 订单状态 -->
    <div class="order-item order-info">
      <!-- 订单状态 -->
      <div class="order-info-item order-statue">
        <span class="order-left-title">订单状态：</span>
        <span class="order-right-statue">
          <template v-if="orderInfo.OrderStatus==1"> 待处理</template>
          <template v-else-if="orderInfo.OrderStatus==2">退款中</template>
          <template v-else-if="orderInfo.OrderStatus==3">退款成功</template>
          <template v-else-if="orderInfo.OrderStatus==4">退款失败</template>
        </span>
      </div>
      <!-- 订单编号 -->
      <div class="order-info-item order-statue">
        <span class="order-left-title">订单编号：</span>
        <span class="order-right-span">{{orderInfo.number}}</span>
      </div>
      <!-- 退款编号 -->
      <div class="order-info-item order-statue">
        <span class="order-left-title">退款编号：</span>
        <span class="order-right-span">{{orderInfo.refundNo}}</span>
      </div>
      <!-- 申请时间 -->
      <div class="order-info-item order-statue">
        <span class="order-left-title">申请时间：</span>
        <span class="order-right-span">{{orderInfo.orderTime}}</span>
      </div>
    </div>
    <!-- 退款详情 -->
    <div class="order-item order-detail">
      <!-- 操作一栏 -->
      <div class="order-operation">
        <span>退款信息</span>
        <!-- 具体操作 -->
        <div class="operatipn-content">
          <template v-if="orderInfo.OrderStatus==1">
            <el-button type="info" plain size="mini" class="info-span-interval"
              @click="openRefundDialog(orderInfo.number)">退款</el-button>
          </template>
        </div>
      </div>
      <!-- 三个模块 -->
      <div class="detail-module">
        <!-- 订单时间 -->
        <div class="refundDetail">
          <div class="refundDetail-time">
            <div class="module-item">退款完成 : <span> 2022-08-22 15:27:38</span></div>
            <div class="module-item">退款处理 : <span> 2022-08-22 15:27:38</span></div>
            <div class="module-item">退款申请 : <span> 2022-08-22 15:27:38</span></div>
            <div class="module-item">成功支付 : <span> 2022-08-22 15:27:38</span></div>
            <div class="module-item">订单创建 : <span> 2022-08-22 15:27:38</span></div>
          </div>
          <div class="refundDetail-reason">
            <img src="../../../public/imgs/goods/icon_edit.png" alt="备注" @click="openNotesDialog(orderInfo.number)">
            <div class="module-item">退款原因: <span>不好吃，太咸了,不要联系我，一定得退款，没得商量</span></div>
            <div class="module-item">商家备注: <span>撒库拉莱卡棉没啥吃的可按时到校三星色卡了</span></div>
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
              {{activity.content}}
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
      <!-- 商品列表 -->
      <div class="order-goods">
        <!-- 相当于表头 -->
        <div class="order-goods-title">
          <div class="order-goods-title-item order-goods-title-item-name">商品名称</div>
          <div class="order-goods-title-item">退款数量</div>
          <div class="order-goods-title-item">商品单价</div>
          <div class="order-goods-title-item">订单金额</div>
          <div class="order-goods-title-item">实际支付</div>
          <div class="order-goods-title-item">申请金额</div>
          <div class="order-goods-title-item">退款金额</div>
        </div>
        <div class="order-goods-content" v-for="(item,index) in orderInfo.goods" :key="index">
          <div class="order-goods-content-item order-goods-content-item-name">
            <img :src="item.imgUrl" />
            <div class="item-name-title">
              <span>{{item.name}}</span>
              <span>{{item.goodNo}}</span>
            </div>
          </div>
          <div class="order-goods-content-item">{{item.num}}</div>
          <div class="order-goods-content-item">{{item.unitPrice}}</div>
          <div class="order-goods-content-item">{{item.orderPrice}}</div>
          <div class="order-goods-content-item">{{item.price}}</div>
          <div class="order-goods-content-item">{{item.applyPrice}}</div>
          <div class="order-goods-content-item">{{item.refundPrice}}</div>
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

    <!-- 退款 弹框 -->
    <el-dialog title="退款处理" :close-on-click-modal="false" :visible.sync="refundDialogVisible" width="500px"
      class="el-dialog-box el-dialog-deliver">
      <el-form :model="ordeRefundForm" label-position="left" class="refund-result-form">
        <el-form-item label="退款选择:">
          <el-radio-group v-model="ordeRefundForm.result">
            <el-radio :label="1">同意</el-radio>
            <el-radio :label="2">拒绝</el-radio>
          </el-radio-group>
        </el-form-item>
        <span class="refund-result-tip">选择“同意”，相关货款将退还给买家，是否继续</span>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="closeRefundDialog">取 消</el-button>
        <el-button size="medium" type="primary" @click="sureRefundDialog">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 备注 弹框 -->
    <el-dialog title="备注信息" :close-on-click-modal="false" :visible.sync="notesDialogVisible" width="500px"
      class="el-dialog-box">
      <el-form :model="orderNotesForm" label-position="left">
        <el-form-item label="商家备注:" :label-width="formLabelWidth">
          <el-input v-model="orderNotesForm.sNotes" autocomplete="off" size="medium" type="textarea"></el-input>
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
        notes: '', //修改价格弹框备注
        pirceDialogTitle: '', //审核和修改价格是同一个弹框，用标题区分是什么操作
        pirceDialogVisible: false, //修改价格弹框
        refundDialogVisible: false, //退款弹框
        notesDialogVisible: false, //备注弹框

        //要退款的订单信息
        ordeRefundForm: {
          id: '', //订单唯一标识
          result: 1, //发货方式
        },
        orderNotesForm: {
          id: '', //订单唯一标识
          sNotes: '' //商家备注
        },

        orderId: '', //订单Id
        orderInfo: {
          // id: 1,
          number: '45257457890123456',
          refundNo: '1234567890123456',
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
            color: '#FF5967'
            // size: 'large',
            // type: 'primary',
            // icon: 'el-icon-more'
          }, {
            content: '合肥市：您的包裹已送达分拨交付中心',
            timestamp: '2021-12-16   12:58:26',
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
              num: '1',
              unitPrice: '￥：99.99', //商品单价
              orderPrice: '￥：99.99', //订单金额
              price: '￥：99.99', //实际支付
              applyPrice: '￥：99.99', //申请金额
              refundPrice: '￥：99.99' //退款金额
            },
            {
              name: '飞利浦核磁共振专业设备医用型号ur125ow飞利ur125ow',
              goodNo: '123',
              imgUrl: '../../../static/img/brand03.png',
              num: '1',
              unitPrice: '￥：99.99', //商品单价
              orderPrice: '￥：99.99', //订单金额
              price: '￥：99.99', //实际支付
              applyPrice: '￥：99.99', //申请金额
              refundPrice: '￥：99.99' //退款金额
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
        this.$router.replace("/refundOrder")
      },
      //取消订单
      cancelOrder(val) {
        console.log("取消订单")
        //根据传值给的订单唯一标识，请求后端接口
        this.$confirm('是否取消该订单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '模拟数据取消成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: ''
          });
        });
      },

      openRefundDialog(val) {
        //传过来的值应该是订单编号，根据订单编号，请求后端接口，获取改订单的信息，放到弹框对应的位置中
        this.refundDialogVisible = true
      },
      closeRefundDialog() {
        this.refundDialogVisible = false
      },
      sureRefundDialog() {
        //请求后端接口数据，保存信息
        this.closeRefundDialog()
      },
      openNotesDialog(val) {
        //传过来的值应该是订单编号，根据订单编号，请求后端接口，获取改订单的信息，放到弹框对应的位置中
        this.notesDialogVisible = true
      },
      closeNotesDialog() {
        this.notesDialogVisible = false
      },
      sureNotesDialog() {
        //请求后端接口数据，保存信息
        this.closeNotesDialog()
      },
    },




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
      margin-top: 15px;
      background-color: #fff;
      box-shadow: 0px 2px 10px 1px rgba(0, 0, 0, 0.06);
      border-radius: 6px 6px 6px 6px;
      padding: 0px 15px;
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
            height: 200px;
            overflow: auto;
            padding: 20px 0px 10px 20px;
          }

          .refundDetail-reason {
            position: relative;
            padding: 10px 20px;
            border-top: 1px solid #EBEEF5;
            height: 60px;

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
        .detail-module-item::-webkit-scrollbar {
          width: 2px;
        }

        .refundDetail-time::-webkit-scrollbar-thumb,
        .detail-module-item::-webkit-scrollbar-thumb {
          border-radius: 10px;
          box-shadow: inset 0 0 0px rgba(0, 0, 0, 0.2);
          background: rgba(0, 0, 0, 0.2);
        }

        .refundDetail-time::-webkit-scrollbar-track,
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

    .el-dialog-box {
      font-size: 14px;
    }
    .refund-result-form{
      padding-left: 20px;
      /deep/.el-form-item{
        margin-bottom: 0px;
      }

    }

    /deep/ .el-dialog__header {
     font-size: 14px;
     font-family: Microsoft YaHei-Regular, Microsoft YaHei;
     font-weight: 400;
     color: #333333;
    }

    .dialog-notes {
      display: inline-block;
      font-size: 12px;
      color: #999;
    }

    .el-dialog-deliver {
      /deep/ .el-form-item {
        // margin-top: 20px;
      }

      .refund-result-tip {
        font-size: 12px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        font-weight: 400;
        color: #999999;
        margin-left: 70px;
      }
    }
  }
</style>
