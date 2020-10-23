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

<script>
import SVGText from '@/components/Atoms/SVGText'
const remote = require('electron').remote
const Menu = remote.Menu
const MenuItem = remote.MenuItem
export default {
  name: 'ComponentObject',
  props: {
    name: {
      type: String,
      required: true
    },
    componentObjectUniqueKey: {
      type: String,
      required: true
    },
    x: {
      type: Number,
      required: true
    },
    y: {
      type: Number,
      required: true
    },
    width: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      beforeMouseX: 0,
      isDragging: false,
      isTouchStart: false,
      isTouchEnd: false
    }
  },
  components: {
    SVGText
  },
  mounted () {
    document.addEventListener('mouseup', this.mouseUp)
    document.addEventListener('mousemove', this.mouseMove)
  },
  beforeDestroy () {
    document.removeEventListener('mouseup', this.mouseUp)
    document.removeEventListener('mousemove', this.mouseMove)
  },
  methods: {
    mouseDown (event) {
      this.isDragging = true
      this.beforeMouseX = event.offsetX
      event.preventDefault()
    },
    mouseUp (event) {
      this.isDragging = false
      this.beforeMouseX = 0
      event.preventDefault()
    },
    mouseMove (event) {
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
    },
    popupContextMenu (event) {
      const menu = new Menu()
      menu.append(
        new MenuItem({
          label: '削除する',
          click: this.calledByRemoveMenuItem
        })
      )
      menu.popup(remote.getCurrentWindow())
      event.preventDefault()
    },
    calledByRemoveMenuItem () {
      // ブロックを削除 -> Emit
      this.$emit('removeComponentObject', {
        componentObjectKey: this.componentObjectKey
      })
    }
  }
}
</script>

<style scoped>
.colResize {
  cursor: col-resize;
}
</style>
