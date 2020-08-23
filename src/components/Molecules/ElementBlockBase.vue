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
      transform="translate(1,1) scale(0.75, 0.75)"
    />
    <slot></slot>
    <path
      v-if="showShadow"
      stroke-width="2"
      fill="#d3d3d8"
      :d="path"
      transform="translate(1,37) scale(0.75, 0.75)"
    />
  </svg>
</template>

<script lang="ts">
import { Prop, Emit, Vue } from 'vue-property-decorator'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const svgZOrder = require('svg-z-order')
const remote = require('electron').remote
const Menu = remote.Menu
const MenuItem = remote.MenuItem
export default class SVGText extends Vue {
  @Prop()
  public blockUniqueKey!: string

  @Prop()
  public x!: string

  @Prop()
  public y!: string

  @Prop()
  public showShadow!: string

  @Prop()
  public strokeColor!: string

  @Prop()
  public fillColor!: string

  @Prop()
  public width!: string

  path = `m 0,4 A 4,4 0 0,1 4,0 H 12 c 2,0 3,1 4,2 l 4,4 c 1,1 2,2 4,2 h 12 c 2,0 3,-1 4,-2 l 4,-4 c 1,-1 2,-2 4,-2 H ${this.width} a 4,4 0 0,1 4,4 v 40  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-4 z`
  isDragging = false
  beforeMouseX = 0
  beforeMouseY = 0

  mounted () {
    document.addEventListener('mouseup', this.mouseUp)
    document.addEventListener('mousemove', this.mouseMove)
  }

  beforeDestroy () {
    document.removeEventListener('mouseup', this.mouseUp)
    document.removeEventListener('mousemove', this.mouseMove)
  }

  mouseDown (event: Event) {
    this.isDragging = true
    event.preventDefault()
  }

  @Emit('stopDragging')
  mouseUp (event: Event) {
    event.preventDefault()
    this.isDragging = false
    this.beforeMouseX = 0
    this.beforeMouseY = 0
    return {
      blockUniqueKey: this.blockUniqueKey
    }
  }

  @Emit('updatePosition')
  mouseMove (event: Event) {
    if (!this.isDragging) return
    event.preventDefault()
    const blockElement = document.getElementById(this.blockUniqueKey)
    svgZOrder.element(blockElement).toTop()
    const newPosition = this.getNewPosition(event.offsetX, event.offsetY)
    return {
      position: newPosition,
      blockUniqueKey: this.blockUniqueKey
    }
  }

  getNewPosition (offsetX: number, offsetY: number) {
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

  popupContextMenu (event: Event) {
    const menu = this.buildContextMenu()
    menu.popup(remote.getCurrentWindow())
    event.preventDefault()
  }

  buildContextMenu () {
    const menu = new Menu()
    menu.append(new MenuItem({ label: 'カット', accelerator: 'CmdOrCtrl+X' }))
    menu.append(new MenuItem({ label: 'コピー', accelerator: 'CmdOrCtrl+C' }))
    menu.append(new MenuItem({ label: 'ペースト', accelerator: 'CmdOrCtrl+V' }))
    menu.append(
      new MenuItem({
        label: '削除',
        accelerator: 'Backspace',
        click: this.calledByRemoveMenuItem
      })
    )
    menu.append(new MenuItem({ type: 'separator' }))
    menu.append(new MenuItem({ label: '詳細メニューを開く', accelerator: 'CmdOrCtrl+M' }))
    menu.append(new MenuItem({ label: '非表示', accelerator: 'CmdOrCtrl+,' }))
    menu.append(new MenuItem({ label: '親ブロックとの接続を切る', enabled: false }))
    return menu
  }

  @Emit('removeBlock')
  calledByRemoveMenuItem () {
    return {
      blockUniqueKey: this.blockUniqueKey
    }
  }
}
</script>
