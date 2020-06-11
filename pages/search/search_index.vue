<template>
	<view>
		<view class="header" >
			<!-- <view class="addr"><view class="icon location"></view>{{city}}</view> -->
			<view class="input-box">
				<view class="icon search"></view>
				<input placeholder="请输入要搜索的关键字"
				 @blur="showHistory = !showHistory;"
				 @focus="showHistory = !showHistory;showGoods=false"
				 v-model="inputData"  
				 placeholder-style="color:#c0c0c0;"/>
			</view>
			<view class="icon-btn">
				<view class="icon" style="font-size: 30upx;" @tap="search()" >搜索</view>
			</view>
		</view>
		<!-- 占位 -->
		<view class="place"></view>
		<view class="search_history" v-if="showHistory">
			<view class="search_title">
				<view class="title_icon">
					<view class="search_title1">
						历史搜索
					</view>
					<view class="icon shanchu" @tap="clearHistory()"></view>
				</view>
			</view>
			<ul class="search_title" v-if="historyList.length !== 0">
				<li v-for="(item, index) in historyList" :key="index" @tap="inputAlain(item)">{{item}}</li>
			</ul>
			<view class="noHistory" v-else>
				暂无搜索记录
			</view>
		</view>
		<view v-if="showGoods">
			<view class="header2" :style="{position:headerPosition,top:headerTop}">
				<view class="target" v-for="(target,index) in orderbyList" @tap="select(index)" :key="index" :class="[target.selected?'on':'']">
					{{target.text}}
					<view v-if="target.orderbyicon" class="icon" :class="target.orderbyicon[target.orderby]"></view>
				</view>
			</view> 
			<view class="place"></view>
			<view class="goods-list">
				<view v-if="searchList.length > 0">
					<view class="product-list">
						<view class="product" v-for="(goods) in searchList" :key="goods.goods_id" @tap="toGoods(goods)">
							<image mode="widthFix" :src="goods.img"></image>
							<view class="name">{{goods.name}}</view>
							<view class="info">
								<view class="price">积分{{goods.price}}</view>
								<!-- <view class="slogan">{{goods.slogan}}</view> -->
							</view>
						</view>
					</view>
					<view class="loading-text">{{loadingText}}</view>
				</view>
				<view class="noProduct" v-else>
					暂无此类商品
				</view>
			</view>
		</view>
	</view>
</template>
<script>
export default{
	data() {
		return {
			showHistory:false,
			showGoods:false,
			searchList:[],
			imgSrc:'../../static/img/555555.jpg',
			historyList:[],
			inputData:'',
			orderbyList:[
				{text:"销量",selected:true,orderbyicon:false,orderby:0},
				{text:"价格",selected:false,orderbyicon:['sheng','jiang'],orderby:0},
				{text:"好评",selected:false,orderbyicon:false,orderby:0}
			],
			goodsList:[
				{ goods_id: 0, img: '/static/img/goods/p1.jpg', name: '商品名称商品名称商品名称商品名称商品名称', price: '￥168', slogan:'1235人付款' },
				{ goods_id: 1, img: '/static/img/goods/p2.jpg', name: '商品名称商品名称商品名称商品名称商品名称', price: '￥168', slogan:'1235人付款' },
				{ goods_id: 2, img: '/static/img/goods/p3.jpg', name: '水壶', price: '￥168', slogan:'1235人付款' },
				{ goods_id: 3, img: '/static/img/goods/p4.jpg', name: '商品名称商品名称商品名称商品名称商品名称', price: '￥168', slogan:'1235人付款' },
				{ goods_id: 4, img: '/static/img/goods/p5.jpg', name: '商品名称商品名称商品名称商品名称商品名称', price: '￥168', slogan:'1235人付款' },
				{ goods_id: 5, img: '/static/img/goods/p6.jpg', name: '商品名称商品名称商品名称商品名称商品名称', price: '￥168', slogan:'1235人付款' },
				{ goods_id: 6, img: '/static/img/goods/p7.jpg', name: '水浒', price: '￥168', slogan:'1235人付款' },
				{ goods_id: 7, img: '/static/img/goods/p8.jpg', name: '商品名称商品名称商品名称商品名称商品名称', price: '￥168', slogan:'1235人付款' },
				{ goods_id: 8, img: '/static/img/goods/p9.jpg', name: '商品名称商品名称商品名称商品名称商品名称', price: '￥168', slogan:'1235人付款' },
				{ goods_id: 9, img: '/static/img/goods/p10.jpg', name: '商品名称商品名称商品名称商品名称商品名称', price: '￥168', slogan:'1235人付款' }
			]
		}
	},
	methods:{
		search(){
			if(this.inputData === ''){
				uni.showToast({
					title:'搜索内容不能为空',
					icon:'none'
				})
				return 
			}
			if(this.historyList.indexOf(this.inputData) != -1){
				console.log("对不起内容相同了")
			}else{
				if(this.historyList.length === 10){
					this.historyList.unshift(this.inputData)
					this.historyList.pop()
				}else{
					this.historyList.unshift(this.inputData)
				}
			}
			this.vagueSearch(this.inputData)
			uni.setStorage({
				key:'searchHistory',
				data:this.historyList
			})
			this.inputData =''
			this.showGoods = true
		},
		//获取本地存储的历史纪录
		getHistory(){
			var _that = this
			uni.getStorage({
				key:'searchHistory',
				success:function(res){
					console.log(res)
					_that.historyList=res.data
				}
			})
		},
		//模糊查询
		vagueSearch(dataConent){
			this.searchList = this.goodsList.filter(array => array.name.match(dataConent));
		},
		//清空数组和设置本地存储为空
		clearHistory(){
			this.historyList = [],
			uni.setStorage({
				key:'searchHistory',
				data:this.historyList
			})
		},
		//将点击的内容赋值给iput输入框
		inputAlain(item){
			this.inputData = item
			this.vagueSearch(item)
			this.showGoods = true
		},
		select(index){
			let tmpTis = this.orderbyList[index].text+"排序 "
			if(this.orderbyList[index].orderbyicon){
				let type = this.orderbyList[index].orderby==0?'升序':'降序';
				if(this.orderbyList[index].selected){
					type = this.orderbyList[index].orderby==0?'降序':'升序';
					this.orderbyList[index].orderby = this.orderbyList[index].orderby==0?1:0;
				}
				tmpTis+=type
			}
			this.orderbyList[index].selected = true;
			let len = this.orderbyList.length;
			for(let i=0;i<len;i++){
				if(i!=index){
					this.orderbyList[i].selected = false;
				}
			}
			uni.showToast({title:tmpTis,icon:"none"});
		},
		toGoods(e){
			uni.showToast({title: '商品'+e.goods_id,icon:"none"});
			uni.navigateTo({
				url: '../goods/goods' 
			});
		},
	},
	mounted() {
		this.getHistory()
	}
}
</script>

<style lang="scss">
	page{position: relative;background-color: #F5F5F5;}
	.icon {
		font-size:26upx;
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
		
		.addr{
			width: 120upx;
			height: 60upx;
			flex-shrink: 0;
			display: flex;
			align-items: center;
			font-size: 28upx;
			.icon{
				height: 60upx; 
				margin-right: 5upx;
				display: flex;
				align-items: center;
				font-size: 42upx;
				color: #ffc50a;
			}
		}
		.input-box{
			width: 100%;
			height: 60upx;
			background-color: #f5f5f5;
			border-radius: 30upx;
			position: relative;
			display: flex;
			align-items: center;
			.icon{
				display: flex;
				align-items: center;
				position: absolute;
				top:0;
				right: 0;
				width: 60upx;
				height: 60upx;
				font-size: 34upx;
				color: #c0c0c0;
			}
			input{
				padding-left: 28upx;
				height: 28upx;
				font-size: 28upx;
			}
		}
		.icon-btn{
			width: 60upx;
			height: 60upx;
			flex-shrink: 0;
			display: flex;
			font-size: 20rpx;
			.icon{
				width: 60upx;
				height: 60upx;
				display: flex;
				justify-content: flex-end;
				align-items: center;
			}
		}
	}
	.place{
		background-color: #F5F5F5;
		height: 100upx;
		/*  #ifdef  APP-PLUS  */
		margin-top: var(--status-bar-height);
		/*  #endif  */
	}
	.search_history{
		width: 100%;
		height: 200upx;
		background-color: #ffffff;
		position: fixed;
		top: 100upx;
		z-index: 11;
		.search_title{
			width: 92%;
			padding: 0px 4%;
			height: 50upx;
			line-height: 50upx;
			.title_icon{
				width: 100%;
				height: 40upx;
				line-height: 40upx;
				position: relative;
				>view{
					display: inline-block;
				}
				.search_title{
					position: absolute;
					left: 0px;
				}
				.shanchu{
					position: absolute;
					right: 0px;
					font-size: 25upx;
				}
			}
			>li{
				display: inline-block;
				float: left;
				width: 18%;
				line-height: 40upx;
				height: 40upx;
				text-align: center;
				background-color: #F8F8F8;
				margin: 0px 1%;
				margin-top: 15upx;
				color: #686868;
				border-radius: 20upx;
				text-overflow: ellipsis;
				overflow: hidden;
				white-space: nowrap;
				font-size: 22upx;
			}
			.search_title1{
				font-size: 14px;
			}
		}
		.noHistory{
			width: 100%;
			height: 100upx;
			font-size: 20upx;
			line-height: 100upx;
			text-align: center;
		}
	}
	.good_list{
		width: 100%;
		.title{
			width: 100%;
			height: 50upx;
			line-height: 50upx;
			background-color: #ffffff;
			font-size: 32upx;
			text-align: center;
		}
	}
	.header2{
		width: 92%;
		padding: 0 4%;
		height: 79upx;
		display: flex;
		justify-content: space-around;
		align-items: flex-end;
		position: fixed;
		top: 80upx;
		z-index: 10;
		background-color: #fff;
		border-bottom: solid 1upx #eee;
		.target{
			width: 20%;
			height: 60upx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 28upx;
			margin-bottom: -2upx;
			color: #aaa;
			&.on{
				color: #555;
				border-bottom: 4upx solid #f06c7a;
				font-weight: 600;
				font-size: 30upx;
			}
			
			
		}
	}
	.goods-list{
			.loading-text{
				width: 100%;
				display: flex;
				justify-content: center;
				align-items: center;
				height: 60upx;
				color: #979797;
				font-size: 24upx;
			}
			.product-list{
				width: 92%;
				padding: 0 4% 3vw 4%; 
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;
				.product{
					width: 48%;
					// border-radius: 20upx;
					background-color: #fff;
					margin: 0 0 15upx 0;
					box-shadow: 0upx 5upx 25upx rgba(0,0,0,0.1);
					image{
						width: 100%;
						// border-radius: 20upx 20upx 0 0;
					}
					.name{
						width: 92%;
						padding: 10upx 4%;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						text-align: justify;
						overflow: hidden;
						font-size: 30upx;
					}
					.info{
						display: flex;
						justify-content: space-between;
						align-items: flex-end;
						width: 92%;
						padding: 10upx 4% 10upx 4%;
						
						.price{
							color: #e65339;
							font-size: 30upx;
							font-weight: 600;
						}
						.slogan{
							color: #807c87;
							font-size: 24upx;
						}
					}
				}
				
			}
		}
		.noProduct{
			text-align: center;
		}
</style>
