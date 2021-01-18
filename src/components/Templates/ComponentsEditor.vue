<template>
  <div class="componentsEditor__container">
    <SandBox
        :blocks="filteredBlocks()"
        :component-uuid="componentUuid"
        :tab-uuid="tabUuid"
        :project-uuid="projectUuid"
        @openingMenu="openingMenu"
    />
    <BlockDetailedPanel
        :block="getBlock(blockUuid)"
        :component-uuid="componentUuid"
        :tab-uuid="tabUuid"
        :project-uuid="projectUuid"
    />
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

  @Prop({ required: true })
  public tabUuid!: string

  @Prop({ required: true })
  public projectUuid!: string

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
.componentsEditor__container {
  height: calc(100vh - 96px);
}
</style>
