<template>
  <div class="BlockDetailedPanel">
    <DefineComponentBlockPanel
      :block="block"
      @updateBlock="updateBlock"
      v-if="isKind(PBlockKind.DefineComponentBlock)"
    />
    <PropBlockPanel
      :block="block"
      @updateBlock="updateBlock"
      v-else-if="isKind(PBlockKind.PropBlock)"
    />
    <PropsBlockPanel
      :block="block"
      @updateBlock="updateBlock"
      v-else-if="isKind(PBlockKind.PropsBlock)"
    />
    <MovieLoadingBlockPanel
      :block="block"
      @updateBlock="updateBlock"
      v-else-if="isKind(PBlockKind.MovieLoadingBlock)"
    />
    <GrayScaleFilterBlockPanel
      :block="block"
      @updateBlock="updateBlock"
      v-else-if="isKind(PBlockKind.GrayScaleFilterBlock)"
    />
    <BlurFilterBlockPanel
      :block="block"
      v-else-if="isKind(PBlockKind.BlurFilterBlock)"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import {
  PBlock,
  PBlockKind
} from '@/@types/piledit'
import { blocksModule } from '@/store/store'
import DefineComponentBlockPanel from '@/components/Molecules/Panels/DefineComponentBlockPanel.vue'
import MovieLoadingBlockPanel from '@/components/Molecules/Panels/MovieLoadingBlockPanel.vue'
import GrayScaleFilterBlockPanel from '@/components/Molecules/Panels/GrayScaleFilterBlockPanel.vue'
import MovieLoadingBlock from '@/components/Molecules/Blocks/MovieLoadingBlock.vue'
import BlurFilterBlockPanel from '@/components/Molecules/Panels/BlurFilterBlockPanel.vue'
import PropBlockPanel from '@/components/Molecules/Panels/PropBlockPanel.vue'
import PropsBlockPanel from '@/components/Molecules/Panels/PropsBlockPanel.vue'

@Component({
  components: {
    PropBlockPanel,
    PropsBlockPanel,
    BlurFilterBlockPanel,
    DefineComponentBlockPanel,
    MovieLoadingBlockPanel,
    GrayScaleFilterBlockPanel,
    MovieLoadingBlock
  }
})
export default class BlockDetailedPanel extends Vue {
  @Prop({ required: true })
  public block!: PBlock

  @Prop({ required: true })
  public componentUuid!: string

  @Prop({ required: true })
  public tabUuid!: string

  @Prop({ required: true })
  public projectUuid!: string

  public updateBlock (block: PBlock) {
    blocksModule.update({
      _triggerBlock: block,
      componentUuid: this.componentUuid,
      tabUuid: this.tabUuid
    })
  }

  public isKind (kind: PBlockKind) {
    return this.block != null && this.block.kind === kind
  }

  get PBlockKind () {
    return PBlockKind
  }

  get blocks () {
    return blocksModule.blocks
  }
}
</script>

<style scoped>
.BlockDetailedPanel {
  border: 2px solid black;
  border-left: none;
  width: 100%;
  height: 70%;
}
</style>
