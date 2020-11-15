<template>
  <div>
    <SandBox :blocks="filteredBlocks()" :tab-uuid="tabUuid" @openingMenu="openingMenu" />
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
  public tabUuid!: string
  // TabのUUID。BlocksからそのTabに存在するBlockのみフィルターする

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
      if (value.tabUuid === this.tabUuid) {
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
