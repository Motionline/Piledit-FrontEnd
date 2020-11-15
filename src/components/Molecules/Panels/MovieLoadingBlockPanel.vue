<template>
  <div>
    <v-btn @click="openFinder">Finderを開く</v-btn>
    <div v-if="selectFilePath !== undefined && selectFilePath.length > 0">
      {{ selectFilePath[0] }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Emit, Vue } from 'vue-property-decorator'
import { TMovieLoadingBlock } from '@/@types/piledit'
import { remote } from 'electron'

@Component
export default class MovieLoadingBlockPanel extends Vue {
  @Prop({ required: true })
  public block!: TMovieLoadingBlock

  public mounted () {
    if (this.block.materialPath != null) {
      this.selectFilePath = [this.block.materialPath]
    } else {
      this.selectFilePath = undefined
    }
  }

  public selectFilePath: string[] | undefined = []

  @Emit('updateBlock')
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
      return {
        ...this.block,
        materialPath: this.selectFilePath[0]
      }
    }
  }
}
</script>

<style scoped>

</style>
