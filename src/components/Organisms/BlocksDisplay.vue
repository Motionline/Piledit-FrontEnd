<template>
  <svg height="1000" width="1200" id="blocksDisplay">
    <foreignObject height="200" width="340" y="100">
      <p>test</p>
      <v-btn
        :ripple="false"
        @click="addBlock('DebugBlock')"
        elevation="0"
        class="dragBlock-btn"
        text
      >
        <DebugBlock
          uuid="sample-debug-block"
          :sample-block="true"
          :shadow="false"
          :position="pos"
          class="dragBlock-btn"
          transform="translate(1,20)"
        />
      </v-btn>
    </foreignObject>
  </svg>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { blocksModule } from '@/store/Modules/Blocks'
import { Position } from '@/@types/piledit'
import DebugBlock from '@/components/Molecules/DebugBlock.vue'

@Component({
  components: { DebugBlock }
})
export default class BlocksDisplay extends Vue {
  @Prop({ required: true })
  public tabUuid!: string

  public pos: Position = {
    x: 1,
    y: 100
  }

  public addBlock (name: string) {
    blocksModule.add(this.getContext(name))
  }

  public dragEnd (event: DragEvent, name: string) {
    blocksModule.add(this.getContext(name))
    event.preventDefault()
  }

  public getContext (name: string) {
    return {
      name,
      position: {
        x: 0,
        y: 0
      },
      tabUuid: this.tabUuid
    }
  }
}
</script>

<style scoped>
  .dragBlock-btn::before {
    color: transparent;
  }

  .dragBlock-btn:hover {
    color: red;
  }
</style>
