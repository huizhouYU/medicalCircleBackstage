<template>
  <div class="content">
    <!-- 搜索部分 -->
    <div class="search">
      <!-- input 输入关键字  -->
      <el-input placeholder="请输入关键字" v-model="inputKey" class="input-with-select search-select-input public-interval">
        <el-select v-model="inputKeyType" slot="prepend" placeholder="请选择">
          <el-option v-for="item in inputKeyOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="selectData()"></el-button>
      </el-input>
    </div>
    <goods-recovery-items class="items"></goods-recovery-items>
  </div>
</template>

<script>
  import GoodsRecoveryItems from '../goods/goodsRecoveryItems.vue'
  export default {
    components: {
      GoodsRecoveryItems
    },
    data() {
      return {
        //商品状态
        inputKeyOptions: [{
          value: '1',
          label: '产品编码'
        }, {
          value: '2',
          label: '产品名称'
        }],
        inputKeyType: '1', //搜索的关键字的类型
        inputKey: '', //输入商品名称/关键字

      }
    },
    methods: {

      //根据条件筛选数据
      selectData() {
        alert("不要点啦！后台接口数据还没做呢。。。")
      }
    }
  }
</script>

<style scoped lang="less">

  // 模块二 搜索条件
  .search {
    height: 74px;
    background-color: #fff;
    box-shadow: 0px 2px 10px 1px rgba(0, 0, 0, 0.06);
    border-radius: 6px 6px 6px 6px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding-left: 15px;

    // 输入关键字
    .search-select-input {
      width: 400px;

      // /deep/.el-input {
      //   width: 110px;
      // }

      // /deep/.el-input-group__prepend .el-input {
      //   font-size: 12px;
      // }

    }
  }

  // 模块三 商品列表
  .items {
    margin-top: 20px;
  }
</style>
