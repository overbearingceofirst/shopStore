<template>
	<view>
		<view v-if="showHeader" class="status" :style="{position:headerPosition,top:statusTop}"></view>
		<view class="goods-list">
			<view class="tis" v-if="goodsList.length==0">暂无积分收付记录哦</view>
            <view class="row" v-for="(row,index) in goodsList" :key="index" >
				<!-- 商品 -->
				<view class="date">
					{{row.date}}
				</view>
				<view class="status">
					<view class="price">
						<span v-if="row.flage === '1'">+</span>
						<span v-else>-</span>
						{{row.price}}积分
					</view>
					<view class="statu">
						<view class="acquire" v-if="row.flage === '-1'">
							赠送
						</view>
						<view class="noAcquire" v-else>
							获赠
						</view>
					</view>
				</view>
			</view>
			<view class="tis2">————没有更多了哦————</view>
        </view>
		</view>
</template>

<script>

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
				goodsList:[
					{date:'2020-04-15 19:33',price:'1500',flage:'1'},
					{date:'2020-04-15 19:33',price:'1500',flage:'-1'},
					{date:'2020-04-15 19:33',price:'1500',flage:'1'},
					{date:'2020-04-15 19:33',price:'1500',flage:'1'},
					{date:'2020-04-15 19:33',price:'1500',flage:'-1'}
				],
				//控制滑动效果
				theIndex:null,
				oldIndex:null,
				isStop:false
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
			discard() {
				//丢弃
			}
			
			
		}
	}
</script>
<style lang="scss">
	page{position: relative;background-color: #F3F3F3;}
	.place{
		
		background-color: #ffffff;
		height: 100upx;
		/*  #ifdef  APP-PLUS  */
		margin-top: var(--status-bar-height);
		/*  #endif  */
	}
	.goods-list{
		width: 100%;
		padding: 0upx 0 120upx 0;
		.tis{
			width: 100%;
			height: 60upx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 32upx;
		}
		.tis2{
			width: 100%;
			height: 60upx;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #777777;
			font-size: 26upx;
			}
		.row{
			width: calc(92%);
			padding: 0upx 4%;
			height: 120upx; 
			background-color: #FFFFFF;
			margin: 20upx auto;
			box-shadow: 0upx 5upx 20upx rgba(0,0,0,0.1);
			display: flex;
			align-items: center;
			z-index: 4;
			border: 0;
			>view{
				width: 50%;
				height: 100%;
				display: inline-block;
				float: left;
			}
			.date{
				height: 100%;
				line-height: 120upx;
				color: #777777;
				text-overflow: ellipsis;
				overflow: hidden;
				white-space: nowrap;
			}
			.status{
				>view{
					height: 50%;
					line-height: 60upx;
					text-align: right;
					text-overflow: ellipsis;
					overflow: hidden;
					white-space: nowrap;
				}
				.acquire{
					color: #EF5656;
				}
				.noAcquire{
					color: #FF9327;
				}
			}
		}
	}
	
</style>
