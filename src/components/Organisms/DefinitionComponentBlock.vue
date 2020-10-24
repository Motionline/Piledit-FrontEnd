<template>
  <EventBlockBase
    :blockUniqueKey="blockUniqueKey"
    :x="x"
    :y="y"
    :showShadow="showShadow"
    :shadowPath="shadowPath(width)"
    :strokeColor="strokeColor"
    :fillColor="fillColor"
    :width="width"
    @stopDragging="stopDragging($event)"
    @updatePosition="updatePosition($event)"
    @removeBlock="removeBlock($event)"
  >
    <SVGText x="10" y="45" color="white">
      コンポーネント定義
    </SVGText>
    <foreignObject
      width="100"
      height="30"
      x="100"
      y="5"
    >
      <v-text-field class="componentNameTextField">text</v-text-field>
    </foreignObject>
  </EventBlockBase>
</template>

<script lang="ts">
import SVGText from '@/components/Atoms/SVGText.vue'
import EventBlockBase from '@/components/Molecules/EventBlockBase.vue'
import { Component, Prop, Vue } from 'vue-property-decorator'
@Component({
  components: {
    SVGText,
    EventBlockBase
  }
})
export default class DefinitionComponentBlock extends Vue {
  @Prop({ required: true })
  public blockUniqueKey!: string

  @Prop({ required: true })
  public x!: number

  @Prop({ required: true })
  public y!: number

  @Prop({ required: true })
  public showShadow!: string

  @Prop({ required: true })
  public shadowPath!: (width: number) => string

  public selectFilePath = ''
  public strokeColor = '#e9bc00'
  public fillColor = '#fcc800'
  public width = 300

  public stopDragging (event: DragEvent) {
    this.$emit('stopDragging', event)
  }

  public updatePosition (event: DragEvent) {
    this.$emit('updatePosition', event)
  }

  public removeBlock (event: DragEvent) {
    this.$emit('removeBlock', event)
  }
}
</script>

<style lang="scss">
  .componentNameTextField .v-btn__content {
    position: unset !important;
    z-index: 1000000 !important;
  }
</style>
