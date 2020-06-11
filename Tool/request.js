import baseurl from './config.js'
const request = function(options) {
     options.url = baseurl + options.url;
     try {
      const token = uni.getStorageSync('token');
		//时隔两个小时执行一次方法    如果token过期则就跳转至登录界面
		setInterval(() => {
			uni.getStorage({
					key:'token',
					success(res){
						var refreshToken = res.data
						uni.request({
							url:baseurl + '/mall-portal/sso/refreshToken',
							method:'GET',
							header:{
								'Authorization' : 'Bearer ' + refreshToken
							},
							success(res) {
								let tokenTime = res.data
								if(tokenTime.code === 500 && tokenTime.message === 'token已经过期！'){
									uni.showToast({
										title:'对不起登录超时，正在为您跳转至登录页',
										icon:'none',
										success() {
											setTimeout(() => {
												uni.redirectTo({
													url:"/pages/login/login",
												})
											},2000)
										}
									})
								}
							}
						})
					},
					fail(res) {
						console.log(res)
					}
				})
			},7200000)
       if (token) {
         options.header = {
           'Authorization' : 'Bearer ' + token
         }
        }else{
			uni.showToast({
				title:'对不起未登录，正在为您跳转至登录界面',
				icon:'none',
				success() {
					setTimeout(() => {
						uni.redirectTo({
							url:"/pages/login/login",
						})
					},2000)
				}
			})
            return;
        }
     } catch (err) {
    }
    return uni.request(options);
  }
export default request;