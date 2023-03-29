<template>
  <!-- 第一版 系列>分组>商品:绑定商品的一个弹框
   展示了分组内有哪些商品，并且可以选择不同分组绑定，未找到的分组，也可以在分组下拉框中添加新的分组
   暂时未启用 -->
  <div class="group-goods-box">
    <div class="group-goods-left-box">
      <!-- 分组名称 -->
      <div class="group-name-box">
        <span class="name" v-show="!editGroupNameFlag">{{groupName}}</span>
        <i class="el-icon-edit my-edit-name-icon" @click="editGroupName" v-show="!editGroupNameFlag"></i>
        <el-input type="text" v-model="groupName" v-show="editGroupNameFlag" @keyup.native.enter="saveGroupName">
        </el-input>
      </div>
      <div class="group-goods-img-box">
        <img src="../../../assets/404_images/404.png" alt="" class="goods-img" v-for="(item,index) in groupGoods"
          :key="index">
      </div>
    </div>
    <div class="group-goods-right-box">
      <!-- <div class="add-good-to-group-box">
        <el-input placeholder="商品名称" v-model="input" :disabled="true">
        </el-input>
      </div> -->
      <el-form ref="form" :model="form" label-width="80px" class="add-good-to-group-box">
        <el-form-item label="商品名称：" class="my-short-input-item">
          <el-input v-model="form.goodsName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="商品型号：" class="my-short-input-item">
          <el-select v-model="form.moudle" disabled></el-select>
          <!-- <el-input v-model="form.moudle"></el-input> -->
        </el-form-item>
        <el-form-item label="选择分组：" class="my-long-input-item">
          <!-- <el-select v-model="value" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select> -->
          <!-- filterable allow-create default-first-option -->
          <el-select v-model.trim="value" clearable filterable @blur="selectGroup" placeholder="请选择分组">
            <!-- <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option> -->
            <!--           <template v-if="options.length === 0 " slot="empty">
              <div class="add-new-option-div">
                <img src="../../../assets/images/icon_add.png" alt="">
                <span class="title">点击创建分组1</span>
              </div>
            </template> -->
            <!-- <div class="add-new-option-div"> -->
            <div style="display: flex;justify-content: flex-start;align-items: center;font-size: 12px;
              color: #333;line-height: 12px;padding: 0px 12px; cursor: pointer;height: 34px;" @click="addNewGroup">
              <img src="../../../assets/images/icon_add.png" alt="" style="width: 24px;height: 24px;">
              <span class="title">点击创建分组</span>
            </div>
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <!-- <el-input v-model="form.moudle"></el-input> -->
        </el-form-item>
      </el-form>
      <div class="delete-group-div">
        <span>删除分组</span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        groupName: '分组A',
        editGroupNameFlag: false,
        groupGoods: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
        form: {
          goodsName: '心电监护仪',
          moudle: 'PC-3000'
        },
        options: [
          //   {
          //   label: "输入新分组名称，用回车添加",
          //   value: 1
          // },
          {
            value: '选项1',
            label: '黄金糕'
          }, {
            value: '选项2',
            label: '双皮奶'
          }
        ],
        value: ''
      }
    },
    methods: {
      selectGroup(val) {
        console.log(val)
      },
      editGroupName() {
        this.editGroupNameFlag = true
      },
      saveGroupName() {
        this.editGroupNameFlag = false
      },
      addNewGroup() {
        this.$message.success("添加新的分组【" + this.value + "】")
      }
    }
  }
</script>

<style lang="less" scoped>
  .group-goods-box {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 100%;
    box-sizing: border-box;

    .group-goods-left-box {
      height: 100%;
      background: #F8F8F8;
      flex: 4;
      box-sizing: border-box;
      padding: 25px 48px 32px 55px;

      .group-name-box {
        width: 100%;
        font-size: 12px;
        font-weight: 400;
        color: #333333;
        line-height: 12px;
        margin-bottom: 30px;
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .my-edit-name-icon {
          margin-left: 8px;
          color: #75C5FF;
          font-size: 14px;
          cursor: pointer;
        }

        /deep/ .el-input--medium .el-input__inner {
          height: 34px;
        }

        /deep/ .el-input__inner {
          width: 300px;
        }
      }

      .group-goods-img-box {
        display: grid;
        grid-template-columns: repeat(auto-fill, 80px);
        justify-content: space-around;
        grid-row-gap: 22px;

        .goods-img {
          width: 80px;
          height: 80px;
        }

      }
    }

    .group-goods-right-box {
      flex: 6;
      padding-left: 45px;
      padding-bottom: 30px;
      height: 100%;
      background: #fff;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: flex-start;

      .add-good-to-group-box {
        padding-top: 14px;
        width: 100%;

        .my-short-input-item {
          /deep/ .el-input--medium .el-input__inner {
            height: 34px;
            width: 300px;
          }
        }

        .my-long-input-item {
          /deep/ .el-input--medium .el-input__inner {
            height: 34px;
            width: 366px;
          }
        }

        // /deep/.el-select-dropdown__list {

        //   .add-new-option-div {
        //     cursor: pointer;
        //     display: flex;
        //     justify-content: flex-start;
        //     align-items: center;
        //     padding: 0px 12px;
        //     height: 34px;

        //     .title {
        //       font-size: 12px;
        //       font-weight: 400;
        //       color: #333333;
        //       line-height: 12px;
        //     }

        //     .my-add-img {
        //       width: 24px;
        //       height: 24px;
        //     }
        //   }
        // }
      }

      .delete-group-div {
        font-size: 12px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        font-weight: 400;
        color: #FF5967;

        span {
          cursor: pointer;
        }
      }
    }
  }
</style>
