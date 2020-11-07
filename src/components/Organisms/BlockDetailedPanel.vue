<template>
  <div class="BlockDetailedPanel">
    <div v-if="blockUuid !== ''">
      <v-text-field label="クリップ名" v-model="clipName"></v-text-field>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { blocksModule } from '@/store/Modules/Blocks'

@Component
export default class BlockDetailedPanel extends Vue {
  @Prop()
  public blockUuid!: string

  public clipName = ''

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
