<template>
  <svg
    @click.right.prevent="popupContextMenu($event)"
  >
    <rect
      :x="clip.position.x"
      :y="clip.position.y"
      :width="clip.width"
      height="50"
      fill="gray"
      stroke="none"
      @mousedown.left.stop="mouseDown"
      :class="{ colResize : isTouchStart || isTouchEnd }"
    />
    <SVGText
      :x="clip.position.x.toString()"
      :y="(clip.position.y + 30).toString()"
      color="white"
    >
      {{ clip.name }}
    </SVGText>
  </svg>
</template>

<script lang="ts">
import { Component, Prop, Emit, Vue } from 'vue-property-decorator'
import { remote } from 'electron'
import SVGText from '@/components/Atoms/SVGText.vue'
import { Clip, Position } from '@/@types/piledit'
const Menu = remote.Menu
const MenuItem = remote.MenuItem

@Component({
  components: {
    SVGText
  }
})
export default class ClipOnLayer extends Vue {
  @Prop({ required: true })
  public clip!: Clip

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

  @Emit('updatePosition')
  public emitUpdatePosition (position: Position, uuid: string) {
    return {
      position,
      uuid
    }
  }

  @Emit('updateWidth')
  public emitUpdateWidth (width: number, uuid: string) {
    return {
      width,
      uuid
    }
  }

  public mouseMove (event: MouseEvent) {
    const clipX = this.clip.position.x
    const clipY = this.clip.position.y
    const clipWidth = this.clip.width
    const clipUuid = this.clip.uuid
    const resX = clipX + event.offsetX - this.beforeMouseX
    if (!this.isDragging) {
      this.isTouchStart = event.offsetX <= (clipX + 10)
      this.isTouchEnd = event.offsetX >= clipX + clipWidth - 10
      return
    }
    if (this.isTouchStart) {
      const res = clipX - event.offsetX
      const newWidth = clipWidth - res >= 60 ? clipWidth + res : 0
      const newPosition: Position = {
        x: clipWidth - res >= 60 ? clipX - res : 0,
        y: clipY
      }
      this.emitUpdatePosition(newPosition, clipUuid)
      this.emitUpdateWidth(newWidth, clipUuid)
      return
    } else if (this.isTouchEnd) {
      const res = event.offsetX - clipX
      const newWidth = res >= 60 ? res : 60
      this.emitUpdateWidth(newWidth, clipUuid)
      return
    }
    this.isTouchStart = false
    this.isTouchEnd = false
    const resY = Math.floor((event.offsetY - 30) / 50) * 50 + 1
    this.beforeMouseX = event.offsetX
    const newPosition = {
      x: resX >= 0 ? resX : clipX,
      y: resY > 0 ? resY : clipY
    }
    this.emitUpdatePosition(newPosition, clipUuid)
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

  @Emit('removeClip')
  public calledByRemoveMenuItem () {
    return this.clip.uuid
  }
}
</script>

<style scoped>
  .colResize {
    cursor: col-resize;
  }
</style>
