<template>
  <div>
    <SandBox :blocks="blocks" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { blocksModule } from '@/store/Modules/Blocks'
import SandBox from '@/components/Organisms/SandBox.vue'

@Component({
  components: {
    SandBox
  }
})
export default class ComponentsEditor extends Vue {
  @Prop({ required: true })
  public tabUuid!: string
  // TabのUUID。BlocksからそのTabに存在するBlockのみフィルターする

  get blocks () {
    return blocksModule.blocks
  }
}
</script>

<style scoped>

</style>
