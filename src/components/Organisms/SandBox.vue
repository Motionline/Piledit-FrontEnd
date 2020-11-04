<template>
  <svg height="2000" width="2000">
    <rect x="3" y="3" stroke="black" stroke-width="3px" height="380" width="1180" fill-opacity="0" />
    <component
      v-for="(block, uuid, index) in blocks"
      :is="block.name"
      :key="index"
      :uuid="uuid"
      :position="block.position"
      :shadow="block.shadow"
      :sample-block="false"
      @mouse-up="stopDragging"
      @mouse-move="updatePosition"
      @remove="removeBlock"
    />
  </svg>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Block } from '@/@types/piledit'
import { blocksModule } from '@/store/Modules/Blocks'
import DebugBlock from '@/components/Molecules/DebugBlock.vue'

@Component({
  components: {
    DebugBlock
  }
})
export default class SandBox extends Vue {
  @Prop({ required: true })
  public blocks!: { [key: string]: Block }

  public getBlock (uuid: string) {
    return this.blocks[uuid]
  }

  public shadowPath (width: number) {
    return `m 0,4 A 4,4 0 0,1 4,0 H 12 c 2,0 3,1 4,2 l 4,4 c 1,1 2,2 4,2 h 12 c 2,0 3,-1 4,-2 l 4,-4 c 1,-1 2,-2 4,-2 H ${width.toString()} a 4,4 0 0,1 4,4 v 40  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-4 z`
  }

  public stopDragging (uuid: string) {
    blocksModule.stopDragging(uuid)
  }

  public updatePosition (block: Block) {
    console.log(block)
  }

  public removeBlock (uuid: string) {
    blocksModule.remove(uuid)
  }
}
</script>

<style scoped>

</style>
