<script>
	export default {
		globalData:{
			requestApi:'http://49fzbm.natappfree.cc',
			userID:''
		},
		onLaunch: function () {
			uni.getStorage({
				key:'userMessage',
				success(res){
					console.log(res)
					getApp().globalData.userID=res.data.id
				}
			})
			console.log('App Launch')
		},
		onShow: function () {
			console.log('App Show')
		},
		onHide: function () {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "/static/iconfont/font.scss";
</style>
