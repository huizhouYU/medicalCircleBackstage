export default {
   //深复制对象方法
   cloneObj(obj) {
     var newObj = {};
     if (obj instanceof Array) {
       newObj = [];
     }
     for (var key in obj) {
       var val = obj[key];
       newObj[key] = typeof val === 'object' ? this.cloneObj(val) : val;
     }
     return newObj;
   }
 }
