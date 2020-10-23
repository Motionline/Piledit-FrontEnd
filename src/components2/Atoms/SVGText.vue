<template>
  <text
    :x="x"
    :y="y"
    :fill="color"
    font-size="14"
    class="notFocusSVGText"
  >
    <slot />
  </text>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
@Component
export default class SVGText extends Vue {
  @Prop({ default: '0' })
  public x!: string

  @Prop({ default: '0' })
  public y!: string

  @Prop()
  public color!: string
}
</script>

<style lang="scss" scoped>
  .notFocusSVGText {
    -ms-user-select: none;
    -webkit-user-select: none;
    user-select: none;
    pointer-events: none;
  }
</style>
