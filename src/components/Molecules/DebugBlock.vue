<template>
  <AbstractBlock
    :uuid="uuid"
    :position="position"
    :shadow="shadow"
    :stroke-color="strokeColor"
    :fill-color="fillColor"
    :path="path"
    :sample-block="sampleBlock"
  >
    <SVGText x="10" y="30" color="white">
      {{ uuid }}
    </SVGText>
  </AbstractBlock>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Position } from '@/@types/piledit'
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
  public uuid!: string

  @Prop({ required: true })
  public position!: Position

  @Prop({ required: true })
  public shadow!: boolean

  @Prop({ required: true })
  public sampleBlock!: boolean

  public strokeColor = '#c53d43'
  public fillColor = '#e83929'
  public width = 350
  public path = `m 0,4 A 4,4 0 0,1 4,0 H 12 c 2,0 3,1 4,2 l 4,4 c 1,1 2,2 4,2 h 12 c 2,0 3,-1 4,-2 l 4,-4 c 1,-1 2,-2 4,-2 H ${this.width} a 4,4 0 0,1 4,4 v 40  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-4 z`
}
</script>

<style scoped>

</style>
