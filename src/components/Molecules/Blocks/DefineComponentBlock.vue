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
      {{ displayComponentName }}
    </SVGText>
  </AbstractBlock>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue, Watch } from 'vue-property-decorator'
import { PBlock, PBlockKind, PPosition, TDefineComponentBlock } from '@/@types/piledit'
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
  public block!: TDefineComponentBlock

  @Prop()
  public newBlock!: PBlock

  public displayComponentName = 'コンポーネント定義'

  mounted () {
    this.setDisplayComponentName()
  }

  @Watch('block', { deep: true })
  public blockWatcher () {
    this.setDisplayComponentName()
  }

  public setDisplayComponentName () {
    if (this.block.componentName == null) {
      this.displayComponentName = 'コンポーネント定義'
    } else {
      this.displayComponentName = 'コンポーネント名: ' + this.block.componentName
    }
  }

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
    return { position, name: 'DefineComponentBlock', kind: PBlockKind.DefineComponentBlock }
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
