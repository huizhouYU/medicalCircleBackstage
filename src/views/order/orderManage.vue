<template>
  <div class="">
    <!-- 搜索栏 -->
    <div class="search-box">
      <!-- 订单状态下拉框 -->
      <el-select v-model="orderStateValue" placeholder="订单状态" class="public-select-box">
        <el-option v-for="item in orderStateOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <!-- 下单时间 -->
      <div class="order-time public-interval">
        <span>下单时间：</span>
        <el-date-picker v-model="orderTime" class="el-date-editor-div" type="daterange" align="right" unlink-panels
          start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" />
      </div>
      <!-- 输入关键字 -->
      <el-input v-model="inputKey" placeholder="请输入订单编号/收货人"
        class="input-with-select search-select-input public-interval">
        <el-select slot="prepend" v-model="inputKeyType" placeholder="请选择">
          <el-option v-for="item in inputKeyOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-input>
      <!-- 查询按钮 -->
      <el-button type="primary" class="public-el-btn">查询</el-button>

      <!-- <button class="but-search public-interval">查询</button> -->
    </div>
    <!-- 订单列表 -->
    <!-- 自定义表格 -->
    <div class="table-item">
      <table border="1" cellspacing="0" cellpadding="0" width="100%">
        <thead>
          <tr>
            <th style="width: 25%;" colspan="2">商品名称</th>
            <th style="width: 12%;">数量</th>
            <th style="width: 12%;">价格</th>
            <th style="width: 12%;">收货人</th>
            <th style="width: 14%;">订单状态</th>
            <th style="width: 12%;">实付金额</th>
            <th style="width: 10%;">操作</th>
          </tr>

        </thead>
        <tbody>
          <template v-for="(item,index) in currentPageData">
            <tr class="order-info">
              <td colspan="8">
                <div class="order-info-title">
                  <div class="order-info-title-left">
                    <span>订单编号: {{ item.number }}</span>
                    <span>下单时间: {{ item.orderTime }}</span>
                    <span class="payWay-span">支付方式: {{ item.payWay }}</span>
                    <span>用户昵称: {{ item.buyer }}</span>
                  </div>
                  <span class="order-info-title-right" @click="openNotesDialog(item.number)">
                    备注<i class="iconfont">&#xe675;</i>
                  </span>
                </div>
              </td>
            </tr>
            <tr class="order-detail">
              <td colspan="2" class="img-name-no-td" style="width: 25%;">
                <div class="img-name-no">
                  <!-- <img :src="item.imgUrl" alt=""> -->
                  <img :src="qqq" alt="">
                  <div class="name-no">
                    <span :title="item.name"> {{ item.name }}</span>
                    <span :title="item.goodNo">编号: {{ item.goodNo }}</span>
                  </div>
                </div>
              </td>
              <td style="width: 12%;">{{ item.num }}</td>
              <td style="width: 12%;">￥：{{ item.price }}</td>
              <td style="width: 12%;">
                <template>
                  <div class="info-span-interval">{{ item.consignee }}</div>
                  <div class="info-span-interval">{{ item.phone }}</div>
                </template>
              </td>
              <td style="width: 14%;">
                <template v-if="item.OrderStatus==1"><span class="info-span-interval">商家待审核</span></template>
                <template v-else-if="item.OrderStatus==2"><span class="info-span-interval">买家待付款</span></template>
                <template v-else-if="item.OrderStatus==3"><span class="info-span-interval">买家已付款</span></template>
                <template v-else-if="item.OrderStatus==4"><span class="info-span-interval">商品运输中</span></template>
                <template v-else-if="item.OrderStatus==5"><span class="info-span-interval">订单退款中</span></template>
                <template v-else-if="item.OrderStatus==6"><span class="info-span-interval">订单已退款</span></template>
                <template v-else-if="item.OrderStatus==7"><span class="info-span-interval">订单已完成</span></template>
                <template v-else-if="item.OrderStatus==8"><span class="info-span-interval">订单已取消</span></template>
                <template v-else-if="item.OrderStatus==9"><span class="info-span-interval">订单已关闭</span></template>
              </td>
              <td style="width: 12%;">{{ item.orderPrice }}
                <div>(免运费)</div>
                <!-- <template v-if="item.OrderStatus==2">
                  <div class="orderState-detail" @click="openPirceDialog(item.number)">修改价格</div>
                </template> -->
              </td>
              <td style="width: 10%;">
                <div class="operation-content">
                  <div class="orderState-detail info-span-interval" @click="toDetail(item.number)">订单详情</div>
                  <template v-if="item.OrderStatus==1">
                    <div class="orderState-detail info-span-interval" @click="cancelOrder(item.number)">取消订单</div>
                    <div class="orderState-detail info-span-interval" @click="openExamineDialog(item.number)">审核</div>
                  </template>
                  <template v-else-if="item.OrderStatus==2">
                    <div class="orderState-detail info-span-interval" @click="cancelOrder(item.number)">取消订单</div>
                    <div class="orderState-detail" @click="openPirceDialog(item.number)">修改价格</div>
                  </template>
                  <template v-else-if="item.OrderStatus==3">
                    <div class="orderState-detail info-span-interval" @click="openDeliverDialog(item.number)">发货</div>
                  </template>
                  <template v-else-if="item.OrderStatus==5 || item.OrderStatus==6">
                    <div class="orderState-detail info-span-interval" @click="toRefundDetail(item.number)">退款详情</div>
                  </template>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
      <div class="bottoms-box">
        <el-pagination background :page-sizes="[1,5,10, 15, 20, 25]" :page-size="pageSize"
          :current-page.sync="currentPage" :pager-count="5" :background="false"
          layout="total, sizes, prev, pager, next, jumper" :total="totalNum" @size-change="handleSizeChange"
          @current-change="handleCurrentChange" />

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
      <el-form :model="orderDeliverForm" label-position="right"
        :class="[{'span-info':orderDeliverForm.deliverWay == 2}]">
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
        <!-- <div  class="span-info"> -->
        <el-form-item label="收货人:" :label-width="formLabelWidth" v-show="orderDeliverForm.deliverWay == 2">
          <span>张楚岚</span>
        </el-form-item>
        <el-form-item label="联系电话:" :label-width="formLabelWidth" v-show="orderDeliverForm.deliverWay == 2">
          <span>123 4567 6988</span>
        </el-form-item>
        <el-form-item label="卖家地址:" :label-width="formLabelWidth" v-show="orderDeliverForm.deliverWay == 2">
          <span>安徽省合肥市蜀山区蜀山区蜀山街道枫叶产业园128号999室</span>
        </el-form-item>
        <!-- </div> -->

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
          <el-input v-model="orderNotesForm.mNotes" placeholder="" type="textarea" :disabled="true" resize='none' />
        </el-form-item>
        <el-form-item label="商家备注:" :label-width="formLabelWidth">
          <el-input v-model="orderNotesForm.sNotes" autocomplete="off" size="medium" type="textarea" resize='none' />
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
  import axios from 'axios'
  const a = require('../../../src/json/orders.json')
  export default {
    data() {
      return {
        qqq:'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        notes: '', // 修改价格弹框备注
        pirceDialogTitle: '', // 审核和修改价格是同一个弹框，用标题区分是什么操作
        pirceDialogVisible: false, // 修改价格弹框
        deliverDialogVisible: false, // 发货弹框
        notesDialogVisible: false, // 备注弹框
        // /搜索关键字类型
        inputKeyOptions: [{
          value: '1',
          label: '订单编号'
        }, {
          value: '2',
          label: '收货人'
        }],
        inputKeyType: '', // 选择的搜索关键字类型
        // 输入的订单编号/收货人
        inputKey: '',
        // 选择的订单状态
        orderStateValue: '',
        // 订单状态
        orderStateOptions: [{
            value: '0',
            label: '全部订单'
          },
          {
            value: '1',
            label: '商家待审核'
          }, {
            value: '2',
            label: '买家待付款'
          },
          {
            value: '3',
            label: '买家已付款'
          },
          {
            value: '4',
            label: '商品运输中'
          },
          {
            value: '5',
            label: '订单退款中'
          },
          {
            value: '6',
            label: '订单已退款'
          },
          {
            value: '7',
            label: '订单已完成'
          },
          {
            value: '8',
            label: '订单已取消'
          },
          {
            value: '9',
            label: '订单已关闭'
          }
        ],
        // 选择的订单时间
        orderTime: '',
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        },
        // 总数据内容
        tableData: [],
        isAddAllTerminalStatus: false, // 是否全选订单
        pagerCount: 4, // 设置页码显示最多的数量
        isAddAllTerminalStatus: false,
        currentPage: 1, // 当前页
        totalPage: 0, // 总页数
        totalNum: 0, // 总条数
        pageSize: 10, // 当前显示条数
        currentPageData: [], // 当前页显示内容
        multipleSelection: [], // 选择的订单编号
        formLabelWidth: '80px',
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
        }

      }
    },
    mounted() {
      this.loadData()
    },
    methods: {
      // 选择某一个订单
      clickCheckbox(val) {
        if (this.currentPageData[val].checked) {
          this.multipleSelection.push(this.currentPageData[val].number)
        } else {
          var ls_Selection = []
          for (var i = 0; i < this.multipleSelection.length; i++) {
            if (this.multipleSelection[i] != this.currentPageData[val].number) {
              ls_Selection.push(this.currentPageData[val].number)
            }
          }
          this.multipleSelection = ls_Selection
        }
      },
      // 全选订单
      allSelectTerminal() {
        for (var i = 0; i < this.currentPageData.length; i++) {
          this.currentPageData[i].checked = this.isAddAllTerminalStatus
          this.multipleSelection.push(this.currentPageData[i].number)
        }
        if (!this.isAddAllTerminalStatus) {
          this.multipleSelection = []
        }
      },
      // 删除
      deleteChoosed() {
        if (this.multipleSelection.length > 0) {
          this.$confirm('数据删除后将无法找回, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$message({
              type: 'success',
              message: '模拟数据删除成功!'
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
        } else {
          this.$message({
            type: 'error',
            message: '请先选择要删除的订单!'
          })
        }
      },
      // 计算页码等
      computeSize() {
        this.totalNum = this.tableData.length
        this.totalPage = Math.ceil(this.totalNum / this.pageSize)
        // 计算得0时设置为1
        this.totalPage = this.totalPage == 0 ? 1 : this.totalPage
        this.setCurrentPageData()
      },
      // 设置当前页面数据，对数组操作的截取规则为[0~10],[10~20]...,
      setCurrentPageData() {
        const begin = (this.currentPage - 1) * this.pageSize
        const end = this.currentPage * this.pageSize
        this.currentPageData = this.tableData.slice(
          begin,
          end
        )
      },
      async loadData() {
        this.tableData = a.ordersData
        this.computeSize()
        // await axios.get("http://192.168.0.110:8080/static/testData/orders.json").then(res => {
        //   if (res.status == 200) {
        //     this.tableData = res.data.ordersData
        //     // console.log(this.tableData)
        //     // console.log(this.tableData.length)
        //   } else {
        //     this.$message.error("数据请求失败，请稍后再试！")
        //   }
        //   this.computeSize()
        // })
      },
      handleSizeChange(val) {
        this.pageSize = val
        this.loadData()
      },
      handleCurrentChange(val) {
        this.setCurrentPageData()
      },
      openPirceDialog(val) {
        // 传过来的值应该是订单编号，根据订单编号，请求后端接口，获取改订单的价格，放到弹框对应的位置中
        this.pirceDialogTitle = '修改价格'
        this.notes = ''
        this.pirceDialogVisible = true
      },
      openExamineDialog(val) {
        // 传过来的值应该是订单编号，根据订单编号，请求后端接口，获取改订单的价格，放到弹框对应的位置中
        this.pirceDialogTitle = '审核'
        this.notes = '注：确认修改价格，即默认订单审核成功'
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
      closeDeliverDialog() {
        this.deliverDialogVisible = false
      },
      sureDeliverDialog() {
        // 请求后端接口数据，保存信息
        this.closeDeliverDialog()
      },
      closeNotesDialog() {
        this.notesDialogVisible = false
      },
      sureNotesDialog() {
        // 请求后端接口数据，保存信息
        this.closeNotesDialog()
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
      openDeliverDialog(val) {
        // 传过来的值应该是订单编号，根据订单编号，请求后端接口，获取改订单的信息，放到弹框对应的位置中
        this.deliverDialogVisible = true
      },
      clearDeliverForm() {
        if (this.orderDeliverForm.deliverWay == 2) {
          this.orderDeliverForm.logisticsCompany = ''
          this.orderDeliverForm.expressNo = ''
        }
      },
      openNotesDialog(val) {
        // 传过来的值应该是订单编号，根据订单编号，请求后端接口，获取改订单的信息，放到弹框对应的位置中
        this.notesDialogVisible = true
      },
      toDetail(val) {
        this.$router.push({
          path: 'orderDetail',
          query: {
            id: val
          }
        })
      },
      toRefundDetail(val) {
        this.$router.push({
          path: 'refundOrderDetail',
          query: {
            id: val
          }
        })
      }
    }

  }
</script>

<style lang="less" scoped>
  // 搜索栏
  .search-box {
    // height: 74px;
    background-color: #fff;
    box-shadow: 0px 2px 10px 1px rgba(0, 0, 0, 0.06);
    border-radius: 6px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    // padding-left: 15px;
    box-sizing: border-box;
    flex-wrap: wrap;
    font-size: 12px;
    font-family: Microsoft YaHei-Regular, Microsoft YaHei;
    font-weight: 400;
    color: #333333;

    //公共上下间距
    .public-interval {
      margin: 20px 0px;
    }

    /deep/ .el-input__inner {
      height: 34px;
      line-height: 34px;
      font-size: 12px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
      font-weight: 400;
      color: #333333;
    }

    // // 订单状态下拉框
    // .orderState-div {
    //   width: 112px;
    //   height: 34px;
    //   border-radius: 6px 6px 6px 6px;
    //   outline: none;
    //   box-shadow: 0px;
    //   box-sizing: border-box;
    //   margin-right: 25px;

    //   /deep/ .el-input__icon {
    //     line-height: 34px;
    //   }

    // }

    // 下单时间
    .order-time {
      margin-right: 25px;

      .el-date-editor-div {
        margin-left: 10px;
        width: 250px;
      }

      /deep/ .el-date-editor .el-range-input {
        font-size: 12px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        font-weight: 400;
        color: #333333;
      }

      /deep/ .el-date-editor .el-range-separator,
      /deep/ .el-date-editor .el-range__icon {
        font-size: 12px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        font-weight: 400;
        line-height: 26px;
      }

      /deep/ .el-date-editor .el-range__close-icon {
        line-height: 28px;
      }
    }

    // 请输入订单编号/收货人
    .search-select-input {
      width: 370px;


      // /deep/.el-input {
      //   width: 110px;
      // }

      // /deep/ .el-input__icon {
      //   line-height: 34px;
      // }

      //输入的关键字的类型
      // .key-selectType {
      //   height: 34px;
      //   width: 140px;
      //   box-sizing: border-box;
      //   font-size: 12px;
      //   margin-left: -1px;

      //   //下拉框的样式修改
      //   /deep/ .el-input__inner {
      //     height: 34px;
      //     line-height: 34px;
      //     font-size: 12px;
      //     border-radius: 6px 0px 0px 6px;
      //   }

      //   //下拉框的箭头修改
      //   /deep/ .el-input__icon {
      //     line-height: 34px;
      //   }
      // }

      // input 输入框
      // .input-search {
      //   width: 320px;
      //   height: 34px;
      //   margin-left: -1px;

      //   /deep/ .el-input__inner {
      //     height: 34px;
      //     line-height: 34px;
      //     border-radius: 0px 6px 6px 0px;
      //   }

      // }
    }

    // .but-search {
    //   margin-left: 40px;
    //   width: 64px;
    //   height: 34px;
    //   background: #1890FF;
    //   border-radius: 6px 6px 6px 6px;
    //   box-sizing: border-box;
    //   color: #FFFFFF;
    //   border: none;
    //   font-size: 12px;
    //   font-family: Microsoft YaHei-Regular, Microsoft YaHei;
    //   font-weight: 400;
    // }
  }

  //自定义表格
  .table-item {
    min-width: 600px;
    // height: 439px;
    margin-top: 20px;
    background-color: #fff;
    box-shadow: 0px 2px 10px 1px rgba(0, 0, 0, 0.06);
    box-sizing: border-box;
    border-radius: 6px;
    padding: 0px 15px 20px 15px;

    table {
      width: 100%;
      border: none;
      // border-collapse: collapse;
      box-sizing: border-box;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
      font-weight: 400;
      color: #333333;
      font-size: 12px;
      table-layout: fixed;
      border-bottom: 1px solid #EBEEF5;

      //表头
      thead {
        border-bottom: 1px solid #EBEEF5;
        height: 55px;
        box-sizing: border-box;
        font-size: 12px;
        font-family: Microsoft YaHei-Bold, Microsoft YaHei;
        font-weight: bold;
        color: #333333;
        display: flex;
        align-items: center;

        th {
          // display: flex;
          text-align: center;

        }

        tr {
          display: table;
          width: 100%;
          table-layout: fixed;
        }
      }

      //改变滚动条样式  start
      tbody::-webkit-scrollbar {
        padding: 2px 0px;
        width: 2px;
      }

      tbody::-webkit-scrollbar-thumb {
        border-radius: 10px;
        box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: rgba(0, 0, 0, 0);
      }

      tbody::-webkit-scrollbar-track {
        box-shadow: inset 0 0 5px rgba(0, 0, 0, 0);
        border-radius: 0;
        background: rgba(0, 0, 0, 0);
      }

      //改变滚动条样式  end
      tbody {
        display: block;
        height: 360px;
        width: 100%;
        overflow-y: auto;
        overflow-x: hidden;

        tr {
          display: table;
          width: 100%;
          table-layout: fixed;
        }
      }

      th,
      td {
        border: 1px solid #fff;
        text-align: center;
      }

      tr:nth-child(odd) {
        // background-color: #eee;
        // border-top: 1px solid red;
      }

      .order-info {
        height: 40px;

        td {
          text-align: left;
        }

        .order-info-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 0px 10px;

          //左边基本信息
          .order-info-title-left {
            span {
              margin-right: 30px;
            }

            .payWay-span {
              // margin-right: 10px;
            }
          }

          //右边备注
          .order-info-title-right {
            cursor: pointer;
            margin-right: 10px;

            span {
              display: flex;
              align-items: center;
              color: #666;
            }

            .iconfont {
              font-size: 12px !important;
              color: #999;
              margin-right: 5px;
            }
          }
        }

      }

      .order-detail:last-child {
        border-bottom: none;
      }

      .order-detail {
        height: 100px;
        border-bottom: 1px solid #EBEEF5;

        .img-name-no-td {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          padding-bottom: 15px;
        }

        .img-name-no {
          // display: flex;
          // justify-content: flex-start;
          // white-space: nowrap;
          // overflow: hidden;
          // text-overflow: ellipsis;

          img {
            width: 70px;
            height: 70px;
            border-radius: 4px;
            box-sizing: border-box;
            float: left;
          }

          .name-no {
            height: 70px;
            padding-left: 10px;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: space-around;

            span {
              width: 100%;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              text-align: left;
            }
          }
        }

        // 上下信息间距
        .info-span-interval+.info-span-interval {
          margin-left: 10px;
        }

        .operation-content {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
        }

        //各种操作
        .orderState-detail {
          margin: 5px;
          cursor: pointer;
          font-size: 12px;
          font-family: Microsoft YaHei-Regular, Microsoft YaHei;
          font-weight: 400;
          color: #1890FF;
        }

        //无操作
        .orderState-other {
          ont-size: 12px;
          font-family: Microsoft YaHei-Regular, Microsoft YaHei;
          font-weight: 400;
          color: #999;
        }

        // 评价
        .evaluate {
          text-align: center;
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
        }
      }
    }

    .bottoms-box {
      height: 60px;
      display: flex;
      justify-content: flex-end;
      align-items: center;

    }
  }
</style>
