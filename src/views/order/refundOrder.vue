<template>
  <div class="">
    <!-- 搜索栏 -->
    <div class="search-box">
      <!-- 订单状态下拉框 -->
      <el-select v-model="orderStateValue" placeholder="订单状态" class="orderState-div public-interval">
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
      <button class="but-search public-interval">查询</button>
    </div>
    <!-- 订单列表 -->
    <!-- 自定义表格 -->
    <div class="table-item">
      <table border="1" cellspacing="0" cellpadding="0" width="100%">
        <thead>
          <th style="width: 25%;" colspan="2">商品名称</th>
          <th style="width: 12%;">交易金额</th>
          <th style="width: 12%;">退款金额</th>
          <th style="width: 12%;">买家</th>
          <th style="width: 14%;">退款原因</th>
          <th style="width: 12%;">退款状态</th>
          <th style="width: 10%;">售后</th>
        </thead>
        <tbody>
          <template v-for="(item,index) in currentPageData">
            <tr class="order-info">
              <td colspan="8">
                <div class="order-info-title">
                  <div class="order-info-title-left">
                    <span>订单编号: {{ item.orderNo }}</span>
                    <span>退款编号: {{ item.refundNo }}</span>
                    <span>申请时间: {{ item.refundTime }}</span>
                    <span>用户昵称: {{ item.buyer }}</span>
                  </div>
                  <span class="order-info-title-right" @click="openNotesDialog(item.number)">
                    备注 <i class="iconfont">&#xe675;</i>
                  </span>
                </div>
              </td>
            </tr>
            <tr class="order-detail">
              <td colspan="2" class="img-name-no-td" style="width: 25%;">
                <div class="img-name-no">
                  <img :src="item.imgUrl" alt="">
                  <div class="name-no">
                    <span :title="item.name"> {{ item.name }}</span>
                    <span :title="item.goodNo">编号: {{ item.goodNo }}</span>
                  </div>
                </div>
              </td>
              <td style="width: 12%;">￥：{{ item.orderPrice }}</td>
              <td style="width: 12%;">￥：{{ item.refundPrice }}</td>
              <td style="width: 12%;">
                <template>
                  <div class="info-span-interval">{{ item.consignee }}</div>
                  <div class="info-span-interval">{{ item.phone }}</div>
                </template>
              </td>
              <td style="width: 14%;"> {{ item.reason }} </td>
              <td style="width: 12%;">
                <template v-if="item.OrderStatus==1"><span class="info-span-interval">待处理</span></template>
                <template v-else-if="item.OrderStatus==2"><span class="info-span-interval">退款中</span></template>
                <template v-else-if="item.OrderStatus==3"><span class="info-span-interval">退款成功</span></template>
                <template v-else-if="item.OrderStatus==4"><span class="info-span-interval">退款失败</span></template>
              </td>
              <td style="width: 10%;">
                <div class="operation-content">
                  <div class="orderState-detail info-span-interval" @click="toRefundDetail(item.refundNo)">退款详情</div>
                  <div class="orderState-detail info-span-interval" @click="toOrderDetail(item.orderNo)">订单详情</div>
                  <template v-if="item.OrderStatus==1">
                    <div class="orderState-detail info-span-interval" @click="openRefundDialog(item.refundNo)">退款</div>
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

    <!-- 发货 弹框 -->
    <el-dialog title="退款审核" :close-on-click-modal="false" :visible.sync="refundDialogVisible" width="500px"
      class="el-dialog-box el-dialog-deliver">
      <el-form :model="refundDeliverForm" label-position="left">
        <el-radio-group v-model="refundDeliverForm.decision" @change="clearRefundForm">
          <el-radio :label="1">同意</el-radio>
          <el-radio :label="2">拒绝</el-radio>
        </el-radio-group>
        <el-form-item label="拒绝原因:" :label-width="formLabelWidth">
          <el-input v-model="refundDeliverForm.refuseReason" placeholder=""
            :disabled="refundDeliverForm.decision == 1" />
        </el-form-item>
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
  const a = require('../../../src/json/refundOrders.json')
  import axios from 'axios'
  export default {
    data() {
      return {
        refundDialogVisible: false, // 退款弹框
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
            label: '待处理'
          }, {
            value: '2',
            label: '退款中'
          },
          {
            value: '3',
            label: '退款成功'
          },
          {
            value: '4',
            label: '退款失败'
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
        formLabelWidth: '100px',
        // 要退款的订单信息
        refundDeliverForm: {
          id: '', // 订单唯一标识
          decision: 1, // 1：同意，2：拒绝
          refuseReason: '' // 拒绝原因
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
      back() {
        this.$router.replace('/orderManage')
      },
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
        // await axios.get("../../../static/testData/refundOrders.json").then(res => {
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
      // 打开退款弹框
      openRefundDialog(val) {
        // 传过来的值应该是订单编号，根据订单编号，请求后端接口，获取改订单的信息，放到弹框对应的位置中
        this.refundDialogVisible = true
      },
      clearRefundForm() {
        if (this.refundDeliverForm.decision == 1) {
          this.refundDeliverForm.refuseReason = ''
        }
      },
      // 关闭退款弹框
      closeRefundDialog() {
        this.refundDialogVisible = false
      },
      sureDeliverDialog() {
        // 请求后端接口数据，保存信息
        this.closeRefundDialog()
      },
      closeNotesDialog() {
        this.notesDialogVisible = false
      },
      sureNotesDialog() {
        // 请求后端接口数据，保存信息
        this.closeNotesDialog()
      },

      openNotesDialog(val) {
        // 传过来的值应该是订单编号，根据订单编号，请求后端接口，获取改订单的信息，放到弹框对应的位置中
        this.notesDialogVisible = true
      },
      toOrderDetail(val) {
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
    padding-left: 15px;
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

    // 订单状态下拉框
    .orderState-div {
      width: 112px;
      height: 34px;
      border-radius: 6px 6px 6px 6px;
      outline: none;
      box-shadow: 0px;
      box-sizing: border-box;
      margin-right: 25px;

      /deep/ .el-input__icon {
        line-height: 34px;
      }

    }

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

      // display: flex;
      // justify-content: flex-start;
      // align-items: center;
      /deep/.el-input {
        width: 110px;
      }

      /deep/ .el-input__icon {
        line-height: 34px;
      }

      //输入的关键字的类型
      .key-selectType {
        height: 34px;
        width: 140px;
        box-sizing: border-box;
        font-size: 12px;
        margin-left: -1px;

        //下拉框的样式修改
        /deep/ .el-input__inner {
          height: 34px;
          line-height: 34px;
          font-size: 12px;
          border-radius: 6px 0px 0px 6px;
        }

        //下拉框的箭头修改
        /deep/ .el-input__icon {
          line-height: 34px;
        }
      }

      // input 输入框
      .input-search {
        width: 320px;
        height: 34px;
        margin-left: -1px;

        /deep/ .el-input__inner {
          height: 34px;
          line-height: 34px;
          border-radius: 0px 6px 6px 0px;
        }

      }
    }

    .but-search {
      margin-left: 40px;
      width: 64px;
      height: 34px;
      background: #1890FF;
      border-radius: 6px 6px 6px 6px;
      box-sizing: border-box;
      color: #FFFFFF;
      border: none;
      font-size: 12px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
      font-weight: 400;
    }
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
        padding-left: 6px;
        border-bottom: 1px solid #EBEEF5;
        height: 55px;
        box-sizing: border-box;
        font-size: 12px;
        font-family: Microsoft YaHei-Bold, Microsoft YaHei;
        font-weight: bold;
        color: #333333;
        display: flex;
        align-items: center;

        tr {
          display: table;
          width: 100%;
          table-layout: fixed;
        }
      }

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
            box-sizing: border-box;
            float: left;
          }

          .name-no {
            height: 70px;
            padding-left: 20px;
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
