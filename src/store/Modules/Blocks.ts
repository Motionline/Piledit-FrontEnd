import {
  Module,
  VuexModule,
  Mutation,
  Action,
  getModule,
} from 'vuex-module-decorators'
import { Vue } from 'vue-property-decorator'
import store from '@/store/store'

interface IPosition {
  x: number
  y: number
}

interface IBlock {
  position: IPosition
  blockType: string
  showShadow: boolean
  childBlockUniqueKey: string
  blockUniqueKey: string
  parentBlockUniqueKey: string
  topBlockUniqueKey: string
}

export interface IBlockState {
  allBlocks: { [key: string]: IBlock }
  objectOfBlockAndComponent: { [key: string] : string }
}

@Module({ dynamic: true, store: store, name: 'Blocks', namespaced: true })
class Blocks extends VuexModule implements IBlockState {
  allBlocks: { [key: string]: IBlock } = {}
  objectOfBlockAndComponent: { [key: string]: string } = {}

  @Mutation
  public addBlock (block: IBlock) {
    Vue.set(this.allBlocks, block.blockUniqueKey, block)
  }

  @Mutation
  public removeBlock (blockUniqueKey: string) {
    Vue.delete(this.allBlocks, blockUniqueKey)
  }

  @Mutation
  public updateBlock (block: IBlock) {
    this.allBlocks[block.blockUniqueKey] = block
  }

  @Mutation
  public updateChildBlock (block: IBlock) {
    let blockInSearch = this.allBlocks[block.blockUniqueKey]
    while (blockInSearch.childBlockUniqueKey !== '') {
      const child = this.allBlocks[blockInSearch.childBlockUniqueKey]
      child.position = {
        x: blockInSearch.position.x,
        y: blockInSearch.position.y + calcHeight(blockInSearch.blockType)
      }
      blockInSearch = this.allBlocks[blockInSearch.childBlockUniqueKey]
    }
  }

  @Mutation
  public addChild (blockUniqueKey: string, childBlockUniqueKey: string) {
    this.allBlocks[blockUniqueKey].childBlockUniqueKey = childBlockUniqueKey
    this.allBlocks[childBlockUniqueKey].parentBlockUniqueKey = blockUniqueKey
    if (this.allBlocks[blockUniqueKey].topBlockUniqueKey === '') {
      this.allBlocks[childBlockUniqueKey].topBlockUniqueKey = blockUniqueKey
    } else {
      this.allBlocks[childBlockUniqueKey].topBlockUniqueKey = this.allBlocks[blockUniqueKey].topBlockUniqueKey
    }
  }

  @Mutation
  public removeChild (blockUniqueKey: string) {
    const childBlockUniqueKey = this.allBlocks[blockUniqueKey].childBlockUniqueKey
    this.allBlocks[blockUniqueKey].childBlockUniqueKey = ''
    this.allBlocks[childBlockUniqueKey].parentBlockUniqueKey = ''
    this.allBlocks[blockUniqueKey].topBlockUniqueKey = ''
  }

  @Mutation
  public showShadow (blockUniqueKey: string) {
    this.allBlocks[blockUniqueKey].showShadow = true
  }

  @Mutation
  public  hideShadow (blockUniqueKey: string) {
    this.allBlocks[blockUniqueKey].showShadow = false
  }

  @Mutation
  public addRelationBlockAndComponent (blockUniqueKey: string, componentUniqueKey: string) {
    Vue.set(this.objectOfBlockAndComponent, blockUniqueKey, componentUniqueKey)
  }

  @Mutation
  public removeRelationBlockAndComponent (blockUniqueKey: string) {
    Vue.delete(this.objectOfBlockAndComponent, blockUniqueKey)
  }

  @Action({})
  public add (position: IPosition, blockType: string) {
    const blockUniqueKey = generateUuid()
    const block: IBlock = {
      position,
      blockType,
      showShadow: false,
      childBlockUniqueKey: '',
      blockUniqueKey,
      parentBlockUniqueKey: '',
      topBlockUniqueKey: ''
    }
    this.addBlock(block)
  }

  @Action({})
  public remove (blockUniqueKey: string) {
    const block = this.allBlocks[blockUniqueKey]
    const topBlock = this.allBlocks[block.topBlockUniqueKey]
    if (topBlock != null && topBlock.blockType === 'DefinitionComponentBlock') {
      const componentUniqueKey = this.objectOfBlockAndComponent[block.topBlockUniqueKey]
      let checkCurrentBlock = this.allBlocks[block.topBlockUniqueKey]
      const componentArr = []
      while (true) {
        componentArr.push({
          blockType: checkCurrentBlock.blockType,
          value: {}
        })
        checkCurrentBlock = this.allBlocks[checkCurrentBlock.childBlockUniqueKey]
        if (checkCurrentBlock.blockUniqueKey === blockUniqueKey) break
      }
      this.removeChild(block.parentBlockUniqueKey)
      // dispatch('Components/update', { componentUniqueKey, componentArr }, { root: true })
    }
    this.removeBlock(blockUniqueKey)
  }

  @Action({})
  public update (blockArg: IBlock) {
    this.updateBlock(blockArg)
    this.updateChildBlock(blockArg)
    const blockUniqueKey = blockArg.blockUniqueKey
    const block = this.allBlocks[blockUniqueKey]
    const position = block.position
    for (const key of Object.keys(this.allBlocks)) {
      if (blockUniqueKey === key) continue
      const blockInSearch = this.allBlocks[key]
      const positionInSearch = blockInSearch.position
      const isNearBy = isNearbyBlocks(positionInSearch, position)
      const notHaveChildRelation = blockInSearch.childBlockUniqueKey === ''
      if (isNearBy && notHaveChildRelation) {
        this.showShadow(key)
      } else {
        this.hideShadow(key)
      }
    }
  }

  @Action({})
  public stopDragging (blockArg: IBlock) {
    const block = this.allBlocks[blockArg.blockUniqueKey]
    const position = block.position
    for (const key of Object.keys(this.allBlocks)) {
      if (blockArg.blockUniqueKey === key) continue
      const blockInSearch = this.allBlocks[key]
      const positionInSearch = blockInSearch.position
      const isNearby = isNearbyBlocks(positionInSearch, position)
      if (isNearby) {
        position.x = positionInSearch.x
        // TODO: 目視で48に設定してあるが、ブロックの高さに合わせて書くべき
        position.y = positionInSearch.y + calcHeight(blockInSearch.blockType)
        const processedBlock = this.allBlocks[blockArg.blockUniqueKey]
        processedBlock.position = position
        this.updateBlock(processedBlock)
        // TODO: 正しく動いているか検証
        this.updateChildBlock(processedBlock)
        if (blockInSearch.childBlockUniqueKey === '') {
          this.addChild(key, blockArg.blockUniqueKey)
          if (blockInSearch.blockType === 'DefinitionComponentBlock') {
            const componentUniqueKey = generateUuid()
            this.addRelationBlockAndComponent(key, componentUniqueKey)
            const componentArr = []
            let checkCurrentBlock = this.allBlocks[key]
            while (true) {
              componentArr.push({
                blockType: checkCurrentBlock.blockType,
                value: {}
              })
              if (checkCurrentBlock.childBlockUniqueKey === '') break
              checkCurrentBlock = this.allBlocks[checkCurrentBlock.childBlockUniqueKey]
            }
            // TODO: 別のモジュールのActionを呼ぶ方法を調べる
            // dispatch('Components/add', { componentUniqueKey, componentArr }, { root: true })
          }
          const topBlock = this.allBlocks[blockInSearch.topBlockUniqueKey]
          if (topBlock != null && topBlock.blockType === 'DefinitionComponentBlock') {
            const componentUniqueKey = this.objectOfBlockAndComponent[blockInSearch.topBlockUniqueKey]
            let checkCurrentBlock = this.allBlocks[blockInSearch.topBlockUniqueKey]
            const componentArr = []
            while (true) {
              componentArr.push({
                blockType: checkCurrentBlock.blockType,
                value: {}
              })
              if (checkCurrentBlock.childBlockUniqueKey === '') break
              checkCurrentBlock = this.allBlocks[checkCurrentBlock.childBlockUniqueKey]
            }
            // TODO: 別のモジュールのActionを呼ぶ方法を調べる
            // dispatch('Components/update', { componentUniqueKey, componentArr }, { root: true })
          }
        }
        this.hideShadow(key)
      } else if (blockInSearch.childBlockUniqueKey === blockArg.blockUniqueKey && blockArg.blockUniqueKey !== key) {
        this.removeChild(key)
        const topBlock = this.allBlocks[blockInSearch.topBlockUniqueKey]
        if (topBlock != null && topBlock.blockType === 'DefinitionComponentBlock') {
          const componentUniqueKey = this.objectOfBlockAndComponent[blockInSearch.topBlockUniqueKey]
          let checkCurrentBlock = this.allBlocks[blockInSearch.topBlockUniqueKey]
          const componentArr = []
          while (true) {
            componentArr.push({
              blockType: checkCurrentBlock.blockType,
              value: {}
            })
            if (checkCurrentBlock.childBlockUniqueKey === '') break
            checkCurrentBlock = this.allBlocks[checkCurrentBlock.childBlockUniqueKey]
          }
          // TODO: 別のモジュールのActionを呼ぶ方法を調べる
          // dispatch('Components/update', { componentUniqueKey, componentArr }, { root: true })
        }
        if (blockInSearch.blockType === 'DefinitionComponentBlock') {
          const componentUniqueKey = this.objectOfBlockAndComponent[key]
          this.removeRelationBlockAndComponent(key)
          // TODO: 別のモジュールのActionを呼ぶ方法を調べる
          // dispatch('Components/remove', componentUniqueKey, { root: true })
        }
      }
    }
  }
}

const calcHeight = (blockName: string) => {
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

const isNearbyBlocks = (position1: IPosition, position2: IPosition) => {
  const isNearbyX1 = (position1.x - position2.x) <= 80
  const isNearbyX2 = (position1.x - position2.x) >= -160
  const isNearbyY1 = (position2.y - position1.y) <= 65
  const isNearbyY2 = (position2.y - position1.y) >= 30
  return isNearbyX1 && isNearbyX2 && isNearbyY1 && isNearbyY2
}

export const blocksModule = getModule(Blocks)
