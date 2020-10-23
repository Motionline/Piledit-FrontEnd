import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const blocks = {
  namespaced: true,
  state: {
    allBlocks: {},
    objectOfBlockAndComponent: {}
  },
  getters: {
    allBlocks: (state) => state.allBlocks
  },
  mutations: {
    addBlock (state, { payload }) {
      Vue.set(state.allBlocks, payload.blockUniqueKey, payload.block)
    },
    removeBlock (state, { payload }) {
      Vue.delete(state.allBlocks, payload)
    },
    updateBlock (state, { payload }) {
      state.allBlocks[payload.blockUniqueKey].position = payload.position
    },
    updateChildBlock (state, { payload }) {
      let blockInSearch = state.allBlocks[payload.blockUniqueKey]
      while (blockInSearch.childBlockUniqueKey !== '') {
        const child = state.allBlocks[blockInSearch.childBlockUniqueKey]
        child.position = {
          x: blockInSearch.position.x,
          y: blockInSearch.position.y + calcHeight(blockInSearch.blockType)
        }
        blockInSearch = state.allBlocks[blockInSearch.childBlockUniqueKey]
      }
    },
    addChild (state, { payload }) {
      state.allBlocks[payload.blockUniqueKey].childBlockUniqueKey = payload.childBlockUniqueKey
      state.allBlocks[payload.childBlockUniqueKey].parentBlockUniqueKey = payload.blockUniqueKey
      if (state.allBlocks[payload.blockUniqueKey].topBlockUniqueKey === '') {
        state.allBlocks[payload.childBlockUniqueKey].topBlockUniqueKey = payload.blockUniqueKey
      } else {
        state.allBlocks[payload.childBlockUniqueKey].topBlockUniqueKey = state.allBlocks[payload.blockUniqueKey].topBlockUniqueKey
      }
    },
    removeChild (state, { payload }) {
      const childBlockUniqueKey = state.allBlocks[payload.blockUniqueKey].childBlockUniqueKey
      state.allBlocks[payload.blockUniqueKey].childBlockUniqueKey = ''
      state.allBlocks[childBlockUniqueKey].parentBlockUniqueKey = ''
      state.allBlocks[payload.blockUniqueKey].topBlockUniqueKey = ''
    },
    showShadow (state, { payload }) {
      state.allBlocks[payload.blockUniqueKey].showShadow = true
    },
    hideShadow (state, { payload }) {
      state.allBlocks[payload.blockUniqueKey].showShadow = false
    },
    addRelationBlockAndComponent (state, { payload }) {
      Vue.set(state.objectOfBlockAndComponent, payload.blockUniqueKey, payload.componentUniqueKey)
    },
    removeRelationBlockAndComponent (state, { payload }) {
      Vue.delete(state.objectOfBlockAndComponent, payload.blockUniqueKey)
    }
  },
  actions: {
    add ({ commit }, block) {
      const blockUniqueKey = generateUuid()
      const payload = {
        blockUniqueKey,
        block: {
          position: block.position,
          blockType: block.blockType,
          showShadow: false,
          childBlockUniqueKey: '',
          blockUniqueKey,
          parentBlockUniqueKey: '',
          topBlockUniqueKey: ''
        }
      }
      commit('addBlock', { payload })
    },
    remove ({ commit, state, dispatch }, blockUniqueKey) {
      const block = state.allBlocks[blockUniqueKey]
      const topBlock = state.allBlocks[block.topBlockUniqueKey]
      if (topBlock != null && topBlock.blockType === 'DefinitionComponentBlock') {
        const componentUniqueKey = state.objectOfBlockAndComponent[block.topBlockUniqueKey]
        let checkCurrentBlock = state.allBlocks[block.topBlockUniqueKey]
        const componentArr = []
        while (true) {
          componentArr.push({
            blockType: checkCurrentBlock.blockType,
            value: {}
          })
          checkCurrentBlock = state.allBlocks[checkCurrentBlock.childBlockUniqueKey]
          if (checkCurrentBlock.blockUniqueKey === blockUniqueKey) break
        }
        commit('removeChild', {
          payload: { blockUniqueKey: block.parentBlockUniqueKey }
        })
        dispatch('Components/update', { componentUniqueKey, componentArr }, { root: true })
      }
      commit('removeBlock', { payload: blockUniqueKey })
    },
    update ({ commit, state }, blockArg) {
      commit('updateBlock', { payload: blockArg })
      commit('updateChildBlock', { payload: blockArg })
      const blockUniqueKey = blockArg.blockUniqueKey
      const block = state.allBlocks[blockUniqueKey]
      const position = block.position
      for (const key of Object.keys(state.allBlocks)) {
        if (blockUniqueKey === key) continue
        const blockInSearch = state.allBlocks[key]
        const positionInSearch = blockInSearch.position
        const isNearBy = isNearbyBlocks(positionInSearch, position)
        const notHaveChildRelation = blockInSearch.childBlockUniqueKey === ''
        if (isNearBy && notHaveChildRelation) {
          commit('showShadow', { payload: { blockUniqueKey: key } })
        } else {
          commit('hideShadow', { payload: { blockUniqueKey: key } })
        }
      }
    },
    stopDragging ({ commit, state, dispatch }, blockArg) {
      const block = state.allBlocks[blockArg.blockUniqueKey]
      const position = block.position
      for (const key of Object.keys(state.allBlocks)) {
        if (blockArg.blockUniqueKey === key) continue
        const blockInSearch = state.allBlocks[key]
        const positionInSearch = blockInSearch.position
        const isNearby = isNearbyBlocks(positionInSearch, position)
        if (isNearby) {
          position.x = positionInSearch.x
          // TODO: 目視で48に設定してあるが、ブロックの高さに合わせて書くべき
          position.y = positionInSearch.y + calcHeight(blockInSearch.blockType)
          commit('updateBlock', {
            payload: {
              blockUniqueKey: blockArg.blockUniqueKey,
              position
            }
          })
          commit('updateChildBlock', { payload: blockArg })
          const payload = {
            blockUniqueKey: key,
            childBlockUniqueKey: blockArg.blockUniqueKey
          }
          if (blockInSearch.childBlockUniqueKey === '') {
            commit('addChild', { payload })
            if (blockInSearch.blockType === 'DefinitionComponentBlock') {
              const componentUniqueKey = generateUuid()
              commit('addRelationBlockAndComponent', {
                payload: { blockUniqueKey: key, componentUniqueKey }
              })
              const componentArr = []
              let checkCurrentBlock = state.allBlocks[key]
              while (true) {
                componentArr.push({
                  blockType: checkCurrentBlock.blockType,
                  value: {}
                })
                if (checkCurrentBlock.childBlockUniqueKey === '') break
                checkCurrentBlock = state.allBlocks[checkCurrentBlock.childBlockUniqueKey]
              }
              dispatch('Components/add', { componentUniqueKey, componentArr }, { root: true })
            }
            const topBlock = state.allBlocks[blockInSearch.topBlockUniqueKey]
            if (topBlock != null && topBlock.blockType === 'DefinitionComponentBlock') {
              const componentUniqueKey = state.objectOfBlockAndComponent[blockInSearch.topBlockUniqueKey]
              let checkCurrentBlock = state.allBlocks[blockInSearch.topBlockUniqueKey]
              const componentArr = []
              while (true) {
                componentArr.push({
                  blockType: checkCurrentBlock.blockType,
                  value: {}
                })
                if (checkCurrentBlock.childBlockUniqueKey === '') break
                checkCurrentBlock = state.allBlocks[checkCurrentBlock.childBlockUniqueKey]
              }
              dispatch('Components/update', { componentUniqueKey, componentArr }, { root: true })
            }
          }
          commit('hideShadow', {
            payload: { blockUniqueKey: key }
          })
        } else if (blockInSearch.childBlockUniqueKey === blockArg.blockUniqueKey && blockArg.blockUniqueKey !== key) {
          commit('removeChild', {
            payload: { blockUniqueKey: key }
          })
          const topBlock = state.allBlocks[blockInSearch.topBlockUniqueKey]
          if (topBlock != null && topBlock.blockType === 'DefinitionComponentBlock') {
            const componentUniqueKey = state.objectOfBlockAndComponent[blockInSearch.topBlockUniqueKey]
            let checkCurrentBlock = state.allBlocks[blockInSearch.topBlockUniqueKey]
            const componentArr = []
            while (true) {
              componentArr.push({
                blockType: checkCurrentBlock.blockType,
                value: {}
              })
              if (checkCurrentBlock.childBlockUniqueKey === '') break
              checkCurrentBlock = state.allBlocks[checkCurrentBlock.childBlockUniqueKey]
            }
            dispatch('Components/update', { componentUniqueKey, componentArr }, { root: true })
          }
          if (blockInSearch.blockType === 'DefinitionComponentBlock') {
            const componentUniqueKey = state.objectOfBlockAndComponent[key]
            commit('removeRelationBlockAndComponent', {
              payload: { blockUniqueKey: key }
            })
            dispatch('Components/remove', componentUniqueKey, { root: true })
          }
        }
      }
    }
  }
}

const calcHeight = (blockName) => {
  if (blockName === 'DefinitionComponentBlock') {
    return 51
  } else {
    return 37
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

const isNearbyBlocks = (position1, position2) => {
  const isNearbyX1 = (position1.x - position2.x) <= 80
  const isNearbyX2 = (position1.x - position2.x) >= -160
  const isNearbyY1 = (position2.y - position1.y) <= 65
  const isNearbyY2 = (position2.y - position1.y) >= 30
  return isNearbyX1 && isNearbyX2 && isNearbyY1 && isNearbyY2
}

export const Blocks = blocks
