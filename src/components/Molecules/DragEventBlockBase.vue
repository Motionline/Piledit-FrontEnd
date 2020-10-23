<template>
  <svg preserveAspectRatio="xMidYMid meet" width="285" height="65" class="DragEventBlock">
    <path
      :d="path"
      :stroke="strokeColor"
      :fill="fillColor"
      stroke-width="2"
      transform="translate(1,15) scale(0.75, 0.75)"
    />
    <slot></slot>
  </svg>
</template>

<script>
export default {
  name: 'DragEventBlockBase',
  props: {
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
      path: `m 0,0 c 25,-22 71,-22 96,0 H ${this.width} a 4,4 0 0,1 4,4 v 40  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-4 z`
    }
  }
}
</script>
