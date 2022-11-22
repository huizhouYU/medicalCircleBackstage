<template>
  <div class="app-container">
    <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%;min-height:200px"
      :height="tableHeight">
      <el-table-column prop="goodsPn" label="产品编码"min- width="150"></el-table-column>
      <el-table-column label="商品图" min-width="100">
        <template slot-scope="scope">
           <img :src="scope.row.defaultImage" alt="图片加载失败" class="item-img">
        </template>
      </el-table-column>
      <el-table-column label="商品名称" min-width="200">
        <template slot-scope="scope">
          <span class="goods-name-span" :title="scope.row.goodsName">{{scope.row.goodsName}} </span>
        </template>
      </el-table-column>
      <el-table-column prop="cateName" label="商品分类" min-width="180"></el-table-column>
      <el-table-column prop="brand" label="品牌" min-width="120"></el-table-column>
      <el-table-column prop="price" label="价格"min-width="100"></el-table-column>
      <el-table-column prop="qty" label="库存" min-width="100"></el-table-column>
      <el-table-column fixed="right" label="操作" min-width="120">
        <template slot-scope="scope">
          <el-button @click.native.prevent="reduction(scope.$index, scope.row)" type="text" size="small"> 还原
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="bottoms-box">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :page-sizes="[1,5,10, 15, 20, 25]" :pager-count="5" :page-size="currentSize.pageSize"
        :background="false" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>

</template>

<script>
  import {
    getDynamicHeight,
    debounce
  } from "../utils/elTableAutoHeight.js";
  import {
    goodsRenew
  } from '@/api/goods'
  export default {
    props: ['tableData','total'],
    watch: {
      tableData(val) {
        this.tableData = val;
      }
    },
    data() {
      return {
        tableHeight: 0,
        pagerCount: 4, //设置页码显示最多的数量
        multipleSelection: [],
        currentSize: {
          pageNo: 1,
          pageSize: 20
        }
      }
    },
    mounted() {
      // 初始化给table高度赋值
      this.getHeight();
      // 屏幕resize监听方法
      this.screenMonitor();
    },
    methods: {
      screenMonitor() {
        let resize = debounce(() => {
          this.getHeight();
        }, 100);
        // 屏幕resize监听事件：一旦屏幕宽高发生变化，就会执行resize
        window.addEventListener("resize", resize, true);
        // 将屏幕监听事件移除
        // 这步是必须的。离开页面时不移除，再返回，或者进入到别的有相同元素的页面会报错
        // 或者将这里的方法直接写在beforeDestroy函数中也可，不过我感觉这样写更明了些
        this.$once("hook:beforeDestroy", () => {
          window.removeEventListener("resize", resize, true);
        });
      },
      getHeight() {
        // 为什么设置了一个定时器我忘却了。。。。大概因为在获取元素时还没有元素吧哈哈哈哈我真的讲不明白但是得有这个定时器
        setTimeout(() => {
          // this.tableHeight = getDynamicHeight(this.$refs.searchContainer).height;
          this.tableHeight = getDynamicHeight(200).height;
        }, 400);
      },
      handleSizeChange(val) {
        this.currentSize.pageSize = val
        this.$emit("getList",this.currentSize)
      },
      handleCurrentChange(val) {
        this.currentSize.pageNo= val
        this.$emit("getList",this.currentSize)
      },
      //还原
      reduction(index, rows) {
        var params = {
          id: rows.goodsId
        }
        this.$confirm('是否将该商品还原?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          goodsRenew(JSON.stringify(params)).then(response => {
            var res = response.data.data
            if (response.data.code != '10000') { //失败
              this.$message.error(response.data.message)
            } else {
              this.$message({
                type: 'success',
                message: '还原成功!'
              });
              this.$emit("getList", this.currentSize)
            }
          })
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
  .app-container {
    box-shadow: 0px 2px 10px 1px rgba(0, 0, 0, 0.06);
  }

  .el-table {
    font-size: 12px;
    color: #333333;
    box-sizing: border-box;
    border-radius: 6px 6px 0px 0px;
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
    border-radius: 4px;
  }

  // 列表底部的部分
  .bottoms-box {
    padding: 20px 50px 25px 15px;
    background-color: #fff;
    font-size: 12px;
    display: flex;
    justify-content: flex-end;
    box-sizing: border-box;
    border-radius: 0px 0px 6px 6px;
  }

  //修改页码样式
  .el-pagination.is-background .el-pager li {
    background-color: #fff !important;
    border: 1px solid #f4f4f5;
  }

  .el-pagination span {
    font-size: 12px;
    color: #777777;
  }
</style>
