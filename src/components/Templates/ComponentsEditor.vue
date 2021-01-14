<template>
  <div>
    <SandBox :blocks="filteredBlocks()" :component-uuid="componentUuid" @openingMenu="openingMenu" />
    <BlockDetailedPanel :block="getBlock(blockUuid)" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { blocksModule, componentsModule } from '@/store/store'
import { PBlocks } from '@/@types/piledit'
import SandBox from '@/components/Organisms/SandBox.vue'
import BlockDetailedPanel from '@/components/Organisms/BlockDetailedPanel.vue'

@Component({
  components: {
    SandBox,
    BlockDetailedPanel
  }
})
export default class ComponentsEditor extends Vue {
  @Prop({ required: true })
  public componentUuid!: string
  // ComponentのUUID。BlocksからそのComponent Editorに存在するBlockのみフィルターする

  public blockUuid = ''

  get blocks () {
    return blocksModule.blocks
  }

  get components () {
    return componentsModule.components
  }

  public getBlock (uuid: string) {
    return this.blocks[uuid]
  }

  public filteredBlocks () {
    const filtered: PBlocks = {}
    for (const [key, value] of Object.entries(this.blocks)) {
      if (value.componentUuid === this.componentUuid) {
        filtered[key] = value
      }
    }
    return filtered
  }

  public openingMenu (uuid: string) {
    this.blockUuid = uuid
  }
}
</script>

<style scoped>
.componentsEditor--row {
  height: 60vh;
}
</style>
