<template>
  <svg height="60vh" width="90vw" id="SandBox" class="ma-0 pa-0">
    <component
      v-for="(block, uuid, index) in blocks"
      :is="block.name"
      :key="index"
      :block="block"
      :sample-block="false"
      @stopDragging="stopDragging"
      @updatePosition="updatePosition"
      @remove="removeBlock"
      @openingMenu="emitOpeningMenu"
    />

    <line x1="58vw" x2="58vw" y1="0" y2="100vh" stroke="black" />

    <BlocksDisplay :tab-uuid="tabUuid" />
  </svg>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator'
import { PBlocks, PPosition } from '@/@types/piledit'
import { blocksModule } from '@/store/Modules/Blocks'
import BlocksDisplay from '@/components/Organisms/BlocksDisplay.vue'
import DebugBlock from '@/components/Molecules/DebugBlock.vue'
import DefineComponentBlock from '@/components/Molecules/DefineComponentBlock.vue'
import MovieLoadingBlock from '@/components/Molecules/MovieLoadingBlock.vue'

@Component({
  components: {
    DebugBlock,
    DefineComponentBlock,
    BlocksDisplay,
    MovieLoadingBlock
  }
})
export default class SandBox extends Vue {
  @Prop({ required: true })
  public blocks!: PBlocks

  @Prop({ required: true })
  public tabUuid!: string

  public stopDragging (uuid: string) {
    blocksModule.stopDragging(uuid)
  }

  public updatePosition (context: { position: PPosition; uuid: string }) {
    const block = this.blocks[context.uuid]
    block.uuid = context.uuid
    block.position = context.position
    blocksModule.update(block)
  }

  public removeBlock (uuid: string) {
    blocksModule.remove(uuid)
  }

  @Emit('openingMenu')
  public emitOpeningMenu (uuid: string) {
    return uuid
  }
}
</script>

<style scoped>
#SandBox {
  border: 2px solid black;
}
</style>
