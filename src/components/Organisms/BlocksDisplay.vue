<template>
  <svg id="blocksDisplay" x="2.5vw">
    <DebugBlock
      @newBlockGenerate="newBlockGenerate"
      @newBlockMove="newBlockMove"
      :new-block="newBlock"
      :block="getPBlock({ x: 0, y: 100 }, PBlockKind.DebugBlock)"
      class="dragBlock-btn"
      transform="translate(1,20)"
    />
    <DefineComponentBlock
      @newBlockGenerate="newBlockGenerate"
      @newBlockMove="newBlockMove"
      :new-block="newBlock"
      :block="getPBlock({ x: 0, y: 50 }, PBlockKind.DefineComponentBlock)"
      class="dragBlock-btn"
      transform="translate(1,50)"
    />
    <MovieLoadingBlock
      @newBlockGenerate="newBlockGenerate"
      @newBlockMove="newBlockMove"
      :new-block="newBlock"
      :block="getPBlock({ x: 0, y: 150 }, PBlockKind.MovieLoadingBlock)"
      class="dragBlock-btn"
      transform="translate(1,20)"
    />
    <GrayScaleFilterBlock
      @newBlockGenerate="newBlockGenerate"
      @newBlockMove="newBlockMove"
      :new-block="newBlock"
      :block="getPBlock({ x: 0, y: 200 }, PBlockKind.GrayScaleFilterBlock)"
      class="dragBlock-btn"
      transform="translate(1,20)"
    />
    <BlurFilterBlock
      @newBlockGenerate="newBlockGenerate"
      @newBlockMove="newBlockMove"
      :new-block="newBlock"
      :block="getPBlock({ x: 0, y: 250 }, PBlockKind.BlurFilterBlock)"
      class="dragBlock-btn"
      transform="translate(1,20)"
    />
  </svg>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { blocksModule } from '@/store/store'
import {
  PBlockKind,
  PPosition
} from '@/@types/piledit'
import { PBlocksMixin } from '@/mixin/PBlocksMixin'
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
  public componentUuid!: string

  @Prop({ required: true })
  public tabUuid!: string

  @Prop({ required: true })
  public projectUuid!: string

  get PBlockKind () {
    return PBlockKind
  }

  public newBlock = {}

  public getPBlock (position: PPosition, kind: PBlockKind) {
    const init = {
      name: kind,
      uuid: kind,
      kind,
      position,
      componentUuid: '',
      projectUuid: '',
      isSample: true
    }
    return PBlocksMixin.newPBlock(init)
  }

  get blocks () {
    return blocksModule.blocks
  }

  public async newBlockGenerate (context: { position: PPosition; name: string; kind: PBlockKind }) {
    const uuid = await blocksModule.add({
      position: context.position,
      name: context.name,
      componentUuid: this.componentUuid,
      kind: context.kind,
      projectUuid: this.projectUuid
    })
    this.newBlock = this.blocks[uuid]
  }

  public newBlockMove (context: { position: PPosition; uuid: string }) {
    const block = this.blocks[context.uuid]
    block.position = context.position
    blocksModule.update({
      _triggerBlock: block,
      componentUuid: this.componentUuid,
      tabUuid: this.tabUuid
    })
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
