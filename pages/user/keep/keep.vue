<template>
	<view>
		<!-- <view v-if="showHeader" class="status" :style="{position:headerPosition,top:statusTop}"></view> -->
		<view class="goods-list">
			<view class="tis" v-if="goodsList.length==0">暂时你没有收藏任何商品哦~</view>
            <view class="row" v-for="(row,index) in goodsList" :key="index" >
					<!-- checkbox -->
					<!-- 商品信息 -->
					<view class="goods-info" @tap="toGoods(row)">
						<view class="checkbox-box" @tap="selected(index)" v-if="shoCheck">
							<view class="checkbox">
								<view :class="[row.selected?'on':'']"></view>
							</view>
						</view>
						<view class="img">
							<image :src="row.productPic"></image>
						</view>
						<view class="info">
							<view class="title">{{row.productSubTitle}}</view>
							<view class="spec">{{row.spec}}</view>
							<view class="price-number">
								<view class="price">￥{{row.productPrice}}</view>
							</view>
						</view>
					</view>
			</view>
        </view>
		<!-- 脚部菜单 -->
		<view class="footer" :style="{bottom:footerbottom}" v-if="goodsList.length !== 0">
			<view class="checkbox-box" @tap="allSelect" v-show="shoCheck">
				<view class="checkbox">
					<view :class="[isAllselected?'on':'']"></view>
				</view>
				<view class="text">全选</view>
			</view>
			<view class="settlement">
				<view class="delBtn" :style="{'backgroundColor': selectedList.length > 0 ? '#FF8000' :'#CCCCCC' }"  @tap="deleteGoods" v-show="shoCheck">删除</view>
				<view class="btn" @tap="toConfirmation">{{btnStatus}}</view>
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
				shoCheck:false,
				btnStatus:'编辑',
				goodsList:[],
				//控制滑动效果
				theIndex:null,
				oldIndex:null,
				isStop:false,
				userId:''
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
		onLoad() {
			this.getDatalist()
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
			//控制左滑删除效果-begin
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
			toGoods(e){
				uni.showToast({title: '商品'+e.productId,icon:"none"});
				uni.navigateTo({
					// url: '../../goods/goods?id='+ e.productId
				});
			},
			//跳转确认订单页面
			toConfirmation(){
				this.shoCheck = !this.shoCheck
				if(this.shoCheck === true){
					this.btnStatus = "完成"
				}else{
					this.btnStatus = "编辑"
				}
				// let tmpList=[];
				// let len = this.goodsList.length;
				// for(let i=0;i<len;i++){
				// 	if(this.goodsList[i].selected) {
				// 		tmpList.push(this.goodsList[i]);
				// 	}
				// }
				// if(tmpList.length<1){
				// 	uni.showToast({
				// 		title:'请选择商品结算',
				// 		icon:'none'
				// 	});
				// 	return ;
				// }
				// uni.setStorage({
				// 	key:'buylist',
				// 	data:tmpList,
				// 	success: () => {
				// 		uni.navigateTo({
				// 			url:'../../order/confirmation'
				// 		})
				// 	}
				// })
			},
			//删除商品
			deleteGoods(){
				let len = this.selectedList.length;
				const _that = this
				for(var i=0;i< len;i++){
					this.deleteCol(this.selectedList[i])
					console.log(this.selectedList)
					uni.showLoading({
						title:'删除中',
					})
					setTimeout(() => {
						uni.showToast({
							title:'删除成功',
							icon:'success',
							success(){
								_that.getDatalist()
							}
						})
					},2000)
				}
			},
			deleteCol(id){
				const _that = this
				const Pid = id
				request({
					url:`/mall-portal/member/collection/deleteProduct?memberId=${_that.userId}&productId=${Pid}`,
					method:'POST',
					success(res){
						console.log(res)
						setTimeout(() =>{
							uni.showToast({
								title:'删除成功',
								icon:'none'
							})
						},300)
					},
				})
			},
			// 删除商品s
			// deleteList(){
			// 	let len = this.selectedList.length;
			// 	while (this.selectedList.length>0)
			// 	{
			// 		this.deleteGoods(this.selectedList[0]);
			// 	}
			// 	this.selectedList = [];
			// 	this.isAllselected = this.selectedList.length == this.goodsList.length && this.goodsList.length>0;
			// 	this.sum();
			// },
			// 选中商品
			selected(index){
				this.goodsList[index].selected = this.goodsList[index].selected?false:true;
				let i = this.selectedList.indexOf(this.goodsList[index].id);
				i>-1?this.selectedList.splice(i, 1):this.selectedList.push(this.goodsList[index].id);
				this.isAllselected = this.selectedList.length == this.goodsList.length;
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
			// 合计
			sum(e,index){
				this.sumPrice=0;
				let len = this.goodsList.length;
				for(let i=0;i<len;i++){
					if(this.goodsList[i].selected) {
						if(e && i==index){
							this.sumPrice = this.sumPrice + (e.detail.value*this.goodsList[i].price);
						}else{
							this.sumPrice = this.sumPrice + (this.goodsList[i].number*this.goodsList[i].price);
						}
					}
				}
				this.sumPrice = this.sumPrice.toFixed(2);
			},
			discard() {
				//丢弃
			},
			getDatalist(){
				const _that = this
				// 获取本地存储的个人信息列表
				uni.getStorage({
					key:'userMessage',
					success(res){
						_that.userId = res.data.id
						request({
							url:'/mall-portal/member/collection/listProduct/'+_that.userId,
							method:'GET',
							success(res){
								// console.log(res.data.data)
								_that.goodsList = res.data.data
							}
						})
					}
				})
			}
		}
	}
</script>
<style lang="scss">
	page{position: relative;background-color: #f3f3f3;}
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
			white-space: nowrap;
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
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 32upx;
		}
		.checkbox-box{
			display: inline-block;
			align-items: center;
			margin-top:calc(11vw - 17.5upx);
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
				white-space: nowrap;
			}
		}
		.row{
			width: calc(92%);
			height: calc(22vw + 50upx);
			background-color: #FFFFFF;
			margin: 0upx auto;
			padding: 0upx 4%;
			align-items: center;
			position: relative;
			// overflow: hidden;
			z-index: 4;
			.title{
				height: 80upx;
				line-height: 80upx;
				position: relative;
				font-size: 28upx;
				.date{
					position: absolute;
					right: 0px;
					color: #757575;
				}
			}
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
				.goods-info{
					border-bottom:2upx solid #CCCCCC;
					width: 100%;
					display: flex;
					padding: 20upx 0upx;
					padding-right: 20upx;
					.img{
						width: 22vw;
						height: 22vw;
						border-radius: 10upx;
						overflow: hidden;
						flex-shrink: 0;
						margin-right: 15upx;
						margin-left: 15upx;
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
						text-overflow: ellipsis;
						white-space: nowrap;
						.title{
							width: 100%;
							font-size: 28upx;
							// display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 2;
							// text-align: justify;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
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
								color: #FF5555;
								font-size: 32upx;
							}
							.number{
								display: flex;
								justify-content: center;
								align-items: flex-end;
								.input{
									width: 60upx;
									height: 60upx;
									margin: 0 10upx;
									background-color: #f3f3f3;
									input{
										width: 60upx;
										height: 60upx;
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
			color: #FFFFFF;
			height: 100%;
			width: 120upx;
			text-align: center;
			justify-content: center;
			align-items: center;
			position: absolute;
			right: 120upx;
		}
		.settlement{
			width: 100%;
			display: flex;
			height: 100%;
			line-height: 100upx;
			position: relative;
			.btn{
				width: 120upx;
				text-align: center;
				height: 100%;
				background-color: #FF5555;
				color: #fff;
				position: absolute;
				right: 0px;
			}
		}
	}
</style>
