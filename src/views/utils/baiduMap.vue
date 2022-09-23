<template>
	<!-- 地图 -->
	<div class="map bottom-content">
       <div id="school-container" style="height:100%;position: relative;"></div>
    </div>
</template>
<script>
import { asyncLoadBaiduJs, asyncLoadJs } from "@/libs/loadBMap"; //引入文件

export default{
  // var _Interval = {};
  data() {
  	return {
  		// 地图
        	// 设置中心点坐标
        	 longitude: "121.002781",
       	 latitude: "30.82561",
       	 map: null,
       	 level:14, // 地图级别
  	}
  },
  methods:{
  	//! 地图
      init() {
        this._asyncLoadBaiduJs().then(() => {
          this.initMap();  // 初始化地图
          this.getMapData();
        });
        // 获取数据
        this.getData();
      },
      initMap(){
        // 创建地图
        let map = new BMap.Map("school-container", {
          minZoom: 12,
          maxZoom: 19,
          enableMapClick: false,
        });
        let point = new BMap.Point(this.longitude, this.latitude);
        // 设置初始化地图中心点、级别
        map.centerAndZoom(point, 14);
        map.enableKeyboard(); //开启键盘操作
        map.enableDragging();
        map.enableScrollWheelZoom();  // 启动滚轮操作
        map.enableDoubleClickZoom();
        map.setMapType(BMAP_SATELLITE_MAP);  // 地图类型：卫星图...

        let that = this;
        //  定义、设置、添加 定位点的图标
        window.addMarker = (point, content) => {
          let myIcon = new BMap.Icon(
                  require("./images/grade1.png"),
                  new BMap.Size(35, 35)
              );
          let marker = new BMap.Marker(point, {icon: myIcon});
          map.addOverlay(marker);
  		// 监听定位点图标 click点击事件
          marker.addEventListener("click", async function () {
            // 取到点击点的内容 （有的需求需要次此内容作为参数去请求想要得到的数据）
            that.enterpriseInfo = content
            that.modalVisible = true;
            // 点击定位企业 详情
            let code = content.code
            let res = await request({code:code});
            if (res && res.code === 200) {
              that.data = res.content;
              // ......
            }
  		  // 定义、设置、添加 定位点被点击时的图标
            let myIcon = new BMap.Icon(
                  // require("./images/grade1-active.png"),
                  new BMap.Size(44, 45)
              );
            let marker = new BMap.Marker(point, {icon: myIcon});
            marker.setTop(true);
            that.marker = marker;
            map.addOverlay(marker);

  		  // 创建窗口内容
            let sContent = handleContent(content,otherContent);
            function handleContent(content, otherContent){
  			return `<div class='info-window' style="display:block;">${content}</div>`

  		 }
  		 // 创建信息窗口对象
              let opts = {
                // width: 320,
                // height: 490,
                title: "",
                // offset: new BMap.Size(0, -28),
                enableMessage: true,
                message: ""
              }

              // 创建信息窗口
              let infoWindow = new BMap.InfoWindow(sContent,opts)
    			//添加信息窗口覆盖物
              marker.openInfoWindow(infoWindow, point);
  			// 设置窗口出现时地图滑动
  			//let curPx = map.pointToPixel(point);
              //if (curPx.y < 571) {
              //  let a = map.pixelToPoint(new BMap.Pixel(curPx.x, 600));
              //  let d = point.lat - a.lat;
              //  let center = map.getCenter();
              //  moveCenter = new BMap.Point(center.lng, center.lat + d);
              //  if (curPx.y > 418) {
              //    clickMove = false;
              //    moveCenter && map.panTo(moveCenter);
              //    moveCenter = null;
              //  }
              //} else {
              //  clickMove = false;
              //}
              if (!infoWindow.isOpen()) {
                infoWindow.addEventListener("open", function () {
                  addEventListener();
                });
              } else {
                addEventListener();
              }
              //添加窗口中操作监听
              function addEventListener() {
                // 进入企业界面
                document .getElementById("id") .addEventListener("click", () => {
                    that.fn(content);
                  });
                document .querySelector(".class") .addEventListener("click", () => {
                    that.fn1(content);
                  });
                document .querySelector(".class1") .addEventListener("click", () => {
                    that.fn2(content);
                  });

                // 创建二维码
                document.getElementById("qrcode").innerHTML = "";
                let colorLight =
                  content.level == "4"
                    ? "#39CF3C"
                    : content.level == "3"
                    ? "#3285FF"
                    : content.level == "2"
                    ? "#FFDF00"
                    :content.level == "1"
                    ?"#ED2629"
                    :"#fff";
                 new QRCode(document.getElementById("qrcode"), {
                   text: "url",
                   width: 100,
                   height: 100,
                   colorDark: "#000000",
                   colorLight: colorLight,
                   correctLevel: QRCode.CorrectLevel.H,
                 });

              }
          });
        };

        // 拖拽结束
          map.addEventListener("dragend", () => {
            let center = that.map.getCenter();

            // console.log(center);
            that.longitude = center.lng;
            that.latitude = center.lat;
            let level = that.map.getZoom();
            that.level = level;
            that.getMapData();
          });
          // 缩放结束事件
          map.addEventListener("zoomend", () => {
            if (this.zooomSet) {
              this.zooomSet = false;
              return;
            }
            let center = that.map.getCenter();
            that.longitude = center.lng;
            that.latitude = center.lat;
            let level = that.map.getZoom();
            that.level = level;
            that.getMapData();
          });
          // 移动结束
          map.addEventListener("moveend", () => {
            if (clickMove) {
              clickMove = false;
              moveCenter && map.panTo(moveCenter);
              moveCenter = null;
            }
          });
        this.map = map;
        this.addPolyline();
      },
      async getMapData() {
        let bounds = this.map.getBounds();
        let min = bounds.getSouthWest();
        let max = bounds.getNorthEast();
        this.searchForm.minLng = min.lng;
        this.searchForm.minLat = min.lat;
        this.searchForm.maxLng = max.lng;
        this.searchForm.maxLat = max.lat;
        // this.searchForm.areaId = this.currAreaId;
        this.searchForm.mapType = this.mapType;
        // this.searchForm.level = this.map.getZoom();

        this.dataLoading = true;
        // 获取企业列表
        let res = await request(
            Object.assign(this.searchForm)
        );

        this.dataLoading = false;
        if (res && res.code === 200) {
          res.content.latitude && (this.latitude = res.content.latitude);
          res.content.longitude && (this.longitude = res.content.longitude);
          if (
              this.searchForm.longitude === "" &&
              this.searchForm.latitude === ""
          ) {
            let point = new BMap.Point(this.longitude, this.latitude);
            this.map.centerAndZoom(point, this.level);
          }
          this.map.clearOverlays();
          // 展示企业列表位置点
          let content = res.content || [];
          for (let i = 0; i < content.length; i++) {
            if (content[i].longitude != "" && content[i].latitude != "") {
              let point = new BMap.Point(
                content[i].longitude,
                content[i].latitude
              );
              const kinds = content[i].kinds || [];
              let arr = kinds.map((item) => {
                return item.kindText;
              });
              content[i].kindsText = arr.join("，");
              window.addMarker(point, content[i]);
            }
          }
        }
        this.addPolyline();
      },
      addPolyline() {
        const plPoints = [
          {
            style: "solid",
            weight: 6,
            color: "#f00",
            opacity: 0.6,
            points: ["120.520705|30.659754", "120.519627|30.659482", "120.518603|30.659047", "120.517614|30.658511", "120.517129|30.658255", "120.516635|30.657898", "120.515881|30.657331", "120.515279|30.656694", "120.514713|30.656065", "120.514443|30.655708", "120.514183|30.655374", "120.513653|30.654566", "120.513312|30.653766", "120.512979|30.65285", "120.5128|30.652042", "120.512647|30.650318", "120.512809|30.648671", "120.513464|30.646356", "120.514165|30.644065", "120.515593|30.639474", "120.518162|30.631061", "120.518719|30.626019", "120.518926|30.623471", "120.519115|30.620915", "120.519501|30.61588", "120.519699|30.61313", "120.519905|30.610729", "120.520184|30.60898", "120.520947|30.6071", "120.522295|30.604885", "120.524001|30.602981", "120.524873|30.602088", "120.525978|30.601357", "120.528358|30.600137", "120.530703|30.599337", "120.53196|30.599236", "120.533245|30.599065", "120.543189|30.59943", "120.54822|30.59971", "120.550744|30.599865", "120.553268|30.600036", "120.564362|30.600891", "120.575609|30.600836", "120.579059|30.600922", "120.581897|30.601544", "120.58452|30.602826", "120.589263|30.605926", "120.59185|30.607791", "120.594473|30.609501", "120.596737|30.611459", "120.598175|30.61379", "120.600187|30.637757", "120.600618|30.657269", "120.592569|30.671558", "120.583802|30.680006", "120.580208|30.68423", "120.566698|30.679261", "120.556781|30.676155", "120.546863|30.672304", "120.532778|30.661742", "120.520705|30.659777"]
          }
        ];
        for (var i = 0; i < plPoints.length; i++) {
          var json = plPoints[i];
          var points = [];
          for (var j = 0; j < json.points.length; j++) {
            var p1 = json.points[j].split("|")[0];
            var p2 = json.points[j].split("|")[1];
            points.push(new BMap.Point(p1, p2));
          }
          var line = new BMap.Polyline(points, {
            strokeStyle: json.style,
            strokeWeight: json.weight,
            strokeColor: json.color,
            strokeOpacity: json.opacity
          });
          this.map.addOverlay(line);
        }
      },

  }
}


</script>
