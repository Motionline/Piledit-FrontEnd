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

<script>
import SVGText from '@/components/Atoms/SVGText'
import ElementBlockBase from '@/components/Molecules/ElementBlockBase'
const dialog = require('electron').remote.dialog
const path = require('path')
export default {
  name: 'LoadingVideoBlock',
  components: {
    SVGText,
    ElementBlockBase
  },
  props: {
    blockUniqueKey: {
      type: String,
      required: true
    },
    x: {
      type: Number,
      required: true
    },
    y: {
      type: Number,
      required: true
    },
    showShadow: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      selectFilePath: '',
      strokeColor: '#ee7800',
      fillColor: '#f39800',
      width: '370'
    }
  },
  methods: {
    openFileDialog () {
      this.selectFilePath = dialog.showOpenDialogSync(null, {
        properties: ['openFile'],
        title: 'Select a text file',
        defaultPath: '.',
        filters: [
          { name: 'text file', extensions: ['mp4'] }
        ]
      })
    },
    getDisplayButtonText () {
      if (this.selectFilePath) {
        return path.basename(this.selectFilePath[0])
      } else {
        return '開く'
      }
    },
    stopDragging (event) {
      this.$emit('stopDragging', event)
    },
    updatePosition (event) {
      this.$emit('updatePosition', event)
    },
    removeBlock (event) {
      this.$emit('removeBlock', event)
    }
  }
}
</script>

<style lang="scss">
  .openDirectoryButton .v-btn__content {
    position: unset !important;
  }
</style>
