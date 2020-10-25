<template>
  <ElementBlockBase
    :blockUniqueKey="blockUniqueKey"
    :x="x"
    :y="y"
    :showShadow="showShadow"
    :strokeColor="strokeColor"
    :fillColor="fillColor"
    :width="width"
    @stopDragging="stopDragging($event)"
    @updatePosition="updatePosition($event)"
    @removeBlock="removeBlock($event)"
  >
    <SVGText x="10" y="30" color="white">
      {{ blockUniqueKey }} {{ allBlocks[blockUniqueKey].childBlockUniqueKey }}
    </SVGText>
  </ElementBlockBase>
</template>

<script lang="ts">
import { Component, Prop, Emit, Vue } from 'vue-property-decorator'
import { blocksModule } from '@/store/Modules/Blocks'
import SVGText from '@/components/Atoms/SVGText.vue'
import ElementBlockBase from '@/components/Molecules/ElementBlockBase.vue'
@Component({
  components: {
    SVGText,
    ElementBlockBase
  }
})
export default class DebugBlock extends Vue {
  get allBlocks () {
    return blocksModule.allBlocks
  }

  @Prop({ required: true })
  public blockUniqueKey!: string

  @Prop({ required: true })
  public x!: number

  @Prop({ required: true })
  public y!: number

  @Prop({ required: true })
  public showShadow!: boolean

  public selectFilePath = ''
  public strokeColor = '#c53d43'
  public fillColor = '#e83929'
  public width = 350

  @Emit('stopDragging')
  public stopDragging (blockUniqueKey: string) {
    return blockUniqueKey
  }

  @Emit('updatePosition')
  public updatePosition (blockObj: { position: Position; blockUniqueKey: string }) {
    return blockObj
  }

  @Emit('removeBlock')
  public removeBlock (blockUniqueKey: string) {
    return blockUniqueKey
  }
}
</script>

<style lang="scss">
  .openDirectoryButton .v-btn__content {
    position: unset !important;
  }
</style>
