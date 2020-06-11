<template>
	<view>
		<view class="block">
			<view class="user">
				<view class="img"></view>
				<view class="user_name">
					forgetting55555555555555555555555
				</view>
				<view class="user_vip">
					普通会员
				</view>
			</view>
		</view>
		<view class="block2">
			<view class="content">
				<view class="my">
					支付金额：￥1800
				</view>
				<view class="my">
					联系方式：<input  v-model="inputAmount" placeholder="请输入联系人电话" type="number" maxlength="11" />
				</view>
			</view>
		</view>
		<view class="pay">
			<button class="btn"   @tap="doDeposit">微信支付(开通会员)</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tis:"保存到相册",
				showBtn:false
			};
		},
		onLoad() {
			// #ifdef APP-PLUS
			this.showBtn = true;
			// #endif
		},
		methods:{
			// 截图，调用webview、Bitmap方法
			printscreen(){
				this.tis = "正在保存"
				let ws=this.$mp.page.$getAppWebview();
				let bitmap = new plus.nativeObj.Bitmap();
				this.showBtn = false;
				this.$nextTick(function(){
					setTimeout(()=>{
						ws.draw(bitmap,(e)=>{
							this.showBtn = true;
							console.log('bitmap绘制图片成功');
							console.log("e: " + JSON.stringify(e));
							bitmap.save("_doc/Qr.jpg", {
								overwrite: true,
								quality: 100
							}, (i)=>{
								plus.gallery.save(i.target,(e)=>{
									uni.showToast({
										title:'保存成功'
									})
									this.tis = "保存到相册"
									bitmap.clear(); //销毁
								},(e)=>{
									bitmap.clear(); //销毁
								});
							},(e)=>{
								console.log('保存图片失败：' + JSON.stringify(e));
							});
						},(e)=>{
							console.log('bitmap绘制图片失败：'+JSON.stringify(e));
						});
					},200)
				})
			},
			doDeposit(){
				if (parseFloat(this.inputAmount).toString() == "NaN") {
					uni.showToast({title:'请输入联系人电话',icon:'none'});
					return ;
				}
				if(this.inputAmount<=0){
					uni.showToast({title:'请输入大于0的金额',icon:'none'});
					return ;
				}
				if(parseFloat(this.inputAmount).toFixed(2)!=parseFloat(this.inputAmount)){
					uni.showToast({title:'最多只能输入两位小数哦~',icon:'none'});
					return ;
				}
				//模板模拟支付，实际应用请调起微信/支付宝
				uni.showLoading({
					title:'支付中...'
				});
				setTimeout(()=>{
					uni.hideLoading();
					uni.showToast({
						title:'支付成功'
					});
					setTimeout(()=>{
						uni.redirectTo({
							url:'../../pay/success/success?amount='+this.inputAmount
						});
					},300);
				},700)
			}
		}
	}
</script>

<style lang="scss">
page{
	background-color: #F3F3F3;
}
.block{
	width: 100%;
	height: 30vh;
	background-color: #FD5454;
	display: flex;
	justify-content: center;
	.user{
		width: 10vh;
		height: 16vh;
		// background-color: #FFFFFF;
		margin: 0px auto;
		margin-top: 7vh;
		color: #FFFFFF;
		font-size: 28upx;
		>view{
			width: 100%;
			text-overflow: ellipsis;
			overflow: hidden;
			white-space: nowrap;
			text-align: center;
		}
		.img{
			width: 100%;
			height: 10vh;
			border: 2upx solid #FFFFFF;
			border-radius: 50%;
			>image{
				width: 100%;
				height: 100%;
				background-repeat: no-repeat;
			}
		}
		.user_name{
			height: 5vh;
			line-height: 5vh;
		}
	}
	
}
.block2{
		width: 94%;
		padding: 0upx 3%;
		margin-top: 20upx;
		background-color: #FFFFFF;
		.title{
			width: 100%;
			font-size: 34upx;
		}
		.content{
			.my{
				width: 100%;
				height: 100upx;
				display: flex;
				align-items: center;
				font-size: 30upx;
				border-bottom: solid 1upx #eee;
			}
			.amount{
				width: 100%;
				
				.list{
					display: flex;
					justify-content: space-between;
					padding: 20upx 0;
					.box{
						width: 30%;
						height: 120upx;
						display: flex;
						justify-content: center;
						align-items: center;
						border-radius: 10upx;
						box-shadow: 0upx 5upx 20upx rgba(0,0,0,0.05);
						font-size: 36upx;
						background-color: #f1f1f1;
						color: 333;
						&.on{
							background-color: #f06c7a;
							color: #fff;
						}
					}
				}
				.num{
					margin-top: 10upx;
					display: flex;
					justify-content: flex-end;
					align-items: center;
					.text{
						padding-right: 10upx;
						font-size: 30upx;
					}
					.input{
						width: 28.2vw;
						border-bottom: solid 2upx #999;
						
						justify-content: flex-end;
						align-items: center;
						input{
							margin: 0 20upx;
							height: 60upx;
							font-size: 30upx;
							color: #f06c7a;
							justify-content: flex-end;
							align-items: center;
						}
					}
				}
			}
			.pay-list{
				width: 100%;
				border-bottom: solid 1upx #eee;
				.row{
					width: 100%;
					height: 120upx;
					display: flex;
					align-items: center;
					.left{
						width: 100upx;
						flex-shrink: 0;
						display: flex;
						align-items: center;
						image{
							width: 80upx;
							height: 80upx;
						}
					}
					.center{
						width: 100%;
						font-size: 30upx;
					}
					.right{
						width: 100upx;
						flex-shrink: 0;
						display: flex;
						justify-content: flex-end;
					}
				}
			}
		}
	}
	.pay{
		margin-top: 20upx;
		width: 100%;
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		.btn{
			width: 94%;
			height: 80upx;
			border-radius: 20upx;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #fff;
			background-color: #FF5555;
			box-shadow: 0upx 5upx 10upx rgba(0,0,0,0.2);
		}
	}
</style>
