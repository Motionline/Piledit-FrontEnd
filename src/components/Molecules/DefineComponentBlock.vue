<template>
  <AbstractBlock
    :block="block"
    :sample-block="sampleBlock"
    :stroke-color="strokeColor"
    :fill-color="fillColor"
    :path="path"
    :new-block-uuid="newBlockUuid"
    @stopDragging="stopDragging"
    @updatePosition="updatePosition"
    @remove="removeBlock"
    @click="onClick"
    @newBlockGenerate="emitNewBlockGenerate"
    @newBlockMove="emitNewBlockMove"
    @newBlockMouseUp="emitNewBlockMouseUp"
  >
    <SVGText x="10" y="75" color="white">
      コンポーネント定義
    </SVGText>
  </AbstractBlock>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator'
import { Block, Position } from '@/@types/piledit'
import AbstractBlock from '@/components/Atoms/AbstractBlock.vue'
import SVGText from '@/components/Atoms/SVGText.vue'

@Component({
  components: {
    AbstractBlock,
    SVGText
  }
})
export default class DefineComponentBlock extends Vue {
  @Prop({ required: true })
  public block!: Block

  @Prop({ required: true })
  public sampleBlock!: boolean

  @Prop()
  public newBlockUuid!: string

  public strokeColor = '#e9bc00'
  public fillColor = '#fcc800'
  public width = 300
  public path = `m 0,0 c 25,-22 71,-22 96,0 H ${this.width} a 4,4 0 0,1 4,4 v 40  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-4 z`

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

  @Emit('newBlockGenerate')
  public emitNewBlockGenerate (position: Position) {
    return { position, name: 'DefineComponentBlock' }
  }

  @Emit('newBlockMove')
  public emitNewBlockMove (context: { uuid: string; position: Position }) {
    return context
  }

  @Emit('newBlockMouseUp')
  public emitNewBlockMouseUp (uuid: string) {
    return uuid
  }
}
</script>

<style scoped>

</style>
