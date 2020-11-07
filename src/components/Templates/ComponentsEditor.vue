<template>
  <div>
    <v-row class="componentsEditor--row ma-0 pa-0">
      <v-col class="ma-0 pa-0">
        <v-row class="ma-0 pa-0">
          <SandBox :blocks="filteredBlocks()" />
        </v-row>
        <v-row class="ma-0 pa-0">
          <BlockDetailedPanel />
        </v-row>
      </v-col>
      <v-col class="ma-0 pa-0">
        <v-row class="ma-0 pa-0">
          <BlocksDisplay :tab-uuid="tabUuid" />
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { blocksModule } from '@/store/Modules/Blocks'
import { Block } from '@/@types/piledit'
import SandBox from '@/components/Organisms/SandBox.vue'
import BlocksDisplay from '@/components/Organisms/BlocksDisplay.vue'
import BlockDetailedPanel from '@/components/Organisms/BlockDetailedPanel.vue'

@Component({
  components: {
    SandBox,
    BlocksDisplay,
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
  height: 70vh;
}
</style>
