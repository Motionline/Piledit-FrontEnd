<template>
  <svg id="SandBox">
    <BlocksDisplay :component-uuid="componentUuid" />
    <line x1="22vw" x2="22vw" y1="0" y2="100vh" stroke="black" />
    <component
        v-for="(block, uuid, index) in blocks"
        :is="block.name"
        :key="`${uuid}-${index}`"
        :block="block"
        @stopDragging="stopDragging"
        @updatePosition="updatePosition"
        @remove="removeBlock"
        @openingMenu="emitOpeningMenu"
    />
  </svg>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator'
import { PBlocks, PPosition } from '@/@types/piledit'
import { blocksModule } from '@/store/store'
import BlocksDisplay from '@/components/Organisms/BlocksDisplay.vue'
import DebugBlock from '@/components/Molecules/Blocks/DebugBlock.vue'
import DefineComponentBlock from '@/components/Molecules/Blocks/DefineComponentBlock.vue'
import MovieLoadingBlock from '@/components/Molecules/Blocks/MovieLoadingBlock.vue'
import GrayScaleFilterBlock from '@/components/Molecules/Blocks/GrayScaleFilterBlock.vue'
import BlurFilterBlock from '@/components/Molecules/Blocks/BlurFilterBlock.vue'

@Component({
  components: {
    DebugBlock,
    DefineComponentBlock,
    BlocksDisplay,
    MovieLoadingBlock,
    GrayScaleFilterBlock,
    BlurFilterBlock
  }
})
export default class SandBox extends Vue {
  @Prop({ required: true })
  public blocks!: PBlocks

  @Prop({ required: true })
  public componentUuid!: string

  public stopDragging (uuid: string) {
    const block = this.blocks[uuid]
    if (block.position.x <= 50) {
      blocksModule.remove({ blockUuid: uuid, componentUuid: this.componentUuid })
    } else {
      blocksModule.stopDragging({ triggeredBlockUuid: uuid, componentUuid: this.componentUuid })
    }
  }

  public updatePosition (context: { position: PPosition; uuid: string }) {
    const block = this.blocks[context.uuid]
    block.uuid = context.uuid
    block.position = context.position
    console.log(context.position)
    blocksModule.update({ _triggerBlock: block, componentUuid: this.componentUuid })
  }

  public removeBlock (blockUuid: string) {
    blocksModule.remove({ blockUuid, componentUuid: this.componentUuid })
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
  height: 60%;
  width: 100%;
}
</style>
