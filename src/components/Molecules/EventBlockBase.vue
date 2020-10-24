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
import { Component, Prop, Vue } from 'vue-property-decorator'
import svgZOrder from 'svgZOrder'
import { remote } from 'electron'
const Menu = remote.Menu
const MenuItem = remote.MenuItem

@Component
export default class EventBlockBase extends Vue {
  @Prop({ required: true })
  public blockUniqueKey!: string

  @Prop({ required: true })
  public x!: number

  @Prop({ required: true })
  public y!: number

  @Prop({ required: true })
  public showShadow!: boolean

  @Prop({ required: true })
  public shadowPath!: string

  @Prop({ required: true })
  public strokeColor!: string

  @Prop({ required: true })
  public fillColor!: string

  @Prop({ required: true })
  public width!: string

  public path = `m 0,0 c 25,-22 71,-22 96,0 H ${this.width} a 4,4 0 0,1 4,4 v 40  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-4 z`
  public isDragging = false
  public beforeMouseX = 0
  public beforeMouseY = 0

  public mouseDown (event: MouseEvent) {
    this.isDragging = true
    event.preventDefault()
  }

  public mouseUp (event: MouseEvent) {
    this.isDragging = false
    this.beforeMouseX = 0
    this.beforeMouseY = 0
    this.$emit('stopDragging', {
      blockUniqueKey: this.blockUniqueKey
    })
    event.preventDefault()
  }

  public mouseMove (event: MouseEvent) {
    if (!this.isDragging) return
    const blockElement = document.getElementById(this.blockUniqueKey)
    svgZOrder.element(blockElement).toTop()
    // 座標を更新 -> Emit
    const newPosition = this.getNewPosition(event.offsetX, event.offsetY)
    this.$emit('updatePosition', {
      position: newPosition,
      blockUniqueKey: this.blockUniqueKey
    })
    event.preventDefault()
  }

  public getNewPosition (offsetX: number, offsetY: number) {
    const mouseX = offsetX
    const mouseY = offsetY
    let dx, dy
    [dx, dy] = [0, 0]
    if (this.beforeMouseX && this.beforeMouseY) {
      dx = mouseX - this.beforeMouseX
      dy = mouseY - this.beforeMouseY
    }
    this.beforeMouseX = mouseX
    this.beforeMouseY = mouseY
    const tempX = dx + Number(this.x)
    const tempY = dy + Number(this.y)
    const x = tempX > 0 ? tempX : this.x
    const y = tempY > 0 ? tempY : this.y
    return { x, y }
  }

  public popupContextMenu (event: MouseEvent) {
    const menu = new Menu()
    menu.append(
      new MenuItem({
        label: '削除する',
        click: this.calledByRemoveMenuItem
      })
    )
    const currentWindow = remote.getCurrentWindow()
    menu.popup({ window: currentWindow })
    event.preventDefault()
  }

  public calledByRemoveMenuItem () {
    // ブロックを削除 -> Emit
    this.$emit('removeBlock', {
      blockUniqueKey: this.blockUniqueKey
    })
  }
}
</script>

<style scoped>

</style>
