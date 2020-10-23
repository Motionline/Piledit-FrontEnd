<template>
  <DragEventBlockBase
    :strokeColor="strokeColor"
    :fillColor="fillColor"
    :width="width"
  >
    <SVGText x="10" y="45" color="white">
      コンポーネントを定義
    </SVGText>
  </DragEventBlockBase>
</template>

<script>
import SVGText from '@/components/Atoms/SVGText'
import DragEventBlockBase from '@/components/Molecules/DragEventBlockBase'
export default {
  name: 'DragDefinitionComponentBlock',
  components: {
    SVGText,
    DragEventBlockBase
  },
  data () {
    return {
      strokeColor: '#e9bc00',
      fillColor: '#fcc800',
      width: '250'
    }
  }
}
</script>
