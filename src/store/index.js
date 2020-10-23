import Vue from 'vue'
import Vuex from 'vuex'

import { Blocks } from './Blocks'
import { Components } from './Components'
import { Timeline } from './Timeline'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    Blocks,
    Components,
    Timeline
  }
})
