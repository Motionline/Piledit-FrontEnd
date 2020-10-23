<template>
  <EventBlockBase
    :blockUniqueKey="blockUniqueKey"
    :x="x"
    :y="y"
    :showShadow="showShadow"
    :shadowPath="shadowPath(width)"
    :strokeColor="strokeColor"
    :fillColor="fillColor"
    :width="width"
    @stopDragging="stopDragging($event)"
    @updatePosition="updatePosition($event)"
    @removeBlock="removeBlock($event)"
  >
    <SVGText x="10" y="45" color="white">
      コンポーネント定義
    </SVGText>
    <foreignObject
      width="100"
      height="30"
      x="100"
      y="5"
    >
      <v-text-field class="componentNameTextField">text</v-text-field>
    </foreignObject>
  </EventBlockBase>
</template>

<script>
import SVGText from '@/components/Atoms/SVGText'
import EventBlockBase from '@/components/Molecules/EventBlockBase'
export default {
  name: 'DefinitionComponentBlock',
  components: {
    SVGText,
    EventBlockBase
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
    },
    shadowPath: {
      type: Function
    }
  },
  data () {
    return {
      selectFilePath: '',
      strokeColor: '#e9bc00',
      fillColor: '#fcc800',
      width: '300'
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
  }
}
</script>

<style lang="scss">
  .componentNameTextField .v-btn__content {
    position: unset !important;
    z-index: 1000000 !important;
  }
</style>
