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
    "AMap.Autocomplete",
    //输入提示插件
    "AMap.PlaceSearch",
    //POI搜索插件
    "AMap.Scale",
    //右下角缩略图插件 比例尺
    "AMap.OverView",
    //地图鹰眼插件
    "AMap.ToolBar",
    //地图工具条
    "AMap.MapType",
    //类别切换控件，实现默认图层与卫星图、实施交通图层之间切换的控制
    "AMap.PolyEditor",
    //编辑 折线多，边形
    "AMap.CircleEditor",
    //圆形编辑器插件
    "AMap.Geolocation",
    //定位控件，用来获取和展示用户主机所在的经纬度位置
    "AMap.Geocoder"
  ],
  v: '1.4.4',
  uiVersion: '1.0'
})
Vue.use(VueAMap)
//粒子背景
import VueParticles from 'vue-particles'
Vue.use(VueParticles)
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


import Utils from '../src/utils/public.js'
Vue.prototype.utils = Utils

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
// 提交以后禁用按钮一段时间，防止重复提交
Vue.directive('noMoreClick', {
  inserted(el, binding) {
    el.addEventListener('click', e => {
      el.classList.add('is-disabled')
      el.disabled = true
      setTimeout(() => {
        el.disabled = false
        el.classList.remove('is-disabled')
      }, 2000)//我这里设置的是2000毫秒也就是2秒
    })
  }
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
