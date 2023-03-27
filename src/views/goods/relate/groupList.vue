<template>
  <div class="">
    <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width:100%" class="el-table-box"
      :header-cell-style="{height:'55px',color: '#333333','font-size': '12px','font-weight': 'bold'}"
      :cell-style="{color: '#333333','font-size': '12px'}">
      <el-table-column prop="groupName" label="分组名称" min-width="200"></el-table-column>
      <el-table-column prop="categoryName" label="类目" min-width="200"></el-table-column>
      <el-table-column prop="brandName" label="品牌名称" min-width="200"></el-table-column>
      <el-table-column fixed="right" label="操作" min-width="120">
        <template slot-scope="scope">
          <el-button @click.native.prevent="editGroupGoods(scope.$index, scope.row)" type="text" size="small"
            class="my-opt-btn">
            管理分组商品
          </el-button>
          <el-button @click.native.prevent="editGroup(scope.$index, scope.row)" type="text" size="small"
            class="my-opt-btn">
            编辑
          </el-button>
          <el-button @click.native.prevent="deleteGroup(scope.$index, scope.row)" type="text" size="small"
            class="my-opt-btn">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    props: ['tableData'],
    data() {
      return {}
    },
    methods: {
      editGroup(index, row) {
        console.log(row)
        this.$emit("editGroup", row)
      },
      editGroupGoods(index, row) {
        console.log("管理分组内的商品：",row)
        this.$router.push({
          path: 'manageSeries',
          query:{
            groupId:row.id
          }
        })
      },
      deleteGroup(index, row) {
        this.$confirm('确定删除这个系列吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
    }
  }
</script>

<style scoped lang="less">
  // .my-opt-btn {
  //        color: #1890FF;
  //      }
</style>
