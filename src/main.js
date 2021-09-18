// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/index.css'

Vue.use(ElementUI, {size: 'small'})

import fabric from 'fabric'
Vue.use(fabric);
//npm i v-charts echarts -S //https://v-charts.js.org/#/
import VCharts from 'v-charts' //https://blog.csdn.net/tscn1/article/details/111650488
Vue.use(VCharts)
    
/* eslint-disable no-new */
new Vue({
    el: '#app',
    components: {App},
    template: '<App/>'
})
