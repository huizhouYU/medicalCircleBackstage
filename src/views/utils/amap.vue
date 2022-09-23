<template>
  <div class="amap-page-container">
    <div class="input-search">
      <el-input class="inpu" placeholder="请输入你要定位的地址" v-model="address">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <el-button type="primary" @click="searchMap()">定位</el-button>
    </div>

    <el-amap vid="amap" :plugin="plugin" class="amap-demo" :center="center" :zoom="zoom" :events='events'>
      <!-- 点击显示标记 -->
      <el-amap-marker v-for="(marker, index) in markers" :key="marker.index" :position="marker.position"
        :icon="marker.icon" :title="marker.title" :events="marker.events" :visible="marker.visible"
        :draggable="marker.draggable" :vid="index"></el-amap-marker>
    </el-amap>
    <div class="dis-tan ju-cen">
    </div>
  </div>
</template>

<script>
  window._AMapSecurityConfig = {
    securityJsCode: "9ac444e6943626216ac1428ea09c45fa"
  };
  export default {
    name: "v-map",
    props: {

    },
    data() {
      let self = this;
      return {
        tishi: '',
        //从这里下去是地图有关的
        address: '', //获取的位置
        zoom: 13, // 地图缩放
        center: [122.59996, 26.197646], // 初始中心
        lng: 0, //经纬度
        lat: 0,
        loaded: false,
        // 点击显示的标记默认的定位
        markers: [],
        //  自动定位到当前位置
        plugin: [{
          timeout: 1000, //超过10秒后停止定位，默认：无穷大
          panToLocation: true, //定位成功后将定位到的位置作为地图中心点，默认：true
          zoomToAccuracy: true, //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：f
          pName: 'Geolocation',
          events: {
            init(o) {
              // o 是高德地图定位插件实例
              o.getCurrentPosition((status, result) => {
                if (result && result.position) {
                  self.address = result.formattedAddress;
                  self.lng = result.position.lng;
                  self.lat = result.position.lat;
                  self.center = [self.lng, self.lat];
                  self.markers = [{
                    position: self.center,
                  }]
                  self.loaded = true;
                  self.$nextTick();
                } else {
                  o.getCityInfo((status, result) => {
                    if (result && result.center) {
                      // self.address = result.formattedAddress;
                      self.lng = result.center[0];
                      self.lat = result.center[1];
                      self.center = result.center;
                      self.markers = [{
                        position: self.center,
                      }]
                      self.loaded = true;
                      self.$nextTick();
                    }
                  });
                }
              });
            }
          }
        }],
        // 点击地图获取当前位置并显示标记
        events: {
          click(e) {
            self.chaadd(e.lnglat)
          }
        }
      }
    },
    created() {
      console.log(this.address)
    },
    methods: {
      searchMap() {
        let that = this;
        let address = this.address;
        var geocoder = new AMap.Geocoder({
          city: "", //城市设为北京，默认：“全国”
        });
        geocoder.getLocation(address, function(status, result) {
          console.log("status", status)
          console.log("result", result)
          if (status === 'complete' && result.geocodes.length) {
            var lnglat = result.geocodes[0].location;
            that.center = [lnglat.lng, lnglat.lat]
            that.lng = lnglat.lng;
            that.lat = lnglat.lat;
            that.markers = [{
              position: that.center,
            }]
            let data = {
              lng: that.lng,
              lat: that.lat
            };
            that.$emit('mapDing', data);
          } else {
            console.log('根据地址查询位置失败');
          }
        });
      },
      chaadd(e) {
        let self = this;
        let {
          lng,
          lat
        } = e;
        self.lng = lng;
        self.lat = lat;
        self.center = [self.lng, self.lat];
        self.loaded = true;
        self.markers = [{
          position: self.center,
        }]
        var geocoder = new AMap.Geocoder({
          radius: 1000 //范围，默认：500
        });
        var marker = new AMap.Marker();

        function regeoCode() {
          var lnglat = [lng, lat]
          geocoder.getAddress(lnglat, function(status, result) {
            if (status === 'complete' && result.regeocode) {
              self.address = result.regeocode.formattedAddress;
            } else {
              console.log('根据经纬度查询地址失败')
            }
          });
        }
        regeoCode();
      },
    }
  }
</script>


<style>
  .amap-page-container {
    height: 400px;
    margin-top: 20px;
    position: relative;
  }

  .input-search {
    position: absolute;
    top: 0px;
    right: 0px;
    z-index: 5;
  }

  .inpu {
    width: calc(100% - 120px);
    margin-right: 20px;
    margin-bottom: 20px;
    margin-left: 20px;
  }

  .wan {
    margin-top: 20px;
  }
</style>
