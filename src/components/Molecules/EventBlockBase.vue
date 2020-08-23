<template>
  <svg
    @mousedown.left="mouseDown($event)"
    @click.right.prevent="popupContextMenu($event)"
    preserveAspectRatio="xMidYMid meet"
    :x="x"
    :y="y"
    :id="blockUniqueKey"
  >
    <path
      :d="path"
      :stroke="strokeColor"
      :fill="fillColor"
      stroke-width="2"
      transform="translate(1,15) scale(0.75, 0.75)"
    />
    <slot></slot>
    <path
      v-if="showShadow"
      stroke-width="2"
      fill="#d3d3d8"
      :d="shadowPath"
      transform="translate(1,52) scale(0.75, 0.75)"
    />
  </svg>
</template>

<script lang="ts">
import { Prop, Emit, Vue } from 'vue-property-decorator'
import svgZOrder from 'svgZOrder'
const remote = require('electron').remote
const Menu = remote.Menu
const MenuItem = remote.MenuItem
export default class SVGText extends Vue {
  @Prop()
  public blockUniqueKey!: string

  @Prop()
  public x!: number
}
</script>

<style scoped>

</style>
