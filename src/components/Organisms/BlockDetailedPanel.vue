<template>
  <div class="BlockDetailedPanel">
    <div v-if="block != null && block.kind === PBlockKind.DefineComponentBlock">
      <v-text-field
        label="コンポーネント名"
        v-model="componentName"
      ></v-text-field>
    </div>
    <div v-else-if="block != null && block.kind === PBlockKind.MovieLoadingBlock">
      <v-btn @click="openFinder">Finderを開く</v-btn>
      <div v-if="selectFilePath !== undefined && selectFilePath.length > 0">{{ selectFilePath[0] }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { PBlockKind, PBlock, TMovieLoadingBlock } from '@/@types/piledit'
import { blocksModule } from '@/store/Modules/Blocks'
import { remote } from 'electron'

@Component
export default class BlockDetailedPanel extends Vue {
  @Prop()
  public block!: PBlock

  // MovieLoadingBlock
  public selectFilePath: string[] | undefined = []

  get PBlockKind () {
    return PBlockKind
  }

  public componentName = ''

  get blocks () {
    return blocksModule.blocks
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
