<template>
	<view>
		<!-- 底部菜单 -->
		<view class="footer">
			<view class="icons">
				<view class="box" @tap="toChat">
					<view class="icon kefu"></view>
					<view class="text">客服</view>
				</view>
				<view class="box" @tap="share">
					<view class="icon cart"></view>
					<view class="text">店铺</view>
				</view>
				<view class="box" @tap="goCart">
					<view class="icon cart"></view>
					<view class="text">购物车</view>
				</view>
			</view>
			<view class="btn">
				<view class="joinCart" @tap="joinCart">加入购物车</view>
				<view class="buy" @tap="buy">立即购买</view>
			</view>
		</view>
		<view class="shortcut">
			<view class="text" v-if="shortcut" @tap="shortcut = !shortcut">
				快捷导航
			</view>
			<view class="close" v-else @tap="shortcut = !shortcut">
				X
			</view>
		</view>
		<view class="function" v-if="!shortcut">
			<view class="icon" :class="[isKeep?'shoucangsel':'shoucang']" @tap="keep"></view>
			<view v-for="(item,index) in fundata" :key='item.id' @tap="shortcuts(item.path)">
				<image :src=item.img mode=""></image>
			</view>
		</view>
		<!-- share弹窗 -->
		<!-- <view class="share" :class="shareClass" @touchmove.stop.prevent="discard" @tap="hideShare">
			<view class="mask"></view>
			<view class="layer" @tap.stop="discard">
				<view class="h1">分享</view>
				<view class="list">
					<view class="box">
						<image src="../../static/img/share/wx.png"></image>
						<view class="title">
							微信好友
						</view>
					</view>
					<view class="box">
						<image src="../../static/img/share/pyq.png"></image>
						<view class="title">
							朋友圈
						</view>
					</view>
					<view class="box">
						<image src="../../static/img/share/wb.png"></image>
						<view class="title">
							新浪微博
						</view>
					</view>
					<view class="box">
						<image src="../../static/img/share/qq.png"></image>
						<view class="title">
							QQ
						</view>
					</view>
				</view>
				<view class="btn" @tap="hideShare">
					取消
				</view>
			</view>
			
		</view> -->
		<!-- 服务-模态层弹窗 -->
		<view class="popup service" :class="serviceClass" @touchmove.stop.prevent="discard" @tap="hideService">
			<!-- 遮罩层 -->
			<view class="mask"></view>
			<view class="layer" @tap.stop="discard">
				<view class="content">
					<view class="row" v-for="(item,index) in goodsData.service" :key="index">
						<view class="title">{{item.name}}</view>
						<view class="description">{{item.description}}</view>
					</view>
				</view>
				<view class="btn"><view class="button" @tap="hideService">确定</view></view>
			</view>
		</view>
		<!-- 规格-模态层弹窗 -->
		<view class="popup spec" :class="specClass" @touchmove.stop.prevent="discard" @tap="hideGg">
			<!-- 遮罩层 -->
			<view class="mask"></view>
			<view class="layer" @tap.stop="discard">
				<view class="content" style="padding: 0upx;">
					<view class="specStyle">
						<view class="picSKU">
							<img :src= "designateProduct.picSKU == undefined ? mastPic : designateProduct.picSKU" alt="" style="width: 100%;height: 100%;">
						</view>
						<view class="specs">
							<view class="price">￥{{designateProduct.price == undefined ? scopePrice :designateProduct.price}}</view>
							<view class="spec">已选规格:<span v-for="(item,index) in selectArr" :key="index" style="margin-left: 20upx;">{{item}}</span></view>
							<view class="num">库存:{{stock == '' ? goodsData.stock : stock}}件</view>
						</view>
					</view>
					<view class="" v-for="(item, index) in goodsData1.spec" :key="index">
						<view class="" style="width: 100%;height: 60upx;line-height: 60upx;" >
							{{item.title}}
						</view>
						<view class="sp">
							<view v-for="(item1,index1) in item.arr" :class="[index+'-'+index1==selectSpec?'on':'']" @tap="setSelectSpec(index,index1,item.arr)" :key="index">{{item1}}</view>
						</view> 
					</view>
					<view class="length" v-if="selectSpec!=null">
						<view class="text">数量</view>
						<view class="number">
							<view class="sub" @tap.stop="sub">
								<view class="icon jian"></view>
							</view>
							<view class="input" @tap.stop="discard">
								<input type="number" v-model="amount" />
							</view>
							<view class="add"  @tap.stop="add">
								<view class="icon jia"></view>
							</view>
						</view>
					</view>
				</view>
				<view class="btn"><view class="button" @tap="hideSpec()">{{joinTitle}}</view></view>
			</view>
		</view>
		<!-- // 参数 -->
		<view class="popup spec" :class="parameterClass" @touchmove.stop.prevent="discard" @tap="parameterHide">
			<!-- 遮罩层 -->
			<view class="mask"></view>
			<view class="layer" @tap.stop="discard">
				<view class="content">
					<view class="pc">
						<view class="title5">商品参数</view>
						<view v-for="(item,index) in goodsData1.parameter" class="message" :class="[index==selectSpec?'on':'']" :key="index">
							<view class="name">{{item.name}}:</view>
							<view class="value">{{item.value}}</view>
						</view>
					</view>
				</view>
				<view class="btn"><view class="button" @tap="parameterHide">确定</view></view>
			</view>
		</view>
		<!-- <view class="place"></view> -->
		<!-- 商品主图轮播 -->
		<view class="swiper-box">
			<swiper circular="true" autoplay="true" @change="swiperChange">
				<swiper-item v-for="(swiper,index) in swiperList" :key="index">
					<image :src="swiper.src"></image>
				</swiper-item>
			</swiper>
			<view class="indicator">{{currentSwiper+1}}/{{swiperList.length}}</view>
		</view>
		<!-- 标题 价格 -->
		<view class="info-box goods-info">
			<view class="title">
				<view class="title1">{{goodsData.name}}</view>
				<view class="share_icon" @tap="share">
					<view class="icon fenxiang"></view>
					<view class="text" >
						<button class="btn" open-type="share">分享</button>
					</view>
				</view>
				<view class="price">￥{{goodsData.price != undefiend ? goodsData.price : '暂无数据'}}</view>
				<view class="other">
					<!-- <view>快递:0~60</view> -->
					<view>库存:{{goodsData.stock != undefiend ? goodsData.stock : '暂无数据'}}</view>
					<view>销量:{{goodsData.sale != undefiend ? goodsData.sale: '暂无数据'}}{{ goodsData.unit != undefiend ? goodsData.unit : '暂无数据'}}</view>
				</view>
			</view>
		</view>
		<!-- 服务-规则选择 -->
		<view class="info-box spec">
			<view class="row" @tap="showService">
				<view class="text">服务</view>
				<view class="content"><view class="serviceitem" v-for="(item,index) in goodsData.serviceIds" :key="index">{{item}}</view></view>
				<view class="arrow"><view class="icon xiangyou"></view></view>
			</view>
			<view class="row" @tap="showSpec(false)">
				<view class="text">规格</view>
				<view class="content">
					<view></view>
					<view class="sp">
						<view v-for="(item,index) in  goodsData1.spec" :key="index" :class="[index==selectSpec?'on':'']">{{item.title}}</view>
					</view>
					
				</view>
				<view class="arrow"><view class="icon xiangyou"></view></view>
			</view>
			<view class="row" @tap="showParameter()">
				<view class="text">参数</view>
				<view class="content">
					<view></view>
					<view class="sp">
						<view v-for="(item,index) in goodsData1.parameter" :key="index" v-if="index < 3" :class="[index==selectSpec?'on':'']">{{item.name}}</view>...
					</view>
				</view>
				<view class="arrow"><view class="icon xiangyou"></view></view>
			</view>
		</view>
		<!-- 评价 -->
		<view class="info-box comments" id="comments">
			<view class="row">
				<view class="text">商品评价({{comment.number}})</view>
				<view class="arrow" @tap="toRatings">
					<view class="show" @tap="showComments(goodsData.id)">
						查看全部
						<view class="icon xiangyou"></view>
					</view>
				</view>
			</view>
			<view class="comment" @tap="toRatings">
				<view class="user-info">
					<!-- <view class="face"><image :src="goodsData.comment.userface"></image></view> -->
					<view class="username">{{comment.username}}</view>
				</view>
				<view class="content">
					{{comment.content}}
				</view>
			</view>
		</view>
		<!-- 详情 -->
		<view class="description">
			<view class="title">———— 商品详情 ————</view>
			<view class="content"><rich-text :nodes="goodsData.detailMobileHtml"></rich-text></view>
		</view>
	</view>
</template>
<script type="text/javascript" src="http://at.alicdn.com/t/font_kpdcqplvwqwr8uxr.js"></script>
<script>
import request from '../../Tool/request.js'
export default {
	data() {
		return {
			//控制渐变标题栏的参数
			beforeHeaderzIndex: 11,//层级
			afterHeaderzIndex: 10,//层级
			beforeHeaderOpacity: 1,//不透明度
			afterHeaderOpacity: 0,//不透明度
			shortcut:true,//快捷导航功能按键显示
			userInfo:'',
			joinTitle:'',
			scopePrice:'',
			selectArr:[],//存放选择的值
			//是否显示返回按钮
			// #ifndef MP
			showBack:false,
			// #endif
			//轮播主图数据
			swiperList: [],
			fundata:[{id:2,img:'../../static/img/icon/man.png',path:'../tabBar/user/user'},{id:3,img:'../../static/img/icon/h.png',path:'../tabBar/home/home'}],
			//轮播图下标
			currentSwiper: 0,
			anchorlist:[],//导航条锚点
			selectAnchor:0,//选中锚点
			serviceClass: '',//服务弹窗css类，控制开关动画
			specClass: '',//规格弹窗css类，控制开关动画
			shareClass:'',//分享弹窗css类，控制开关动画
			parameterClass:'',//参数
			setselectAtt:[],//遍历有多少个选择的参数
			selectAll:[],
			selectAlls:[],
			amount:'1',//商品数量
			// 商品信息
			goodsData1:{
				parameter:'',
			},
			designateProduct:'',
			specList:'',
			specification:[],
			goodsData:{},
			comment:{
				number:102,
				userface:'../../static/img/face.jpg',
				username:'大黑哥',
				content:'很不错，之前买了很多次了，很好看，能放很久，和图片色差不大，值得购买！'
			},
			selectSpec:null,//选中规格
			isKeep:'',//收藏
			mastPic:'',//商品主图
			stock:'',
			changeId:''
		};
	},
	onLoad(option) {
		// this.fundata[0].img = this.isKeep1
		this.getUsermsg()
		// 请求上级页面传送过来的id的商品详情
		this.getDetail(option.id)
		this.changeId = option.Pid
		setTimeout(() => {
			this.isCollection(option.id)
			if(option.spec && option.stock){
				var arr = option.spec.split(",")
				for(var i=0;i<arr.length;i++){
					this.selectArr[i] = arr[i]
				}
				this.stock = parseInt(option.stock)
				this.specClass = 'show'
				this.joinTitle = '修改规格'
			}
		},500)
		// // #ifdef MP
		// //小程序隐藏返回按钮
		// this.showBack = false;
		// wx.setNavigationBarTitle({
		// 	title:'商品详情'
		// })
		// console.log(option)
		// // #endif
		// //option为object类型，会序列化上个页面传递的参数
		// console.log(option); //打印出上个页面传递的参数。
	},
	onReady(){
		this.calcAnchor();//计算锚点高度，页面数据是ajax加载时，请把此行放在数据渲染完成事件中执行以保证高度计算正确
	},
	onPageScroll(e) {
		//锚点切换
		// this.selectAnchor = e.scrollTop>=this.anchorlist[2].top?2:e.scrollTop>=this.anchorlist[1].top?1:0;
		// //导航栏渐变
		// let tmpY = 375;
		// e.scrollTop = e.scrollTop > tmpY ? 375 : e.scrollTop;
		// this.afterHeaderOpacity = e.scrollTop * (1 / tmpY);
		// this.beforeHeaderOpacity = 1 - this.afterHeaderOpacity;
		// //切换层级
		// this.beforeHeaderzIndex = e.scrollTop > 0 ? 10 : 11;
		// this.afterHeaderzIndex = e.scrollTop > 0 ? 11 : 10;
	},
	//上拉加载，需要自己在page.json文件中配置"onReachBottomDistance"
	onReachBottom() {
		// uni.showToast({ title: '触发上拉加载' });
	},
	mounted () {
		
	},
	methods: {
		//轮播图指示器
		swiperChange(event) {
			this.currentSwiper = event.detail.current;
		},
		shortcuts(p){
			const path = p
			uni.switchTab({
				url:path
			})
		},
		//消息列表
		toMsg(){
			uni.navigateTo({
				url:'../msg/msg'
			})
		},
		// 客服
		toChat(){
			uni.navigateTo({
				url:"../msg/chat/chat?name=客服008"
			})
		},
		goCart(){
			uni.switchTab({
				url:'../tabBar/cart/cart'
			})
		},
		// 分享
		share(){
			this.shareClass = 'show';
			// onShareAppMessage: function (res) {
			//  return {
			//   title: '弹出分享时显示的分享标题',
			//   // desc: '分享页面的内容',
			//   path: '/page/user?id=123' ,// 路径，传递参数到指定页面。
			//  }
			// }
		},
		onShareAppMessage: function (res) {
		 return {
		  title: '弹出分享时显示的分享标题',
		  // desc: '分享页面的内容',
		  path: '/page/user?id=123'
		 }
		},
		hideShare(){
			this.shareClass = 'hide';
			setTimeout(() => {
				this.shareClass = 'none';
			}, 150);
		},
		
		//收藏
		keep(){
			var time = (new Date()).valueOf();
			const _that = this
			if(this.isKeep == false){
				// 添加商品收藏
				request({
					url:'/mall-portal/member/collection/addProduct',
					method:'POST',
					data:{
						id:_that.goodsData.id,
						memberId:_that.userInfo.id,
						memberNickname: _that.userInfo.nickname,
						memberIcon: _that.goodsData.picSKU,
						productId:_that.goodsData.id,
						productName:_that.goodsData.name,
						productPic:_that.mastPic,
						productSubTitle:_that.goodsData.subTitle,
						productPrice:_that.goodsData.price,
						createTime: time,
					},
					success(res){
						_that.isKeep = _that.isKeep?false:true;
						setTimeout(() =>{
							uni.showToast({
								title:'收藏商品成功',
								icon:'success'
							})
						},300)
					},
				})
			}else if(this.isKeep == true){
				// 取消商品收藏
				request({
					url:`/mall-portal/member/collection/deleteProduct?memberId=${_that.userInfo.id}&productId=${_that.goodsData.id}`,
					method:'POST',
					success(res){
						console.log(res)
						_that.isKeep = _that.isKeep?false:true;
						setTimeout(() =>{
							uni.showToast({
								title:'取消收藏',
								icon:'none'
							})
						},300)
					},
				})
			}
		},
		// 加入购物车
		joinCart(){
			this.specClass = 'show'
			this.joinTitle = '加入购物车'
		},
		//立即购买
		buy(){
			if(this.selectSpec==null){
				return this.showSpec(()=>{
					this.toConfirmation();
				});
			}
			this.toConfirmation();
		},
		//商品评论
		toRatings(){
			uni.navigateTo({
				url:'ratings/ratings'
			})
		},
		//跳转确认订单页面
		toConfirmation(){
			let tmpList=[];
			let goods = {id:this.goodsData.id,img:'../../static/img/goods/p1.jpg',name:this.goodsData.name,spec:'规格:'+this.goodsData.spec[this.selectSpec],price:this.goodsData.price,number:this.goodsData.number};
			tmpList.push(goods);
			uni.setStorage({
				key:'buylist',
				data:tmpList,
				success: () => {
					uni.navigateTo({
						url:'../order/confirmation'
					})
				}
			})
		},
		//跳转评论列表
		showComments(goodsid){
			
		},
		//选择规格
		setSelectSpec(index,index1,item1){
			this.selectSpec = index+'-'+index1;
			// 设置规格
			this.$set(this.selectArr, index, item1[index1]);
			// 将请求回来的所有规格组合存放在一个数组里面
			for (var y of this.specList) {
				var allSpec = JSON.parse(y.spData)
				var array = []
				allSpec.forEach((item,index) => {
				array.push(item.value)
				})
				if(this.selectAlls.toString().indexOf(array.toString()) === -1){
					this.selectAlls.push(array)
				}
			}
			console.log(this.selectArr)
			// 所选规格和所有规格进行匹配
			for(var k=0;k<this.selectAlls.length;k++){
				if(this.selectAlls[k].toString() === this.selectArr.toString()){
					this.designateProduct =  this.specList[k]
					this.stock = this.designateProduct.stock
				}
			}
		},
		//减少数量
		sub(){
			if(this.amount<=1){
				uni.showToast({
					title:"对不起商品数量不可以少于1件",
					icon:'none'
				})
				return;
			}
			this.amount--;
		},
		//增加数量
		add(){
			if(this.amount >= this.designateProduct.stock){
				uni.showToast({
					title:"对不起商品数量不可以大于库存量",
					icon:'none'
				})
				return;
			}
			this.amount++;
		},
		//跳转锚点
		toAnchor(index){
			this.selectAnchor = index;
			uni.pageScrollTo({scrollTop: this.anchorlist[index].top,duration: 200});
		},
		//计算锚点高度
		calcAnchor(){
			this.anchorlist=[
				{name:'主图',top:0},
				{name:'评价',top:0},
				{name:'详情',top:0}
			]
			let commentsView = uni.createSelectorQuery().select("#comments");
			commentsView.boundingClientRect((data) => {
				let statusbarHeight = 0;
				//APP内还要计算状态栏高度
				// #ifdef APP-PLUS
					statusbarHeight = plus.navigator.getStatusbarHeight()
				// #endif
				let headerHeight = uni.upx2px(100);
				this.anchorlist[1].top = data.top - headerHeight - statusbarHeight;
				this.anchorlist[2].top = data.bottom - headerHeight - statusbarHeight;
				
			}).exec();
		},
		//返回上一页
		back() {
			uni.navigateBack();
		},
		//服务弹窗
		showService() {
			console.log('show');
			this.serviceClass = 'show';
		},
		//关闭服务弹窗
		hideService() {
			this.serviceClass = 'hide';
			setTimeout(() => {
				this.serviceClass = 'none';
			}, 200);
		},
		//规格弹窗
		showSpec(fun) {
			console.log('show');
			this.specClass = 'show';
			this.specCallback = fun;
		},
		specCallback(){
			return;
		},
		//关闭规格弹窗
		hideGg(){
			this.specClass = 'hide';
			this.selectSpec&&this.specCallback&&this.specCallback();
			this.specCallback = false;
			setTimeout(() => {
				this.specClass = 'none';
			}, 200);
		},
		hideSpec() {
			const _that = this
			//回调
			if(this.joinTitle === '加入购物车'){
				if(this.designateProduct === ''){
					uni.showToast({
						title:"请选择规格后再加入到购物车",
						icon:'none'
					})
					return
				}
				request({
					url:'/mall-portal/cart/add',
					method:'POST',
					data:{
						"productId":_that.designateProduct.id,
						 "productSkuId":_that.designateProduct.skuId,
						 "quantity":_that.amount,
						 "price":_that.designateProduct.price,
						 "productPic":_that.designateProduct.picSKU == undefined ? '' :_that.designateProduct.picSKU,
						 "productName":_that.designateProduct.name,
						 "productSubTitle":_that.designateProduct.subTitle,
						 "productSkuCode":_that.designateProduct.skuCode,
						 "productCategoryId":_that.designateProduct.productCategoryId,
						 "productBrand":_that.designateProduct.brandName,
						 "productSn":_that.designateProduct.productSn,
						 "productAttr":_that.designateProduct.spData
					},
					success(res){
						uni.showLoading({
							title:'提交中'
						})
						setTimeout(() => {
							console.log(_that.designateProduct)
							uni.hideLoading()
							uni.showToast({
								title:'加入购物车成功',
								icon:'none'
							})
							_that.specClass = 'hide';
							_that.amount = 1,
							_that.selectArr = []
							_that.selectSpec = ''
						},2000)
					},
					fail(){
						uni.showToast({
							title:'对不起添加失败，请稍后重试',
							icon:'none'
						})
						_that.specClass = 'hide';
					}
				})
			}else if(this.joinTitle === '修改规格'){
				request({
					url:'/mall-portal/cart/update/attr',
					method:'POST',
					data:{
						'id':_that.changeId,
						"productId":_that.designateProduct.id,
						 "productSkuId":_that.designateProduct.skuId,
						 "quantity":_that.amount,
						 "price":_that.designateProduct.price,
						 "productPic":_that.designateProduct.picSKU == undefined ? '' :_that.designateProduct.picSKU,
						 "productName":_that.designateProduct.name,
						 "productSubTitle":_that.designateProduct.subTitle,
						 "productSkuCode":_that.designateProduct.skuCode,
						 "productCategoryId":_that.designateProduct.productCategoryId,
						 "productBrand":_that.designateProduct.brandName,
						 "productSn":_that.designateProduct.productSn,
						 "productAttr":_that.designateProduct.spData
					},
					success(res){
						uni.showLoading({
							title:'提交中'
						})
						setTimeout(() => {
							console.log(_that.designateProduct)
							uni.hideLoading()
							uni.showToast({
								title:'修改规格成功正在为您跳转至之前页面',
								icon:'none',
								success() {
									setTimeout(() =>{
										uni.navigateBack({
											delta: -1
										})
									},1000)
								}
							})
							_that.specClass = 'hide';
							_that.amount = 1,
							_that.selectArr = []
							_that.selectSpec = ''
						},2000)
					}
				})
			}
			// this.selectSpec&&this.specCallback&&this.specCallback();
			// this.specCallback = false;
			// setTimeout(() => {
			// 	this.specClass = 'none';
			// }, 200);
		},
		// 判断收藏列表中是否存在本商品的id
		isCollection(id){
			const _that = this
			const collectionId = id
			request({
				url:'/mall-portal/member/collection/listProduct/'+_that.userInfo.id,
				method:'GET',
				success(res){
					const dataList = res.data.data
					for (let y of dataList) {
						if(parseInt(y.productId) == collectionId){
							_that.isKeep = true
						}else{
							_that.isKeep = false
						}
					}
				}
			})
		},
		showParameter(fun) {
			this.parameterClass = 'show';
			this.specCallback = fun;
		},
		parameterHide(){
			this.parameterClass = 'hide';
			//回调
			this.selectSpec&&this.specCallback&&this.specCallback();
			this.specCallback = false;
			setTimeout(() => {
				this.parameterClass = 'none';
			}, 200);
		},
		discard() {
			//丢弃
		},
		//获取本地的个人信息
		getUsermsg(){
			const _that = this
			uni.getStorage({
				key:'userMessage',
				success(res){
					_that.userInfo = res.data
				}
			})
		},
		getDetail(id){
			const _that = this
			const Pid = id
			request({
				url:'/mall-portal/portalproducts/selectdetails/' + Pid,
				method:'POST',
				success(res){
					let data = res.data.data
					console.log(data)
					// 参数设置
					_that.goodsData1.parameter = data.parameter
					// 轮播图设置
					const imgs = data.picMap.albumPics.split(',')
					const spData = data.productResult
					_that.scopePrice = spData[0].price + '-'+ spData[spData.length - 1].price
					var newImg = []
					var spName = []
					var spValue = []
					const firstP = JSON.parse(data.productResult[0].spData)
					_that.specList = data.productResult
					_that.goodsData = data.productResult[0]
					// 服务参数
					_that.goodsData.serviceIds = data.productResult[0].serviceIds.split(',')
					// console.log(_that.goodsData)
					// 轮播图
					for (let i of imgs) { newImg.push({src:i}) }
					_that.mastPic = data.picMap.pic
					newImg.unshift({src:data.picMap.pic})
					_that.swiperList = newImg
					// 商品标题相关数据
					for (let i of firstP) {
						var sN = new Object()
						sN.title = i.key
						sN.arr = []
						spName.push(sN)
						// 获取所有商品的规格属性
						for (let g of spData) {
							const keys = JSON.parse(g.spData)
							for (let y of keys) {
								if(y.key === sN.title){
									if(sN.arr.indexOf(y.value)=== -1){
										sN.arr.push(y.value)
									}
								}
							}
						}
					}
					_that.goodsData1.spec = spName
					_that.goodsData1.spec.map(item => {
						_that.selectArr.push('');
					});
				},
				fail(){
					uni.showToast({
						title:'对不起网络开小差了，请稍后重试',
						icon:'none'
					})
				}
			})
		}
	}
};
</script>

<style lang="scss">
page {
	background-color: #f8f8f8;
}
@keyframes showPopup {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
	@keyframes hidePopup {
		0% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}
	@keyframes showLayer {
		0% {
			transform: translateY(0);
		}
		100% {
			transform: translateY(-100%);
		}
	}
	@keyframes hideLayer {
		0% {
			transform: translateY(-100%);
		}
		100% {
			transform: translateY(0);
		}
	}

.icon {
	font-size: 26upx;
}
.status {
	width: 100%;
	height: 0;
	position: fixed;
	z-index: 10;
	top: 0;
	/*  #ifdef  APP-PLUS  */
	height: var(--status-bar-height); //覆盖样式
	/*  #endif  */
	background-color: #f1f1f1;
	transition: opacity 0.05s linear;
}
.header {
	width: 100%;
	color: #2C405A;
	height: 100upx;
	display: flex;
	align-items: center;
	position: fixed;
	top: 0;
	z-index: 10;
	/*  #ifdef  APP-PLUS  */
	top: var(--status-bar-height);
	/*  #endif  */
	.before,
	.after {
		width: 92%;
		padding: 0 4%;
		height: 100upx;
		display: flex;
		align-items: center;
		position: fixed;
		top: 0;
		/*  #ifdef  APP-PLUS  */
			top: var(--status-bar-height);
		/*  #endif  */
		transition: opacity 0.05s linear;
		.back {
			width: 125upx;
			height: 60upx;
			flex-shrink: 0;
			.icon {
				margin-left: -10%;
				width: 60upx;
				height: 60upx;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 42upx;
			}
		}
		.middle {
			width: 100%;
		}
		.icon-btn {
			width: 125upx;
			height: 60upx;
			flex-shrink: 0;
			display: flex;
			.icon {
				&:first-child{
					margin-right: 5upx;
				}
				width: 60upx;
				height: 60upx;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 42upx;
			}
		}
	}
	.before {
		width: 100%;
		background-color: #FFFFFF;
		.back {
			.icon {
				// color: #fff;
				// background-color: rgba(0, 0, 0, 0.2);
				// border-radius: 100%;
			}
		}
		.icon-btn {
			.icon {
				color: #fff;
				background-color: rgba(0, 0, 0, 0.2);
				border-radius: 100%;
				
			}
		}
	}
	.after {
		background-color: #f1f1f1;
		.back {
			.icon {
				color: #666;
			}
		}
		.icon-btn {
			.icon {
				color: #666;
			}
		}
		.middle {
			font-size: 32upx;
			height: 90upx;
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 0 7%;
			view {
				width: (100%/3);
				padding: 0 3%;
				margin: 0 3%;
				display: flex;
				justify-content: center;
				align-items: center;
				&.on {
					margin-bottom: -4upx;
					color: #f47952;
					border-bottom: solid 4upx #f47952;
				}
			}
		}
	}
}
.place{
	background-color: #ffffff;
		height: 100upx;
		/*  #ifdef  APP-PLUS  */
		margin-top: var(--status-bar-height);
		/*  #endif  */
}
.swiper-box {
	position: relative;
	width: 100%;
	height: 100vw;
	swiper {
		width: 100%;
		height: 100vw;
		swiper-item {
			image {
				width: 100%;
				height: 100vw;
			}
		}
	}
	.indicator{
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0 25upx;
		height: 40upx;
		border-radius: 40upx;
		font-size: 22upx;
		position: absolute;
		bottom: 20upx;
		right: 20upx;
		color: #fff;
		background-color: rgba(0, 0, 0, 0.2);
	}
}
.info-box {
	width: 92%;
	padding: 20upx 4%;
	background-color: #fff;
	margin-bottom: 20upx;
}

.goods-info {
	.price {
		font-size: 46upx;
		font-weight: 600;
		color: #FF5555;
		line-height: 70upx;
	}
	.title {
		width: 100%;
		>view{
			display: inline-block;
		}
		.title1{
			font-size: 32upx;
			width: 85%;
		}
		.share_icon{
			margin-left: calc(15% - 50upx);
			width: 50upx;
			height: 50upx;
			text-align: center;
			.icon{
				color: #FD6969;
				font-size: 30upx;
			}
			.text{
				font-size: 25upx;
				justify-content: right;
				color: #B3B3B3;
				.btn{
					width: 100%;
					height: 50upx;
					line-height: 50upx;
					padding: 0upx;
					font-size: 25upx;
					background-color: #FFFFFF;
					color: #B3B3B3;
					
				}
				button::after{
					border: none;
				}
			}
		}
	}
	.other{
		width: 100%;
		height: 40upx;
		line-height: 40upx;
		>view{
			display: inline-block;
			width: calc(100% / 3);
			font-size: 28upx;
			text-overflow: ellipsis;
			white-space: nowrap;
			overflow: hidden;
			color: #B5B5B5;
		}
	}
}
.spec {
	.row {
		width: 100%;
		display: flex;
		align-items: center;
		margin: 0 0 30upx 0;
		.text {
			font-size: 24upx;
			color: #a2a2a2;
			margin-right: 20upx;
		}
		.content {
			font-size: 28upx;
			display: flex;
			flex-wrap: wrap;
			.serviceitem{
				margin-right: 10upx;
			}
			.sp {
				width: 100%;
				display: flex;
				view {
					background-color: #f6f6f6;
					padding: 5upx 10upx;
					color: #999;
					margin-right: 10upx;
					font-size: 20upx;
					border-radius: 5upx;
					&.on{
						border: solid 1upx #f47952;
						padding: 4upx 8upx;
					}
				}
			}
		}
		.arrow {
			position: absolute;
			right: 4%;
			.icon {
				color: #ccc;
			}
		}
	}
}
.comments {
	.row {
		width: 100%;
		height: 40upx;
		display: flex;
		align-items: center;
		margin: 0 0 30upx 0;
		.text {
			font-size: 30upx;
		}
		.arrow {
			font-size: 28upx;
			position: absolute;
			right: 4%;
			color: #17e6a1;
			.show {
				display: flex;
				align-items: center;
				.icon {
					color: #17e6a1;
				}
			}
		}
	}
	.comment {
		width: 100%;
		.user-info {
			width: 100%;
			height: 40upx;
			display: flex;
			align-items: center;
			.face {
				width: 40upx;
				height: 40upx;
				margin-right: 8upx;
				image {
					width: 40upx;
					height: 40upx;
					border-radius: 100%;
				}
			}
			.username {
				font-size: 24upx;
				color: #999;
			}
		}
		.content {
			margin-top: 10upx;
			font-size: 26upx;
		}
	}
}
.description {
	.title {
		width: 100%;
		height: 80upx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 26upx;
		color: #999;
	}
}
.footer {
	position: fixed;
	bottom: 0upx;
	width: 92%;
	padding: 0 4%;
	height: 99upx;
	border-top: solid 1upx #eee;
	background-color: #fff;
	z-index: 2;
	display: flex;
	justify-content: space-between;
	align-items: center;
	.icons {
		display: flex;
		height: 80upx;
		margin-left: -4%;
		.box {
			width: 80upx;
			height: 80upx;
			display: flex;
			justify-content: center;
			flex-wrap: wrap;
			.icon {
				font-size: 40upx;
				color: #828282;
			}
			.text {
				display: flex;
				justify-content: center;
				width: 100%;
				font-size: 22upx;
				color: #666;
			}
		}
	}
	.btn {
		height: 80upx;
		border-radius: 40upx;
		overflow: hidden;
		display: flex;
		margin-right: -2%;
		.joinCart,
		.buy {
			height: 80upx;
			padding: 0 40upx;
			color: #fff;
			display: flex;
			align-items: center;
			font-size: 28upx;
		}
		.joinCart {
			background-color: #f0b46c;
		}
		.buy {
			background-color: #f06c7a;
		}
	}
}
.popup {
	position: fixed;
	top: 0;
	width: 100%;
	height: 100%;
	z-index: 20;
	display: none;
	.mask{
		position: fixed;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: 21;
		background-color: rgba(0, 0, 0, 0.6);
	}
	.layer {
		position: fixed;
		z-index: 22;
		bottom: -70%;
		width: 92%;
		padding: 0 4%;
		height: 70%;
		border-radius: 20upx 20upx 0 0;
		background-color: #fff;
		display: flex;
		flex-wrap: wrap;
		align-content: space-between;
		.content {
			width: 100%;
			padding: 20upx 0;
		}
		.btn {
			width: 100%;
			height: 100upx;
			.button {
				width: 100%;
				height: 80upx;
				border-radius: 40upx;
				color: #fff;
				display: flex;
				align-items: center;
				justify-content: center;
				background-color: #f47952;
				font-size: 28upx;
			}
		}
	}
	
	&.show {
		display: block;
		.mask{
			animation: showPopup 0.2s linear both;
		}
		.layer {
			animation: showLayer 0.2s linear both;
		}
	}
	&.hide {
		display: block;
		.mask{
			animation: hidePopup 0.2s linear both;
		}
		
		.layer {
			animation: hideLayer 0.2s linear both;
		}
	}
	&.none {
		display: none;
	}
	&.service {
		.row {
			margin: 30upx 0;
			.title {
				font-size: 30upx;
				margin: 10upx 0;
			}
			.description {
				font-size: 28upx;
				color: #999;
			}
		}
	}
	&.spec {
		.title {
			font-size: 30upx;
			margin: 30upx 0;
		}
		.sp {
			// display: flex;
			display: inline-block;
			// view {
			// 	display: inline-block;
			// 	float: left;
			// 	font-size: 28upx;
			// 	padding: 0upx 10upx;
			// 	border-radius: 8upx;
			// 	margin: 0 10upx 10upx 0;
			// 	background-color: #F5F5F5;
			// 	&.on {
			// 		padding: 3upx 0upx;
			// 		// border: solid 1upx #f47925;
			// 	}
			// }
			view{
				display: inline-block;
				float: left;
				font-size: 28upx;
				padding: 10upx 30upx;
				margin: 0upx 20upx 20upx 0upx;
				background-color: #F5F5F5;
				border-radius: 8upx;
			}
			.on{
				background-color: #F47952;
				color: #FFFFFF;
				// border: solid 1upx #f47925;
			}
		}
		.length{
			margin-top: 30upx;
			border-top: solid 1upx #aaa;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-top: 20upx;
			.text{
				font-size: 30upx;
			}
			.number{
				display: flex;
				justify-content: center;
				align-items: center;
				.input{
					width: 80upx;
					height: 60upx;
					margin: 0 10upx;
					background-color: #f3f3f3;
					display: flex;
					justify-content: center;
					align-items: center;
					text-align: center;
					input{
						width: 80upx;
						height: 60upx;
						display: flex;
						justify-content: center;
						align-items: center;
						text-align: center;
						font-size: 26upx;
					}
				}
				
				.sub ,.add{
					width: 60upx;
					height: 60upx;
					background-color: #f3f3f3;
					border-radius: 5upx;
					.icon{
						font-size: 30upx;
						width: 60upx;
						height: 60upx;
						display: flex;
						justify-content: center;
						align-items: center;
						
					}
				}
			}
		}
		
	}
}
.share{
	display: none;
	&.show {
		display: block;
		.mask{
			animation: showPopup 0.15s linear both;
		}
		.layer {
			animation: showLayer 0.15s linear both;
		}
	}
	&.hide {
		display: block;
		.mask{
			animation: hidePopup 0.15s linear both;
		}
		
		.layer {
			animation: hideLayer 0.15s linear both;
		}
	}
	&.none {
		display: none;
	}
	.mask{
		background-color: rgba(0,0,0,.5);
		position: fixed;
		width: 100%;
		height: 100%;
		top:0;
		z-index: 11;
	}
	.layer{
		width: 92%;
		position: fixed;
		z-index: 12;
		padding: 0 4%;
		top: 100%;
		background-color: rgba(255,255,255,0.9);
		.list{
			width: 100%;
			display: flex;
			padding:10upx 0 30upx 0;
			.box{
				width: 25%;
				display: flex;
				justify-content: center;
				flex-wrap: wrap;
				image{
					width: 13.8vw;
					height: 13.8vw;
				}
				.title{
					margin-top: 10upx;
					display: flex;
					justify-content: center;
					width: 100%;
					font-size: 26upx;
				}
			}
		}
		.btn{
			width: 100%;
			height: 100upx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 28upx;
			border-top: solid 1upx #666666;
		}
		.h1{
			width: 100%;
			height: 80upx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 34upx;
		}
	}
}
.shortcut{
	width: 60upx;
	height: 60upx;
	background-color: #3C3C3C;
	opacity: .8;
	position: fixed;
	z-index: 15;
	bottom: 120upx;
	right: 20upx;
	border-radius: 50%;
	.text{
		width: 50upx;
		height: 50upx;
		font-size: 20upx;
		text-align: center;
		color: #fff;
		margin: 0upx auto;
	}
	.close{
		width: 100%;
		height: 60upx;
		line-height: 60upx;
		font-size: 30upx;
		text-align: center;
		color: #fff;
		margin: 0upx auto;
		background-color: #F06C7A;
		border-radius: 50%;
	}
}
.function{
	width: 60upx;
	height:300upx;
	position: fixed;
	z-index: 15;
	bottom: 200upx;
	opacity: .8;
	right: 20upx;
	.icon{
		width: 60upx;
		height: 60upx;
		// background-color: #CCCCCC;
		text-align: center;
		line-height: 60upx;
		font-size: 40upx;
		color: #FFFFFF;
	}
	view{
		width: 60upx;
		// padding: 10upx;
		height: 60upx;
		margin: 30upx auto;
		background-color: #6B6C6E;
		border-radius: 50%;
		image{
			width: 100%;
			height: 100%;
			// background-repeat: no-repeat;
		}
	}
}
.pc{
	width: 100%;
	// background-color: #C8C7CC;
	>.title5{
		text-align: center;
		color: #5D5D5D;
		font-size: 28upx;
		height: 60upx;
		line-height: 60upx;
		border-bottom: 2upx solid #CCCCCC;
	}
	.message{
		width: 100%;
		height: 60upx;
		line-height: 60upx;
		border-bottom:2upx solid #CCCCCC;
		font-size: 24upx;
		view{
			display: inline-block;
		}
		.name{
			width: 30%;
			padding-left: 20upx;
		}
		.value{
			color: #909090;
		}
	}
}
.specStyle{
	width: 100%;
	height: 180upx;
	padding: 20upx 0upx;
	>view{
		display: inline-block;
		float: left;
		font-size: 28upx;
	}
	.picSKU{
		width: 160upx;height: 160upx;
		border: 2upx solid #CCCCCC;
		top: 10upx;
		border-radius: 20upx;
		>img{
			border-radius: 20upx;
		}
	}
	.specs{
		width: calc(100% - 184upx);
		margin-left: 20upx;
		font-size: 24upx;
		view{
			margin-top: 10upx;
		}
		.price{
			color: #FF3963;
			font-size: 32upx;
			font-weight: bold;
		}
		.spec{
		}
		.num{
		}
	}
}
</style>
