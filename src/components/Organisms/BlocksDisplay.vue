<template>
  <svg id="blocksDisplay" x="1vw">
    <svg v-if="blockDisplayTab === 0">
      <DefineComponentBlock
          @newBlockGenerate="newBlockGenerate"
          @newBlockMove="newBlockMove"
          :new-block="newBlock"
          :block="getPBlock({ x: 0, y: 25 }, PBlockKind.DefineComponentBlock)"
          class="dragBlock-btn"
          transform="translate(1,50)"
      />
      <PropsBlock
          @newBlockGenerate="newBlockGenerate"
          @newBlockMove="newBlockMove"
          :new-block="newBlock"
          :block="getPBlock({ x: 0, y: 85 }, PBlockKind.PropsBlock)"
          class="dragBlock-btn"
          transform="translate(1,50)"
      />
      <PropBlock
          @newBlockGenerate="newBlockGenerate"
          @newBlockMove="newBlockMove"
          :new-block="newBlock"
          :block="getPBlock({ x: 0, y: 210 }, PBlockKind.PropBlock)"
          class="dragBlock-btn"
          transform="translate(1,50)"
      />
      <VariableBlock
          @newBlockGenerate="newBlockGenerate"
          @newBlockMove="newBlockMove"
          :new-block="newBlock"
          :block="getPBlock({ x: 0, y: 270 }, PBlockKind.VariableBlock)"
          class="dragBlock-btn"
          transform="translate(1,50)"
      />
    </svg>
    <svg v-else-if="blockDisplayTab === 1">
      <MovieLoadingBlock
          @newBlockGenerate="newBlockGenerate"
          @newBlockMove="newBlockMove"
          :new-block="newBlock"
          :block="getPBlock({ x: 0, y: 50 }, PBlockKind.MovieLoadingBlock)"
          class="dragBlock-btn"
          transform="translate(1,20)"
      />
      <DebugBlock
          @newBlockGenerate="newBlockGenerate"
          @newBlockMove="newBlockMove"
          :new-block="newBlock"
          :block="getPBlock({ x: 0, y: 100 }, PBlockKind.DebugBlock)"
          class="dragBlock-btn"
          transform="translate(1,20)"
      />
    </svg>
    <svg v-else-if="blockDisplayTab === 2">
      <GrayScaleFilterBlock
          @newBlockGenerate="newBlockGenerate"
          @newBlockMove="newBlockMove"
          :new-block="newBlock"
          :block="getPBlock({ x: 0, y: 50 }, PBlockKind.GrayScaleFilterBlock)"
          class="dragBlock-btn"
          transform="translate(1,20)"
      />
      <BlurFilterBlock
          @newBlockGenerate="newBlockGenerate"
          @newBlockMove="newBlockMove"
          :new-block="newBlock"
          :block="getPBlock({ x: 0, y: 100 }, PBlockKind.BlurFilterBlock)"
          class="dragBlock-btn"
          transform="translate(1,20)"
      />
    </svg>
  </svg>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { blocksModule } from '@/store/store'
import {
  PBlockKind,
  PPosition
} from '@/@types/piledit'
import { PBlocksMixin } from '@/mixin/pBlocks'
import DebugBlock from '@/components/Molecules/Blocks/DebugBlock.vue'
import DefineComponentBlock from '@/components/Molecules/Blocks/DefineComponentBlock.vue'
import PropBlock from '@/components/Molecules/Blocks/PropBlock.vue'
import PropsBlock from '@/components/Molecules/Blocks/PropsBlock.vue'
import MovieLoadingBlock from '@/components/Molecules/Blocks/MovieLoadingBlock.vue'
import GrayScaleFilterBlock from '@/components/Molecules/Blocks/GrayScaleFilterBlock.vue'
import BlurFilterBlock from '@/components/Molecules/Blocks/BlurFilterBlock.vue'
import VariableBlock from '@/components/Molecules/Blocks/VariableBlock.vue'

@Component({
  components: {
    MovieLoadingBlock,
    DebugBlock,
    DefineComponentBlock,
    GrayScaleFilterBlock,
    BlurFilterBlock,
    PropBlock,
    PropsBlock,
    VariableBlock
  }
})
export default class BlocksDisplay extends Vue {
  @Prop({ required: true })
  public componentUuid!: string

  @Prop({ required: true })
  public tabUuid!: string

  @Prop({ required: true })
  public projectUuid!: string

  @Prop({ required: true })
  public blockDisplayTab!: number

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
