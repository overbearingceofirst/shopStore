<template>
	<view>
		<view class="content" v-if="addressList.length > 0">
			<view class="list" >
				<view class="row" v-for="(row,index) in addressList" :key="index" @tap="select(row)">
					<view class="left">
						<view class="head">
							{{row.head}}
						</view>
					</view>
					<view class="center">
						<view class="name-tel">
							<view class="name">{{row.name}}</view>
							<view class="tel">{{row.phoneNumber}}</view>
							<view class="default" v-if="row.defaultStatus === 1">
								默认
							</view>
						</view>
						<view class="address">
							{{row.province}}-{{row.city}}-{{row.region}} {{row.detailAddress}}
						</view>
					</view>
					<view class="right">
						<view class="icon bianji" @tap.stop="edit(row)">				
						</view>
					</view>
				</view>
			</view>	
		</view>
		<view class="noData" v-else>
			暂无收货地址
		</view>
		<view class="add">
			<view class="btn" @tap="add">
				<view class="icon tianjia"></view>新增地址
			</view>
		</view>
	</view>
</template>
<script>
	import request from '../../../Tool/request.js'
	export default {
		data() {
			return {
				isSelect:false,
				addressList:[],
				orderId:'',
			};
		},
		onShow() {
			this.getArdessList()
		},
		onLoad(e) {
			if(e.type=='select'){
				this.isSelect = true;
			}
		},
		methods:{
			getArdessList(){
				const _that = this
				request({
					url:'/mall-portal/member/address/list',
					method:'GET',
					success(res){
						_that.addressList = res.data.data
					},
					fail(res){
						uni.showToast({
							title:'网络开小差了,正在为您返回之前的页面',
							icon:"none",
						})
						setTimeout(() => {
							uni.switchTab({
								url:'../../tabBar/user/user'
							})
						},1500)
					}
				})
			},
			edit(row){
				uni.setStorage({
					key:'address',
					data:row,
					success() {
						uni.navigateTo({
							url:"edit/edit?type=edit&id="+ row.id
						})
					}
				});
				
			},
			add(){
				uni.navigateTo({
					url:"edit/edit?type=add&address="+this.addressList
				})
			},
			select(row){
				const _that = this
				//是否需要返回地址(从订单确认页跳过来选收货地址)
				if(!this.isSelect){
					return ;
				}
				uni.getStorage({
					key:'selectAddress',
					success(res){
						_that.orderId = res.data.id
						request({
							url:'/mall-portal/order/orderConfirmAddress',
							method:'POST',
							data:{
								id:_that.orderId,
								receiverName:row.name,
								receiverPhone:row.phoneNumber,
								receiverPostCode:row.postCode,
								receiverProvince:row.province,
								receiverCity:row.city,
								receiverRegion:row.region,
								receiverDetailAddress:row.detailAddress
							},
							success(res){
								console.log(res)
								uni.setStorage({
									key:'selectAddress',
									data:{
										id:_that.orderId,
										name: row.name,
										phoneNumber: row.phoneNumber,
										postCode: row.postCode,
										province: row.province,
										region: row.region,
										city: row.city,
										detailAddress:row.detailAddress,
									},
									success() {
										uni.navigateBack();
									}
								})
							}
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
view{
	display: flex;
}
	.icon {
		// &.bianji {
		// 	&:before{content:"\e61b";}
		// }
		// &.tianjia {
		// 	&:before{content:"\e81a";}
		// }
	}
	.add{
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 120upx;
		justify-content: center;
		align-items: center;
		.btn{
			box-shadow: 0upx 5upx 10upx rgba(0,0,0,0.4);
			width: 70%;
			height: 80upx;
			border-radius: 80upx;
			background-color: #f06c7a;
			color: #fff;
			justify-content: center;
			align-items: center;
			.icon{
				height: 80upx;
				color: #fff;
				font-size: 30upx;
				justify-content: center;
				align-items: center;
			}
			font-size: 30upx;
		}
	}
	.list{
		flex-wrap: wrap;
		.row{
			width: 96%;
			padding: 20upx 2%;
			.left{
				width: 90upx;
				flex-shrink: 0;
				align-items: center;
				.head{
					width: 70upx;
					height: 70upx;
					background:linear-gradient(to right,#ccc,#aaa);
					color: #fff;
					justify-content: center;
					align-items: center;
					border-radius: 60upx;
					font-size: 35upx;
				}
			}
			.center{
				width: 100%;
				flex-wrap: wrap;
				.name-tel{
					width: 100%;
					align-items: baseline;
					.name{
						font-size: 34upx;
					}
					.tel{
						margin-left: 30upx;
						font-size: 24upx;
						color: #777;
					}
					.default{

						font-size: 22upx;
						
						background-color: #f06c7a;
						color: #fff;
						padding: 0 18upx;
						border-radius: 24upx;
						margin-left: 20upx;
					}
				}
				.address{
					width: 100%;
					font-size: 24upx;
					align-items: baseline;
					color: #777;
				}
			}
			.right{
				flex-shrink: 0;
				align-items: center;
				margin-left: 20upx;
				.icon{
					justify-content: center;
					align-items: center;
					width: 80upx;
					height: 60upx;
					border-left: solid 1upx #aaa;
					font-size: 40upx;
					color: #777;
				}
			}
		}
	}
	.noData{
		width: 100%;
		height:100upx;
		line-height: 100upx;
		// background-color: #1AAD19;
		font-size: 24upx;
		color: #C0C0C0;
		justify-content: center;
	}
</style>
