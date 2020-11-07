<template>
  <div>
    <SandBox :blocks="filteredBlocks()" :tab-uuid="tabUuid" />
    <BlockDetailedPanel />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { blocksModule } from '@/store/Modules/Blocks'
import { Block } from '@/@types/piledit'
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

  get blocks () {
    return blocksModule.blocks
  }

  public filteredBlocks () {
    const filtered: { [key: string]: Block } = {}
    for (const [key, value] of Object.entries(this.blocks)) {
      if (value.tabUuid === this.tabUuid) {
        filtered[key] = value
      }
    }
    return filtered
  }
}
</script>

<style scoped>
.componentsEditor--row {
  height: 60vh;
}
</style>
