<template>
  <div class="app-container">
    <!-- 第二模块 类目搜索 -->
    <div class="searchSort" v-show="showSearch">
      <span>类目搜索:</span>
      <div class="input-box">
        <el-select v-model="inputKey" filterable remote reserve-keyword placeholder="请输入关键词"
          :remote-method="remoteMethod" :loading="loading" class="input-search">
          <el-option v-for="(item,index) in options" :key="JSON.stringify(item.cateId)"
            :label="item.cateName.join(' > ')" :value="item.cateId"></el-option>
        </el-select>
        <button class="btn-search" @click="position()">
          <img src="../../../public/imgs/icon_search.png" alt="">
        </button>
      </div>
    </div>
    <!-- 第三模块 三级联动 -->
    <div class="multistage-linkage">
      <div class="module-uls">
        <!-- 一级菜单 -->
        <div class="item-a">
          <ul class="item-a-ul" id="item-a">
            <li v-for="(item,index) in linkageData" :key="item.cateId"
              :class="{'selected':selectIndex.item1 == item.cateId}" @click="chooseItem1(index,item.cateId)">
              {{item.cateName}} <i class="el-icon-arrow-right"></i>
            </li>
          </ul>
        </div>

        <!-- 二级菜单 -->
        <div class="item-b">
          <ul class="item-b-ul" v-show="isShowFlag2">
            <li v-for="(item,index) in item2ChildData" :key="item.cateId"
              :class="{'selected':selectIndex.item2 == item.cateId}" @click="chooseItem2(index,item.cateId)">
              {{item.cateName}}<i class="el-icon-arrow-right"></i>
            </li>
          </ul>
        </div>
        <!-- 三级菜单 -->
        <div class="item-c">
          <ul class="item-c-ul" v-show="isShowFlag3">
            <li v-for="(item,index) in item3ChildData" :key="item.cateId"
              :class="{'selected':selectIndex.item3 == item.cateId}" @click="chooseItem3(index,item.cateId)">
              {{item.cateName}}<i class="el-icon-arrow-right"></i>
            </li>
          </ul>
        </div>
      </div>
      <div class="selectedTitle-box">
        <span>您当前选择的是：</span>
        <span class="selectedTitle">{{chooseClassify}}</span>
      </div>
      <div class="next-box" v-show="showSearch">
        <el-button type="primary" class="public-el-btn" :disabled="!isNextFlag" @click="nextStep">下一步，发布商品</el-button>
      </div>
      <!-- 协议明细 -->
      <div class="agreement-box" v-show="showSearch">
        <span>
          特别提醒用户认真阅读本《用户服务协议》(下称《协议》) 中各条款。除非您接受本《协议》条款，否则您无权使用本网站提供的相关服务。您的使用行为将视为对本《协议》的接受，并同意接受本《协议》各项条款的约束。
          一、定义
          "用户"指符合本协议所规定的条件，同意遵守本网站各种规则、条款（包括但不限于本协议），并使用本网站的个人或机构。
          "卖家"是指在本网站上出售物品的用户。"买家"是指在本网站购买物品的用户。
          "成交"指买家根据卖家所刊登的交易要求，在特定时间内提出最优的交易条件，因而取得依其提出的条件购买该交易物品的权利。
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    goodsCategoryList
  } from '@/api/goods'
  const city = require("../../../src/json/citys.json")
  export default {
    name: 'AddGoods',
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
    props: {
      showSearch: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        inputKey: '',
        selectIndex: {
          item1: '-1',
          item2: '-1',
          item3: '-1'
        },
        isNextFlag: false, //是否允许跳转下一步
        chooseClassify: "", //选中的类目 拼接
        chosedData: [{
          value: '',
          label: '',
          typeId: ''
        }, {
          value: '',
          label: '',
          typeId: ''
        }, {
          value: '',
          label: '',
          typeId: ''
        }], //选中的类目
        isShowFlag2: false, //二级菜单是否显示
        isShowFlag3: false, //三级菜单是否显示
        item2ChildData: null, //二级菜单内容
        item3ChildData: null, //三级菜单内容
        //多级联动数据
        linkageData: [],
        options: [],
        list: [],
        loading: false,
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        goodsCategoryList().then(response => {
          this.linkageData = response.data.data
          this.loadData()
        })
      },
      remoteMethod(query) {
        if (query !== '') {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            this.options = this.list.filter(item => {
              return JSON.stringify(item.cateName).toLowerCase().indexOf(query.toLowerCase()) > -1;
            });
          }, 200);
        } else {
          this.options = [];
        }
      },

      async loadData() {
        if (this.$route.query.chosedData !== undefined) {
          this.chosedData = JSON.parse(this.$route.query.chosedData)
          this.setData()
          this.position1()
        }
        for (var i = 0; i < this.linkageData.length; i++) {
          var item = {
              'cateName': [],
              'cateId': []
            },
            child2 = this.linkageData[i].children
          item.cateId.push(this.linkageData[i].cateId)
          item.cateName.push(this.linkageData[i].cateName)
          //二级
          if (child2 != null && child2.length > 0) {
            for (var j = 0; j < child2.length; j++) {
              var child3 = child2[j].children
              item.cateId.push(child2[j].cateId)
              item.cateName.push(child2[j].cateName)
              //三级
              if (child3 != null && child3.length > 0) {
                for (var k = 0; k < child3.length; k++) {
                  item.cateId.push(child3[k].cateId)
                  item.cateName.push(child3[k].cateName)
                  this.list.push(this.utils.cloneObj(item))
                  item.cateId.pop()
                  item.cateName.pop()
                }
              } else {
                this.list.push(this.utils.cloneObj(item))
              }
              item.cateId.pop()
              item.cateName.pop()
            }
          } else {
            this.list.push(this.utils.cloneObj(item))
          }
          item.cateId.pop()
          item.cateName.pop()
        }
      },
      back() {
        this.$router.back()
      },
      // 给选择的类目赋值
      setData() {
        this.chooseClassify = this.chosedData[0].label
        if (this.chosedData[1].label != '') {
          this.chooseClassify += " > " + this.chosedData[1].label
          this.isNextFlag = false
          if (this.chosedData[2].label != '') {
            this.isNextFlag = true
            this.chooseClassify += " > " + this.chosedData[2].label
          }
        } else {
          this.isNextFlag = false
        }
      },
      position() {
        for (var i = 0; i < this.linkageData.length; i++) {
          //循环一级菜单
          if (this.inputKey[0] == this.linkageData[i].cateId) {
            this.chosedData[0].value = this.inputKey[0]
            this.chosedData[0].label = this.linkageData[i].cateName
            this.selectIndex.item1 = this.inputKey[0]
            this.isShowFlag2 = "true"
            this.item2ChildData = this.linkageData[i].children
            if (i * 32 > 370) {
              document.getElementById('item-a').scrollTop = i * 32
            }
            for (var j = 0; j < this.item2ChildData.length; j++) {
              //循环二级菜单
              if (this.inputKey[1] == this.item2ChildData[j].cateId) {
                this.chosedData[1].value = this.inputKey[1]
                this.chosedData[1].label = this.item2ChildData[j].cateName
                this.selectIndex.item2 = this.inputKey[1]
                this.item3ChildData = this.item2ChildData[j].children
                if (j * 32 > 370) {
                  document.getElementById('item-b').scrollTop = j * 32
                }
                //判断三级菜单有无内容
                if (this.item3ChildData.length > 0) {
                  this.isShowFlag3 = "true"
                  if (this.inputKey.length == 3) {
                    for (var x = 0; x < this.item3ChildData.length; x++) {
                      //循环三级菜单
                      if (this.inputKey[2] == this.item3ChildData[x].cateId) {
                        this.chosedData[2].value = this.inputKey[2]
                        this.chosedData[2].label = this.item3ChildData[x].cateName
                        this.selectIndex.item3 = this.inputKey[2]
                        if (x * 32 > 370) {
                          document.getElementById('item-c').scrollTop = x * 32
                        }
                        this.setData()
                        return
                      }
                    }
                  }
                }
                this.setData()
                return
              }
            }
            return
          }
        }
      },
      // 根据传值定位三级联动菜单
      position1() {
        this.selectIndex.item1 = this.chosedData[0].value
        this.selectIndex.item2 = this.chosedData[1].value
        this.selectIndex.item3 = this.chosedData[2].value
        var a = document.getElementsByClassName("item-a")[0].offsetHeight
        //循环一级菜单
        for (var i = 0; i < this.linkageData.length; i++) {
          if (this.linkageData[i].value == this.chosedData[0].value) {
            if (i * 32 > 370) {
              document.getElementById('item-a').scrollTop = i * 32
            }
            this.item2ChildData = this.linkageData[i].children
            this.isShowFlag2 = true
            //循环二级菜单
            for (var j = 0; j < this.item2ChildData.length; j++) {
              if (this.item2ChildData[j].value == this.chosedData[1].value) {
                this.item3ChildData = this.item2ChildData[j].children
                this.isShowFlag3 = true
                if (j * 32 > 370) {
                  document.getElementById('item-b').scrollTop = j * 32
                }
                for (var x = 0; x < this.item3ChildData.length; x++) {
                  //循环三级菜单
                  if (this.chosedData[2].value == this.item3ChildData[x].value) {
                    if (x * 32 > 370) {
                      document.getElementById('item-c').scrollTop = x * 32
                    }
                    this.setData()
                    return
                  }
                }
              }
            }
            return
          }
        }

      },
      //给父组件带值（传递选择的类目）
      getData() {
        this.$emit("getCartData", JSON.stringify(this.chosedData))
      },
      //选择一级分类
      chooseItem1(val, id) {
        //将选中的一栏进行标记
        this.selectIndex.item1 = id;
        // 将二级和三级分类选中状态取消
        this.selectIndex.item2 = "-1"
        this.selectIndex.item3 = "-1"
        // 将一级分类选中的数据赋值
        this.chosedData[0].value = id
        this.chosedData[0].label = this.linkageData[val].cateName
        this.chosedData[0].typeId = this.linkageData[val].typeId
        //清空二级和三级选中的数据
        this.chosedData[1].value = ''
        this.chosedData[1].label = ''
        this.chosedData[1].typeId = ''
        this.chosedData[2].value = ''
        this.chosedData[2].label = ''
        this.chosedData[2].typeId = ''
        //调用setData方法，将选中的类目拼接成字符串
        this.setData()
        //根据一级分类动态赋值二级分类
        this.item2ChildData = this.linkageData[val].children
        //只有二级菜单有数据才会显示二级菜单
        if (this.item2ChildData != null && this.item2ChildData.length > 0) {
          this.isShowFlag2 = true
        }
        //没选择二级分类，不展示三级分类
        this.isShowFlag3 = false
        // this.getData()
      },
      //选择二级分类
      chooseItem2(val, id) {
        //将选中的一栏进行标记
        this.selectIndex.item2 = id
        // 将三级分类选中状态取消
        this.selectIndex.item3 = "-1"
        // 将二级分类选中的数据赋值
        this.chosedData[1].value = id
        this.chosedData[1].label = this.item2ChildData[val].cateName
        this.chosedData[1].typeId = this.item2ChildData[val].typeId
        //清空三级选中的数据
        this.chosedData[2].value = ''
        this.chosedData[2].label = ''
        this.chosedData[2].typeId = ''
        this.item3ChildData = this.item2ChildData[val].children
        //调用setData方法，将选中的类目拼接成字符串
        this.setData()
        //只有三级菜单有数据才会显示三级菜单
        if (this.item3ChildData != null && this.item3ChildData.length > 0) {
          this.isShowFlag3 = true
          //有三级类目，不允许跳转
          this.isNextFlag = false
        } else {
          //没有三级类目，允许跳转
          this.isNextFlag = true
          this.getData()
        }
      },
      //选择三级分类
      chooseItem3(val, id) {
        //将选中的一栏进行标记
        this.selectIndex.item3 = id;
        // 将三级分类选中的数据赋值
        this.chosedData[2].value = id
        this.chosedData[2].label = this.item3ChildData[val].cateName
        this.chosedData[2].typeId = this.item3ChildData[val].typeId
        //调用setData方法，将选中的类目拼接成字符串
        this.setData()
        this.getData()
      },
      //下一步
      nextStep() {
        if (this.isNextFlag) {
          var chosedDataString = JSON.stringify(this.chosedData)
          this.$store.dispatch('tagsView/delView', this.$route).then(({
            visitedViews
          }) => {
            this.$router.replace({
              path: 'publishGood',
              query: {
                chosedData: chosedDataString
              }
            })
          })
        }
      },
      handleChange(value) {},
      hiddenDropdown() {}
    }
  }
</script>

<style scoped lang="less">
  // 第二模块 类目搜索
  .searchSort {
    height: 74px;
    background-color: #fff;
    padding: 20px 15px;
    border-radius: 6px 6px 6px 6px;
    box-sizing: border-box;
    display: flex;
    justify-content: flex-start;
    align-items: center;

    span {
      font-size: 12px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
      font-weight: 400;
      color: #333333;
      display: inline-block;
      min-width: 60px;
    }

    .input-box {
      margin-left: 30px;
      width: 620px;
      height: 34px;
      display: flex;
      align-items: center;

      // input 输入框
      .input-search {
        width: 560px;
        height: 34px;

        /deep/ .el-input__inner {
          height: 34px !important;
          line-height: 34px;
          font-size: 12px;
        }

      }

      .btn-search {
        width: 60px;
        height: 34px;
        background: #1890FF;
        border-radius: 0px 6px 6px 0px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: none;
        margin-left: -2px;
        z-index: 1;
        outline: none;
      }
    }

    /deep/ .el-cascader {
      line-height: 0px !important;
      font-size: 12px;
    }

    /deep/.el-input__icon {
      line-height: 34px;
    }

  }


  // 第三模块 多级联动
  .multistage-linkage {
    background-color: #fff;
    margin-top: 20px;
    padding: 15px 20px 20px 20px;
    box-sizing: border-box;

    //改变滚动条样式  start
    .item-a-ul::-webkit-scrollbar,
    .item-b-ul::-webkit-scrollbar,
    .item-c-ul::-webkit-scrollbar {
      padding: 2px 0px;
      width: 2px;
    }

    .item-a-ul::-webkit-scrollbar-thumb,
    .item-b-ul::-webkit-scrollbar-thumb,
    .item-c-ul::-webkit-scrollbar-thumb {
      border-radius: 10px;
      box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      background: rgba(0, 0, 0, 0);
    }

    .item-a-ul::-webkit-scrollbar-track,
    .item-b-ul::-webkit-scrollbar-track,
    .item-c-ul::-webkit-scrollbar-track {
      box-shadow: inset 0 0 5px rgba(0, 0, 0, 0);
      border-radius: 0;
      background: rgba(0, 0, 0, 0);
    }

    //改变滚动条样式  end
    .module-uls {
      display: flex;
      justify-content: flex-start;
      height: 374px;
      // height: 170px;

      .item-a,
      .item-b,
      .item-c {
        height: 100%;
        width: 260px;
        padding: 10px 0px;
        border-radius: 10px 10px 10px 10px;
        box-sizing: border-box;
        border: 1px solid #EBEEF5;

        ul {
          height: 100%;
          overflow-y: auto;
        }

        li {
          width: 100%;
          height: 32px;
          box-sizing: border-box;
          padding: 0px 10px 0px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          font-family: Microsoft YaHei-Regular, Microsoft YaHei;
          font-weight: 400;
          color: #333333;
        }

        li:hover {
          color: #1890FF;
          background-color: #E6F7FF;
        }

        .selected {
          color: #1890FF;
          background-color: #E6F7FF;
        }
      }

      .item-b,
      .item-c {
        margin-left: 7px;

        .selected {
          border-left: 1px solid #1890FF;
        }
      }
    }

    //您当前选择的是
    .selectedTitle-box {
      margin-top: 20px;
      font-size: 12px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
      font-weight: 400;
      color: #333333;

      .selectedTitle {
        color: #1890FF;
      }
    }

    //下一步，发布商品
    .next-box {
      width: 100%;
      margin-top: 30px;
      display: flex;
      justify-content: center;
      align-items: center;

      .next-btn {
        width: 136px;
        height: 34px;
        background: #bbb;
        border-radius: 6px 6px 6px 6px;
        border: none;
        font-size: 12px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        font-weight: 400;
        color: #FFFFFF;
      }

      .next-btn-t {
        background: #1890FF;
      }
    }

    // 协议明细
    .agreement-box {
      margin-top: 40px;
      width: 100%;
      max-height: 140px;
      box-sizing: border-box;
      border-radius: 6px 6px 6px 6px;
      border: 1px solid #EBEEF5;
      padding: 7px 15px;
      overflow-y: auto;
      font-size: 12px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
      font-weight: 400;
      color: #888888;
    }

  }
</style>
