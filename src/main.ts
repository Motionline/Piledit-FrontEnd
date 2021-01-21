import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store, { sessionsModule } from './store/store'
import vuetify from './plugins/vuetify'
import VueHead from 'vue-head'
import adobeLoader from './assets/adobefont'
import { firestorePlugin } from 'vuefire'
import { Auth } from '@/firebase/auth'

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

Auth.onAuthStateChanged(user => {
  sessionsModule.updateLogInState({ user })
})
