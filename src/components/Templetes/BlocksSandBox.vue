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
  // TODO: Block型をプロジェクト全体から使えるようにする
  public allBlocks!: null
  /* Block[] */

  public shadowPath (width: number) {
    return `m 0,4 A 4,4 0 0,1 4,0 H 12 c 2,0 3,1 4,2 l 4,4 c 1,1 2,2 4,2 h 12 c 2,0 3,-1 4,-2 l 4,-4 c 1,-1 2,-2 4,-2 H ${width.toString()} a 4,4 0 0,1 4,4 v 40  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-4 z`
  }

  // TODO: event型を定義する
  public stopDragging (event: DragEvent) {
    // blocksModule.stopDragging(event)
  }

  public updatePosition (event: DragEvent) {
    // blocksModule.update(event)
  }

  public removeBlock (event: DragEvent) {
    // blocksModule.remove(event.blockUniqueKey)
  }
}
</script>

<style scoped>
#blockComponentsSandBox {
  border: 4px black solid;
}
</style>
