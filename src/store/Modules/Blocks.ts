import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { Vue } from 'vue-property-decorator'
import store from '@/store/store'
import { PBlock, PBlockKind, PBlocks, PPosition } from '@/@types/piledit'
import { VuexMixin } from '@/mixin/vuex'
import { componentsModule } from '@/store/Modules/Components'

export interface BlocksStateIF {
  blocks: PBlocks;
  objectOfBlockAndComponent: { [key: string]: string };
}

@Module({ dynamic: true, store: store, name: 'Blocks', namespaced: true })
class Blocks extends VuexModule implements BlocksStateIF {
  blocks: PBlocks = {}
  objectOfBlockAndComponent: { [key: string]: string } = {}
  DEFINE_COMPONENT_BLOCK = 'DefineComponentBlock'

  @Mutation
  public addBlock (block: PBlock) {
    Vue.set(this.blocks, block.uuid, block)
  }

  @Mutation
  public removeBlock (uuid: string) {
    Vue.delete(this.blocks, uuid)
  }

  @Mutation
  public updateBlock (block: PBlock) {
    this.blocks[block.uuid] = block
  }

  // 親ブロックから子ブロックに連鎖して座標を更新
  @Mutation
  public updateChildBlock (block: PBlock) {
    let parentBlock = block
    while (parentBlock.childUuid !== '') {
      const childBlock = this.blocks[parentBlock.childUuid]
      childBlock.position = {
        x: parentBlock.position.x,
        y: parentBlock.position.y + VuexMixin.calcHeight(parentBlock.kind)
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
    this.blocks[childUuid].topUuid = ''
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
  public addRelationBlockAndComponent (payload: { uuid: string; componentUuid: string }) {
    Vue.set(this.objectOfBlockAndComponent, payload.uuid, payload.componentUuid)
  }

  @Mutation
  public removeRelationBlockAndComponent (uuid: string) {
    Vue.delete(this.objectOfBlockAndComponent, uuid)
  }

  @Action({ rawError: true })
  public async add (context: { position: PPosition; name: string; tabUuid: string; kind: PBlockKind }) {
    const uuid = VuexMixin.generateUuid()
    const block = new PBlock(
      context.name,
      uuid,
      '',
      '',
      '',
      false,
      context.position,
      context.tabUuid,
      false,
      context.kind
    )
    this.addBlock(block)
    // 追加したブロックがコンポーネント定義ブロックならコンポーネントを作成
    if (context.name === this.DEFINE_COMPONENT_BLOCK) {
      const componentUuid = VuexMixin.generateUuid()
      this.addRelationBlockAndComponent({ uuid, componentUuid })
      componentsModule.add({ uuid: componentUuid, blocks: { uuid: block } })
    }
    return uuid
  }

  @Action({ rawError: true })
  public remove (uuid: string) {
    const block = this.blocks[uuid]
    const topBlock = this.blocks[block.topUuid]
    if (topBlock != null && topBlock.kind === PBlockKind.DefineComponentBlock) {
      this.removeChild(block.parentUuid)
      const componentUuid = this.objectOfBlockAndComponent[topBlock.uuid]
      const blocksFamily = VuexMixin.searchChildrenOfBlock(topBlock, this.blocks)
      componentsModule.update({ uuid: componentUuid, blocks: blocksFamily })
    }
    // TODO: ブロック接続状態でブロックを削除した時、ドラッグアップ時に4つエラーが出る
    this.removeBlock(uuid)
  }

  @Action({ rawError: true })
  public update (blockArg: PBlock) {
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
  public stopDragging (triggeredBlockUuid: string) {
    // イベント発火元
    const triggeredBlock = this.blocks[triggeredBlockUuid]

    for (const blockKey of Object.keys(this.blocks)) {
      if (triggeredBlock.uuid === blockKey) continue

      const block = this.blocks[blockKey]
      const blockPosition = block.position
      const topBlock = this.blocks[block.topUuid]
      const topBlockIsDefineCompBlock = (topBlock != null && topBlock.kind === PBlockKind.DefineComponentBlock)

      const isNearby = VuexMixin.isNearbyBlocks(blockPosition, triggeredBlock.position)

      // triggeredBlockが他のブロックに近ければ接続する
      if (isNearby) {
        triggeredBlock.position.x = blockPosition.x
        triggeredBlock.position.y = blockPosition.y + VuexMixin.calcHeight(block.kind)
        this.updateBlock(triggeredBlock)
        this.updateChildBlock(triggeredBlock)

        // 接続したブロックのchildUuidにtriggeredBlockのuuidを追加
        if (block.childUuid === '') {
          this.addChild({ uuid: blockKey, childUuid: triggeredBlockUuid })

          // 接続したブロックがコンポーネント定義ブロックならコンポーネントを更新
          if (block.kind === PBlockKind.DefineComponentBlock) {
            const componentUuid = this.objectOfBlockAndComponent[block.uuid]
            const blocksFamily = VuexMixin.searchChildrenOfBlock(block, this.blocks)
            componentsModule.update({ uuid: componentUuid, blocks: blocksFamily })
          }

          // 接続したブロックがコンポーネント定義ブロックの子ならコンポーネントを更新
          if (topBlockIsDefineCompBlock) {
            const componentUuid = this.objectOfBlockAndComponent[topBlock.uuid]
            const blocksFamily = VuexMixin.searchChildrenOfBlock(topBlock, this.blocks)
            componentsModule.update({ uuid: componentUuid, blocks: blocksFamily })
          }
        }

        this.hideShadow(blockKey)
      } else if (block.childUuid === triggeredBlockUuid) {
        // すでにtriggeredBlockが子ブロックで、かつ近くない = ブロックの接続を切る時
        this.removeChild(blockKey)

        if (topBlockIsDefineCompBlock) {
          const componentUuid = this.objectOfBlockAndComponent[topBlock.uuid]
          const blocksFamily = VuexMixin.searchChildrenOfBlock(topBlock, this.blocks)
          componentsModule.update({ uuid: componentUuid, blocks: blocksFamily })
        }

        if (block.kind === PBlockKind.DefineComponentBlock) {
          const componentUuid = this.objectOfBlockAndComponent[blockKey]
          const blocksFamily = VuexMixin.searchChildrenOfBlock(block, this.blocks)
          componentsModule.update({ uuid: componentUuid, blocks: blocksFamily })
        }
      }
    }
  }
}

export const blocksModule = getModule(Blocks)
