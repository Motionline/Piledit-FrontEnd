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
import { Component, Prop, Emit, Vue } from 'vue-property-decorator'
import svgZOrder from 'svg-z-order'
import { remote } from 'electron'
import { Position } from '@/@types/piledit'
const Menu = remote.Menu
const MenuItem = remote.MenuItem

@Component
export default class ElementBlockBase extends Vue {
  @Prop({ required: true })
  public blockUniqueKey!: string

  @Prop({ required: true })
  public x!: number

  @Prop({ required: true })
  public y!: number

  @Prop({ required: true })
  public showShadow!: boolean

  @Prop({ required: true })
  public strokeColor!: string

  @Prop({ required: true })
  public fillColor!: string

  @Prop({ required: true })
  public width!: string

  public path = `m 0,4 A 4,4 0 0,1 4,0 H 12 c 2,0 3,1 4,2 l 4,4 c 1,1 2,2 4,2 h 12 c 2,0 3,-1 4,-2 l 4,-4 c 1,-1 2,-2 4,-2 H ${this.width} a 4,4 0 0,1 4,4 v 40  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-4 z`
  public isDragging = false
  public beforeMouseX = 0
  public beforeMouseY = 0

  public mounted () {
    document.addEventListener('mouseup', this.mouseUp)
    document.addEventListener('mousemove', this.mouseMove)
  }

  public beforeDestroy () {
    document.removeEventListener('mouseup', this.mouseUp)
    document.removeEventListener('mousemove', this.mouseMove)
  }

  @Emit('stopDragging')
  public mouseUp (event: MouseEvent) {
    this.isDragging = false
    this.beforeMouseX = 0
    this.beforeMouseY = 0
    event.preventDefault()
    return this.blockUniqueKey
  }

  public mouseDown (event: MouseEvent) {
    this.isDragging = true
    event.preventDefault()
  }

  public mouseMove (event: MouseEvent) {
    if (!this.isDragging) return
    event.preventDefault()
    const blockElement = document.getElementById(this.blockUniqueKey)
    svgZOrder.element(blockElement).toTop()
    const newPosition: Position = this.getNewPosition(event.offsetX, event.offsetY)
    const context = {
      position: newPosition,
      blockUniqueKey: this.blockUniqueKey
    }
    this.emitUpdatePosition(context)
  }

  @Emit('updatePosition')
  public emitUpdatePosition (context: { position: Position; blockUniqueKey: string }) {
    return context
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
    return { x: x, y: y }
  }

  public popupContextMenu (event: Event) {
    const menu = this.buildContextMenu()
    const currentWindow = remote.getCurrentWindow()
    menu.popup({ window: currentWindow })
    event.preventDefault()
  }

  public buildContextMenu () {
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
  public calledByRemoveMenuItem () {
    return this.blockUniqueKey
  }
}
</script>
