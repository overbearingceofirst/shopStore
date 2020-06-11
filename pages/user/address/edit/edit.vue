<template>
	<view>
		<view class="content">
			<view class="row">
				<view class="nominal">
					收件人
				</view>
				<view class="input">
					<input placeholder="请输入收件人姓名" maxlength="20" type="text" v-model="addressData.name" />
				</view>
			</view>
			<view class="row">
				<view class="nominal">
					电话号码
				</view>
				<view class="input">
					<input placeholder="请输入收件人电话号码" maxlength="11" type="number" v-model="addressData.phoneNumber" />
				</view>
			</view>
			<view class="row">
				<view class="nominal">
					邮政编码
				</view>
				<view class="input">
					<input placeholder="请输入邮政编码" type="number" maxlength="6" v-model="addressData.postCode" />
				</view>
			</view>
			<view class="row">
				<view class="nominal">
					所在地区
				</view>
				<view class="input" @tap="chooseCity">
					{{region.label}}
				</view>
				
			</view>
			<view class="row">
				<view class="nominal">
					详细地址
				</view>
				<view class="input">
					<textarea v-model="addressData.detailAddress" auto-height="true" placeholder="输入详细地址"></textarea>
				</view>
			</view>
			<view class="row">
				<view class="nominal">
					设置默认地址
				</view>
				<view class="input switch">
					<switch color="#f06c7a" :checked="isDefault" @change=isDefaultChange />
				</view>
			</view>
			<view class="row" v-if="editType=='edit'" @tap="del">
				<view class="del">
					删除收货地址
				</view>
			</view>
		</view>
		<view class="save" @tap="save">
			<view class="btn">
				保存地址
			</view>
		</view>
		<mpvue-city-picker :themeColor="themeColor" ref="mpvueCityPicker" :pickerValueDefault="cityPickerValue" @onCancel="onCancel" @onConfirm="onConfirm"></mpvue-city-picker>
	</view>
</template>

<script>
	import mpvueCityPicker from '@/components/mpvue-citypicker/mpvueCityPicker.vue'
	import request from'../../../../Tool/request.js'
	export default {
		components: {
			mpvueCityPicker
		},
		data() {
			return {
				addressData:{
					"city": "",
					"defaultStatus": 0,
					"detailAddress": "",
					"name": "",
					"phoneNumber": "",
					"postCode": "",
					"province": "",
					"region": ""
				},
				type:'',
				arr:[],
				editType:'edit',
				id:'',
				name:'',
				tel:'',
				detailed:'',
				isDefault:false,
				cityPickerValue: [0, 0, 1],
				themeColor: '#007AFF',
				region:{label:"请点击选择地址",value:[],cityCode:""}
			};
		},
		methods: {
			onCancel(e) {
				console.log(e)
			},
			chooseCity() {
				this.$refs.mpvueCityPicker.show()
			},
			onConfirm(e) {
				this.region = e;
				console.log(e)
				this.cityPickerValue = e.value;
				 this.arr =e.label.split('-')
				 this.addressData.province = this.arr[0],
				 this.addressData.city = this.arr[1],
				 this.addressData.region = this.arr[2]
				 console.log(this.addressData)
				 
			},
			isDefaultChange(e){
				this.isDefault = e.detail.value;
				if(this.isDefault == true){
					this.addressData.defaultStatus = 1
				}else{
					this.addressData.defaultStatus = 0
				}
			},
			goBack(titel1,icon,title2,icon2){
				let title3 = titel1
				let title4 = title2
				let icon3 = icon
				let icon4 = icon2
				uni.showLoading({
					title:title3,
					icon:icon3
				})
				setTimeout(()=>{
					uni.hideLoading()
					uni.showToast({
						title:title4,
						icon:icon4,
						success() {
							setTimeout(() => {
								uni.navigateBack({
									delta:1
								})
							},2000)
						}
					})
				},1000)
			},
			del(){
				let _that = this
				uni.showModal({
					title: '删除提示',
					content: '你将删除这个收货地址',
					success: (res)=>{
						if (res.confirm) {
							request({
								url:'/mall-portal/member/address/delete/' + _that.id,
								method:'POST',
								success(res){
									_that.goBack('删除中','loading','删除成功，正在为您跳转至之前页面','none')
								}
							})
							
						}
					}
				});
				
			},
			save(){
				let _that = this
				let data=this.addressData
				//判断是添加还是修改
					if(!data.name){
						uni.showToast({title:'请输入收件人姓名',icon:'none'});
						return ;
					}
					if(!data.phoneNumber || !(/^1(3|4|5|6|7|8|9)\d{9}$/.test(data.phoneNumber))){
						uni.showToast({title:'电话号码格式错误，请重新输入',icon:'none'});
						data.phoneNumber = ''
						return ;
					}
					if(!data.postCode || !(/^[1-9]\d{5}$/.test(data.postCode))){
						uni.showToast({title:'邮政编码格式错误,请重新输入',icon:'none'});
						data.postCode = ''
						return ;
					}
					if(!data.detailAddress){
						uni.showToast({title:'请输入收件人详细地址',icon:'none'});
						return ;
					}
					uni.showLoading({
						title:'正在提交'
					})
					//实际应用中请提交ajax,模板定时器模拟提交效果
				if(_that.type === 'add'){
					if(this.arr == 0){
						uni.showToast({title:'请选择收件地址',icon:'none'});
						return ;
					}
					setTimeout(()=>{
						request({
							url:'/mall-portal/member/address/add',
							method:'POST',
							data:{
								"city": _that.addressData.city,
								"defaultStatus": _that.addressData.defaultStatus,
								"detailAddress": _that.addressData.detailAddress,
								"name": _that.addressData.name,
								"phoneNumber": _that.addressData.phoneNumber,
								"postCode": _that.addressData.postCode,
								"province": _that.addressData.province,
								"region": _that.addressData.region
							},
							success(res){
								_that.goBack('提交中','loading','新增成功，正在为您跳转至之前页面','none')
							}
						})
					},300)
					
				}
				if(_that.type=='edit'){
					request({
						url:'/mall-portal/member/address/update/' + _that.id,
						method:'POST',
						data:{
							"city": _that.addressData.city,
							"defaultStatus": _that.addressData.defaultStatus,
							"detailAddress": _that.addressData.detailAddress,
							"name": _that.addressData.name,
							"phoneNumber": _that.addressData.phoneNumber,
							"postCode": _that.addressData.postCode,
							"province": _that.addressData.province,
							"region": _that.addressData.region
						},
						success(res){
							_that.goBack('保存中','loading','保存成功，正在为您跳转至之前页面','none')
						}
					})
				}			
			}
		},
		onLoad(e) {
			//获取传递过来的参数	
			this.type = e.type
			this.id = e.id
			if(e.type === 'add' && e.address === ''){
				this.addressData.defaultStatus = 1
				this.isDefault = true
			}
			if(e.type=='edit'){
				let _that = this
				request({
					url:'/mall-portal/member/address/' + e.id,
					method:'GET',
					success(res){
						let data = res.data.data
						_that.addressData = data
						_that.region.label = data.province+'-'+data.city +'-'+data.region
						if(data.defaultStatus === 1){
							_that.isDefault = true
						}
					},
					fail(res){
						uni.showToast({
							title:"对不起连接超时,正在为您返回上一级页面",
							icon:'none'
						})
						setTimeout(()=>{
							uni.navigateBack({
								delta:1
							},300)
						})
					}
				})
			}
			this.editType = e.type;
			
		},
		onBackPress() {
			if (this.$refs.mpvueCityPicker.showPicker) {
				this.$refs.mpvueCityPicker.pickerCancel();
				return true;
			}
		},
		onUnload() {
			if (this.$refs.mpvueCityPicker.showPicker) {
				this.$refs.mpvueCityPicker.pickerCancel()
			}
		}
	};
</script>
<style lang="scss">

.save{
		view{
			display: flex;
		}
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 120upx;
		display: flex;
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
	.content{
		display: flex;
		flex-wrap: wrap;
		view{
			display: flex;
		}
		.row{
			width: 94%;
			
			margin: 0 3%;
			border-top: solid 1upx #eee;
			.nominal{
				width: 30%;
				height: 120upx;
				font-weight: 200;
				font-size: 30upx;
				align-items: center;
			}
			.input{
				width: 70%;
				padding: 20upx 0;
				align-items: center;
				font-size: 30upx;
				&.switch{
					justify-content: flex-end;
				}
				.textarea{
					margin: 20upx 0;
					min-height: 120upx;
				}
			}
			.del{
				width: 100%;
				height: 100upx;
				justify-content: center;
				align-items: center;
				font-size: 36upx;
				color: #f06c7a;
				background-color: rgba(255,0,0,0.05);
				border-bottom: solid 1upx #eee;
			}
		}
	}
	
</style>
