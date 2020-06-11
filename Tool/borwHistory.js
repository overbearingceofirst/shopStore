var arr = []
var addHistory = function(product){
		// console.log(product)
		var s = product
		// arr.push(s)
		// for(let i = 0; i<arr.length; i++){
		// 	console.log(arr[i].id)
		// }
		if(arr.indexOf(s.id) != -1){
			console.log("对不起内容相同了")
		}else{
			if(arr.length === 10){
				arr.unshift(s)
				arr.pop()
			}else{
				arr.unshift(s)
			}
		}
		// console.log(arr)
		uni.setStorage({
			key:'browHistory',
			data:arr
		})
}
export default addHistory