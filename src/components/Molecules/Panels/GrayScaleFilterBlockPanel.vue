<template>
  <div>
    <p>グレースケール</p>
    <v-slider
      :value="value"
      @change="changeValue($event)"
      label="値" max="256" min="0" thumb-label="always" style="width: 50%;"
    />
    <v-text-field
      type="number"
      :value="value"
      @change="changeValue($event)"
      :rules="valueRules"
    />
    <v-checkbox
      label="白黒を反転させる"
      :input-value="inversion"
      @change="changeInversion($event)"
    />
    <v-select
      style="width: 50%;"
      :value="mode"
      @change="changeMode($event)"
      :items="items"
      item-text="display"
      item-value="value"
    />
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator'
import { GrayScaleFilterMode, TGrayScaleFilterBlock } from '@/@types/piledit'

@Component
export default class GrayScaleFilterBlock extends Vue {
  @Prop({ required: true })
  public block!: TGrayScaleFilterBlock

  public mounted () {
    if (this.block.inversion != null) {
      this.inversion = this.block.inversion
    } else {
      this.inversion = false
    }
    if (this.block.value != null) {
      this.value = this.block.value
    } else {
      this.value = 0
    }
    if (this.block.mode != null) {
      this.mode = this.block.mode
    } else {
      this.mode = GrayScaleFilterMode.Invalid
    }
  }

  public inversion = false
  public value = 0
  public mode = GrayScaleFilterMode.Invalid
  public items = [
    { display: '無効', value: GrayScaleFilterMode.Invalid },
    { display: '赤基準', value: GrayScaleFilterMode.BasedOnR },
    { display: '緑基準', value: GrayScaleFilterMode.BasedOnG },
    { display: '青基準', value: GrayScaleFilterMode.BasedOnB }
  ]

  public valueRules = [
    (v: number) => (!!v) || '必ず値を入力してください',
    (v: number) => (v && v >= 0 && v <= 256) || '0以上256以下である必要があります'
  ]

  @Emit('updateBlock')
  public changeValue (_value: number) {
    this.value = _value
    return {
      ...this.block,
      value: _value
    }
  }

  @Emit('updateBlock')
  public changeInversion (_inversion: boolean) {
    this.inversion = _inversion
    return {
      ...this.block,
      inversion: _inversion
    }
  }

  @Emit('updateBlock')
  public changeMode (_mode: GrayScaleFilterMode) {
    this.mode = _mode
    return {
      ...this.block,
      mode: _mode
    }
  }
}
</script>

<style scoped>

</style>
