<template>
	<view>
		<view class="content">
			<view class="list">
				<view class="row">
					<view class="title">姓名</view>
					<view class="right">
						<input type="text" v-model="useeMessage.username" placeholder="请输入您的姓名"/>
					</view>
				</view>
				<view class="row">
					<view class="title">手机号</view>
					<view class="right">
						<input type="number" v-model="useeMessage.phone"  placeholder="请输入您的手机号"/>
					</view>
					<!-- <button type="default" size="mini" @tap="getUserInfo(e)">{{wxtitle}}</button> -->
				</view>
				<view class="row">
					<view class="title">微信号</view>
					<view class="right">
						{{wxstatus}}
					</view>
					<button type="default" size="mini" @tap="bindWx()">{{wxtitle}}</button>
				</view>
				<view class="row">
					<view class="title">出生日期</view>
					<view class="right">
						<picker mode="date" :value="date" placeholder="请选择" :start="startDate" :end="endDate" @change="bindDateChange">
						    <view class="uni-input">{{date}}</view>
						</picker>
					</view>
				</view>
				<view class="row">
					<view class="title">所在城市</view>
					<view class="right">
						 <div @click="showPicker">{{city}}</div>
						 <mpvue-picker ref="mpvuePicker" :mode="mode" :pickerValueDefault="pickerValueDefault" @onChange="onChange" @onConfirm="onConfirm" @onCancel="onCancel" :pickerValueArray="pickerValueArray"></mpvue-picker>
					</view>
				</view>
			</view>
			<button class="btn" @tap="doDeposit">确认修改</button>
		</view>
	</view>
</template>

<script>
	import mpvuePicker from '../../../components/mpvue-citypicker/mpvueCityPicker.vue'
	import request from '../../../Tool/request.js'
	export default {
		components:{
			mpvuePicker
		},
		onLoad() {
			this.getMsg()
		},
		data() {
			const currentDate = this.getDate({
			            format: true
			        })
			return {
				date:'请选择时间',
				useeMessage:{},
				city:'请选择城市',
				mode: 'selector',
				pickerValueDefault: [1],
				wxstatus:'',
				wxtitle:''
			};
		},
		 computed: {
		        startDate() {
		            return this.getDate('start');
		        },
		        endDate() {
		            return this.getDate('end');
		        }
		    },
		methods: {
			showType(tbIndex){
				this.tabbarIndex = tbIndex;
				this.list = this.orderList[tbIndex];
			},
			bindDateChange(e) {
			   this.date = this.useeMessage.date = e.target.value
			},
			 getDate(type) {
			            const date = new Date();
			            let year = date.getFullYear();
			            let month = date.getMonth() + 1;
			            let day = date.getDate();
			
			            if (type === 'start') {
			                year = year - 60;
			            } else if (type === 'end') {
			                year = year + 2;
			            }
			            month = month > 9 ? month : '0' + month;;
			            day = day > 9 ? day : '0' + day;
			            return `${year}-${month}-${day}`;
			 },
			 doDeposit(){
				 console.log(this.useeMessage)
				 uni.showToast({
				 	title:"修改成功"
				 })
				 setTimeout(() =>{
					uni.navigateBack({
						delta: 1
					}) 
				 },1000)
			 },
			 showPicker() {
			       this.$refs.mpvuePicker.show();
			 },
			 onConfirm(e) {
			   // console.log(e);
			 },
			 onChange(e) {
			   // console.log(e);
			  this.useeMessage.city = e.label;
			  this.city = e.label
			 },
			 onCancel(e) {
			   // console.log(e);
			 },
			 bindWx(){
				 const _that = this
				 if(_that.wxstatus === '未绑定' && _that.wxtitle === '绑定'){
					wx.login({
					     success: function (res) {
							let codeId = res.code
							request({
								url:'/mall-portal/sso/setOpenId?code='+ codeId,
								data:{
									code:codeId,
									memberId:_that.useeMessage.id
								},
								method:'GET',
								success(res){
									uni.setStorage({
										key:'openid',
										data:res.data.data
									})
								}
							})
					     }
					   })
				 }
			 },
			 getMsg(){
				 const _that = this
				 uni.getStorage({
				 	key:'userMessage',
				 	success(res) {
				 		const data = res.data
						if(data.openid){
							_that.wxstatus = '已绑定'
							_that.wxtitle = '解除绑定'
						}else{
							_that.wxstatus = '未绑定'
							_that.wxtitle = '绑定'
						}
				 		_that.useeMessage = data
				 	}
				 })
			 }
		}
	}
</script>

<style lang="scss">
page{
	background-color: #f3f3f3;	
}

.icon {
	font-size: 30upx;

}
.content{
	padding-bottom: 20upx;
	.list{
		width: 96%;
		padding-left: 4%;
		background-color: #fff;
		margin-bottom: 20upx;
		.row{
			widows: 100%;
			min-height: 90upx;
			display: flex;
			align-items: center;
			// justify-content: space-around;
			border-bottom: solid 1upx #eee;
			&:last-child{
				border-bottom: none;
			}
			.title{
				font-size: 32upx;
				color: #333;
				display: flex;
				width: 150upx;
			}
			.right{
				display: flex;
				align-items: center;
				color: #999;
				justify-content: center;
			}
			
		}
	}
}
.btn{
	width: 94%;
	height: 80upx;
	border-radius: 10upx;
	display: flex;
	justify-content: center;
	align-items: center;
	color: #fff;
	background-color: #FF5555;
	box-shadow: 0upx 5upx 10upx rgba(0,0,0,0.2);
}
</style>
