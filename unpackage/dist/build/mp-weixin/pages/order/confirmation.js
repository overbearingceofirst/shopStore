(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/order/confirmation"],{"12e7":function(e,t,n){"use strict";var i=n("dc8a"),o=n.n(i);o.a},"2b5f":function(e,t,n){"use strict";(function(e){n("cddc"),n("921b");i(n("66fd"));var t=i(n("4c78"));function i(e){return e&&e.__esModule?e:{default:e}}e(t.default)}).call(this,n("543d")["createPage"])},"35bf":function(e,t,n){"use strict";(function(e){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n={data:function(){return{buylist:[],goodsPrice:0,sumPrice:0,freight:12,note:"",int:1200,deduction:0,recinfo:{id:1,name:"大黑哥",head:"大",tel:"18816881688",address:{region:{label:"广东省-深圳市-福田区",value:[18,2,1],cityCode:"440304"},detailed:"深南大道1111号无名摩登大厦6楼A2"},isDefault:!0}}},onShow:function(){var t=this;e.getStorage({key:"buylist",success:function(e){t.buylist=e.data,t.goodsPrice=0;for(var n=t.buylist.length,i=0;i<n;i++)t.goodsPrice=t.goodsPrice+t.buylist[i].number*t.buylist[i].price;t.deduction=t.int/100,t.sumPrice=t.goodsPrice-t.deduction+t.freight}}),e.getStorage({key:"selectAddress",success:function(n){t.recinfo=n.data,e.removeStorage({key:"selectAddress"})}})},onHide:function(){},onBackPress:function(){this.clearOrder()},filters:{toFixed:function(e){return parseFloat(e).toFixed(2)}},methods:{clearOrder:function(){var t=this;e.removeStorage({key:"buylist",success:function(e){t.buylist=[],console.log("remove buylist success")}})},toPay:function(){for(var t=this,n=[],i=[],o=this.buylist.length,r=0;r<o;r++)n.push(this.buylist[r]),i.push(this.buylist[r].id);0!=n.length?(e.showLoading({title:"正在提交订单..."}),setTimeout((function(){e.setStorage({key:"paymentOrder",data:n,success:function(){e.hideLoading(),e.redirectTo({url:"../pay/payment/payment?amount="+t.sumPrice})}})}),1e3)):e.showToast({title:"订单信息有误，请重新购买",icon:"none"})},selectAddress:function(){e.navigateTo({url:"../user/address/address?type=select"})}}};t.default=n}).call(this,n("543d")["default"])},"4c78":function(e,t,n){"use strict";n.r(t);var i=n("ea42"),o=n("84d8");for(var r in o)"default"!==r&&function(e){n.d(t,e,(function(){return o[e]}))}(r);n("12e7");var s,u=n("f0c5"),c=Object(u["a"])(o["default"],i["b"],i["c"],!1,null,null,null,!1,i["a"],s);t["default"]=c.exports},"84d8":function(e,t,n){"use strict";n.r(t);var i=n("35bf"),o=n.n(i);for(var r in i)"default"!==r&&function(e){n.d(t,e,(function(){return i[e]}))}(r);t["default"]=o.a},dc8a:function(e,t,n){},ea42:function(e,t,n){"use strict";var i,o=function(){var e=this,t=e.$createElement,n=(e._self._c,e._f("toFixed")(e.deduction)),i=e._f("toFixed")(e.goodsPrice),o=e._f("toFixed")(e.freight),r=e._f("toFixed")(e.deduction),s=e._f("toFixed")(e.sumPrice);e.$mp.data=Object.assign({},{$root:{f0:n,f1:i,f2:o,f3:r,f4:s}})},r=[];n.d(t,"b",(function(){return o})),n.d(t,"c",(function(){return r})),n.d(t,"a",(function(){return i}))}},[["2b5f","common/runtime","common/vendor"]]]);