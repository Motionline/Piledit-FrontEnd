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
    />

    <line x1="58vw" x2="58vw" y1="0" y2="100vh" stroke="black" />

    <BlocksDisplay :tab-uuid="tabUuid" />
  </svg>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Block, Position } from '@/@types/piledit'
import { blocksModule } from '@/store/Modules/Blocks'
import BlocksDisplay from '@/components/Organisms/BlocksDisplay.vue'
import DebugBlock from '@/components/Molecules/DebugBlock.vue'
import DefineComponentBlock from '@/components/Molecules/DefineComponentBlock.vue'

@Component({
  components: {
    DebugBlock,
    DefineComponentBlock,
    BlocksDisplay
  }
})
export default class SandBox extends Vue {
  @Prop({ required: true })
  public blocks!: { [key: string]: Block }

  @Prop({ required: true })
  public tabUuid!: string

  public getBlock (uuid: string) {
    return this.blocks[uuid]
  }

  public shadowPath (width: number) {
    return `m 0,4 A 4,4 0 0,1 4,0 H 12 c 2,0 3,1 4,2 l 4,4 c 1,1 2,2 4,2 h 12 c 2,0 3,-1 4,-2 l 4,-4 c 1,-1 2,-2 4,-2 H ${width.toString()} a 4,4 0 0,1 4,4 v 40  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-4 z`
  }

  public stopDragging (uuid: string) {
    blocksModule.stopDragging(uuid)
  }

  public updatePosition (context: { position: Position; uuid: string }) {
    const block = this.blocks[context.uuid]
    block.uuid = context.uuid
    block.position = context.position
    blocksModule.update(block)
  }

  public removeBlock (uuid: string) {
    blocksModule.remove(uuid)
  }
}
</script>

<style scoped>
#SandBox {
  border: 2px solid black;
}
</style>
