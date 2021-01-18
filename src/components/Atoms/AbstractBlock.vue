<template>
  <svg
      @mousedown.left="mouseDown($event)"
      @dblclick.left="calledByOpenDetailedMenuItem"
      @click.right.prevent="popupContextMenu($event)"
      preserveAspectRatio="xMidYMid meet"
      :x="block.position.x"
      :y="block.position.y"
      :id="block.uuid"
  >
    <g transform="translate(2, 20)">
      <path
          @click="onClick"
          :d="block.path"
          :stroke="block.strokeColor"
          :fill="block.fillColor"
          stroke-width="1"
      />
      <slot></slot>
      <path
          v-if="block.shadow"
          fill="#d3d3d8"
          :d="block.shadowPath"
          transform="translate(1,38)"
      />
    </g>
  </svg>
</template>

<style lang="scss" scoped>
svg {
  cursor: pointer;
}
</style>

<script lang="ts">
import { Component, Prop, Emit, Vue } from 'vue-property-decorator'
import { PBlock, PPosition } from '@/@types/piledit'
import svgZOrder from 'svg-z-order'
import { remote } from 'electron'
const Menu = remote.Menu
const MenuItem = remote.MenuItem

// AbstractBlock classは、編集ブロックの抽象クラスです
// マウスイベントによる移動、クリックイベント、コピーなどブロックの最低限の機能を備えます
// 全ての編集ブロックはAbstractBlockコンポーネントを利用して作成します

@Component
export default class AbstractBlock extends Vue {
  // ブロック一覧にあるサンプルかどうか
  // サンプルなら、mouseUpでcopyし、編集可能範囲外でも自動削除しない
  @Prop({ required: true })
  public block!: PBlock

  @Prop()
  public newBlock!: PBlock

  public isDragging = false
  public beforeMouseX = 0
  public beforeMouseY = 0

  @Emit('click')
  public onClick (event: Event) {
    return event
  }

  mounted () {
    document.addEventListener('mouseup', this.mouseUp)
    document.addEventListener('mousemove', this.mouseMove)
  }

  beforeDestroy () {
    document.removeEventListener('mouseup', this.mouseUp)
    document.removeEventListener('mousemove', this.mouseMove)
  }

  @Emit('stopDragging')
  public mouseUp (event: MouseEvent) {
    this.isDragging = false
    this.beforeMouseX = 0
    this.beforeMouseY = 0
    event.preventDefault()

    if (this.block.isSample) {
      this.emitNewBlockMouseUp(this.newBlock.uuid)
      return
    }
    return this.block.uuid
  }

  @Emit('newBlockMouseUp')
  public emitNewBlockMouseUp (uuid: string) {
    return uuid
  }

  public mouseDown (event: MouseEvent) {
    this.isDragging = true
    if (this.block.isSample) {
      this.emitNewBlockGenerate(this.getNewPosition(event.offsetX, event.offsetY, this.block))
      // this.block.isSample = false
    }
    event.preventDefault()
  }

  @Emit('newBlockGenerate')
  public emitNewBlockGenerate (position: PPosition) {
    return position
  }

  public mouseMove (event: MouseEvent) {
    if (!this.isDragging) return
    event.preventDefault()
    if (this.block.isSample) {
      this.emitNewBlockMove({
        uuid: this.newBlock.uuid,
        position: this.getNewPosition(event.offsetX, event.offsetY, this.newBlock)
      })
    } else {
      const blockElement = document.getElementById(this.block.uuid)
      svgZOrder.element(blockElement).toTop()
      const newPosition: PPosition = this.getNewPosition(event.offsetX, event.offsetY, this.block)
      const context = {
        position: newPosition,
        uuid: this.block.uuid
      }
      this.emitUpdatePosition(context)
    }
  }

  @Emit('newBlockMove')
  public emitNewBlockMove (context: { uuid: string; position: PPosition }) {
    return context
  }

  @Emit('updatePosition')
  public emitUpdatePosition (context: { position: PPosition; uuid: string }) {
    return context
  }

  public getNewPosition (offsetX: number, offsetY: number, block: PBlock) {
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
    const tempX = dx + block.position.x
    const tempY = dy + block.position.y
    const x = tempX > 0 ? tempX : block.position.x
    const y = tempY > 0 ? tempY : block.position.y
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
    menu.append(
      new MenuItem({
        label: '詳細メニューを開く',
        accelerator: 'CmdOrCtrl+M',
        click: this.calledByOpenDetailedMenuItem
      })
    )
    menu.append(new MenuItem({ label: '非表示', accelerator: 'CmdOrCtrl+,' }))
    menu.append(new MenuItem({ label: '親ブロックとの接続を切る', enabled: false }))
    return menu
  }

  @Emit('remove')
  public calledByRemoveMenuItem () {
    return this.block.uuid
  }

  @Emit('openingMenu')
  public calledByOpenDetailedMenuItem () {
    return this.block.uuid
  }
}
</script>
