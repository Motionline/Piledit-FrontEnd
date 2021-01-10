import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'
import vuetify from './plugins/vuetify'
import VueHead from 'vue-head'
// import axios from 'axios'
// import VueAxios from 'vue-axios'

Vue.config.productionTip = false
// Vue.use(axios)

Vue.use(VueHead)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
