<template>
  <AbstractBlock
      :block="block"
      :new-block="newBlock"
      @stopDragging="stopDragging"
      @updatePosition="updatePosition"
      @remove="removeBlock"
      @click="onClick"
      @newBlockGenerate="emitNewBlockGenerate"
      @newBlockMove="emitNewBlockMove"
      @newBlockMouseUp="emitNewBlockMouseUp"
      @openingMenu="emitOpeningMenu"
  >
    <SVGText x="10" y="30" color="white">
      変数定義
    </SVGText>
  </AbstractBlock>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import AbstractBlock from '@/components/Atoms/AbstractBlock.vue'
import SVGText from '@/components/Atoms/SVGText.vue'
import { PBlock, PBlockKind, PPosition } from '@/@types/piledit'

@Component({
  components: {
    AbstractBlock,
    SVGText
  }
})
export default class VariableBlock extends Vue {
  @Prop({ required: true })
  public block!: PBlock

  @Prop()
  public newBlock!: PBlock

  @Emit('stopDragging')
  public stopDragging (uuid: string) {
    return uuid
  }

  @Emit('updatePosition')
  public updatePosition (context: { position: PPosition; uuid: string }) {
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
  public emitNewBlockGenerate (position: PPosition) {
    return { position, name: 'VariableBlock', kind: PBlockKind.VariableBlock }
  }

  @Emit('newBlockMove')
  public emitNewBlockMove (context: { uuid: string; position: PPosition }) {
    return context
  }

  @Emit('newBlockMouseUp')
  public emitNewBlockMouseUp (uuid: string) {
    return uuid
  }

  @Emit('openingMenu')
  public emitOpeningMenu (uuid: string) {
    return uuid
  }
}
</script>

<style scoped>

</style>
