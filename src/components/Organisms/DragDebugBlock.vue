<template>
  <DragElementBlockBase
    :strokeColor="strokeColor"
    :fillColor="fillColor"
    :width="width"
  >
    <SVGText x="10" y="30" color="white">
      debug
    </SVGText>
  </DragElementBlockBase>
</template>

<script>
import SVGText from '@/components/Atoms/SVGText'
import DragElementBlockBase from '@/components/Molecules/DragElementBlockBase'
export default {
  name: 'DragDebugBlock',
  components: {
    SVGText,
    DragElementBlockBase
  },
  data () {
    return {
      strokeColor: '#c53d43',
      fillColor: '#e83929',
      width: '350'
    }
  }
}
</script>

<style lang="scss">
  .openDirectoryButton .v-btn__content {
    position: unset !important;
  }
</style>
