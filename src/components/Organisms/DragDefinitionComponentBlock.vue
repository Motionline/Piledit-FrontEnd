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

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import SVGText from '@/components/Atoms/SVGText.vue'
import DragEventBlockBase from '@/components/Molecules/DragEventBlockBase.vue'
@Component({
  components: {
    SVGText,
    DragEventBlockBase
  }
})
export default class DragDefinitionComponentBlock extends Vue {
  public strokeColor = '#e9bc00'
  public fillColor = '#fcc800'
  public width = 250
}
</script>
