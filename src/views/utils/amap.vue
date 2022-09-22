
 <!--     amap-manager： 地图管理对象
      vid：地图容器节点的ID
      zooms： 地图显示的缩放级别范围，在PC上，默认范围[3,18]，取值范围[3-18]；在移动设备上，默
              认范围[3-19]，取值范围[3-19]
      center： 地图中心点坐标值
      plugin：地图使用的插件
      events： 事件
 -->
 <template>
   <div class="amap-page-container">
     <!-- 搜索条件 是个对象searchOption 属性是city城市名，citylimit：false； 搜索回调函数 -->
     <el-amap-search-box
       class="search-box"
       :search-option="searchOption"
       :on-search-result="onSearchResult"
     ></el-amap-search-box>

     <el-amap
       ref="map"
       vid="amapDemo"
       :amap-manager="amapManager"
       :center="center"
       :zoom="12"
       :plugin="plugin"
       :events="events"
       class="amap-demo"
     >
       <!-- 点标记在地图上显示的位置，默认为地图中心点， -->
       <el-amap-marker
         :position="marker.position"
         :events="marker.events"
         :visible="marker.visible"
         :draggable="marker.draggable"
       ></el-amap-marker>
     </el-amap>
   </div>
 </template>
 <script>
 import VueAMap from "vue-amap";
 const amapManager = new VueAMap.AMapManager();  //获取实例中 的画布
 // let Geocoder;
 export default {
   name: "amaps",
   props: ["Nowlnglat"],   //接受父页面的经纬度
   data() {
     let self = this; //定义当前对象(data) 为 self
     return {
       amapManager,
       //搜索条件
       searchOption: {
         city: "全国",   //范围
         citylimit: false, //是否限制城市内搜索
       },
       marker: {
         //   position: [118.054927, 36.813487], //坐标
         position: [0, 0], //坐标
         events: {
           click: (e) => {
             console.log("点击maker", e);
             this.marker = null;
           },
          //点标记拖拽移动结束触发事件
           dragend: (e) => {
             console.log("---event---: dragend", e);
             this.marker.position = [e.lnglat.lng, e.lnglat.lat];
           },
         },
         visible: true,    //点标记是否可见，默认为true。
         draggable: false, //设置点标记是否可拖拽移动，默认为false。
         template: "<span>1</span>",
       },
       lng: 0, //经度
       lat: 0, //纬度
       clicklnglat:[],
       center: [0, 0],
       //el-amap绑定一个事件  （点击）获取当前位置的经纬度
       events: {
         init: (o) => {
           o.getCity((result) => {
             // console.log(result);
           });
         },
         //点击获取 当前位置的经纬度
         click: (e) => {
           // if (!!this.marker) {
             //获取点击后的经纬度
             self.lng = e.lnglat.lng;
             self.lat = e.lnglat.lat;
             self.center = [e.lnglat.lng, e.lnglat.lat];  //设置范围中心点
             self.marker.position = [self.lng, self.lat];


             //存储 点击后经纬度
             sessionStorage.setItem("maplng", self.lng);
             sessionStorage.setItem("maplat", self.lat);
             console.log("点击后", sessionStorage.getItem("maplng"));
             console.log("点击后",sessionStorage.getItem("maplat"));

           // }
           // else {
             // this.marker = {
             //   position: [e.lnglat.lng, e.lnglat.lat],
             //   events: {
             //     click: (e) => {
             //       console.log("点击maker", e);
             //       this.marker = null;
             //     },
             //     dragend: (e) => {
             //       console.log("---event---: dragend", e);
             //       this.marker.position = [e.lnglat.lng, e.lnglat.lat];
             //     },
             //   },
             //   visible: true,
             //   draggable: false,
             //   template: "<span>1</span>",
             // };
           // }
                  //Geocoder编码：根据地理名称来获得地点的经纬度
           let geocoder = new AMap.Geocoder({
             radius: 1000,
             extensions: "all",
           });
           //根据坐标获取位置  将经纬度 转换后成 地址信息 放在 输入框展示
           geocoder.getAddress(
             [e.lnglat.lng, e.lnglat.lat],
             function (status, result) {
               if (status === "complete" && result.info === "OK") {
                 document.querySelector(".search-box-wrapper input").value =
                   result.regeocode.formattedAddress;
               }
             }
           );
         },
       },
       // el-amap定位当前位置  （初始化）
       plugin: [
         {
           enableHighAccuracy: true, //是否使用高精度定位，默认:true
           timeout: 100, //超过10秒后停止定位，默认：无穷大
           maximumAge: 0, //定位结果缓存0毫秒，默认：0
           convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
           showButton: true, //显示定位按钮，默认：true
           buttonPosition: "RB", //定位按钮停靠位置，默认：'LB'，左下角
           showMarker: true, //定位成功后在定位到的位置显示点标记，默认：true
           showCircle: true, //定位成功后用圆圈表示定位精度范围，默认：true
           panToLocation: true, //定位成功后将定位到的位置作为地图中心点，默认：true
           zoomToAccuracy: true, //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认： f
           extensions: "all",
           pName: "Geolocation",
           events: {
             init(o) {
               // o是高德地图定位插件实例
             //   console.log("0", o);

               o.getCurrentPosition((status, result) => {
                 // console.log("初始化当前位置", result);
                 if (result && result.position) {

                   // 设置经度
                   self.lng = result.position.lng;
                   // 设置纬度
                   self.lat = result.position.lat;

                   //如果 Nowlnglat 经纬度有值
                        // 回显或刷新页面： 显示初始化的定位  或  点击后的定位
                   if(self.Nowlnglat[0] != null && self.Nowlnglat[1] != null){

                       console.log('Nowlnglat____',self.Nowlnglat)

                     let  Clnglat =self.Nowlnglat
                     self.center = Clnglat;
                     self.marker.position = Clnglat;

                     let geocoder = new AMap.Geocoder({
                             radius: 1000,
                             extensions: "all",
                         });
                         //根据坐标获取位置  将经纬度 转换后成 地址信息 放在 输入框展示
                         geocoder.getAddress(
                             Clnglat,
                             function (status, result) {
                             if (status === "complete" && result.info === "OK") {
                                 document.querySelector(".search-box-wrapper input").value =
                                 result.regeocode.formattedAddress;
                             }
                             }
                         );
                     // alert(123)
                     } else {
                        // 设置坐标中心点
                     self.center = [self.lng, self.lat];
                     self.marker.position = [self.lng, self.lat];
                     //存储  初始化定位
                     sessionStorage.setItem("maplng1", self.lng);
                     sessionStorage.setItem("maplat1", self.lat);
                     console.log("初始", sessionStorage.getItem("maplng1"));
                     console.log(sessionStorage.getItem("maplat1"));

                     document.querySelector(".search-box-wrapper input").value =
                     result.formattedAddress;
                   }
                   self.loaded = true;
                   self.$nextTick(); //页面渲染好后
                 }
               });
             },
           },
         },
       ],
     };
   },
   methods: {
     //搜索地址 查询结果
     onSearchResult(pois) {
       console.log(pois);
       this.marker.position = [pois[0].lng, pois[0].lat];
       this.center = [pois[0].lng, pois[0].lat];
       sessionStorage.setItem("maplng", pois[0].lng);
       sessionStorage.setItem("maplat", pois[0].lat);
     },
   },
 };
 </script>
 <style scoped lang="less">
 .map_address {
   height: 50vh;
   width: 100vh;
   // background: red;
   .amap-wrapper {
     // display: flex;
     // flex-direction: column;
     height: 100%;
     width: 100%;
     .search-box {
       width: 100%;
       // transform: translateY(-20px);
       border: 1px solid #d9d9d9;
       /deep/.search-btn {
         background: #46a6ff;
         width: 15%;
         border-radius: 5px;
       }
     }
   }
 }
 </style>
