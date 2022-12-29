<template>
  <div class="amap-page-container">
    <!-- 百度地图  -->
    <div id="bai-du-map">
      <!-- 技术支持和联系方式  -->
    </div>
    <div id="myPageTop">
      <label>请输入关键字：</label>
      <input id="tipinput" />
    </div>
  </div>
</template>

<script>
  window._AMapSecurityConfig = {
    // 设置安全密钥
    securityJsCode: '9ac444e6943626216ac1428ea09c45fa',
  }
  import AMapLoader from "@amap/amap-jsapi-loader";

  export default {
    props: {
      longitude: {//经度
        type: String,
        default: 117.136991
      },
      latitude: {//纬度
        type: String,
        default: 31.832883
      }
      // longitude: String,
      // latitude: String, //纬度
    },
    watch: {
      longitude(val) {
        if (val != undefined && val != null && val != '') {
          this.position[0] = val
          this.initMap()
        }
      },
      latitude(val) {
        if (val != undefined && val != null && val != '') {
          this.position[1] = val
          this.initMap()
        }
      }
    },
    data() {
      return {
        position: [117.136991,30.832883],
        map: null,
        mouseTool: null,
        overlays: [],
        auto: null,
        placeSearch: null,
        marker:null
      }
    },
    methods: {
      initMap() {
        // console.log("初始化this.position：",this.position)
        AMapLoader.load({
          "key": "351fa1549567026aba8fb335fe01e931", // 申请好的Web端开发者Key，首次调用 load 时必填
          "version": "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
          "plugins": ["AMap.AutoComplete", "AMap.PlaceSearch"], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
          // "plugins": [],           // 需要使用的的插件列表，如比例尺'AMap.Scale'等
        }).then((AMap) => {
          this.map = new AMap.Map('bai-du-map', {
            viewMode: "2D", //  是否为3D地图模式
            zoom: 13, // 初始化地图级别
            center: this.position, //中心点坐标  郑州
            resizeEnable: true
          });
          // 关键字查询
          // this.searchMap()
          this.auto = new AMap.AutoComplete({
            input: 'tipinput' // 搜索框的id
          });
          this.placeSearch = new AMap.PlaceSearch({
            map: this.map,
            panel: "panel", // 结果列表将在此容器中进行展示。
            // city: "010", // 兴趣点城市
            autoFitView: true, // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
            extensions: 'base' //返回基本地址信息
          });
          this.auto.on("select", this.select); //注册监听，当选中某条记录时会触发
          // 标记
          this.marker = new AMap.Marker({
            position: this.position // 基点位置
          });
          // 地图添加标记
          this.map.add(this.marker);
          // 鼠标点击获取经纬度
          var _this = this
          this.map.on('click', function(e) {
            // console.log("经度", e.lnglat.getLng())
            // console.log("纬度", e.lnglat.getLat())
            _this.position = [e.lnglat.getLng(), e.lnglat.getLat()]
            let data = {
              lng: e.lnglat.getLng(),
              lat: e.lnglat.getLat()
            };
            _this.$emit('mapDing', data);
            _this.poistionImg()
          });
        }).catch(e => {
          console.log(e);
        });
      },
      poistionImg(){
        // if(this.marker != null && this.marker != ""){
          this.map.remove(this.marker)
        // }
        this.marker = new AMap.Marker({
          position: this.position,
        });
        this.map.add(this.marker);
      },
      select(e) {
        this.position = [e.poi.location.lng, e.poi.location.lat]
        this.placeSearch.setCity(e.poi.adcode);
        this.placeSearch.search(e.poi.name); //关键字查询查询
        let data = {
          lng: e.poi.location.lng,
          lat: e.poi.location.lat
        };
        this.$emit('mapDing', data);
        this.poistionImg()
      }
    },
    mounted() {
      this.initMap();
    },
  };
</script>
<style>
  .amap-page-container {
    height: 400px;
    margin-top: 20px;
    position: relative;
    border: 1px solid #DCDFE6;
  }

  #myPageTop {
    position: absolute;
    top: 0px;
    right: 0px;
    z-index: 5;

  }
#myPageTop label{
  font-size: 12px;
  color: #333;
}
  #myPageTop input {
    outline: none;
    border: 1px solid #DCDFE6;
  }

  #bai-du-map {
    /* width: 700px; */
    height: 400px;
  }
</style>
