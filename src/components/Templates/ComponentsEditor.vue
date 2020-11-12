<template>
  <div>
    <p>{{ jsonFilteredBlocks() }}</p>
    <hr>
    <p>{{ jsonFilteredComponents() }}</p>
    <SandBox :blocks="filteredBlocks()" :tab-uuid="tabUuid" @openingMenu="openingMenu" />
    <BlockDetailedPanel :block-uuid="blockUuid" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { blocksModule } from '@/store/Modules/Blocks'
import { componentsModule } from '@/store/Modules/Components'
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

  public blockUuid = ''

  get blocks () {
    return blocksModule.blocks
  }

  get components () {
    return componentsModule.components
  }

  public jsonFilteredBlocks () {
    const data = JSON.stringify(this.blocks, null, 2)
    // console.log(data)
    return data
  }

  public jsonFilteredComponents () {
    const data = JSON.stringify(this.components, null, 2)
    // console.log(data)
    return data
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
