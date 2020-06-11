<template>
	<view>
		<view v-if="showHeader" class="status" :style="{position:headerPosition,top:statusTop}"></view>
		<!-- <view v-if="showHeader" class="header" :style="{position:headerPosition,top:headerTop}">
			<view class="title">购物车</view>
		</view> -->
		<!-- 占位 -->
		<!-- <view v-if="showHeader" class="place"></view> -->
		<!-- 商品列表 -->
		<view class="goods-list">
			<view class="tis" v-if="goodsList.length==0">
				<view class="">您的购物车中没有商品哦</view>
				<view class="homePage" @tap="goCart()">去首页逛逛吧</view>
			</view>
			<view class="redact" v-if="goodsList.length > 0">
				<view style="left:4%;" @tap="clearCart">
					清空购物车
				</view>
				<view @tap="changeRedact(redact)" style="right:4%;">
					{{redact}}
				</view>
			</view>
            <view class="row" v-for="(row,index) in goodsList" :key="index" >
				<!-- 删除按钮 -->
				<view class="menu" @tap.stop="deleteGoods(row.id)">
					<view class="icon shanchu"></view>
				</view>
				<!-- 商品 -->
				<!--左滑删除效果-->
				<view class="carrier" :class="[theIndex==index?'open':oldIndex==index?'close':'']" @touchstart="touchStart(index,$event)" @touchmove="touchMove(index,$event)" @touchend="touchEnd(index,$event)">
				<view class="carrier" :class="[theIndex==index?'open':oldIndex==index?'close':'']">
					<!-- checkbox -->
					<view class="checkbox-box" @tap="selected(index)">
						<view class="checkbox">
							<view :class="[row.selected?'on':'']"></view>
						</view>
					</view>
					<!-- 商品信息 -->
					<view class="goods-info" @tap="toGoods(row,index)">
						<view class="img">
							<image :src="row.productPic"></image>
						</view>
						<view class="info">
							<view class="title">{{row.productSubTitle}}</view>
							<view class="spec" >{{specList[index]}}&nbsp;库存:{{row.stock}}</view>
							<view class="price-number">
								<view class="price">￥{{row.price}}</view>
								<view class="number">
									<view class="sub" @tap.stop="sub(index)">
										<view class="icon jian"></view>
									</view>
									<view class="input" @tap.stop="discard">
										<input type="number" v-model="row.quantity" @input="sum($event,index)" />
									</view>
									<view class="add"  @tap.stop="add(index)">
										<view class="icon jia"></view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				</view>
			</view>
        </view>
		<!-- 脚部菜单 -->
		<view class="footer" :style="{bottom:footerbottom}" v-if="goodsList.length > 0">
			<view class="checkbox-box" @tap="allSelect">
				<view class="checkbox">
					<view :class="[isAllselected?'on':'']"></view>
				</view>
				<view class="text">全选</view>
			</view>
			<!-- <view class="delBtn" @tap="deleteList" v-if="selectedList.length>0">删除</view> -->
			<view class="settlement" v-if="showRedact">
				<view class="sum">合计:<view class="money">{{sumPrice}}积分</view></view>
				<view class="btn" @tap="toConfirmation">结算({{selectedList.length}})</view>
			</view>
			<view class="settlement" v-if="!showRedact">
				<!-- <view class="btn" @tap="@tap="deleteList"">删除({{selectedList.length}})</view> -->
				<!-- <view class="btn" style="border-right: 2upx solid #FFFFFF;" @tap="deleteList">移到关注</view> -->
				<view class="btn" @tap="deleteList">删除</view>
			</view>
		</view>
	</view>
</template>

<script>
	import request from '../../../Tool/request.js'
	export default {
		data() {
			return {
				sumPrice:'0.00',
				headerPosition:"fixed",
				headerTop:null,
				statusTop:null,
				showHeader:true,
				selectedList:[],
				isAllselected:false,
				redact:'编辑',
				showRedact:true,
				goodsList:[],
				//控制滑动效果
				theIndex:null,
				oldIndex:null,
				isStop:false,
				specList:[],
				orderList:'',
				order:''
			}
		},
		onPageScroll(e){
			//兼容iOS端下拉时顶部漂移
			this.headerPosition = e.scrollTop>=0?"fixed":"absolute";
			this.headerTop = e.scrollTop>=0?null:0;
			this.statusTop = e.scrollTop>=0?null:-this.statusHeight+'px';
		},
		//下拉刷新，需要自己在page.json文件中配置开启页面下拉刷新 "enablePullDownRefresh": true
		onPullDownRefresh() {
		    setTimeout(function () {
		        uni.stopPullDownRefresh();
		    }, 1000);
		},
		mounted() {
			this.getCarlist()
		},
		onHide(){
			this.subNum()
		},
		filters:{
			getValue:function(x){
				for(var i of x){
					return i.value
				}
			}
		},
		onLoad() {
			this.getCarlist()
			//兼容H5下结算条位置
			// #ifdef H5
				this.footerbottom = document.getElementsByTagName('uni-tabbar')[0].offsetHeight+'px';
			// #endif
			// #ifdef APP-PLUS
			this.showHeader = false;
			this.statusHeight = plus.navigator.getStatusbarHeight();
			// #endif
		},
		methods: {
			//加入商品 参数 goods:商品数据
			joinGoods(goods){
				/*
				* 这里只是展示一种添加逻辑，模板并没有做从其他页面加入商品到购物车的具体动作，
				* 在实际应用上，前端并不会直接插入记录到goodsList这一个动作，一般是更新列表和本地列表缓存。
				* 一般商城购物车的增删改动作是由后端来完成的,
				* 后端记录后返回前端更新前端缓存
				*/
				let len = this.goodsList.length;
				let isFind = false;//是否找到ID一样的商品
				for(let i=0;i<len;i++){
					let row = this.goodsList[i];
					if(row.id==goods.id )
					{	//找到商品一样的商品
						this.goodsList[i].number++;//数量自增
						isFind = true;//找到一样的商品
						break;//跳出循环
					}
				}
				if(!isFind){
					//没有找到一样的商品，新增一行到购物车商品列表头部
					this.goodsList[i].unshift(goods);
				}
			},
			changeRedact(value){
				if(value === '编辑'){
					this.redact = '完成'
					this.showRedact = false
				}else if(value ==='完成'){
					this.redact = '编辑'
					this.showRedact = true
				}
			},
			// //控制左滑删除效果-begin
			touchStart(index,event){
				//多点触控不触发
				if(event.touches.length>1){
					this.isStop = true;
					return ;
				}
				this.oldIndex = this.theIndex;
				this.theIndex = null;
				//初始坐标
				this.initXY = [event.touches[0].pageX,event.touches[0].pageY];
			},
			touchMove(index,event){
				//多点触控不触发
				if(event.touches.length>1){
					this.isStop = true;
					return ;
				}
				let moveX = event.touches[0].pageX - this.initXY[0];
				let moveY = event.touches[0].pageY - this.initXY[1];
				
				if(this.isStop||Math.abs(moveX)<5){
					return ;
				}
				if (Math.abs(moveY) > Math.abs(moveX)){
					// 竖向滑动-不触发左滑效果
					this.isStop = true;
					return;
				}
				
				if(moveX<0){
					this.theIndex = index;
					this.isStop = true;
				}else if(moveX>0){
					if(this.theIndex!=null&&this.oldIndex==this.theIndex){
						this.oldIndex = index;
						this.theIndex = null;
						this.isStop = true;
						setTimeout(()=>{
							this.oldIndex = null;
						},150)
					}
				}
			},
			touchEnd(index,$event){
				//结束禁止触发效果
				this.isStop = false;
			},
			//控制左滑删除效果-end
			
			
			//商品跳转
			toGoods(e,index){
				console.log(e)
				uni.showToast({title: '商品'+e.id,icon:"none"});
				uni.navigateTo({
					url: '../../goods/goods?id='+ e.productId+'&spec=' + this.specList[index] + '&stock='+ e.stock + '&Pid=' + e.id
				});
			},
			//跳转确认订单页面
			toConfirmation(){
				const _that = this
				request({
					url:'/mall-portal/member/address/list',
					method:'GET',
					success(res){
						let data = res.data.data
						let defaultAdress =''
						for(var i of data){
							if(i.defaultStatus === 1){
								defaultAdress = i.id
							}
						}
						request({
							url:'/mall-portal/order/generateOrder',
							method:'POST',
							data:{
								'memberReceiveAddressId':defaultAdress,
								'couponId':'',
								'useIntegration':'',
								'payType':2,
								'ids':_that.selectedList
							},
							success(res){
								_that.orderList = res.data.data.orderItemList
								_that.order = res.data.data.order
								uni.showLoading({
									title:'正在为您生成订单信息',
									icon:'none'
								})
								setTimeout(() => {
									uni.hideLoading()
									uni.showToast({
										title:'生成订单成功，正在为您跳转至确认订单页面',
										icon:'none',
										success() {
											uni.setStorage({
												//设置所有生成的订单信息
												key:'orderList',
												data:_that.orderList,
												success() {
													uni.setStorage({
														// 设置订单相关信息和个人收货地址
														key:'order',
														data:_that.order,
														success() {
															uni.setStorage({
																key:'selectAddress',
																data:{
																	id:_that.order.id,
																	memberId:_that.order.memberId,
																	name:_that.order.receiverName,
																	phoneNumber:_that.order.receiverPhone,
																	postCode:_that.order.receiverPostCode,
																	province:_that.order.receiverProvince,
																	city:_that.order.receiverCity,
																	regoin:_that.order.receiverRegion,
																	detailAddress:_that.order.receiverDetailAddress
																}
															})
														}
													})
												}
											})
											uni.navigateTo({
												url:'../../order/confirmation?orderList',
											})
										}
									})
								},2000)
							}
						})
					}
				})
			},
			//删除单个商品
			deleteGoods(id){
				this.selectedList.push(id)
				this.deleteList()
				this.oldIndex = null;
				this.theIndex = null;
			},
			// 删除多个商品
			deleteList(){
				const _that = this
				uni.showLoading({
					title:"删除中"
				})
				request({
					url:'/mall-portal/cart/delete?ids='+ _that.selectedList,
					method:'POST',
					success(res){
						uni.hideLoading()
						uni.showToast({
							title:'删除成功',
							icon:'success',
							success() {
								_that.getCarlist()
							}
						})
					}
				})
			},
			// 清空购物车
			clearCart(){
				const _that = this
				uni.showLoading({
					title:"清空中"
				})
				request({
					url:'/mall-portal/cart/clear',
					method:'POST',
					success(){
						uni.hideLoading()
						uni.showToast({
							title:'清空购物车成功',
							icon:'success',
							success() {
								_that.getCarlist()
							}
						})
					}
				})
			},
			// 选中商品
			selected(index){
				this.goodsList[index].selected = this.goodsList[index].selected?false:true;
				let i = this.selectedList.indexOf(this.goodsList[index].id);
				i>-1?this.selectedList.splice(i, 1):this.selectedList.push(this.goodsList[index].id);
				this.isAllselected = this.selectedList.length == this.goodsList.length;
				this.sum();
			},
			//全选
			allSelect(){
				let len = this.goodsList.length;
				let arr = [];
				for(let i=0;i<len;i++){
					this.goodsList[i].selected = this.isAllselected? false : true;
					arr.push(this.goodsList[i].id);
				}
				this.selectedList = this.isAllselected?[]:arr;
				this.isAllselected = this.isAllselected||this.goodsList.length==0?false : true;
				this.sum();
			},
			subNum(){
				for (let p of this.goodsList) {
					this.changeQuantity(p.id,p.quantity)
				}
			},
			// 减少数量
			sub(index){
				if(this.goodsList[index].quantity<=1){
					uni.showToast({
						title:'对不起商品数量不可以小于1',
						icon:'none'
					})
					return;
				}
				this.goodsList[index].quantity--;
				this.sum();
			},
			// 增加数量
			add(index){
				console.log(this.goodsList[index].stock)
				if(this.goodsList[index].quantity >= this.goodsList[index].stock){
					uni.showToast({
						title:'对不起商品数量不可超出库存',
						icon:'none'
					})
					return;
				}
				this.goodsList[index].quantity++;
				this.sum();
			},
			// 合计
			sum(e,index){
				this.sumPrice=0;
				let len = this.goodsList.length;
				for(let i=0;i<len;i++){
					if(this.goodsList[i].selected) {
						if(i==index){
							this.sumPrice = this.sumPrice + (e.detail.value*this.goodsList[i].price);
							// console.log(e.detail.value*this.goodsList[i].price)
						}else{
							this.sumPrice = this.sumPrice + (this.goodsList[i].quantity*this.goodsList[i].price);
						}
					}
				}
				this.sumPrice = this.sumPrice.toFixed(2);
			},
			discard() {
				//丢弃
			},
			goCart(){
				uni.switchTab({
					url: '../home/home' 
				});
			},
			// 获取购物车里面的所有信息
			getCarlist(){
				const _that = this
				request({
					url:'/mall-portal/cart/list',
					method:'GET',
					success(res){
						const data = res.data.data
						_that.goodsList = res.data.data
						// 所有规格序列化
						for(var y of data){
							const alonePro =JSON.parse(y.productAttr)
							const array = []
							alonePro.forEach((item,index) => {
							array.push(item.value)
							})
							if(_that.specList.toString().indexOf(array.toString()) === -1){
								_that.specList.push(array)
							}
						}
					}
				})
			},
			// 修改购物车中某个商品的数量
			changeQuantity(id,num){
				const Pid = id
				const nums = num
				request({
					url:'/mall-portal/cart/update/quantity',
					method:'GET',
					data:{id:Pid,quantity:nums}
				})
			}
		}
	}
</script>
<style lang="scss">
	page{position: relative;background-color: #fff;}
	.checkbox-box{
		display: flex;
		align-items: center;
		.checkbox{
			width: 35upx;
			height: 35upx;
			border-radius: 100%;
			border: solid 2upx #f06c7a;
			display: flex;
			justify-content: center;
			align-items: center;
			.on{
				width: 25upx;
				height: 25upx;
				border-radius: 100%;
				background-color: #f06c7a;
			}
		}
		.text{
			font-size: 28upx;
			margin-left: 10upx;
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
		height: var(--status-bar-height);//覆盖样式
		/*  #endif  */
	}

	.header{
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
		.title{
			font-size: 36upx;
		}
		
	}
	.place{
		
		background-color: #ffffff;
		height: 100upx;
		/*  #ifdef  APP-PLUS  */
		margin-top: var(--status-bar-height);
		/*  #endif  */
	}
	.goods-list{
		width: 100%;
		padding: 20upx 0 120upx 0;
		.tis{
			width: 100%;
			height: 60upx;
			// display: flex;
			// justify-content: center;
			text-align: center;
			align-items: center;
			font-size: 32upx;
			>view{
				margin: 0upx auto;
			}
			.homePage{
				border: 1upx solid #FF5555;
				color: #FF5555;
				padding: 20upx;
				width: 200upx;
				margin-top: 30upx;
				border-radius: 40upx;
			}
		}
		.row{
			width: calc(92%);
			height: calc(22vw + 40upx); 
			margin: 20upx auto;
			
			border-radius: 15upx;
			box-shadow: 0upx 5upx 20upx rgba(0,0,0,0.1);
			display: flex;
			align-items: center;
			position: relative;
			overflow: hidden;
			z-index: 4;
			border: 0;
			.menu{
				.icon{
					color: #fff;
					// font-size: 25upx;
				}
				position: absolute;
				width: 30%;
				height: 100%;
				right: 0;
				display: flex;
				justify-content: center;
				align-items: center;
				background-color: red;
				color: #fff;
				z-index: 2;
			}
			.carrier{
				@keyframes showMenu {
					0% {transform: translateX(0);}100% {transform: translateX(-30%);}
				}
				@keyframes closeMenu {
					0% {transform: translateX(-30%);}100% {transform: translateX(0);}
				}
				&.open{
					animation: showMenu 0.25s linear both;
				}
				&.close{
					animation: closeMenu 0.15s linear both;
				}
				background-color: #fff;
				.checkbox-box{
					padding-left: 20upx;
					flex-shrink: 0;
					height: 22vw;
					margin-right: 20upx;
				}
				position: absolute;
				width: 100%;
				padding: 0 0;
				height: 100%;
				z-index: 3;
				display: flex;
				align-items: center;

				.goods-info{
					width: 100%;
					display: flex;
					padding-right: 20upx;
					.img{
						width: 22vw;
						height: 22vw;
						border-radius: 10upx;
						overflow: hidden;
						flex-shrink: 0;
						margin-right: 10upx;
						image{
							width: 22vw;
							height: 22vw;
						}
					}
					.info{
						width: 100%;
						height: 22vw;
						overflow: hidden;
						display: flex;
						flex-wrap: wrap;
						position: relative;
						.title{
							width: 100%;
							font-size: 28upx;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 2;
							// text-align: justify;
							overflow: hidden;
						}
						.spec{
							font-size: 20upx;
							background-color: #f3f3f3;
							color: #a7a7a7;
							height: 30upx;
							display: flex;
							align-items: center;
							padding: 0 10upx;
							border-radius: 15upx;
							margin-bottom: 20vw;
						}
						.price-number{
							position: absolute;
							width: 100%;
							bottom: 0upx;
							display: flex;
							justify-content: space-between;
							align-items: flex-end;
							font-size: 28upx;
							height: 60upx;
							.price{
							}
							.number{
								display: flex;
								justify-content: center;
								align-items: flex-end;
								.input{
									width: 45upx;
									height: 45upx;
									margin: 0 10upx;
									background-color: #f3f3f3;
									input{
										width: 45upx;
										height: 45upx;
										display: flex;
										justify-content: center;
										align-items: center;
										text-align: center;
										font-size: 26upx;
									}
								}
								.sub ,.add{
									width: 45upx;
									height: 45upx;
									background-color: #f3f3f3;
									border-radius: 5upx;
									.icon{
										font-size: 22upx;
										width: 45upx;
										height: 45upx;
										display: flex;
										justify-content: center;
										align-items: center;
										
									}
								}
							}
						}
					}
				}
			}
		}
	}
	.footer{
		width: 96%;
		padding: 0 0 0 4%;
		background-color: #fbfbfb;
		height: 100upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 28upx;
		position: fixed;
		bottom: 0upx;
		z-index: 5;
		.delBtn{
			border: solid 1upx #f06c7a;
			color: #f06c7a;
			padding: 0 30upx;
			height: 50upx;
			border-radius: 30upx;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		.settlement{
			width: 60%;
			display: flex;
			justify-content: flex-end;
			align-items: center;
			.sum{
				width: 50%;
				font-size: 28upx;
				margin-right: 10upx;
				display: flex;
				justify-content: flex-end;
				.money{
					// font-weight: 600;
					color: #FF6969;
				}
			}
			.btn{
				padding: 0 30upx;
				height: 100upx;
				background-color: #f06c7a;
				color: #fff;
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}
	}
	.redact{
		width: 92%;
		padding: 0upx 4%;
		height: 60upx;
		// text-align: right;
		background-color: #F8F8F8;
		position: relative;
		>view{
			display: inline-block;
			line-height: 60upx;
			position: absolute;
			}
		}
</style>
