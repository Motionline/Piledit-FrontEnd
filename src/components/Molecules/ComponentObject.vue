<template>
  <svg
    @click.right.prevent="popupContextMenu($event)"
  >
    <rect
      :x="x"
      :y="y"
      :width="width"
      height="50"
      fill="gray"
      stroke="none"
      @mousedown.left.stop="mouseDown"
      :class="{ colResize : isTouchStart || isTouchEnd }"
    />
    <SVGText
      :x="x.toString()"
      :y="(y+30).toString()"
      color="white"
    >
      {{ name }}
    </SVGText>
  </svg>
</template>

<script lang="ts">
import SVGText from '@/components/Atoms/SVGText.vue'
import { Component, Prop, Emit, Vue } from 'vue-property-decorator'
import { remote } from 'electron'
const Menu = remote.Menu
const MenuItem = remote.MenuItem

@Component({
  components: {
    SVGText
  }
})
export default class ComponentObject extends Vue {
  @Prop({ required: true })
  public name!: string

  @Prop({ required: true })
  public componentObjectUniqueKey!: string

  @Prop({ required: true })
  public x!: number

  @Prop({ required: true })
  public y!: number

  @Prop({ required: true })
  public width!: number

  public beforeMouseX = 0
  public isDragging = false
  public isTouchStart = false
  public isTouchEnd = false

  public mounted () {
    document.addEventListener('mouseup', this.mouseUp)
    document.addEventListener('mousemove', this.mouseMove)
  }

  public beforeDestroy () {
    document.removeEventListener('mouseup', this.mouseUp)
    document.removeEventListener('mousemove', this.mouseMove)
  }

  public mouseUp (event: MouseEvent) {
    this.isDragging = false
    this.beforeMouseX = 0
    event.preventDefault()
  }

  public mouseDown (event: MouseEvent) {
    this.isDragging = true
    this.beforeMouseX = event.offsetX
    event.preventDefault()
  }

  public mouseMove (event: MouseEvent) {
    const resX = this.x + event.offsetX - this.beforeMouseX
    if (!this.isDragging) {
      this.isTouchStart = event.offsetX <= (this.x + 10)
      this.isTouchEnd = event.offsetX >= this.x + this.width - 10
      return
    }
    if (this.isTouchStart) {
      const res = this.x - event.offsetX
      const newWidth = this.width - res >= 60 ? this.width + res : 0
      const newPosition = {
        x: this.width - res >= 60 ? this.x - res : 0,
        y: this.y
      }
      this.$emit('updatePosition', {
        position: newPosition,
        componentObjectUniqueKey: this.componentObjectUniqueKey
      })
      this.$emit('updateWidth', {
        width: newWidth,
        componentObjectUniqueKey: this.componentObjectUniqueKey
      })
      return
    } else if (this.isTouchEnd) {
      const res = event.offsetX - this.x
      const newWidth = res >= 60 ? res : 60
      this.$emit('updateWidth', {
        width: newWidth,
        componentObjectUniqueKey: this.componentObjectUniqueKey
      })
      return
    }
    this.isTouchStart = false
    this.isTouchEnd = false
    const resY = Math.floor((event.offsetY - 30) / 50) * 50 + 1
    this.beforeMouseX = event.offsetX
    const newPosition = {
      x: resX >= 0 ? resX : this.x,
      y: resY > 0 ? resY : this.y
    }
    this.$emit('updatePosition', {
      position: newPosition,
      componentObjectUniqueKey: this.componentObjectUniqueKey
    })
    event.preventDefault()
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
    this.$emit('removeComponentObject', {
      componentObjectKey: this.componentObjectUniqueKey
    })
  }
}
</script>

<style scoped>
.colResize {
  cursor: col-resize;
}
</style>
