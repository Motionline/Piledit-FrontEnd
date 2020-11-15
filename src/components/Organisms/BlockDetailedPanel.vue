<template>
  <div class="BlockDetailedPanel">
    <div v-if="block != null && block.kind === PBlockKind.DefineComponentBlock">
      <v-text-field
        label="コンポーネント名"
        :value="componentName"
        @change="changeComponentName($event)"
      ></v-text-field>
    </div>
    <div v-else-if="block != null && block.kind === PBlockKind.MovieLoadingBlock">
      <v-btn @click="openFinder">Finderを開く</v-btn>
      <div v-if="selectFilePath !== undefined && selectFilePath.length > 0">{{ selectFilePath[0] }}</div>
    </div>
    <div v-else-if="block != null && block.kind === PBlockKind.GrayScaleFilterBlock">
      <p>グレースケール</p>
      <v-slider
        :value="grayScaleFilterBlockParams.value"
        @change="changeGrayScaleValue($event)"
        label="値" max="256" min="0" thumb-label="always" style="width: 50%;"
      />
      <v-text-field
        type="number"
        :value="grayScaleFilterBlockParams.value"
        @change="changeGrayScaleValue($event)"
        :rules="grayScaleValueTextFieldRules"
      />
      <v-checkbox
        label="白黒を反転させる"
        :input-value="grayScaleFilterBlockParams.inversion"
        @change="changeGrayScaleInversion($event)"
      />
      <v-select
        style="width: 50%;"
        :value="grayScaleFilterBlockParams.mode"
        @change="changeGrayScaleMode($event)"
        :items="grayScaleFilterBlockParams.items"
        item-text="display"
        item-value="value"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import {
  GrayScaleFilterMode,
  PBlock,
  PBlockKind,
  TDefineComponentBlock,
  TGrayScaleFilterBlock,
  TMovieLoadingBlock
} from '@/@types/piledit'
import { blocksModule } from '@/store/Modules/Blocks'
import { remote } from 'electron'

  @Component
export default class BlockDetailedPanel extends Vue {
  @Prop()
  public block!: PBlock

  @Watch('block')
  public watchBlock () {
    const kind = this.block.kind
    if (kind === PBlockKind.MovieLoadingBlock) {
      const movieLoadingBlock: TMovieLoadingBlock = this.block
      if (movieLoadingBlock.materialPath != null) {
        this.selectFilePath = [movieLoadingBlock.materialPath]
      } else {
        this.selectFilePath = undefined
      }
    } else if (kind === PBlockKind.DefineComponentBlock) {
      const defineComponentBlock: TDefineComponentBlock = this.block
      if (defineComponentBlock.componentName != null) {
        this.componentName = defineComponentBlock.componentName
      } else {
        this.componentName = ''
      }
    } else if (kind === PBlockKind.GrayScaleFilterBlock) {
      const grayScaleFilterBlock: TGrayScaleFilterBlock = this.block
      if (grayScaleFilterBlock.inversion != null) {
        this.grayScaleFilterBlockParams.inversion = grayScaleFilterBlock.inversion
      }
      if (grayScaleFilterBlock.value != null) {
        this.grayScaleFilterBlockParams.value = grayScaleFilterBlock.value
      }
      if (grayScaleFilterBlock.mode != null) {
        this.grayScaleFilterBlockParams.mode = grayScaleFilterBlock.mode
      }
    }
  }

  // MovieLoadingBlock
  public selectFilePath: string[] | undefined = []

  // DefineComponentBlock
  public componentName = ''

  // GrayScaleFilterBlock
  public grayScaleFilterBlockParams = {
    inversion: false,
    value: 0,
    mode: GrayScaleFilterMode.Invalid,
    items: [
      { display: '無効', value: GrayScaleFilterMode.Invalid },
      { display: '赤基準', value: GrayScaleFilterMode.BasedOnR },
      { display: '緑基準', value: GrayScaleFilterMode.BasedOnG },
      { display: '青基準', value: GrayScaleFilterMode.BasedOnB }
    ]
  }

  public grayScaleValueTextFieldRules = [
    (v: number) => (!!v) || '必ず値を入力してください',
    (v: number) => (v && v >= 0 && v <= 256) || '0以上256以下である必要があります'
  ]

  get PBlockKind () {
    return PBlockKind
  }

  get blocks () {
    return blocksModule.blocks
  }

  public changeComponentName (_componentName: string) {
    this.componentName = _componentName
    const defineComponentBlock: TDefineComponentBlock = this.block
    defineComponentBlock.componentName = _componentName
    blocksModule.update(defineComponentBlock)
  }

  public changeGrayScaleValue (_value: number) {
    this.grayScaleFilterBlockParams.value = _value
    const grayScaleFilterBlock: TGrayScaleFilterBlock = this.block
    grayScaleFilterBlock.value = _value
    blocksModule.update(grayScaleFilterBlock)
  }

  public changeGrayScaleInversion (_inversion: boolean) {
    this.grayScaleFilterBlockParams.inversion = _inversion
    const grayScaleFilterBlock: TGrayScaleFilterBlock = this.block
    grayScaleFilterBlock.inversion = _inversion
    blocksModule.update(grayScaleFilterBlock)
  }

  public changeGrayScaleMode (_mode: GrayScaleFilterMode) {
    this.grayScaleFilterBlockParams.mode = _mode
    const grayScaleFilterBlock: TGrayScaleFilterBlock = this.block
    grayScaleFilterBlock.mode = _mode
    blocksModule.update(grayScaleFilterBlock)
  }

  public openFinder () {
    const currentWindow = remote.getCurrentWindow()
    const dialog = remote.dialog
    this.selectFilePath = dialog.showOpenDialogSync(currentWindow, {
      properties: ['openFile'],
      title: '動画ファイルを選択してください',
      defaultPath: '.',
      filters: [
        { name: 'movie file', extensions: ['mp4'] }
      ]
    })
    if (this.selectFilePath !== undefined) {
      const movieLoadingBlock: TMovieLoadingBlock = this.block
      movieLoadingBlock.materialPath = this.selectFilePath[0]
      blocksModule.update(movieLoadingBlock)
    }
  }
}
</script>

<style scoped>
.BlockDetailedPanel {
  border: 2px solid black;
  width: 100%;
  height: 40vh;
}
</style>
