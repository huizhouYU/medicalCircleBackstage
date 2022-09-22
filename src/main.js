import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets
import '@icon-park/vue/styles/index.css'//使用iconPark图标引入样式

import Element from 'element-ui'
import './styles/element-variables.scss'
// import enLang from 'element-ui/lib/locale/lang/en'// 如果使用中文语言包请默认支持，无需额外引入，请删除该依赖

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // global filters
import VueAMap from 'vue-amap'


VueAMap.initAMapApiLoader({
  key: '351fa1549567026aba8fb335fe01e931',
  plugin: [
    'AMap.Geolocation',  //定位空间，用来获取和展示用户主机所在的经纬度位置
    ' AMap.Autocomplete ',  //输入提示插件
    ' AMap.PlaceSearch ', //POI搜索插件
    ' AMap.Scale ',   //右下角缩略图插件，比例尺
    ' AMap.OverView ', //地图鹰眼插件
    ' AMap.ToolBar ',  //地图工具条
    ' AMap.MapType ',  //类别切换空间，实现默认图层与卫星图，实施交通层之间切换的控制
    ' AMap.PolyEditor ', //编辑 折线多边形
    ' AMap.CircleEditor ',
    ' AMap.Geocoder'      //地图编码
  ],
  v: '1.4.4'
})
Vue.use(VueAMap)

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  // locale: enLang // 如果使用中文，无需设置，请删除
})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
