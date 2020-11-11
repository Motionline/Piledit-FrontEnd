import {
  Module,
  VuexModule,
  Mutation,
  Action,
  getModule
} from 'vuex-module-decorators'
import { Vue } from 'vue-property-decorator'
import store from '@/store/store'
import { Position, Block, Component } from '@/@types/piledit'
import { VuexMixin } from '@/mixin/vuex'
import { componentsModule } from '@/store/Modules/Components'

export interface BlocksStateIF {
  blocks: { [key: string]: Block };
  objectOfBlockAndComponent: { [key: string]: string };
}

@Module({ dynamic: true, store: store, name: 'Blocks', namespaced: true })
class Blocks extends VuexModule implements BlocksStateIF {
  blocks: { [key: string]: Block } = {}
  objectOfBlockAndComponent: { [key: string]: string } = {}

  @Mutation
  public addBlock (block: Block) {
    Vue.set(this.blocks, block.uuid, block)
  }

  @Mutation
  public removeBlock (uuid: string) {
    Vue.delete(this.blocks, uuid)
  }

  @Mutation
  public updateBlock (block: Block) {
    this.blocks[block.uuid] = block
  }

  // 親ブロックから子ブロックに連鎖して座標を更新
  @Mutation
  public updateChildBlock (block: Block) {
    let parentBlock = block
    while (parentBlock.childUuid !== '') {
      const childBlock = this.blocks[parentBlock.childUuid]
      childBlock.position = {
        x: parentBlock.position.x,
        y: parentBlock.position.y + VuexMixin.calcHeight(parentBlock.name)
      }
      parentBlock = childBlock
    }
  }

  // 子ブロックを追加
  @Mutation
  public addChild (payload: { uuid: string; childUuid: string }) {
    const uuid = payload.uuid
    const childUuid = payload.childUuid
    this.blocks[uuid].childUuid = childUuid
    this.blocks[childUuid].parentUuid = uuid
    if (this.blocks[uuid].topUuid === '') {
      this.blocks[childUuid].topUuid = uuid
    } else {
      this.blocks[childUuid].topUuid = this.blocks[uuid].topUuid
    }
  }

  @Mutation
  public removeChild (uuid: string) {
    const childUuid = this.blocks[uuid].childUuid
    this.blocks[uuid].childUuid = ''
    this.blocks[childUuid].parentUuid = ''
    this.blocks[uuid].topUuid = ''
  }

  @Mutation
  public showShadow (uuid: string) {
    this.blocks[uuid].shadow = true
  }

  @Mutation
  public hideShadow (uuid: string) {
    this.blocks[uuid].shadow = false
  }

  @Mutation
  public addRelationBlockAndComponent (uuid: string, componentUniqueKey: string) {
    Vue.set(this.objectOfBlockAndComponent, uuid, componentUniqueKey)
  }

  @Mutation
  public removeRelationBlockAndComponent (uuid: string) {
    Vue.delete(this.objectOfBlockAndComponent, uuid)
  }

  @Action({ rawError: true })
  public async add (context: { position: Position; name: string; tabUuid: string }) {
    const uuid = VuexMixin.generateUuid()
    const block: Block = {
      position: context.position,
      name: context.name,
      shadow: false,
      uuid,
      childUuid: '',
      parentUuid: '',
      topUuid: '',
      tabUuid: context.tabUuid
    }
    this.addBlock(block)
    return uuid
  }

  @Action({ rawError: true })
  public remove (uuid: string) {
    const block = this.blocks[uuid]
    const topBlock = this.blocks[block.topUuid]
    if (topBlock != null && topBlock.name === 'DefineComponentBlock') {
      const componentUniqueKey = this.objectOfBlockAndComponent[block.topUuid]
      let checkCurrentBlock = this.blocks[block.topUuid]
      const componentArr = []
      while (true) {
        componentArr.push({
          blockType: checkCurrentBlock.name,
          value: {}
        })
        checkCurrentBlock = this.blocks[checkCurrentBlock.childUuid]
        if (checkCurrentBlock.name === uuid) break
      }
      this.removeChild(block.parentUuid)
      store.dispatch('Components/update', { componentUniqueKey, componentArr }, { root: true })
    }
    this.removeBlock(uuid)
  }

  @Action({ rawError: true })
  public update (blockArg: Block) {
    this.updateBlock(blockArg)
    this.updateChildBlock(blockArg)
    const uuid = blockArg.uuid
    const block = this.blocks[uuid]
    const position = block.position
    for (const key of Object.keys(this.blocks)) {
      if (uuid === key) continue
      const blockInSearch = this.blocks[key]
      const positionInSearch = blockInSearch.position
      const isNearBy = VuexMixin.isNearbyBlocks(positionInSearch, position)
      const notHaveChildRelation = blockInSearch.childUuid === ''
      if (isNearBy && notHaveChildRelation) {
        this.showShadow(key)
      } else {
        this.hideShadow(key)
      }
    }
  }

  @Action({ rawError: true })
  public stopDragging (uuid: string) {
    // ブロック全体から探す
    const block = this.blocks[uuid]
    const position = block.position
    for (const key of Object.keys(this.blocks)) {
      if (uuid === key) continue
      const blockInSearch = this.blocks[key]
      const positionInSearch = blockInSearch.position
      const isNearby = VuexMixin.isNearbyBlocks(positionInSearch, position)
      if (isNearby) {
        position.x = positionInSearch.x
        // TODO: 目視で48に設定してあるが、ブロックの高さに合わせて書くべき
        position.y = positionInSearch.y + VuexMixin.calcHeight(blockInSearch.name)
        const processedBlock = this.blocks[uuid]
        processedBlock.position = position
        this.updateBlock(processedBlock)
        // TODO: 正しく動いているか検証
        this.updateChildBlock(processedBlock)
        if (blockInSearch.childUuid === '') {
          const payload = {
            uuid: key,
            childUuid: uuid
          }
          this.addChild(payload)
          if (blockInSearch.name === 'DefineComponentBlock') {
            const uuid = VuexMixin.generateUuid()
            this.addRelationBlockAndComponent(key, uuid)
            const blocks: { [key: string]: Block } = {}
            let currentBlock = this.blocks[key]
            while (true) {
              blocks[currentBlock.uuid] = currentBlock
              if (currentBlock.childUuid === '') break
              currentBlock = this.blocks[currentBlock.childUuid]
            }
            const blockComponent: Component = {
              uuid,
              blocks
            }
            componentsModule.add(blockComponent)
          }
          const topBlock = this.blocks[blockInSearch.topUuid]
          if (topBlock != null && topBlock.name === 'DefineComponentBlock') {
            const uuid = this.objectOfBlockAndComponent[blockInSearch.topUuid]
            const blocks: { [key: string]: Block } = {}
            let currentBlock = this.blocks[key]
            while (true) {
              blocks[currentBlock.uuid] = currentBlock
              if (currentBlock.childUuid === '') break
              currentBlock = this.blocks[currentBlock.childUuid]
            }
            // TODO: 別のモジュールのActionを呼ぶ方法を調べる
            const blockComponent: Component = {
              uuid,
              blocks
            }
            componentsModule.update(blockComponent)
          }
        }
        this.hideShadow(key)
      } else if (blockInSearch.childUuid === uuid && uuid !== key) {
        this.removeChild(key)
        const topBlock = this.blocks[blockInSearch.topUuid]
        if (topBlock != null && topBlock.name === 'DefineComponentBlock') {
          const uuid = this.objectOfBlockAndComponent[blockInSearch.topUuid]
          const blocks: { [key: string]: Block } = {}
          let currentBlock = this.blocks[blockInSearch.topUuid]
          while (true) {
            blocks[currentBlock.uuid] = currentBlock
            if (currentBlock.childUuid === '') break
            currentBlock = this.blocks[currentBlock.childUuid]
          }
          const component: Component = {
            uuid,
            blocks
          }
          componentsModule.update(component)
        }
        if (blockInSearch.name === 'DefineComponentBlock') {
          const uuid = this.objectOfBlockAndComponent[key]
          this.removeRelationBlockAndComponent(key)
          componentsModule.remove(uuid)
        }
      }
    }
  }
}

export const blocksModule = getModule(Blocks)
