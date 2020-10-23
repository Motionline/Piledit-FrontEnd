import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const components = {
  namespaced: true,
  state: {
    allComponents: {}
  },
  getters: {
    allComponents: (state) => state.allComponents
  },
  mutations: {
    addComponent (state, { payload }) {
      Vue.set(state.allComponents, payload.componentUniqueKey, payload.componentArr)
    },
    removeComponent (state, { payload }) {
      Vue.delete(state.allComponents, payload)
    },
    updateComponent (state, { payload }) {
      Vue.set(state.allComponents, payload.componentUniqueKey, payload.componentArr)
    }
  },
  actions: {
    add ({ commit }, componentData) {
      console.log('add component! ', componentData)
      commit('addComponent', { payload: componentData })
    },
    remove ({ commit }, componentUniqueKey) {
      console.log('remove component! ', componentUniqueKey)
      commit('removeComponent', { payload: componentUniqueKey })
    },
    update ({ commit }, componentData) {
      console.log('update component! ', componentData)
      commit('updateComponent', { payload: componentData })
    }
  }
}

export const Components = components
