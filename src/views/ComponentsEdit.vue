<template>
  <div id="Home">
    <ApplicationTab />
    <svg height="1500" width="1500">
      <BlocksSandBox :allBlocks="allBlocks" />
      <BlocksList />
    </svg>
  </div>
</template>

<style scoped>
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import BlocksSandBox from '@/components/Templates/BlocksSandBox.vue'
import BlocksList from '@/components/Templates/BlocksList.vue'
import ApplicationTab from '@/components/Organisms/ApplicationTab.vue'
import { blocksModule } from '@/store/Modules/Blocks'
import { blockComponentsModule } from '@/store/Modules/BlockComponents'
@Component({
  components: {
    BlocksSandBox,
    BlocksList,
    ApplicationTab
  }
})
export default class ComponentsEdit extends Vue {
  get allBlocks () {
    return blocksModule.allBlocks
  }

  get allBlockComponents () {
    return blockComponentsModule.allBlockComponents
  }
}
</script>
