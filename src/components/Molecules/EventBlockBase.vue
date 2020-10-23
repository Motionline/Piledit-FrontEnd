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

<script>
const svgZOrder = require('svg-z-order')
const remote = require('electron').remote
const Menu = remote.Menu
const MenuItem = remote.MenuItem
export default {
  name: 'DefinitionEventBlockBase',
  props: {
    // ブロック識別キー
    blockUniqueKey: {
      type: String,
      required: true
    },
    // svgの座標
    x: {
      type: Number,
      required: true
    },
    y: {
      type: Number,
      required: true
    },
    // ブロック接続シャドーを表示するかどうか
    showShadow: {
      type: Boolean,
      required: true
    },
    // 影path
    shadowPath: {
      type: String
    },
    // pathの輪郭・塗り潰し色
    strokeColor: {
      type: String,
      required: true
    },
    fillColor: {
      type: String,
      required: true
    },
    // ブロックの横の長さ
    width: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      path: `m 0,0 c 25,-22 71,-22 96,0 H ${this.width} a 4,4 0 0,1 4,4 v 40  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-4 z`,
      isDragging: false,
      beforeMouseX: 0,
      beforeMouseY: 0
    }
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
      event.preventDefault()
    },
    mouseUp (event) {
      this.isDragging = false
      this.beforeMouseX = 0
      this.beforeMouseY = 0
      this.$emit('stopDragging', {
        blockUniqueKey: this.blockUniqueKey
      })
      event.preventDefault()
    },
    mouseMove (event) {
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
    },
    getNewPosition (offsetX, offsetY) {
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
      this.$emit('removeBlock', {
        blockUniqueKey: this.blockUniqueKey
      })
    }
  }
}
</script>

<style scoped>

</style>
