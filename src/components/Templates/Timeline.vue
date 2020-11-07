<template>
  <svg id="timeline" width="2200" height="500" @mousedown="mouseDown" @mousemove="mouseMove" @mouseup="mouseUp">
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
        :key="`SVGText-${i}`"
        :x="`${10 + (i-1) * 200}`"
        y="16"
        color="black"
      >
        {{ getTimeDisplay(i) }}
      </SVGText>
      <g transform="translate(0, 20)">
        <ClipOnLayer
          v-for="(clip, uuid, index) in clips"
          :key="`Clip-${uuid}-${index}`"
          :clip="clip"
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

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { clipsModule } from '@/store/Modules/Clips'
import { Clip, Position } from '@/@types/piledit'
import SVGText from '@/components/Atoms/SVGText.vue'
import ClipOnLayer from '@/components/Molecules/ClipOnLayer.vue'
@Component({
  components: {
    SVGText,
    ClipOnLayer
  }
})
export default class Timeline extends Vue {
  @Prop({ required: true })
  public clips!: { [key: string]: Clip }

  public width = 4000
  public beforeMouseX = 0
  public beforeMouseY = 0
  public timelinePositionX = 0
  public isDragging = false

  public getTimeDisplay (seconds: number) {
    const minutes = Math.floor(seconds / 60)
    seconds -= minutes * 60
    const displayMinutes = minutes >= 10 ? minutes.toString() : '0' + minutes.toString()
    const displaySeconds = seconds >= 10 ? seconds.toString() : '0' + seconds.toString()
    return `${displayMinutes}:${displaySeconds}:00`
  }

  public getLinePosY (i: number) {
    return (i - 1) * 50 + 1
  }

  public mouseDown (event: MouseEvent) {
    this.isDragging = true
    this.beforeMouseX = event.offsetX
    event.preventDefault()
  }

  public mouseMove (event: MouseEvent) {
    if (!this.isDragging) return
    const res = this.timelinePositionX + event.offsetX - this.beforeMouseX
    if (res <= 0 && res >= -this.width + 1500) {
      this.timelinePositionX = res
    }
    this.beforeMouseX = event.offsetX
    event.preventDefault()
  }

  public mouseUp (event: MouseEvent) {
    this.isDragging = false
    this.beforeMouseX = 0
    this.beforeMouseY = 0
    event.preventDefault()
  }

  public updatePosition (context: { position: Position; uuid: string }) {
    clipsModule.updatePosition(context)
  }

  public updateWidth (context: { width: number; uuid: string }) {
    clipsModule.updateWidth(context)
  }
}
</script>

<style scoped>
</style>
