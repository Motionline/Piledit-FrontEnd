import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store, { sessionsModule, tabsModule } from './store/store'
import vuetify from './plugins/vuetify'
import VueHead from 'vue-head'
import adobeLoader from './assets/adobefont'
import VueVideoPlayer from 'vue-video-player'
import 'video.js/dist/video-js.css'
import { firestorePlugin } from 'vuefire'
import { Auth } from '@/firebase/auth'
import { MenuMixin } from '@/mixin/menu'
import { remote } from 'electron'
const Menu = remote.Menu

// import axios from 'axios'
// import VueAxios from 'vue-axios'

Vue.config.productionTip = false
// Vue.use(axios)

Vue.use(VueHead)
Vue.use(firestorePlugin)
Vue.use(VueVideoPlayer)

adobeLoader(document)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

const menu = MenuMixin.getMenu()
Menu.setApplicationMenu(menu)

const tabs = tabsModule.tabs
const tab = tabs[tabsModule.currentViewingTabUuid]
const tabHistoryIndex = tab.history.historyIndex
const url = tab.history.historyContainer[tabHistoryIndex].url
tabsModule.routerPush({ url })

Auth.onAuthStateChanged(user => {
  sessionsModule.updateLogInState({ user })
})
