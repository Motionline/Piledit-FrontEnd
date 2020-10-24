<template>
  <DragElementBlockBase
    :strokeColor="strokeColor"
    :fillColor="fillColor"
    :width="width"
  >
    <SVGText x="10" y="30" color="white">
      動画ファイル
    </SVGText>
    <foreignObject
      width="100"
      height="30"
      x="100"
      y="5"
    >
      <v-btn
        small
        outlined
        color="white"
        class="openDirectoryButton"
      >
        動画
      </v-btn>
    </foreignObject>
    <SVGText x="205" y="30" color="white">
      を読み込む
    </SVGText>
  </DragElementBlockBase>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import SVGText from '@/components/Atoms/SVGText.vue'
import DragElementBlockBase from '@/components/Molecules/DragElementBlockBase.vue'
@Component({
  components: {
    SVGText,
    DragElementBlockBase
  }
})
export default class DragLoadingVideoBlock extends Vue {
  public selectFilePath = ''
  public strokeColor = '#ee7800'
  public fillColor = '#f39800'
  public width = 370
}
</script>

<style lang="scss">
  .openDirectoryButton .v-btn__content {
    position: unset !important;
  }
</style>
