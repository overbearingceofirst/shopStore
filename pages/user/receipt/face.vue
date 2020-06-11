<template>
	<view class="face">
		<view class="collect" v-for="(item,index) in collectList" :key="index" @tap="harvest(index)">
			<view class="conent">
				<view class="round" :style="{backgroundColor:item.bg}">
					{{item.text}}
				</view>
				<view class="text">
					{{item.title}}
				</view>
			</view>
		</view>
		<view class="pop" v-show="pop">
			<view class="mask">
				<view class="inputMobal">
					<view class="top">
						<view class="title">提示</view>
						<input type="text" maxlength="12" v-model="inputValue" placeholder="请输入要赠送的积分" />
					</view>
					<view class="btns">
						<view class="btn1" @tap="pop = false">
							取消
						</view>
						<view class="btn2" @tap="ascertain">
							确定
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	export default{
		data(){
			return{
				inputValue:'',
				pop:false,
				collectList:[
					{text:'付积分',title:'我要付积分',bg:'#F6E51C'},
					{text:'收积分',title:'我要收积分',bg:'#F69A15'}
				]
			}
		},
		methods:{
			harvest(index){
				if(index === 0){
					this.pop = true
				}
			},
			ascertain(){
				if (parseFloat(this.inputValue).toString() == "NaN") {
					uni.showToast({title:'请输入正确金额',icon:'none'});
					return ;
				}
				if(this.inputValue<=0){
					uni.showToast({title:'请输入大于0的金额',icon:'none'});
					return ;
				}
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
							url:'../../pay/success/success?amount='+this.inputValue
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
	.collect{
		width: 90%;
		height: 420upx;
		background-color: #FFFFFF;
		margin: 20upx auto;
		border-radius: 20upx;
		.conent{
			width: 270upx;
			height:300upx;
			margin:0upx auto;
			padding: 60upx 0upx;
			.round{
				width: 260upx;
				height: 260upx;
				border-radius: 50%;
				background-color: #EC652F;
				text-align: center;
				line-height: 260upx;
				color: #FFFFFF;
			}
			.text{
				width: 100%;
				height: 60upx;
				line-height: 60upx;
				text-align: center;
			}
		}
	}
	.pop{
		// display: none;
		.mask{
			width: 100%;
			height: 100%;
			position: fixed;
			top: 0upx;
			z-index: 11;
			background-color: rgba(0,0,0,.5);
		}
		.inputMobal{
			width: 92%;
			height: 200upx;
			background-color: #FFFFFF;
			z-index: 12;
			border-radius: 10upx;
			margin: 0upx auto;
			margin-top: 50%;
			.top{
				width: 92%;
				height: 100upx;
				margin: 0upx auto;
				padding-top: 30upx;
				font-size: 28upx;
				color: #888888;
				>view{
					height: 50upx;
					line-height: 50upx;
				}
			}
			.btns{
				height: 70upx;
				width: 100%;
				border-top: 1upx solid #E8E8EA;
				>view{
					display: inline-block;
					float: left;
					width: calc(50% - 1upx);
					height: 70upx;
					line-height: 70upx;
					text-align: center;
				}
				.btn1{
					border-right: 1upx solid #E8E8EA;
				}
				.btn2{
					color: #3CC51F;
				}
			}
		}
	}
</style>
