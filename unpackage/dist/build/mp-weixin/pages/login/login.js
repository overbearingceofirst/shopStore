(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/login/login"],{"49f2":function(e,n,t){"use strict";var o,i=function(){var e=this,n=e.$createElement;e._self._c},a=[];t.d(n,"b",(function(){return i})),t.d(n,"c",(function(){return a})),t.d(n,"a",(function(){return o}))},"55ee":function(e,n,t){"use strict";(function(e){t("cddc"),t("921b");o(t("66fd"));var n=o(t("c6ee"));function o(e){return e&&e.__esModule?e:{default:e}}e(n.default)}).call(this,t("543d")["createPage"])},"61cd":function(e,n,t){"use strict";(function(e){Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var o=i(t("188a"));function i(e){return e&&e.__esModule?e:{default:e}}var a={data:function(){return{phoneNumber:"",passwd:"",isShowOauth:!1,showProvider:{weixin:!1,qq:!1,sinaweibo:!1,xiaomi:!1}}},onShow:function(){},onLoad:function(){this.getProvider()},methods:{oauthLogin:function(n){e.showLoading(),e.login({provider:n,success:function(t){console.log("success: "+JSON.stringify(t)),e.getUserInfo({provider:n,success:function(n){console.log("用户信息："+JSON.stringify(n.userInfo)),e.setStorage({key:"UserInfo",data:{username:n.userInfo.nickName,face:n.userInfo.avatarUrl,signature:"个性签名",integral:0,balance:0,envelope:0},success:function(){e.hideLoading(),e.showToast({title:"登录成功",icon:"success"}),setTimeout((function(){e.navigateBack()}),300)}})}})},fail:function(e){console.log("fail: "+JSON.stringify(e))}})},getProvider:function(){var n=this;e.getProvider({service:"oauth",success:function(e){for(var t=e.provider.length,o=0;o<t;o++)n.showProvider[e.provider[o]]=!0;0==e.provider.length&&(n.isShowOauth=!1)}})},toPage:function(n){e.hideKeyboard(),e.navigateTo({url:n})},doLogin:function(){var n=this;if(e.hideKeyboard(),!/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.phoneNumber))return e.showToast({title:"请填写正确手机号码",icon:"none"}),!1;e.showLoading({title:"提交中..."}),setTimeout((function(){var t=(0,o.default)(n.passwd);e.getStorage({key:"UserList",success:function(o){for(var i in o.data){var a=o.data[i];a.username==n.phoneNumber&&(e.hideLoading(),t==o.data[i].passwd?e.showToast({title:"登录成功",icon:"success"}):e.showToast({title:"账号或密码不正确",icon:"none"}))}},fail:function(n){e.hideLoading(),e.showToast({title:"手机号码未注册",icon:"none"})}})}),1e3)}}};n.default=a}).call(this,t("543d")["default"])},"8c62":function(e,n,t){"use strict";t.r(n);var o=t("61cd"),i=t.n(o);for(var a in o)"default"!==a&&function(e){t.d(n,e,(function(){return o[e]}))}(a);n["default"]=i.a},c6ee:function(e,n,t){"use strict";t.r(n);var o=t("49f2"),i=t("8c62");for(var a in i)"default"!==a&&function(e){t.d(n,e,(function(){return i[e]}))}(a);t("cb9d");var r,s=t("f0c5"),u=Object(s["a"])(i["default"],o["b"],o["c"],!1,null,null,null,!1,o["a"],r);n["default"]=u.exports},cb9d:function(e,n,t){"use strict";var o=t("df4d"),i=t.n(o);i.a},df4d:function(e,n,t){}},[["55ee","common/runtime","common/vendor"]]]);