<template>
  <svg height="2000" width="1200">
    <rect x="3" y="3" stroke="black" stroke-width="3px" height="380" width="1180" fill-opacity="0" />
    <component
      v-for="(value, key, index) in this.allBlocks"
      :is="value.blockType"
      :key="index"
      :blockUniqueKey="key"
      :x="value.position.x"
      :y="value.position.y"
      :showShadow="value.showShadow"
      :shadowPath="shadowPath"
      @stopDragging="stopDragging($event)"
      @updatePosition="updatePosition($event)"
      @removeBlock="removeBlock($event)"
    />
  </svg>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Block, Position } from '@/@types/piledit'
import { blocksModule } from '@/store/Modules/Blocks'
import LoadingVideoBlock from '@/components/Organisms/LoadingVideoBlock.vue'
import DebugBlock from '@/components/Organisms/DebugBlock.vue'
import DefinitionComponentBlock from '@/components/Organisms/DefinitionComponentBlock.vue'

@Component({
  components: {
    LoadingVideoBlock,
    DebugBlock,
    DefinitionComponentBlock
  }
})
export default class BlocksSandBox extends Vue {
  @Prop({ required: true })
  public allBlocks!: { [key: string]: Block }

  public getBlock (blockUniqueKey: string) {
    return this.allBlocks[blockUniqueKey]
  }

  public shadowPath (width: number) {
    return `m 0,4 A 4,4 0 0,1 4,0 H 12 c 2,0 3,1 4,2 l 4,4 c 1,1 2,2 4,2 h 12 c 2,0 3,-1 4,-2 l 4,-4 c 1,-1 2,-2 4,-2 H ${width.toString()} a 4,4 0 0,1 4,4 v 40  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-4 z`
  }

  public stopDragging (blockUniqueKey: string) {
    blocksModule.stopDragging(blockUniqueKey)
  }

  public updatePosition (blockObj: { position: Position; blockUniqueKey: string }) {
    const block = this.getBlock(blockObj.blockUniqueKey)
    const updatedBlock: Block = {
      position: blockObj.position,
      blockType: block.blockType,
      showShadow: block.showShadow,
      childBlockUniqueKey: block.childBlockUniqueKey,
      blockUniqueKey: blockObj.blockUniqueKey,
      parentBlockUniqueKey: block.parentBlockUniqueKey,
      topBlockUniqueKey: block.topBlockUniqueKey
    }
    blocksModule.update(updatedBlock)
  }

  public removeBlock (blockUniqueKey: string) {
    blocksModule.remove(blockUniqueKey)
  }
}
</script>

<style scoped>
#blockComponentsSandBox {
  border: 4px black solid;
}
</style>
