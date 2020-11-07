<template>
  <AbstractBlock
    :block="block"
    :stroke-color="strokeColor"
    :fill-color="fillColor"
    :path="path"
    :sample-block="sampleBlock"
    @stopDragging="stopDragging"
    @updatePosition="updatePosition"
    @remove="removeBlock"
    @click="onClick"
  >
    <SVGText x="10" y="80" color="white">
      {{ block.uuid }}
    </SVGText>
  </AbstractBlock>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator'
import { Block, Position } from '@/@types/piledit'
import AbstractBlock from '@/components/Atoms/AbstractBlock.vue'
import SVGText from '@/components/Atoms/SVGText.vue'

// DebugBlock classは、デバッグ用の編集ブロックです。
// 開発中に実験機能の追加、動作の確認のために利用します。
@Component({
  components: {
    AbstractBlock,
    SVGText
  }
})
export default class DebugBlock extends Vue {
  @Prop({ required: true })
  public sampleBlock!: boolean

  @Prop({ required: true })
  public block!: Block

  public strokeColor = '#c53d43'
  public fillColor = '#e83929'
  public width = 350
  public path = `m 0,4 A 4,4 0 0,1 4,0 H 12 c 2,0 3,1 4,2 l 4,4 c 1,1 2,2 4,2 h 12 c 2,0 3,-1 4,-2 l 4,-4 c 1,-1 2,-2 4,-2 H ${this.width} a 4,4 0 0,1 4,4 v 40  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-4 z`

  @Emit('stopDragging')
  public stopDragging (uuid: string) {
    return uuid
  }

  @Emit('updatePosition')
  public updatePosition (context: { position: Position; uuid: string }) {
    return context
  }

  @Emit('remove')
  public removeBlock (uuid: string) {
    return uuid
  }

  @Emit('click')
  public onClick (event: Event) {
    return event
  }
}
</script>

<style scoped>

</style>
