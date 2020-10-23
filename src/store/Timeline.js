import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const timelineObjects = {
  namespaced: true,
  state: {
    componentObjects: {}
  },
  getters: {
    componentObjects: (state) => state.componentObjects
  },
  mutations: {
    addComponentObject (state, { payload }) {
      Vue.set(
        state.componentObjects,
        payload.componentObjectUniqueKey,
        payload.componentObject
      )
    },
    updatePosition (state, { payload }) {
      state.componentObjects[payload.componentObjectUniqueKey].position = payload.position
    },
    updateWidth (state, { payload }) {
      state.componentObjects[payload.componentObjectUniqueKey].width = payload.width
    }
  },
  actions: {
    add ({ commit }, componentObject) {
      const componentObjectUniqueKey = generateUuid()
      const payload = {
        componentObjectUniqueKey,
        componentObject: {
          componentUniqueKey: componentObject.key,
          position: {
            x: 0,
            y: 1
          },
          width: 200
        }
      }
      commit('addComponentObject', { payload })
    },
    updatePosition ({ commit }, componentObject) {
      const payload = {
        componentObjectUniqueKey: componentObject.componentObjectUniqueKey,
        position: componentObject.position
      }
      commit('updatePosition', { payload })
    },
    updateWidth ({ commit }, componentObject) {
      const payload = {
        componentObjectUniqueKey: componentObject.componentObjectUniqueKey,
        width: componentObject.width
      }
      commit('updateWidth', { payload })
    }
  }
}

const generateUuid = () => {
  const material = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.split('')
  for (let i = 0, len = material.length; i < len; i++) {
    if (material[i] === 'x') {
      material[i] = Math.floor(Math.random() * 16).toString(16)
    } else if (material[i] === 'y') {
      material[i] = (Math.floor(Math.random() * 4) + 8).toString(16)
    }
  }
  return material.join('')
}

export const Timeline = timelineObjects
