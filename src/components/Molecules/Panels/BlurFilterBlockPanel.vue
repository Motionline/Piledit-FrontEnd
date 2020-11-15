<template>
  <div>
    <p>ブラーフィルター</p>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Emit, Vue } from 'vue-property-decorator'
import { TBlurFilterBlock } from '@/@types/piledit'

@Component
export default class BlurFilterBlockPanel extends Vue {
  @Prop({ required: true })
  public block!: TBlurFilterBlock
}
</script>

<style scoped>

</style>
