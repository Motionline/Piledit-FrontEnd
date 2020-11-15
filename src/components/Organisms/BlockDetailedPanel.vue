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
      }
    } else if (kind === PBlockKind.DefineComponentBlock) {
      const defineComponentBlock: TDefineComponentBlock = this.block
      if (defineComponentBlock.componentName != null) {
        this.componentName = defineComponentBlock.componentName
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
    mode: GrayScaleFilterMode.Invalid
  }

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
