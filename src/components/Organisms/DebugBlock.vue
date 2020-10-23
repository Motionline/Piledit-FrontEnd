<template>
  <ElementBlockBase
    :blockUniqueKey="blockUniqueKey"
    :x="x"
    :y="y"
    :showShadow="showShadow"
    :strokeColor="strokeColor"
    :fillColor="fillColor"
    :width="width"
    @stopDragging="stopDragging($event)"
    @updatePosition="updatePosition($event)"
    @removeBlock="removeBlock($event)"
  >
    <SVGText x="10" y="30" color="white">
      {{ blockUniqueKey }} {{ allBlocks[blockUniqueKey].childBlockUniqueKey }}
    </SVGText>
  </ElementBlockBase>
</template>

<script>
import { mapGetters } from 'vuex'
import SVGText from '@/components/Atoms/SVGText'
import ElementBlockBase from '@/components/Molecules/ElementBlockBase'
export default {
  name: 'DebugBlock',
  components: {
    SVGText,
    ElementBlockBase
  },
  props: {
    blockUniqueKey: {
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
    showShadow: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      selectFilePath: '',
      strokeColor: '#c53d43',
      fillColor: '#e83929',
      width: '350'
    }
  },
  methods: {
    stopDragging (event) {
      this.$emit('stopDragging', event)
    },
    updatePosition (event) {
      this.$emit('updatePosition', event)
    },
    removeBlock (event) {
      this.$emit('removeBlock', event)
    }
  },
  computed: {
    ...mapGetters('Blocks', [
      'allBlocks'
    ])
  }
}
</script>

<style lang="scss">
  .openDirectoryButton .v-btn__content {
    position: unset !important;
  }
</style>
