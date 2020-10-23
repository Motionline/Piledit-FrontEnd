<template>
  <svg height="2000" width="1200">
    <rect x="3" y="3" stroke="black" stroke-width="3px" height="380" width="1180" fill-opacity="0" />
    <component
      v-for="(value, key, index) in this.allBlocks"
      :is="value.blockType"
      :key="index"
      :blockUniqueKey="key"
      :x="value.position.x"
      :y="value.position.y"
      :showShadow="value.showShadow"
      :shadowPath="shadowPath"
      @stopDragging="stopDragging($event)"
      @updatePosition="updatePosition($event)"
      @removeBlock="removeBlock($event)"
    />
  </svg>
</template>

<script>
import LoadingVideoBlock from '@/components/Organisms/LoadingVideoBlock'
import DebugBlock from '@/components/Organisms/DebugBlock'
import DefinitionComponentBlock from '@/components/Organisms/DefinitionComponentBlock'
export default {
  name: 'BlocksSandBox',
  components: {
    LoadingVideoBlock,
    DebugBlock,
    DefinitionComponentBlock
  },
  props: {
    allBlocks: {
      type: Object,
      required: true
    }
  },
  methods: {
    shadowPath (width) {
      return `m 0,4 A 4,4 0 0,1 4,0 H 12 c 2,0 3,1 4,2 l 4,4 c 1,1 2,2 4,2 h 12 c 2,0 3,-1 4,-2 l 4,-4 c 1,-1 2,-2 4,-2 H ${width} a 4,4 0 0,1 4,4 v 40  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-4 z`
    },
    test () {
      console.log('drop')
    },
    stopDragging (event) {
      this.$store.dispatch('Blocks/stopDragging', event)
    },
    updatePosition (event) {
      this.$store.dispatch('Blocks/update', event)
    },
    removeBlock (event) {
      this.$store.dispatch('Blocks/remove', event.blockUniqueKey)
    }
  }
}
</script>

<style scoped>
#blockComponentsSandBox {
  border: 4px black solid;
}
</style>
