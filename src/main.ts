import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'
import vuetify from './plugins/vuetify'
import VueHead from 'vue-head'
import adobeLoader from './assets/adobefont'
import { firestorePlugin } from 'vuefire'
import Firebase from 'firebase/app'
import { credentials } from './@types/piledit'
// import axios from 'axios'
// import VueAxios from 'vue-axios'

Vue.config.productionTip = false
// Vue.use(axios)

Vue.use(VueHead)
Vue.use(firestorePlugin)

adobeLoader(document)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
