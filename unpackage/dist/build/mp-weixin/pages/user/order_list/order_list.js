(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/user/order_list/order_list"],{1928:function(e,t,n){"use strict";var i,r=function(){var e=this,t=e.$createElement;e._self._c},o=[];n.d(t,"b",(function(){return r})),n.d(t,"c",(function(){return o})),n.d(t,"a",(function(){return i}))},"222f":function(e,t,n){"use strict";(function(e){n("cddc"),n("921b");i(n("66fd"));var t=i(n("edce"));function i(e){return e&&e.__esModule?e:{default:e}}e(t.default)}).call(this,n("543d")["createPage"])},"9a68":function(e,t,n){"use strict";(function(e){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n={data:function(){return{headerPosition:"fixed",headerTop:"0px",typeText:{unpaid:"等待付款",back:"等待商家发货",unreceived:"商家已发货",received:"等待用户评价",completed:"交易已完成",refunds:"商品退货处理中",cancelled:"订单已取消"},orderType:["全部","待付款","待发货","待收货","待评价","退换货"],orderList:[[{type:"unpaid",ordersn:0,goods_id:0,img:"/static/img/goods/p1.jpg",name:"商品名称商品名称商品名称商品名称商品名称",price:"168.00",payment:168,freight:12,spec:"规格:S码",numner:1},{type:"unpaid",ordersn:1,goods_id:1,img:"/static/img/goods/p2.jpg",name:"商品名称商品名称商品名称商品名称商品名称",price:"168.00",payment:168,freight:12,spec:"规格:S码",numner:1},{type:"back",ordersn:2,goods_id:1,img:"/static/img/goods/p3.jpg",name:"商品名称商品名称商品名称商品名称商品名称",price:"168.00",payment:168,freight:12,spec:"规格:S码",numner:1},{type:"unreceived",ordersn:3,goods_id:1,img:"/static/img/goods/p4.jpg",name:"商品名称商品名称商品名称商品名称商品名称",price:"168.00",payment:168,freight:12,spec:"规格:S码",numner:1},{type:"received",ordersn:4,goods_id:1,img:"/static/img/goods/p5.jpg",name:"商品名称商品名称商品名称商品名称商品名称",price:"168.00",payment:168,freight:12,spec:"规格:S码",numner:1},{type:"completed",ordersn:5,goods_id:1,img:"/static/img/goods/p6.jpg",name:"商品名称商品名称商品名称商品名称商品名称",price:"168.00",payment:168,freight:12,spec:"规格:S码",numner:1},{type:"refunds",ordersn:6,goods_id:1,img:"/static/img/goods/p5.jpg",name:"商品名称商品名称商品名称商品名称商品名称",price:"￥168",payment:168,freight:12,spec:"规格:S码",numner:1},{type:"cancelled",ordersn:7,goods_id:1,img:"/static/img/goods/p5.jpg",name:"商品名称商品名称商品名称商品名称商品名称",price:"￥168",payment:168,freight:12,spec:"规格:S码",numner:1}],[{type:"unpaid",ordersn:0,goods_id:0,img:"/static/img/goods/p1.jpg",name:"商品名称商品名称商品名称商品名称商品名称",price:"￥168",payment:168,freight:12,spec:"规格:S码",numner:1},{type:"unpaid",ordersn:1,goods_id:1,img:"/static/img/goods/p2.jpg",name:"商品名称商品名称商品名称商品名称商品名称",price:"￥168",payment:168,freight:12,spec:"规格:S码",numner:1}],[],[{type:"unreceived",ordersn:3,goods_id:1,img:"/static/img/goods/p4.jpg",name:"商品名称商品名称商品名称商品名称商品名称",price:"￥168",payment:168,freight:12,spec:"规格:S码",numner:1}],[{type:"received",ordersn:4,goods_id:1,img:"/static/img/goods/p5.jpg",name:"商品名称商品名称商品名称商品名称商品名称",price:"￥168",payment:168,freight:12,spec:"规格:S码",numner:1}],[{type:"refunds",ordersn:6,goods_id:1,img:"/static/img/goods/p5.jpg",name:"商品名称商品名称商品名称商品名称商品名称",price:"￥168",payment:168,freight:12,spec:"规格:S码",numner:1}]],list:[],tabbarIndex:0}},onLoad:function(e){console.log("option: "+JSON.stringify(e));var t=parseInt(e.tbIndex)+1;this.list=this.orderList[t],this.tabbarIndex=t},onPageScroll:function(e){},methods:{showType:function(e){this.tabbarIndex=e,this.list=this.orderList[e]},showLogistics:function(e){},remindDeliver:function(t){e.showToast({title:"已提醒商家发货"})},cancelOrder:function(t){var n=this;e.showModal({title:"取消订单",content:"确定取消此订单？",success:function(e){e.confirm?(console.log("用户点击确定"),n.doCancelOrder(t.ordersn)):e.cancel&&console.log("用户点击取消")}})},doCancelOrder:function(e){for(var t=this.orderList.length,n=0;n<t;n++){var i=this.orderList[n],r=i.length;if(r>0&&"unpaid"==i[0].type)for(var o=0;o<r;o++)if(this.orderList[n][o].ordersn==e){this.orderList[n][o].type="cancelled";break}}},toPayment:function(t){e.showLoading({title:"正在获取订单..."});var n=[];n.push(t),setTimeout((function(){e.setStorage({key:"paymentOrder",data:n,success:function(){e.hideLoading(),e.navigateTo({url:"../../pay/payment/payment?amount="+t.payment})}})}),500)}}};t.default=n}).call(this,n("543d")["default"])},a346:function(e,t,n){"use strict";n.r(t);var i=n("9a68"),r=n.n(i);for(var o in i)"default"!==o&&function(e){n.d(t,e,(function(){return i[e]}))}(o);t["default"]=r.a},cc85:function(e,t,n){},edce:function(e,t,n){"use strict";n.r(t);var i=n("1928"),r=n("a346");for(var o in r)"default"!==o&&function(e){n.d(t,e,(function(){return r[e]}))}(o);n("fa19");var s,d=n("f0c5"),a=Object(d["a"])(r["default"],i["b"],i["c"],!1,null,null,null,!1,i["a"],s);t["default"]=a.exports},fa19:function(e,t,n){"use strict";var i=n("cc85"),r=n.n(i);r.a}},[["222f","common/runtime","common/vendor"]]]);