<template>
  <div class="BlockDetailedPanel">
    <DefineComponentBlockPanel
      :block="block"
      @updateBlock="updateBlock"
      v-if="isKind(PBlockKind.DefineComponentBlock)"
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
import { blocksModule } from '@/store/Modules/Blocks'
import DefineComponentBlockPanel from '@/components/Molecules/Panels/DefineComponentBlockPanel.vue'
import MovieLoadingBlockPanel from '@/components/Molecules/Panels/MovieLoadingBlockPanel.vue'
import GrayScaleFilterBlockPanel from '@/components/Molecules/Panels/GrayScaleFilterBlockPanel.vue'
import MovieLoadingBlock from '@/components/Molecules/Blocks/MovieLoadingBlock.vue'
import BlurFilterBlockPanel from '@/components/Molecules/Panels/BlurFilterBlockPanel.vue'

@Component({
  components: {
    BlurFilterBlockPanel,
    DefineComponentBlockPanel,
    MovieLoadingBlockPanel,
    GrayScaleFilterBlockPanel,
    MovieLoadingBlock
  }
})
export default class BlockDetailedPanel extends Vue {
  @Prop()
  public block!: PBlock

  public updateBlock (block: PBlock) {
    blocksModule.update(block)
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
  width: 100%;
  height: 40vh;
}
</style>
