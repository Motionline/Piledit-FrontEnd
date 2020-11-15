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
    @openingMenu="emitOpeningMenu"
  >
    <SVGText x="10" y="80" color="white">
      グレースケール
    </SVGText>
  </AbstractBlock>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator'
import { PBlock, PBlockKind, PPosition } from '@/@types/piledit'
import AbstractBlock from '@/components/Atoms/AbstractBlock.vue'
import SVGText from '@/components/Atoms/SVGText.vue'

  @Component({
    components: {
      AbstractBlock,
      SVGText
    }
  })
export default class GrayScaleFilterBlock extends Vue {
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
      return { position, name: 'GrayScaleFilterBlock', kind: PBlockKind.GrayScaleFilterBlock }
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
