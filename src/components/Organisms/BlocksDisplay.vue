<template>
  <svg id="blocksDisplay" x="60vw">
    <DebugBlock
      @newBlockGenerate="newBlockGenerate"
      @newBlockMove="newBlockMove"
      @newBlockMouseUp="newBlockMouseUp"
      :new-block-uuid="newBlockUuid"
      :sample-block="true"
      :block="getPBlock({ x: 0, y: 100 }, PBlockKind.DebugBlock)"
      class="dragBlock-btn"
      transform="translate(1,20)"
    />
    <DefineComponentBlock
      @newBlockGenerate="newBlockGenerate"
      @newBlockMove="newBlockMove"
      @newBlockMouseUp="newBlockMouseUp"
      :new-block-uuid="newBlockUuid"
      :sample-block="true"
      :block="getPBlock({ x: 0, y: 50 }, PBlockKind.DefineComponentBlock)"
      class="dragBlock-btn"
      transform="translate(1,50)"
    />
    <MovieLoadingBlock
      @newBlockGenerate="newBlockGenerate"
      @newBlockMove="newBlockMove"
      @newBlockMouseUp="newBlockMouseUp"
      :new-block-uuid="newBlockUuid"
      :sample-block="true"
      :block="getPBlock({ x: 0, y: 150 }, PBlockKind.MovieLoadingBlock)"
      class="dragBlock-btn"
      transform="translate(1,20)"
    />
    <GrayScaleFilterBlock
      @newBlockGenerate="newBlockGenerate"
      @newBlockMove="newBlockMove"
      @newBlockMouseUp="newBlockMouseUp"
      :new-block-uuid="newBlockUuid"
      :sample-block="true"
      :block="getPBlock({ x: 0, y: 200 }, PBlockKind.GrayScaleFilterBlock)"
      class="dragBlock-btn"
      transform="translate(1,20)"
    />
    <BlurFilterBlock
      @newBlockGenerate="newBlockGenerate"
      @newBlockMove="newBlockMove"
      @newBlockMouseUp="newBlockMouseUp"
      :new-block-uuid="newBlockUuid"
      :sample-block="true"
      :block="getPBlock({ x: 0, y: 250 }, PBlockKind.BlurFilterBlock)"
      class="dragBlock-btn"
      transform="translate(1,20)"
    />
  </svg>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { blocksModule } from '@/store/Modules/Blocks'
import {
  PBlock,
  PBlockKind,
  PPosition, TBlurFilterBlock,
  TDebugBlock,
  TDefineComponentBlock,
  TGrayScaleFilterBlock,
  TMovieLoadingBlock
} from '@/@types/piledit'
import DebugBlock from '@/components/Molecules/Blocks/DebugBlock.vue'
import DefineComponentBlock from '@/components/Molecules/Blocks/DefineComponentBlock.vue'
import MovieLoadingBlock from '@/components/Molecules/Blocks/MovieLoadingBlock.vue'
import GrayScaleFilterBlock from '@/components/Molecules/Blocks/GrayScaleFilterBlock.vue'
import BlurFilterBlock from '@/components/Molecules/Blocks/BlurFilterBlock.vue'

  @Component({
    components: {
      MovieLoadingBlock,
      DebugBlock,
      DefineComponentBlock,
      GrayScaleFilterBlock,
      BlurFilterBlock
    }
  })
export default class BlocksDisplay extends Vue {
  @Prop({ required: true })
  public tabUuid!: string

  get PBlockKind () {
    return PBlockKind
  }

  public newBlockUuid = ''

  public getPBlock (position: PPosition, kind: PBlockKind) {
    const init: Partial<PBlock> = {
      name: kind,
      uuid: kind,
      topUuid: '',
      parentUuid: '',
      childUuid: '',
      shadow: false,
      position,
      tabUuid: '',
      isSample: true,
      kind
    }
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
  }

  get blocks () {
    return blocksModule.blocks
  }

  public async newBlockGenerate (context: { position: PPosition; name: string; kind: PBlockKind }) {
    this.newBlockUuid = await blocksModule.add({
      position: context.position,
      name: context.name,
      tabUuid: this.tabUuid,
      kind: context.kind
    })
  }

  public newBlockMove (context: { position: PPosition; uuid: string }) {
    const block = this.blocks[context.uuid]
    block.position = context.position
    blocksModule.updateBlock(block)
  }

  public newBlockMouseUp (uuid: string) {
    const block = this.blocks[uuid]
    if (block != null && block.position.x >= 430) {
      blocksModule.remove(uuid)
    }
  }

  public getContext (name: string) {
    return {
      name,
      position: {
        x: 0,
        y: 0
      },
      tabUuid: this.tabUuid
    }
  }
}
</script>

<style scoped>
  #blocksDisplay {
    border: 2px black solid;
  }
  .dragBlock-btn::before {
    color: transparent;
  }

  .dragBlock-btn:hover {
    color: red;
  }
</style>
