import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false
Vue.prototype.$serverUrl = 'http://192.168.1.105:8201/mall-portal'

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
