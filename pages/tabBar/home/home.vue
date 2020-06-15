<template>
	<view>
		<!-- 状态栏 -->
		<view v-if="showHeader" class="status" :style="{ position: headerPosition,top:statusTop,opacity: afterHeaderOpacity}"></view>
		<!-- 顶部导航栏 -->
		<view v-if="showHeader" class="header" :style="{ position: headerPosition,top:headerTop,opacity: afterHeaderOpacity }">
			<!-- 定位城市 -->
			<view class="addr">
				<view class="icon location"></view>
				{{ city }}
			</view>
			<!-- 搜索框 -->
			<view class="input-box">
				<input
					placeholder="默认关键字"
					placeholder-style="color:#c0c0c0;"
					@tap="toSearch()"
				/>
				<view class="icon search"></view>
			</view>
			<!-- 右侧图标按钮 -->
			<!-- <view class="icon-btn">
				<view class="icon yuyin-home"></view>
				<view class="icon tongzhi" @tap="toMsg"></view>
			</view> -->
		</view>
		<!-- 占位 -->
		<view v-if="showHeader" class="place"></view>
		<!-- 轮播图 -->
		<view class="swiper">
			<view class="swiper-box">
				<swiper circular="true" autoplay="true" @change="swiperChange">
					<swiper-item v-for="swiper in swiperList" :key="swiper.id">
						<image v-if="swiper.type === 1" :src="swiper.pic" @tap="toSwiper(swiper)"></image>
					</swiper-item>
				</swiper>
				<view class="indicator"> -->
					<view
						class="dots"
						v-for="(swiper, index) in swiperList"
						:class="[currentSwiper >= index ? 'on' : '']"
						:key="index"
					></view>
				</view>
			</view>
		</view>
		<!-- 分类列表 -->
		<view class="category-list">
			<view
				class="category"
				v-for="(row, index) in categoryList"
				:key="index"
				@tap="toCategory(row)"
			>
				<view class="img"><image :src="row.icon"></image></view>
				<view class="text">{{ row.name }}</view>
			</view>
		</view>
			<view class="gifts">
				<view class="gifts_conent">
					<view class="gifts_title">
						<view class="text1">严选好礼</view>
						<view class="text2">优质好礼严选</view>
					</view>
					<view class="gift_product">
						<view class="gift_products" v-for="(item, index) in niceGifts" :key="index" v-if="index < 3">
							<view class="product_conent" @tap="toGoods(item)">
								<view class="img">
									<image :src="item.pic" mode=""></image>
								</view>
								<view class="goods_name">{{item.name}}</view>
								<view class="integral">积分{{item.price}}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="recommend" v-for=" (item,index) in recommendList" :key="index">
				<view class="img">
					<view class="recommend_img">
						<image :src="item.chirldList[0].pic" mode=""></image>
					</view>
				</view>
				<scroll-view class="scroll-view" scroll-x="true" show-scrollba="true">
				    <view class="recommend_good" v-for="(item2, index2) in item.chirldList" :key="index2">
				    	<view class="recommend_conent" @tap="toGoods(item2)">
				    		<view class="img">
								<image :src="item2.pic" mode=""></image>
							</view>
							<view class="text1">{{item2.name}}</view>
							<view class="text2">积分{{item2.price}}</view>
				    	</view>
				    </view>
				</scroll-view>
			</view>
		<!-- </view> -->
		<!-- 商品列表 -->
		<view class="goods-list">
			<view class="title">
				发现好物
			</view>
			<view class="product-list">
				<view
					class="product"
					v-for="product in productList"
					:key="product.id"
					@tap="toGoods(product)"
				>
					<image mode="widthFix" :src="product.pic"></image>
					<view class="name">{{ product.name }}</view>
					<view class="info">
						<view class="price">积分{{ product.price }}</view>
						<!-- <view class="slogan">{{ product.slogan }}</view> -->
					</view>
				</view>
			</view>
			<view class="loading-text" v-if="last">{{ loadingText }}</view>
		</view>
	</view>
</template>

<script>
var ttt = 0;
//高德SDK
import amap from '@/common/SDK/amap-wx.js';
import request from '../../../Tool/request.js'
import addHistory from '../../../Tool/borwHistory.js'
export default {
	data() {
		return {
			showHeader:true,
			afterHeaderOpacity: 1,//不透明度
			headerPosition: 'fixed',
			headerTop:null,
			statusTop:null,
			nVueTitle:null,
			city: '北京',
			currentSwiper: 0,
			token:'',
			// 轮播图片
			swiperList: [],
			arrHistory:[],
			// 分类菜单
			categoryList: [
				{ id: 1, name: '办公', img: '/static/img/category/1.png' },
				{ id: 2, name: '家电', img: '/static/img/category/2.png' },
				{ id: 3, name: '服饰', img: '/static/img/category/3.png' },
				{ id: 4, name: '日用', img: '/static/img/category/4.png' },
				{ id: 5, name: '蔬果', img: '/static/img/category/5.png' },
				{ id: 6, name: '运动', img: '/static/img/category/6.png' },
				{ id: 7, name: '书籍', img: '/static/img/category/7.png' },
				{ id: 8, name: '文具', img: '/static/img/category/8.png' },
				{ id: 9, name: '办公', img: '/static/img/category/1.png' },
				{ id: 10, name: '家电', img: '/static/img/category/2.png' },
			],
			Promotion: [],
			niceGifts: [],
			recommendList: [
				{
					chirldList:[
					]
				}
			],
			//猜你喜欢列表
			productList: [
				{
					goods_id: 0,
					img: '/static/img/goods/p1.jpg',
					name: '商品名称商品名称商品名称商品名称商品名称',
					price: '168'
				},
				{
					goods_id: 1,
					img: '/static/img/goods/p2.jpg',
					name: '商品名称商品名称商品名称商品名称商品名称',
					price: '168'
				},
				{
					goods_id: 2,
					img: '/static/img/goods/p3.jpg',
					name: '商品名称商品名称商品名称商品名称商品名称',
					price: '168'
				},
				{
					goods_id: 3,
					img: '/static/img/goods/p4.jpg',
					name: '商品名称商品名称商品名称商品名称商品名称',
					price: '168'
				},
				{
					goods_id: 4,
					img: '/static/img/goods/p5.jpg',
					name: '商品名称商品名称商品名称商品名称商品名称',
					price: '168'
				},
				{
					goods_id: 5,
					img: '/static/img/goods/p6.jpg',
					name: '商品名称商品名称商品名称商品名称商品名称',
					price: '168'
				},
				{
					goods_id: 6,
					img: '/static/img/goods/p7.jpg',
					name: '商品名称商品名称商品名称商品名称商品名称',
					price: '168'
				},
				{
					goods_id: 7,
					img: '/static/img/goods/p8.jpg',
					name: '商品名称商品名称商品名称商品名称商品名称',
					price: '168'
				},
				{
					goods_id: 8,
					img: '/static/img/goods/p9.jpg',
					name: '商品名称商品名称商品名称商品名称商品名称',
					price: '168'
				},
				{
					goods_id: 9,
					img: '/static/img/goods/p10.jpg',
					name: '商品名称商品名称商品名称商品名称商品名称',
					price: '￥168'
				}
			],
			loadingText: '已经加载完毕了~',
			pageSize: null,
			pageNum: null,
			last: false
		};
	},
	onPageScroll(e) {
		//兼容iOS端下拉时顶部漂移
		this.headerPosition = e.scrollTop>=0?"fixed":"absolute";
		this.headerTop = e.scrollTop>=0?null:0;
		this.statusTop = e.scrollTop>=0?null:-this.statusHeight+'px';
	},
	//下拉刷新，需要自己在page.json文件中配置开启页面下拉刷新 "enablePullDownRefresh": true
	onPullDownRefresh() {
		const _that = this
		uni.showLoading({
			title:'刷新中',
			success() {
				setTimeout(() => {
					uni.hideLoading()
					uni.showToast({
						title:'刷新成功'
					})
					_that.getHomeconent()
				},3000)
			}
		})
	},
	//上拉加载，需要自己在page.json文件中配置"onReachBottomDistance"
	onReachBottom() {
		this.productRecommendation(this.pageNum)
		// uni.showToast({ title: '触发上拉加载' });
		// let len = this.productList.length;
		// if (len >= 40) {
		// 	this.loadingText = '到底了';
		// 	return false;
		// }
		// 演示,随机加入商品,生成环境请替换为ajax请求
		// let end_goods_id = this.productList[len -  1].goods_id;
		// for (let i = 1; i <= 10; i++) {
		// 	let goods_id = end_goods_id + i;
		// 	let p = {
		// 		goods_id: goods_id,
		// 		img:
		// 			'/static/img/goods/p' + (goods_id % 10 == 0 ? 10 : goods_id % 10) + '.jpg',
		// 		name: '商品名称商品名称商品名称商品名称商品名称',
		// 		price: '￥168',
		// 		slogan: '1235人付款'
		// 	};
		// 	this.productList.push(p);
		// }
	},
	onLoad() {
		// 加载数据的同时检测用户是否登录
		this.getHomeconent()
		// #ifdef APP-PLUS
		this.nVueTitle = uni.getSubNVueById('homeTitleNvue');
		this.nVueTitle.onMessage(res => {
			let type = res.data.type;
			if(type=='focus'){
				this.toSearch();
			}
		});
		this.showHeader = false;
		this.statusHeight = plus.navigator.getStatusbarHeight();
		// #endif
		this.amapPlugin = new amap.AMapWX({
			//高德地图KEY，随时失效，请务必替换为自己的KEY，参考：http://ask.dcloud.net.cn/article/35070
			key: '7c235a9ac4e25e482614c6b8eac6fd8e'
		});
		//定位地址
		this.amapPlugin.getRegeo({
			success: data => {
				this.city = data[0].regeocodeData.addressComponent.city.replace(/市/g, ''); //把"市"去掉
				// #ifdef APP-PLUS
				this.nVueTitle.postMessage({type: 'location',city:this.city});
				// #endif
			}
		});
		//开启定时器
		this.Timer();
		//加载活动专区
		this.loadPromotion();
	},
	methods: {
		//加载Promotion 并设定倒计时,,实际应用中应该是ajax加载此数据。
		loadPromotion() {
			let cutTime = new Date();
			let yy = cutTime.getFullYear(),
				mm = cutTime.getMonth() + 1,
				dd = cutTime.getDate();
			let tmpcountdown = yy + '/' + mm + '/' + dd + ' 23:59:59';
			let tmpPromotion = [
				{
					title: '整点秒杀',
					ad: '整天秒杀专区',
					img: '/static/img/s1.jpg',
					countdown: false
				},
				{
					title: '限时抢购',
					ad: '每天23点上线',
					img: '/static/img/s2.jpg',
					countdown: tmpcountdown
				} //countdown为目标时间，程序会获取当前时间倒数
			];
			//检查倒计时
			for (let i = 0; i < tmpPromotion.length; i++) {
				let row = tmpPromotion[i];
				if (row.countdown) {
					let h = '00',
						m = '00',
						s = '00';
					let currentTime = new Date();
					let cutoffTime = new Date(tmpcountdown);
					if (!(currentTime >= cutoffTime)) {
						let countTime = parseInt(
							(cutoffTime.getTime() - currentTime.getTime()) / 1000
						);
						h = parseInt(countTime / 3600);
						m = parseInt((countTime % 3600) / 60);
						s = countTime % 60;
						h = h < 10 ? '0' + h : h;
						m = m < 10 ? '0' + m : m;
						s = s < 10 ? '0' + s : s;
					}
					tmpPromotion[i].countdown = { h: h, m: m, s: s };
				}
			}
			this.Promotion = tmpPromotion;
		},
		//定时器
		Timer() {
			setInterval(() => {
				if (this.Promotion.length > 0) {
					for (let i = 0; i < this.Promotion.length; i++) {
						let row = this.Promotion[i];
						if (row.countdown) {
							if (
								!(
									row.countdown.h == 0 &&
									row.countdown.m == 0 &&
									row.countdown.s == 0
								)
							) {
								if (row.countdown.s > 0) {
									row.countdown.s--;
									row.countdown.s =
										row.countdown.s < 10
											? '0' + row.countdown.s
											: row.countdown.s;
								} else if (row.countdown.m > 0) {
									row.countdown.m--;
									row.countdown.m =
										row.countdown.m < 10
											? '0' + row.countdown.m
											: row.countdown.m;
									row.countdown.s = 59;
								} else if (row.countdown.h > 0) {
									row.countdown.h--;
									row.countdown.h =
										row.countdown.h < 10
											? '0' + row.countdown.h
											: row.countdown.h;
									row.countdown.m = 59;
									row.countdown.s = 59;
								}
								this.Promotion[i].countdown = row.countdown;
							}
						}
					}
				}
			}, 1000);
		},
		//消息列表
		toMsg(){
			uni.navigateTo({
				url:'../../msg/msg'
			})
		},
		//搜索跳转
		toSearch() {
			uni.navigateTo({
				url:'../../search/search_index'
			})
		},
		//轮播图跳转
		toSwiper(e) {
			uni.showToast({ title: e.src, icon: 'none' });
		},
		//分类跳转
		toCategory(e) {
			//uni.showToast({title: e.name,icon:"none"});
			uni.setStorageSync('catName',e.name);
			uni.navigateTo({
				url: '../../goods/goods-list/goods-list?cid='+e.id+'&name='+e.name
			});
		},
		//推荐商品跳转
		toPromotion(e) {
			uni.showToast({ title: e.title, icon: 'none' });
		},
		getHomeconent(){
			const _that = this
			let dataList = ''
			//请求严选好礼相关的信息
			request({
				url:"/mall-portal/home/content",
				method:'get',
				success:function(res){
					dataList = res.data.data
					_that.swiperList = dataList.advertiseList   //轮播图数据
					_that.niceGifts = dataList.hotProductList   //严选好礼数据
					_that.recommendList[0].chirldList = dataList.newProductList   //严选好礼下面的新商品数据
				},
				fail(res){
					uni.showToast({
						title:'网络开小差了，请稍后重试',
						icon:'none'
					})
				}
			}),
			this.productRecommendation(0)
			request({	
				url:'/mall-portal/home/productCateList/'+ 0,
				method:'get',
				success(res){
					_that.categoryList = res.data.data  //首页icon图标
				}
			})
		},
		// 发现好物请求
		productRecommendation(page){
			const _that = this
			_that.pageNum = page
			// 当pageNum为0的时候，加载
			if(_that.pageNum == 0){
				_that.last = false
				_that.pageNum = 0
				_that.productList = []
			}
			// // 最后一页就停止操作
			if(_that.last){
				return false;
			}
			uni.showLoading({  
				title: '加载中...'  
			});
			request({	
				url:'/mall-portal/home/recommendProductList?pageNum='+_that.pageNum+'&pageSize=6',
				method:'get',
				success(res){
					uni.hideLoading();
					let resData = res.data.data
					console.log(resData)
					// 假设页数为最大是，停止加载
					if(res.data.data.isLastPage == true){
						_that.last = true	
					}
					console.log(resData)
					var productListRes = null
					if(_that.pageNum == 0){
						productListRes = resData.list;
					}else{
						productListRes = _that.productList;
						productListRes = productListRes.concat(resData.list)
					}
					_that.productList = productListRes
					_that.pageNum += 1
				}
			})
		},
		//商品跳转
		toGoods(e) {
			addHistory(e)
			uni.showToast({ title: '商品' + e.id, icon: 'none' })
			uni.navigateTo({
				url: '../../goods/goods?id='+e.id
			});
		},
		//轮播图指示器
		swiperChange(event) {
			this.currentSwiper = event.detail.current;
		},
		onShareAppMessage: function (res) {
		 return {
		  // title: '弹出分享时显示的分享标题',
		  // desc: '分享页面的内容',
		  path: '/page/user?id=123' ,// 路径，传递参数到指定页面。
		 }
		},
		/* showShareMenu:function (res){
		  withShareTicket: true
		} */
	}
};
</script>
<style lang="scss">
page{position: relative;background-color: #F3F3F3;}

@font-face {
	font-family: 'HMfont-home';
	src: url('data:application/x-font-woff2;charset=utf-8;base64,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')
		format('woff2');
}

.pullDown-effects{
	position: fixed;
	//top: calc(100upx - 36vw);
	top: 0;
	z-index: 9;
	width: 100%;
	height: 36vw;
	/*  #ifdef  APP-PLUS  */
	padding-top: var(--status-bar-height);
	/*  #endif  */
	image{
		width: 100%;
		height: 36vw;
	}
}
.status {
	width: 100%;
	height: 0;
	position: fixed;
	z-index: 10;
	background-color: #fff;
	top: 0;
	/*  #ifdef  APP-PLUS  */
	height: var(--status-bar-height); //覆盖样式
	/*  #endif  */
}
.header {
	width: 92%;
	padding: 0 4%;
	height: 100upx;
	display: flex;
	align-items: center;
	position: fixed;
	top: 0;
	z-index: 10;
	background-color: #fff;

	/*  #ifdef  APP-PLUS  */
	top: var(--status-bar-height);
	/*  #endif  */

	.addr {
		width: 120upx;
		height: 60upx;
		flex-shrink: 0;
		display: flex;
		align-items: center;
		font-size: 28upx;
		.icon {
			height: 60upx;
			margin-right: 5upx;
			display: flex;
			align-items: center;
			font-size: 42upx;
			color: #ffc50a;
		}
	}
	.input-box {
		width: 100%;
		height: 60upx;
		background-color: #f5f5f5;
		border-radius: 30upx;
		position: relative;
		display: flex;
		align-items: center;
		.icon {
			display: flex;
			align-items: center;
			position: absolute;
			top: 0;
			right: 0;
			width: 60upx;
			height: 60upx;
			font-size: 34upx;
			color: #c0c0c0;
		}
		input {
			padding-left: 28upx;
			height: 28upx;
			font-size: 28upx;
		}
	}
	.icon-btn {
		width: 120upx;
		height: 60upx;
		flex-shrink: 0;
		display: flex;
		.icon {
			width: 60upx;
			height: 60upx;
			display: flex;
			justify-content: flex-end;
			align-items: center;
			font-size: 42upx;
		}
	}
}
.place {
	background-color: #ffffff;
	height: 100upx;
	/*  #ifdef  APP-PLUS  */
	margin-top: var(--status-bar-height);
	/*  #endif  */
}
.swiper {
	width: 100%;
	// margin-top: 10upx;
	display: flex;
	justify-content: center;
	.swiper-box {
		width: 100%;
		height: 40vw;
		overflow: hidden;
		// border-radius: 15upx;
		box-shadow: 0upx 8upx 25upx rgba(0, 0, 0, 0.2);
		//兼容ios，微信小程序
		position: relative;
		z-index: 1;
		swiper {
			width: 100%;
			height: 40vw;
			swiper-item {
				image {
					width: 100%;
					height: 40vw;
				}
			}
		}
		.indicator {
			position: absolute;
			bottom: 20upx;
			left: 20upx;
			background-color: rgba(255, 255, 255, 0.4);
			width: 150upx;
			height: 5upx;
			border-radius: 5upx;
			overflow: hidden;
			display: flex;
			.dots {
				width: 0upx;
				background-color: rgba(255, 255, 255, 1);
				transition: all 0.3s ease-out;
				&.on {
					width: (100%/5);
				}
			}
		}
	}
}

.category-list {
	width: 100%;
	// margin: 0 4%;
	padding: 0 0 30upx 0;
	border-bottom: solid 2upx #f6f6f6;
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
	background-color: #FFFFFF;
	.category {
		width: 20%;
		margin-top: 50upx;
		display: flex;
		flex-wrap: wrap;
		.img {
			width: 100%;
			display: flex;
			justify-content: center;
			image {
				width: 9vw;
				height: 9vw;
			}
		}
		.text {
			margin-top: 16upx;
			width: 100%;
			display: flex;
			justify-content: center;
			font-size: 24upx;
			color: #3c3c3c;
		}
	}
}
.banner {
	width: 92%;
	margin: 40upx 4%;
	image {
		width: 100%;
		height: 20vw;
		border-radius: 10vw;
		box-shadow: 0upx 5upx 25upx rgba(0, 0, 0, 0.3);
	}
}
.gifts{
	width: 94%;
	height: 400upx;
	background-color: #FFFFFF;
	margin: 0upx auto;
	margin-top: 20upx;
	border-radius: 20upx;
	.gifts_conent{
		width: 96%;
		height: 350upx;
		// background-color: #4CD964;
		margin: 0px auto;
		padding: 20upx 0px;
		.text1{
			font-weight: bold;
			font-size: 40upx;
			height: 50upx;
			line-height: 50upx;
		}
		.text2{
			line-height: 40upx;
			height: 40upx;
			font-size: 20upx;
			color: #ABABAB;
		}
		}
	.gift_product{
		width: 100%;
		height: 270upx;
		.gift_products{
			width: calc(100% / 3 - 2px);
			height: 270upx;
			font-size: 28upx;
			display: inline-block;
			float: left;
			border: 1px solid #F3F1F2;
		}
		.product_conent{
			width:70%;
			margin: 10px auto;
			.img{
				height: 150upx;
				width: 100%;
				background-color: #808080;
				image{
					width: 100%;
					height: 100%;
				}
			}
			.goods_name{
				width: 100%;
				text-overflow: ellipsis;
				white-space: nowrap;
				overflow: hidden;
				color: #FF1F1F;
				line-height: 40upx;
				height: 40upx;
				// font-weight: bold;
			}
			.integral{
				color: #FF1F1F;
				line-height: 40upx;
				height: 40upx;
				width: 100%;
				text-overflow: ellipsis;
				white-space: nowrap;
				overflow: hidden;
				// font-weight: bold;
			}
		}
	}
}
.goods-list {
	// background-color: #f4f4f4;
	.title {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100upx;
		line-height: 100upx;
		font-size: 40upx;
		font-weight: bold;
		// background-color: #FFFFFF;
		image {
			width: 30upx;
			height: 30upx;
		}
	}
	.loading-text {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 60upx;
		color: #979797;
		font-size: 24upx;
	}
	.product-list {
		width: 92%;
		padding: 0 4% 3vw 4%;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		.product {
			width: 49%;
			// border-radius: 20upx;
			background-color: #fff;
			margin: 0 0 15upx 0;
			box-shadow: 0upx 5upx 25upx rgba(0, 0, 0, 0.1);
			image {
				width: 100%;
				// border-radius: 20upx 20upx 0 0;
			}
			.name {
				width: 92%;
				padding: 10upx 4%;
				// display: -webkit-box;
				// -webkit-box-orient: vertical;
				// -webkit-line-clamp: 2;
				text-overflow: ellipsis;
				white-space: nowrap;
				text-align: justify;
				overflow: hidden;
				font-size: 30upx;
				
			}
			.info {
				display: flex;
				justify-content: space-between;
				align-items: flex-end;
				width: 92%;
				padding: 10upx 4% 10upx 4%;

				.price {
					color: #e65339;
					font-size: 30upx;
					// font-weight: 600;
				}
				.slogan {
					color: #807c87;
					font-size: 24upx;
				}
			}
		}
	}
}
.recommend{
	width: 100%;
	height: 540upx;
	margin-top: 30upx;
	// margin: 20upx 0px;
	position: relative;
	.img{
		width: 100%;
		height: 300upx;
		background-color: #FFFFFF;
		.recommend_img{
			width: 80%;
			height: 280upx;
			margin: 0px auto;
			image{
				width: 100%;
				height: 100%;
			}
		}
	}
	.scroll-view{
		white-space: nowrap;
		width: calc(100% - 20upx);
		position: absolute;
		left: 20upx;
		top: 250upx;
		background: #FFFFFF;
		.recommend_good{
			width: calc(100% / 3 - 1px);
			display: inline-block;
			height: 300upx;
			border-right:1px solid #F3F1F2;
			.recommend_conent{
				width: 90%;
				height: 260upx;
				margin: 10upx auto;
				font-size: 30upx;
				.img{
					width: 100%;
					height: 160upx;
					background: #1AAD19;
					image{
						width: 100%;
						height: 100%;
					}
				}
				.text1{
					height: 60upx;
					line-height: 60upx;
					text-overflow: ellipsis;
					white-space: nowrap;
					overflow: hidden;
					font-size: 32upx;
				}
				.text2{
					height: 40upx;
					line-height: 40upx;
					text-overflow: ellipsis;
					white-space: nowrap;
					overflow: hidden;
					color: #FF1F1F;
				}
			}
		}
	}
}
</style>
