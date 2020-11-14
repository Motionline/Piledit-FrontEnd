<template>
  <AbstractBlock
    :block="block"
    :new-block-uuid="newBlockUuid"
    @stopDragging="stopDragging"
    @updatePosition="updatePosition"
    @remove="removeBlock"
    @click="onClick"
    @newBlockGenerate="emitNewBlockGenerate"
    @newBlockMove="emitNewBlockMove"
    @newBlockMouseUp="emitNewBlockMouseUp"
  >
    <SVGText x="10" y="80" color="white">
      {{ block.uuid }}
    </SVGText>
  </AbstractBlock>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator'
import { PBlock, PBlockKind, PPosition } from '@/@types/piledit'
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
  public block!: PBlock

  @Prop()
  public newBlockUuid!: string

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
    return { position, name: 'DebugBlock', kind: PBlockKind.DebugBlock }
  }

  @Emit('newBlockMove')
  public emitNewBlockMove (context: { uuid: string; position: PPosition }) {
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
