<template>
	<view>
		<!-- 用户信息 -->
		<view class="user">
			<!-- 头像 -->
			<view class="left">
				<image :src="user.face" @tap="toSetting"></image>
			</view>
			<!-- 昵称,个性签名 -->
			<view class="right">
				<view class="username" @tap="toLogin">{{user.username}}</view>
				<view class="signature" @tap="toSetting">{{user.signature}}</view>
			</view>
			<view class="erweima" @tap="toSetting">
				<view class="icon xiangyou"></view>
			</view>
		</view>
		<view class="self">
			<view class="self_function" v-for="(selfs,index) in selfList" :key="selfs.title" @tap="seleGo(selfs.path)">
				<view class="title">
					<view class="number" v-if="selfs.imgUrl === ''">
						{{selfs.text}}
					</view>
					<view class="img" v-else>
						<image :src="selfs.imgUrl" mode=""></image>
					</view>
				</view>
				<view class="title1">
					{{selfs.title}}
				</view>
			</view>
		</view>
		<!-- VIP banner -->
		<view class="VIP" @tap="goVip()">
			<view class="left">
				<view class="dedge">
					开通会员享专属好礼
				</view>
				<view class="text">
					还有好礼免费相送
				</view>
			</view>
			<view class="right">
				<view class="button">
					立即开通
				</view>
			</view>
		</view>
		<!-- 订单-余额 -->
		<view class="order">
			<view class="topTitle">
				<view class="left">
					<view class="img">
						<image src="/static/img/user/order.png" mode=""></image>
					</view>
					<view class="text">
						我的订单
					</view>
				</view>
				<view class="right" @tap="toOrderList(-1)">
					查看全部订单
				</view>
			</view>
			<!-- 订单类型 -->
			<view class="list">
				<view class="box" v-for="(row,index) in orderList" :key="index" @tap="toOrderList(index)">
					<view class="img">
						<view class="icon" :class="row.icon"></view>
					</view>
					<view class="text">{{row.text}}</view>
				</view>
			</view>
		</view>
		<!-- 工具栏 -->
		<view class="toolbar">
			<!-- <view class="title">我的工具栏</view> -->
			<view class="list">
				<view class="box" v-for="(row,index) in mytoolbarList" :key="index" @tap="toPage(row.url)">
					<view class="img">
						<image :src="row.img"></image>
					</view>
					<view class="text">{{row.text}}</view>
				</view>
			</view>
		</view>
		<!-- 占位 -->
		<view class="place-bottom"></view>
	</view>
</template>
<script>

	export default {
		data() {
			return {
				isfirst:true,
				headerPosition:"fixed",
				headerTop:null,
				statusTop:null,
				showHeader:true,
				//个人信息,
				user:{
					username:'游客1002',
					face:'/static/img/face.jpg',
					signature:'点击昵称跳转登录/注册页',
					integral:0,
					balance:0,
					envelope:0
				},
				// 订单类型
				orderList:[
					{text:'待付款',icon:"fukuan"},
					{text:'待发货',icon:"fahuo"},
					{text:'待收货',icon:"shouhuo"},
					{text:'退换货',icon:"tuihuo"}
				],
				selfList: [
					{title:'我的积分',imgUrl:'',text:'0.00',path:'../../user/integralHistory/history'},
					{title:'我的收藏',imgUrl:'/static/img/user/collect.png',text:'0.00',path:'../../user/keep/keep'},
					{title:'我的足迹',imgUrl:'/static/img/user/footprint.png',text:'0.00',path:'../../user/coupon/coupon'},
				],
				// 工具栏列表
				mytoolbarList:[
					{url:'../../user/deposit/deposit',text:'积分充值',img:'/static/img/user/chongzhi.png'},
					{url:'../../user/receipt/face',text:'面对面送积分',img:'/static/img/user/mianduimian.png'},
					{url:'../../user/receipt/account',text:'输入帐号送积分',img:'/static/img/user/shuru.png'},
					{url:'../../user/openVip/vip',text:'开通会员',img:'/static/img/user/huiyuan.png'},
					{url:'../../user/keep/keep',text:'我的关注',img:'/static/img/user/guanzhu.png'},
					{url:'../../user/integralHistory/history',text:'积分收付记录',img:'/static/img/user/jifenshoufu.png'},
					{url:'../../user/address/address',text:'收货地址',img:'/static/img/user/shouhuo.png'}
					
				]
			}
		},
		//下拉刷新，需要自己在page.json文件中配置开启页面下拉刷新 "enablePullDownRefresh": true
		onPullDownRefresh() {
		    setTimeout(function () {
		        uni.stopPullDownRefresh();
		    }, 1000);
		},
		onPageScroll(e){
			//兼容iOS端下拉时顶部漂移
			this.headerPosition = e.scrollTop>=0?"fixed":"absolute";
			this.headerTop = e.scrollTop>=0?null:0;
			this.statusTop = e.scrollTop>=0?null:-this.statusHeight+'px';
		},
		onLoad() {
			this.statusHeight = 0;
			// #ifdef APP-PLUS
			this.showHeader = false;
			this.statusHeight = plus.navigator.getStatusbarHeight();
			// #endif
			console.log(getApp().globalData.userIphone)
		},
		onReady(){
			//此处，演示,每次页面初次渲染都把登录状态重置
			uni.setStorage({
				key: 'UserInfo',
				data: false,
				success: function () {
				},
				fail:function(e){
				}
			});
		},
		onShow(){
			uni.getStorage({
				key: 'UserInfo',
				success: (res)=>{
					if(!res.data){
						if(this.isfirst){
							//this.toLogin();
						}
						return ;
					}
					this.user = res.data;
				},
				fail:(e)=>{
					//this.toLogin(); 
				}
			});
		},
		methods: {
			//消息列表
			// 获取登录时用户的相关信息
			// userMessage(){
			// 	uni.getStorage({
					
			// 	})
			// },
			toMsg(){
				uni.navigateTo({
					url:'../../msg/msg'
				})
			},
			goVip(){
				uni.navigateTo({
					url:'../../user/openVip/vip'
				})
			},
			toOrderList(index){
				uni.setStorageSync('tbIndex',index);
				uni.navigateTo({url:'../../user/order_list/order_list?tbIndex='+index}) 
			},
			toSetting(){
				uni.navigateTo({
					url:'../../user/setting/setting'
				})
			},
			toMyQR(){
				uni.navigateTo({
					url:'../../user/myQR/myQR'
				})
			},
			toLogin(){
				uni.showToast({title: '请登录',icon:"none"});
				uni.navigateTo({
					url:'../../login/login'
				})
				this.isfirst = false;
			},
			isLogin(){
				//实际应用中,用户登录状态应该用token等方法去维持登录状态.
				const value = uni.getStorageSync('UserInfo');
				if (value) {
					return true;
				}
				return false
			},
			toDeposit(){
				uni.navigateTo({
					url:'../../user/deposit/deposit'
				})
			},
			toPage(url){
				if(!url){
					uni.showToast({title: '模板未包含此页面',icon:"none"});return;
				}
				uni.navigateTo({
					url:url
				})
			},
			seleGo(url) {
				if(!url){
					uni.showToast({title: '模板未包含此页面',icon:"none"});return;
				}
				uni.navigateTo({
					url:url
				})
			}
		}
	} 
</script>
<style lang="scss">
	page{position: relative;background-color: #fff;}
	.status {
		width: 100%;
		height: 0;
		position: fixed;
		z-index: 10;
		background-color: #FEE6BA;
		top: 0;
		/*  #ifdef  APP-PLUS  */
		height: var(--status-bar-height);//覆盖样式
		/*  #endif  */
		
	}
	
	.header{
		width: 92%;
		padding: 0 4%;
		height: 100upx;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		position: fixed;
		top: 0;
		z-index: 10;
		background-color: #f06c7a;
		/*  #ifdef  APP-PLUS  */
		top: var(--status-bar-height);
		/*  #endif  */
		.icon-btn{
			width: 120upx;
			height: 60upx;
			flex-shrink: 0;
			display: flex;
			.icon{
				color: #fff;
				width: 60upx;
				height: 60upx;
				display: flex;
				justify-content: flex-end;
				align-items: center;
				font-size: 42upx;
			}
		}
	}
	.place{
		background-color: #f06c7a;
		height: 100upx;
		/*  #ifdef  APP-PLUS  */
		margin-top: var(--status-bar-height);
		/*  #endif  */
	}
	.place-bottom{
		height: 100upx;
	}
	.user{
		width: 92%;
		padding: 0 4%;
		display: flex;
		align-items: center;
		// position: relative;
		background-color: #E6B87D;
		padding-bottom: 120upx;
		.left{
			width: 20vw;
			height: 20vw;
			flex-shrink: 0;
			margin-right: 20upx;
			border: solid 1upx #fff;
			border-radius: 100%;
			image{
				width: 20vw;
				height: 20vw;
				border-radius: 100%;
			}
			
		}
		.right{
			width: 100%;
			.username{
				font-size: 36upx;
				// color: #fff;
			}
			.signature{
				// color: #eee;
				font-size: 28upx;
			}
		}
		.erweima{
			flex-shrink: 0;
			width: 10vw;
			height: 10vw;
			margin-left: 5vw;
			border-radius: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			// background: linear-gradient(to left, #fbbb37 0%,#fcf0d0 105%);
			.icon{
				color: #41322B;
				font-size: 32upx;
			}
		}
	}
	.order{
		width: 84%;
		margin: 30upx 4% 30upx 4%;
		padding: 0upx 4% 20upx 4%;
		background-color: #fff;
		box-shadow: 0upx 0upx 25upx rgba(0,0,0,0.1);
		border-radius: 15upx;
		.topTitle{
			width: 100%;
			height: 80upx;
			line-height: 80upx;
			border-bottom: 1upx solid #EBEBEB;
			position: relative;
			.left>view{
				display: inline-block;
				float: left;
			}
			.left{
				.img{
					width: 40upx;
					height: 40upx;
					margin-top: 10upx;
					margin-right: 10upx;
					>image{
						width: 100%;
						height: 100%;
						background-repeat: no-repeat;
					}
				}
			}
			.right{
				position: absolute;
				right: 0upx;
			}
		}
		.list{
			display: flex;
			padding-bottom: 10upx;
			padding-top: 30upx;
			.box{
				width: 25%;
				.img{
					width: 100%;
					display: flex;
					justify-content: center;
					.icon{
						font-size: 50upx;
						color: #464646;
					}
				}
				.text{
					width: 100%;
					display: flex;
					justify-content: center;
					font-size: 28upx;
					color: #3d3d3d;
				}
			}
		}
		.balance-info{
			display: flex;
			padding: 10upx 0;
			.left{
				width: 75%;
				display: flex;
				.box{
					width: 50%;
					font-size: 28upx;
					
					.num{
						width: 100%;
						height: 50upx;
						display: flex;
						justify-content: center;
						align-items: flex-end;
						color: #f9a453;
					}
					.text{
						width: 100%;
						display: flex;
						justify-content: center;
						color: #3d3d3d;
						font-size: 28upx;
					}
				}
			}
			.right{
				border-left: solid 1upx #17e6a1;
				width: 25%;
				.box{
					
					.img{
						width: 100%;
						height: 50upx;
						display: flex;
						justify-content: center;
						align-items: flex-end;
						.icon{
							font-size: 45upx;
							color: #e78901;
						}
					}
					.text{
						width: 100%;
						display: flex;
						justify-content: center;
						font-size: 28upx;
						color: #3d3d3d;
					}
				}
			}
		}
	}
	.VIP{
		width: 84%;
		margin: 30upx auto 20upx auto;
		padding: 0upx 4%;
		height: 140upx;
		background-color: #261E13;
		box-shadow: 0upx 0upx 25upx rgba(0,0,0,0.2);
		border-radius: 15upx;
		display: flex;
		align-items: center;
		position: relative;
		>view{
			display: inline-block;
		}
		.left{
			color: #FAEBDB;
			.dedge{
				height: 50upx;
				line-height: 50upx;
				font-size: 32upx;
				font-weight: bold;
			}
			.text{
				font-size: 26upx;
				height: 40upx;
				line-height: 40upx;
			}
		}
		.right{
			position: absolute;
			right: 20upx;
			.button{
				// background: -webkit-gradient(linear,0% , 100%,from(#E4C9B5), to(#FCEFDE));
				font-size: 26upx;
				padding: 5upx 20upx;
				// background-color: #E4C9B5;
				border-radius: 30upx;
				background: linear-gradient(to right,#E4C9B5,#FCEFDE);
			}
		}
	}
	.self{
		width: 84%;
		margin: -35upx auto 20upx auto;
		padding: 10upx 4%;
		background-color: #ffffff;
		box-shadow: 0upx 0upx 25upx rgba(0,0,0,0.2);
		border-radius: 15upx;
		display: flex;
		align-items: center;
		.self_function{
			display: inline-block;
			width: calc(100% / 3);
			text-align: center;
			.title{
				width: 100%;
				height: 50upx;
				line-height: 50upx;
				.img{
					width: 40upx;
					height: 40upx;
					margin: 5upx auto;
					>image{
						width: 100%;
						height: 100%;
					}
				}
				.number{
					font-weight: bold;
					color: #FF6F0F;
				}
			}
			.title1{
				height: 60upx;
				line-height: 60upx;
			}
		}
	}
	.toolbar{
		width: 92%;
		margin: 0 4% 0 4%;
		padding: 0 0 20upx 0;
		background-color: #fff;
		box-shadow: 0upx 0upx 25upx rgba(0,0,0,0.1);
		border-radius: 15upx;
		.title{
			padding-top: 40upx;
			margin: 0 0 10upx 3%;
			font-size: 30upx;
			height: 80upx;
			display: flex;
			align-items: center;
		}
		.list{
			padding-top: 40upx;
			display: flex;
			flex-wrap: wrap;
			.box{
				width: 25%;
				margin-bottom: 30upx;
				.img{
					width: 23vw;
					height: 10.5vw;
					display: flex;
					justify-content: center;
					
					image{
						width: 7vw;
						height: 7vw;
					}
				}
				.text{
					width: 100%;
					display: flex;
					justify-content: center;
					font-size: 24upx;
					color: #3d3d3d;
				}
			}
		}
	}
</style>
