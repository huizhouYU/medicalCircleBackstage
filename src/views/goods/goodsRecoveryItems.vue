<template>
  <div>
    <el-table ref="multipleTable" :data="currentPageData" tooltip-effect="dark" style="width: 100%" height="439">
      <el-table-column prop="id" label="产品编码" width="150"></el-table-column>
      <el-table-column label="商品图" width="100">
        <template slot-scope="scope">
          <img src="../../assets/401_images/401.gif" alt="图片加载失败" class="item-img">
        </template>
      </el-table-column>
      <el-table-column label="商品名称" width="300">
        <template slot-scope="scope">
          <span class="goods-name-span" :title="scope.row.name">{{scope.row.name}} </span>
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="商品分类" width="250"></el-table-column>
      <el-table-column prop="brand" label="品牌" width="120"></el-table-column>
      <el-table-column prop="price" label="价格" width="100"></el-table-column>
      <el-table-column prop="stock" label="库存" width="100"></el-table-column>
      <el-table-column fixed="right" label="操作" width="120">
        <template slot-scope="scope">
          <el-button @click.native.prevent="reduction(scope.$index, currentPageData)" type="text" size="small">
            还原
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="bottoms-box">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :page-sizes="[1,5,10, 15, 20, 25]" :page-size="pageSize" :current-page.sync="currentPage" :pager-count="5"
        :background="false" layout="total, sizes, prev, pager, next, jumper" :total="totalNum">
      </el-pagination>
    </div>

  </div>

</template>

<script>
  import axios from 'axios';
  const a = require("../../../src/json/goods.json")
  export default {
    data() {
      return {
        pagerCount: 4, //设置页码显示最多的数量
        currentPage: 1, //当前页
        totalPage: 0, //总页数
        totalNum: 0, //总条数
        pageSize: 10, //当前显示条数
        tableData: [], //总数据内容
        currentPageData: [], //当前页显示内容
        multipleSelection: []
      }
    },
    created() {

    },
    mounted() {
      this.loadData()

    },
    methods: {
      // 计算页码等
      computeSize() {
        this.totalNum = this.tableData.length
        this.totalPage = Math.ceil(this.totalNum / this.pageSize);
        // 计算得0时设置为1
        this.totalPage = this.totalPage == 0 ? 1 : this.totalPage;
        this.setCurrentPageData();
      },
      // 设置当前页面数据，对数组操作的截取规则为[0~10],[10~20]...,
      setCurrentPageData() {
        let begin = (this.currentPage - 1) * this.pageSize;
        let end = this.currentPage * this.pageSize;
        this.currentPageData = this.tableData.slice(
          begin,
          end
        );
      },
      async loadData() {
        this.tableData = a.goodsData
        this.computeSize()
        // await axios.get("http://192.168.0.110:8080//static/testData/goods.json").then(res => {
        //   console.log(res);
        //   if (res.status == 200) {
        //     this.tableData = res.data.goodsData
        //     console.log(this.tableData)
        //     console.log(this.tableData.length)
        //   } else {
        //     this.$message.error("数据请求失败，请稍后再试！")
        //   }
        //   this.computeSize()
        // })
      },
      handleSizeChange(val) {
        this.pageSize = val
        this.loadData();
      },
      handleCurrentChange(val) {
        this.setCurrentPageData();
      },
      reduction(index, rows) {
        this.$confirm('是否将该商品还原?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          rows.splice(index, 1);
          this.$message({
            type: 'success',
            message: '还原成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消还原'
          });
        })
      },
    }
  }
</script>
<style scoped lang="less">
  .el-table {
    font-size: 12px;
    color: #333333;
  }

  //商品名称
  .goods-name-span {
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  // 列表中商品圈图片
  .item-img {
    width: 50px;
    height: 50px;
  }

  // 列表底部的部分
  .bottoms-box {
    padding: 20px 50px 25px 15px;
    background-color: #fff;
    font-size: 12px;
    display: flex;
    justify-content: flex-end;
  }

  //修改页码样式
  .el-pagination.is-background .el-pager li {
    background-color: #fff !important;
    border: 1px solid #f4f4f5;
  }
  .el-pagination span{
    font-size: 12px;
    color: #777777;
  }
</style>
