<template>
  <div id="app">
    <h1>日期和时间点</h1>
    <h4>通过设置type属性为datetime, 即可在同一个选择器里同时进行日期和时间的选择。快捷选项的使用方法与Date Picker相同。</h4>
    <div style="display: inline-block;">
      <span>默认: </span>
      <el-date-picker v-model="val11" type="datetime" placeholder="选择日期时间"></el-date-picker>
    </div>
    <div style="display: inline-block; margin-left: 20px;">
      <span>带快捷选项: </span>
      <el-date-picker v-model="val12" type="datetime" placeholder="选择日期时间" align="right" :picker-options="po1">
      </el-date-picker>
    </div>
    <div style="display: inline-block; margin-left: 20px;">
      <span>设置默认时间: </span>
      <el-date-picker v-model="val13" type="datetime" placeholder="选择日期时间" default-time="12:00:00"></el-date-picker>
    </div>

    <h1>日期和时间范围</h1>
    <h4>设置type为datetimerange即可选择日期和时间范围。</h4>
    <div style="display: inline-block;">
      <span>默认: </span>
      <el-date-picker v-model="val21" type="datetimerange" range-separator="至" start-placeholder="开始日期"
        end-placeholder="结束日期"></el-date-picker>
    </div>
    <div style="display: inline-block; margin-left: 20px;">
      <span>带快捷选项: </span>
      <el-date-picker v-model="val22" type="datetimerange" :picker-options="po2" range-separator="至"
        start-placeholder="开始日期" end-placeholder="结束日期" align="right"></el-date-picker>
    </div>

    <h1>默认的起始与结束时刻</h1>
    <h4>使用datetimerange进行范围选择时, 在日期选择面板中选定起始与结束的日期, 默认会使用该日期的00:00:00作为起始与结束的时刻;
      通过选项default-time可以控制选中起始与结束日期时所使用的具体时刻。default-time接受一个数组, 数组每项值为字符串, 形如12:00:00, 其中第一项控制起始日期的具体时刻,
      第二项控制结束日期的具体时刻。</h4>
    <div style="display: inline-block;">
      <span>起始日期时刻为12:00:00</span>
      <el-date-picker v-model="val31" type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期"
        :default-time="['12:00:00']"></el-date-picker>
    </div>
    <div style="display: inline-block; margin-left: 20px;">
      <span>起始日期时刻为12:00:00, 结束日期时刻为08:00:00</span>
      <el-date-picker v-model="val32" type="datetimerange" align="right" start-placeholder="开始日期" end-placeholder="结束日期"
        :default-time="['12:00:00', '08:00:00']"></el-date-picker>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        val11: '',
        val12: '',
        val13: '',
        po1: {
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date())
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', date)
            }
          }]
        },
        val21: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
        val22: '',
        po2: {
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
        val31: '',
        val32: ''
      }
    }
  }
</script>
