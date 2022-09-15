<template>
  <div class="app-container">
    <!-- 模块二 搜索条件 + 添加商品 -->
    <div class="search-add">
      <!-- 搜索部分 -->
      <div class="search">
        <!-- 商品分类 -->
        <el-cascader v-model="sortValue" placeholder="商品分类" :options="options" @change="handleChange"
          class="choose-store-sort public-interval" clearable :filterable="true">
        </el-cascader>
        <!-- 商品状态 -->
        <el-select v-model="value" placeholder="商品状态" class="choose-shop-state public-interval" clearable>
          <el-option v-for="item in shopStateOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <!-- input 输入关键字  -->
        <el-input placeholder="请输入关键字" v-model="inputKey" class="input-with-select search-select-input public-interval">
          <el-select v-model="inputKeyType" slot="prepend" placeholder="请选择">
            <el-option v-for="item in inputKeyOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="selectData()"></el-button>
        </el-input>
      </div>
      <!-- 添加商品 -->
      <button class="btn-add " @click="toAddGoods">添加商品 </button>
    </div>
    <!-- 模块三 商品列表 -->
    <goods-items class="items"></goods-items>
    <!-- <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="Date">
        <template slot-scope="scope">
          <span>{{ scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="Author">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" label="Importance">
        <template slot-scope="scope">
          <svg-icon v-for="n in +scope.row.importance" :key="n" icon-class="star" class="meta-item__icon" />
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="Status" width="110">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column min-width="300px" label="Title">
        <template slot-scope="{row}">
          <router-link :to="'/example/edit/'+row.id" class="link-type">
            <span>{{ row.title }}</span>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Actions" width="120">
        <template slot-scope="scope">
          <router-link :to="'/example/edit/'+scope.row.id">
            <el-button type="primary" size="small" icon="el-icon-edit">
              Edit
            </el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" /> -->
  </div>
</template>

<script>
  import {
    fetchList
  } from '@/api/article'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import GoodsItems from '../goods/goodsItems.vue'
  export default {
    name: 'GoodsList',
    components: {
      Pagination,
      GoodsItems
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'info',
          deleted: 'danger'
        }
        return statusMap[status]
      }
    },
    data() {
      return {

        //商品分类
        options: [{
            value: 'zhinan',
            label: '指南',
            children: [{
              value: 'daohang',
              label: '导航',
              children: [{
                value: 'cexiangdaohang',
                label: '侧向导航'
              }, {
                value: 'dingbudaohang',
                label: '顶部导航'
              }]
            }]
          },
          {
            value: 'ziyuan',
            label: '资源',
            children: [{
              value: 'axure',
              label: 'Axure Components'
            }, {
              value: 'sketch',
              label: 'Sketch Templates'
            }, {
              value: 'jiaohu',
              label: '组件交互文档'
            }]
          }
        ],
        //商品状态
        shopStateOptions: [{
          value: '1',
          label: '上架'
        }, {
          value: '2',
          label: '下架'
        }],
        //搜索关键字类型
        inputKeyOptions: [{
          value: '1',
          label: '产品编码'
        }, {
          value: '2',
          label: '产品名称'
        }],
        inputKeyType: '1', //搜索的关键字的类型
        inputKey: '', //输入商品名称/关键字
        value: '',
        sortValue: '', //选择的商品分类
        //////////////////
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        fetchList(this.listQuery).then(response => {
          this.list = response.data.items
          this.total = response.data.total
          this.listLoading = false
        })
      },
      //添加商品
      toAddGoods() {
        this.$router.push('addGoods')
      },
      //根据条件筛选数据
      selectData() {
        alert("不要点啦！后台接口数据还没做呢。。。")
      },
      handleChange() {

      }
    }
  }
</script>

<style scoped lang="less">
  // 模块二 搜索条件 + 添加商品
  .search-add {
    // margin-top: 15px;
    background-color: #fff;
    box-shadow: 0px 2px 10px 1px rgba(0, 0, 0, 0.06);
    border-radius: 6px 6px 6px 6px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;

    //公共上下间距
    .public-interval {
      margin: 20px 0px;
    }

    // 搜索部分
    .search {
      display: flex;
      justify-content: flex-start;
      align-items: center;

      /deep/.el-input--mini .el-input__inner {
        // height: 34px;
        // line-height: 34px;
      }

      // 本店分类
      // 商品状态
      .choose-store-sort,
      .choose-shop-state {
        width: 112px;
        height: 34px;
        margin: 20px 25px 20px 15px;
        border-radius: 6px 6px 6px 6px;
        box-sizing: border-box;
        font-size: 12px;

        /deep/.el-select-dropdown__item span {
          font-size: 12px;
        }

        /deep/ .el-select-dropdown__empty {
          font-size: 12px !important;
        }
      }

      .choose-shop-state {
        margin-left: 0px;
      }

      /deep/ .el-cascader {
        line-height: 0px !important;
      }

      // 输入关键字
      .search-select-input {
        width: 400px;

        /deep/.el-input {
          width: 110px;
        }

        //搜索按钮
        /deep/.el-input-group__append button.el-button {
          background-color: #1890FF;
          border-color: #1890FF;
          color: #fff;
        }

        /deep/.el-input-group__append {
          border-color: #1890FF;
          overflow: hidden;
        }

        /deep/.el-button {
          line-height: unset;
        }
      }
    }

    // 添加商品
    .btn-add {
      width: 88px;
      height: 34px;
      background: #1890FF;
      border-radius: 6px 6px 6px 6px;
      border: none;
      margin: 20px 20px 20px 15px;
      box-sizing: border-box;
      font-size: 12px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
      color: #FFFFFF;
      text-align: center;
      line-height: 34px;
    }
  }

  // 模块三 商品列表
  .items {
    margin-top: 20px;
  }
</style>
