<template>
  <ElementBlockBase
    :blockUniqueKey="blockUniqueKey"
    :x="x"
    :y="y"
    :showShadow="showShadow"
    :strokeColor="strokeColor"
    :fillColor="fillColor"
    :width="width"
    @stopDragging="stopDragging($event)"
    @updatePosition="updatePosition($event)"
    @removeBlock="removeBlock($event)"
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
        @click="openFileDialog()"
      >
        {{ getDisplayButtonText() }}
      </v-btn>
    </foreignObject>
    <SVGText x="205" y="30" color="white">
      を読み込む
    </SVGText>
  </ElementBlockBase>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import SVGText from '@/components/Atoms/SVGText.vue'
import ElementBlockBase from '@/components/Molecules/ElementBlockBase.vue'
import electron from 'electron'
import path from 'path'
const remote = electron.remote
const dialog = remote.dialog
@Component({
  components: {
    SVGText,
    ElementBlockBase
  }
})
export default class LoadingVideoBlock extends Vue {
  @Prop({ required: true })
  public blockUniqueKey!: string

  @Prop({ required: true })
  public x!: number

  @Prop({ required: true })
  public y!: number

  @Prop({ required: true })
  public showShadow!: boolean

  public selectFilePath: string[] | undefined = undefined
  public strokeColor = '#ee7800'
  public fillColor = '#f39800'
  public width = 370

  public openFileDialog () {
    const currentWindow = remote.getCurrentWindow()
    this.selectFilePath = dialog.showOpenDialogSync(currentWindow, {
      properties: ['openFile'],
      title: 'Select a text file',
      defaultPath: '.',
      filters: [
        { name: 'text file', extensions: ['mp4'] }
      ]
    })
  }

  public getDisplayButtonText () {
    if (this.selectFilePath) {
      return path.basename(this.selectFilePath[0])
    } else {
      return '開く'
    }
  }

  public stopDragging (event: DragEvent) {
    this.$emit('stopDragging', event)
  }

  public updatePosition (event: DragEvent) {
    this.$emit('updatePosition', event)
  }

  public removeBlock (event: DragEvent) {
    this.$emit('removeBlock', event)
  }
}
</script>

<style lang="scss">
  .openDirectoryButton .v-btn__content {
    position: unset !important;
  }
</style>
