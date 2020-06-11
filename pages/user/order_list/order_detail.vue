<template>
	<view class="order_detail">
		<view class="body">
		<view class="order_status">
			<view class="title">
				{{typeText[list[0].status]}}
			</view>
			<view class="">
				订单金额(含运费):￥1960.00
			</view>
		</view>
		<view class="order_address">
			<view class="address_img"></view>
			<view class="address">
				<view class="">
					{{list[0].receiverName}}&nbsp;&nbsp;{{list[0].receiverPhone}}
				</view>
				<view class="address_detail">
					{{list[0].receiverProvince}}-{{list[0].receiverCity}}-{{list[0].receiverRegion}}-{{list[0].receiverDetailAddress}}
				</view>
			</view>
		</view>
		<view class="order" v-for="(item,index) in list" :key="index">
			<view class="title">
				52
			</view>
			<view class="order_message">
				<view class="order_img">
					<img :src=item.productPic alt="">
				</view>
				<view class="order_title">{{item.productName}}</view>
				<view class="order_price">
					<view class="price">
						￥{{item.productPrice}}
					</view>
					<view class="number">
						x{{item.productQuantity}}
					</view>
				</view>
			</view>
		</view>
		<view class="titles">
			<view class="">
				<view class="title">商品小计</view>
				<view class="data">￥{{list[0].payAmount | toFixed}}</view>
			</view>
			<view class="">
				<view class="title">运费</view>
				<view class="data">￥{{0 | toFixed}}</view>
				</view>
			<view class="">
				<view class="title">实付费(含运费)</view>
				<view class="price">￥{{list[0].payAmount | toFixed}}</view>
			</view>
		</view>
		<view class="order_messages">
			<view>订单编号：{{list[0].orderSn}}</view>
			<view>创建时间：{{list[0].createTime | changeTime}}</view>
		</view>
		</view>
		<view class="bottom">
			<view class="btn">
				客服
			</view>
			<view class="btns">
				<block v-if="list[0].status == 0"><view class="btn">去支付</view><view class="btn">支付订单</view></block>
				<block v-if="list[0].status == 1"><view class="btn">提醒发货</view></block>
				<block v-if="list[0].status == 2"><view class="btn">查看物流</view></block>
				<block v-if="list[0].status == 3"><view class="btn">订单已关闭</view></block>
				<block v-if="list[0].status == 4"><view class="btn">已取消</view></block>
			</view>
		</view>
	</view>
</template>

<script>
	import request from '../../../Tool/request.js'
	export default{
		data(){
			return{
				status:2,
				userId:'',
				typeText:{
					0:'等待付款',
					1:'等待商家发货',
					2:'商家已发货',
					3:'交易已完成',
					4:'已关闭',
					5:'无效订单'
				},
				list:[]
			}
		},
		onLoad(option) {
			this.getOrder(option.orderSn,option.status)
		},
		filters:{
			toFixed:function(x) {
				return parseFloat(x).toFixed(2);
			},
			changeTime:function(date) {
			        var newDate = new Date(date).toJSON();
			        return new Date(+new Date(newDate) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
			   }
		},
		methods:{
			getOrder(Sn,statu){
				console.log(Sn,statu)
				const _that = this
				const sn = Sn
				const statuS = statu
				uni.getStorage({
					key:'userMessage',
					success(res){
						const userId = res.data.id
						request({
							url:'/mall-portal/order/selectOrderStatus',
							method:'POST',
							data:{
								memberId:userId,
								status:statuS,
								orderSn:sn
							},
							success(res){
								const data = res.data.data
								console.log(data)
								// const s = new Set() //实例化对象
								// data.forEach(item => s.add(item.orderSn)) //添加值（Set可以去掉重复数据）
								// let newData = Array.from({ length: s.size }, () => []) //创建指定长度数组并添值
								// data.forEach(item => {
								//     let index = [...s].indexOf(item.orderSn) //找到指定下标
								//     newData[index].push(item) //添加数据
								// })
								// console.log(newData[0])
								_that.list = data
							}
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #F3F3F3;
	}
	.body{
		width: 100%;
		height: calc(100vh - 80upx);
		overflow-y: auto;
		// background-color: #2C405A;
		margin-bottom: 80upx;
	}
	.order_status{
		width: 100%;
		height: 14vh;
		text-align: center;
		background:linear-gradient(left , #FFB646 0%,#FE9C2D 100%);
		color: #FFFFFF;
		.title{
			font-size: 32upx;
			font-weight: bold;
			line-height: 7vh;
		}
		view{
			width: 100%;
			height: 7vh;
			font-size: 28upx;
		}
	}
	.order_address{
		width: 92%;
		padding: 0upx 4%;
		height: 10vh;
		background-color: #FFFFFF;
		margin: 20upx auto;
		.address_img{
			width: 60upx;
			height: 100%;
			background-color: #000000;
			margin-right: 20upx;
		}
		.address{
			height: 100%;
			width: calc(100% - 80upx);
			>view{
				line-height: 5vh;
				width: 100%;
				overflow: hidden;
				text-overflow:ellipsis;
				white-space: nowrap;
			}
			.address_detail{
				color: #A6A6A6;
				font-size: 28upx;
			}
		}
		>view{
			display: inline-block;
			float: left;
		}
	}
	.order{
		width: 92%;
		padding: 0upx 4%;
		background-color: #FFFFFF;
		.title{
			width: 100%;
			height: 5vh;
			line-height: 5vh;
		}
		.order_message{
			height: 160upx;
			width: 100%;
			border-top: 1upx solid #F2F2F2;
			padding: 20upx 0upx;
			overflow: hidden;
			position: relative;
			>view{
				display: inline-block;
				float: left;
				// margin-right: 20upx;
			}
			.order_img{
				width: 160upx;
				height: 160upx;
				background-color: #007AFF;
				>img{
					width: 100%;
					height:100%;
				}
			}
			.order_title{
				width: 52%;
				// background-color: #4CD964;
				word-wrap: break-word;
				margin-left: 20upx;
			}
			.order_price{
				width: 19%;
				margin-left: 20upx;
				>view{
					width: 100%;
					overflow: hidden;
					text-overflow:ellipsis;
					white-space: nowrap;
				}
				.price{
					width: 100%;
				}
				.number{
					width: 100%;
					color: #727272;
					text-align: right;
				}
			}
		}
	}
	.titles{
		background-color: #FFFFFF;
		width: 92%;
		padding: 0upx 4%;
		margin: 20upx auto;
		>view{
			font-size: 26upx;
			color:#A3A3A3;
			height: 80upx;
			line-height: 80upx;
			border-bottom: 1upx solid #F2F2F2;
			>view{
				display: inline-block;
				float: left;
				width: 50%;
				overflow: hidden;
				text-overflow:ellipsis;
				white-space: nowrap;
			}
			.data{
				text-align: right;
				color: #000000;
			}
			.price{
				color: #E65339;
				text-align: right;
				font-size: 32upx;
			}
		}
	}
	.order_messages{
		width: 92%;
		padding: 20upx 4%;
		background-color: #FFFFFF;
		font-size: 24upx;
		color: #A3A3A3;
		>view{
			width: 100%;
			overflow: hidden;
			text-overflow:ellipsis;
			white-space: nowrap;
			height: 50upx;
			line-height: 50upx;
		}
	}
	.bottom{
		width: 92%;
		height: 80upx;
		// line-height: 80upx;
		background-color: #FFFFFF;
		padding: 0upx 4%;
		position: fixed;
		bottom: 0upx;
		 align-items:center;
		 display: flex;
		.btn{
			// width: 80upx;
			height: 50upx;
			font-size: 26upx;
			line-height: 50upx;
			text-align: center;
			padding: 0upx 20upx;
			border: 1upx solid #000000;
			border-radius: 40upx;
		}
		.btns{
			position: absolute;
			right: 4%;
			>view{
				display: inline-block;
				float: left;
				margin-left: 20upx;
			}
		}
	}
</style>
