<template>
  <svg id="timeline" width="2200" height="800" @mousedown="mouseDown" @mousemove="mouseMove" @mouseup="mouseUp">
    <g :transform="`translate(${this.timelinePositionX}, 0)`">
      <rect
        x="1"
        y="1"
        :width="width"
        height="620"
        fill="none"
        stroke="black"
        stroke-width="1"
      />
      <SVGText
        v-for="i in 20"
        :key="i"
        :x="`${10 + (i-1) * 200}`"
        y="16"
        color="black"
      >
        {{ getTimeDisplay(i) }}
      </SVGText>
      <g transform="translate(0, 20)">
        <ComponentObject
          v-for="(value, key, index) in componentObjects"
          :key="index + key"
          :componentObjectUniqueKey="key"
          :name="value.componentUniqueKey"
          :x="value.position.x"
          :y="value.position.y"
          :width="value.width"
          @updatePosition="updatePosition"
          @updateWidth="updateWidth"
        />
        <line
          v-for="i in 10"
          :key="i"
          x1="1"
          :y1="getLinePosY(i)"
          :x2="width + 1"
          :y2="getLinePosY(i)"
          stroke="black"
          stroke-width="1"
        />
      </g>
    </g>
  </svg>
</template>

<script>
import SVGText from '@/components/Atoms/SVGText'
import ComponentObject from '@/components/Molecules/ComponentObject'
export default {
  name: 'Timeline',
  components: {
    SVGText,
    ComponentObject
  },
  props: {
    componentObjects: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      width: 4000,
      beforeMouseX: 0,
      timelinePositionX: 0,
      isDragging: false
    }
  },
  methods: {
    getTimeDisplay (seconds) {
      const minutes = Math.floor(seconds / 60)
      seconds -= minutes * 60
      const displayMinutes = minutes >= 10 ? minutes.toString() : '0' + minutes.toString()
      const displaySeconds = seconds >= 10 ? seconds.toString() : '0' + seconds.toString()
      return `${displayMinutes}:${displaySeconds}:00`
    },
    getLinePosY (i) {
      return (i - 1) * 50 + 1
    },
    mouseDown (event) {
      this.isDragging = true
      this.beforeMouseX = event.offsetX
      event.preventDefault()
    },
    mouseMove (event) {
      if (!this.isDragging) return
      const res = this.timelinePositionX + event.offsetX - this.beforeMouseX
      if (res <= 0 && res >= -this.width + 1500) {
        this.timelinePositionX = res
      }
      this.beforeMouseX = event.offsetX
      event.preventDefault()
    },
    mouseUp (event) {
      this.isDragging = false
      this.beforeMouseX = 0
      this.beforeMouseY = 0
      event.preventDefault()
    },
    updatePosition (pos) {
      this.$store.dispatch('Timeline/updatePosition', pos)
    },
    updateWidth (width) {
      this.$store.dispatch('Timeline/updateWidth', width)
    }
  }
}
</script>

<style scoped>
</style>
