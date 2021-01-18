import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { Vue } from 'vue-property-decorator'
import {
  PBlock,
  PBlockKind,
  PBlocks,
  PPosition,
  TBlurFilterBlock,
  TDebugBlock,
  TDefineComponentBlock,
  TGrayScaleFilterBlock,
  TMovieLoadingBlock
} from '@/@types/piledit'
import { VuexMixin } from '@/mixin/vuex'
import store, {
  componentsModule,
  tabsModule
} from '@/store/store'

export interface BlocksStateIF {
  blocks: PBlocks;
}

/*
* 1. ブロックを追加する
* 2. エディタのcomponentsUuidを渡す
* 3. ブロックの変更を反映
* 4. componentsには(export)Blocksのuuidだけ渡すだけでいいかも
*
* Blockを作成した時点でComponentUuidも渡して登録する
* Blockがコンポーネント定義ブロックならcomponent.blocksを更新する
 */

@Module({ store: store, name: 'BlocksModule', namespaced: true })
export default class Blocks extends VuexModule implements BlocksStateIF {
  blocks: PBlocks = {}

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
    Vue.set(this.blocks, block.uuid, block)
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
  public changeShadowPath (payload: { uuid: string; shadowPath: string }) {
    this.blocks[payload.uuid].shadowPath = payload.shadowPath
  }

  @Action({ rawError: true })
  public async add (context: { position: PPosition; name: string; componentUuid: string; kind: PBlockKind }) {
    const uuid = VuexMixin.generateUuid()
    const init: Partial<PBlock> = {
      name: context.name,
      uuid,
      topUuid: '',
      parentUuid: '',
      childUuid: '',
      shadow: false,
      position: context.position,
      componentUuid: context.componentUuid,
      isSample: false,
      kind: context.kind
    }
    const block: PBlock = ((kind) => {
      if (kind === PBlockKind.DebugBlock) {
        return new TDebugBlock(init)
      } else if (kind === PBlockKind.DefineComponentBlock) {
        return new TDefineComponentBlock(init)
      } else if (kind === PBlockKind.MovieLoadingBlock) {
        return new TMovieLoadingBlock(init)
      } else if (kind === PBlockKind.GrayScaleFilterBlock) {
        return new TGrayScaleFilterBlock(init)
      } else if (kind === PBlockKind.BlurFilterBlock) {
        return new TBlurFilterBlock(init)
      } else {
        throw new Error('登録されていないブロックです')
      }
    })(context.kind)
    this.addBlock(block)
    // 追加したブロックがコンポーネント定義ブロックならコンポーネントにブロックを登録
    if (context.kind === PBlockKind.DefineComponentBlock) {
      const blocks = componentsModule.components[context.componentUuid].blocks
      blocks[uuid] = block
      componentsModule.updateBlocks({ componentUuid: context.componentUuid, blocks })
    }
    return uuid
  }

  @Action({ rawError: true })
  public remove ({ blockUuid, componentUuid }: { blockUuid: string; componentUuid: string }) {
    const block = this.blocks[blockUuid]
    const topBlock = this.blocks[block.topUuid]
    if (block.kind === PBlockKind.DefineComponentBlock) {
      componentsModule.updateBlocks({ componentUuid, blocks: {} })
      const component = componentsModule.components[componentUuid]
      component.name = ''
      componentsModule.updateComponent(component)
    }
    if (topBlock != null && topBlock.kind === PBlockKind.DefineComponentBlock) {
      this.removeChild(block.parentUuid)
      const blocksFamily = VuexMixin.searchChildrenOfBlock(topBlock, this.blocks)
      componentsModule.updateBlocks({ componentUuid, blocks: blocksFamily })
    }
    // TODO: ブロック接続状態でブロックを削除した時、ドラッグアップ時に4つエラーが出る
    // なぜか治っていた 次出たらここが原因なので気を付ける
    this.removeBlock(blockUuid)
  }

  @Action({ rawError: true })
  public removeWithChildren ({ blockUuid, componentUuid }: { blockUuid: string; componentUuid: string }) {
    const block = this.blocks[blockUuid]
    const topBlock = block.topUuid === '' ? block : this.blocks[block.topUuid]
    if (topBlock.kind === PBlockKind.DefineComponentBlock) {
      componentsModule.updateBlocks({ componentUuid, blocks: {} })
      const component = componentsModule.components[componentUuid]
      component.name = ''
      componentsModule.updateComponent(component)
    }
    const blocksFamily = VuexMixin.searchChildrenOfBlock(topBlock, this.blocks)
    for (const child in blocksFamily) {
      this.removeBlock(child)
    }
  }

  @Action({ rawError: true })
  public update ({ _triggerBlock, componentUuid, tabUuid }: { _triggerBlock: PBlock; componentUuid: string; tabUuid: string }) {
    this.updateBlock(_triggerBlock)
    this.updateChildBlock(_triggerBlock)
    const triggerBlock = this.blocks[_triggerBlock.uuid]
    const topBlock = this.blocks[triggerBlock.topUuid]
    if (topBlock != null && topBlock.kind === PBlockKind.DefineComponentBlock) {
      const blocksFamily = VuexMixin.searchChildrenOfBlock(topBlock, this.blocks)
      componentsModule.updateBlocks({ componentUuid, blocks: blocksFamily })
    }
    // コンポーネント定義ブロックだったら
    if (triggerBlock.kind === PBlockKind.DefineComponentBlock) {
      const blocksFamily = VuexMixin.searchChildrenOfBlock(triggerBlock, this.blocks)
      componentsModule.updateBlocks({ componentUuid, blocks: blocksFamily })
      const defineComponentBlock: TDefineComponentBlock = triggerBlock
      // コンポーネント名を更新
      if (defineComponentBlock.componentName) {
        const component = componentsModule.components[componentUuid]
        component.name = defineComponentBlock.componentName
        componentsModule.updateComponent(component)
        tabsModule.updateTabName({ tabUuid, name: defineComponentBlock.componentName })
      }
    }
    for (const blockUuid of Object.keys(this.blocks)) {
      if (triggerBlock.uuid === blockUuid) continue
      if (triggerBlock.kind === PBlockKind.DefineComponentBlock) continue
      const block = this.blocks[blockUuid]
      const isNearBy = VuexMixin.isNearbyBlocks(block.position, triggerBlock.position)
      const notHaveChildRelation = block.childUuid === ''
      if (isNearBy && notHaveChildRelation) {
        this.changeShadowPath({ uuid: block.uuid, shadowPath: triggerBlock.path })
        this.showShadow(blockUuid)
      } else {
        this.hideShadow(blockUuid)
      }
    }
  }

  @Action({ rawError: true })
  public stopDragging ({ triggeredBlockUuid, componentUuid }: { triggeredBlockUuid: string; componentUuid: string }) {
    // イベント発火元
    const triggeredBlock = this.blocks[triggeredBlockUuid]

    for (const blockKey of Object.keys(this.blocks)) {
      if (triggeredBlock.uuid === blockKey) continue
      if (triggeredBlock.kind === PBlockKind.DefineComponentBlock) continue

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
            const blocksFamily = VuexMixin.searchChildrenOfBlock(block, this.blocks)
            componentsModule.updateBlocks({ componentUuid, blocks: blocksFamily })
          }

          // 接続したブロックがコンポーネント定義ブロックの子ならコンポーネントを更新
          if (topBlockIsDefineCompBlock) {
            const blocksFamily = VuexMixin.searchChildrenOfBlock(topBlock, this.blocks)
            componentsModule.updateBlocks({ componentUuid, blocks: blocksFamily })
          }
        }

        this.hideShadow(blockKey)
      } else if (block.childUuid === triggeredBlockUuid) {
        // すでにtriggeredBlockが子ブロックで、かつ近くない = ブロックの接続を切る時
        this.removeChild(blockKey)

        if (topBlockIsDefineCompBlock) {
          const blocksFamily = VuexMixin.searchChildrenOfBlock(topBlock, this.blocks)
          componentsModule.updateBlocks({ componentUuid, blocks: blocksFamily })
        }

        if (block.kind === PBlockKind.DefineComponentBlock) {
          const blocksFamily = VuexMixin.searchChildrenOfBlock(block, this.blocks)
          componentsModule.updateBlocks({ componentUuid, blocks: blocksFamily })
        }
      }
    }
  }
}
