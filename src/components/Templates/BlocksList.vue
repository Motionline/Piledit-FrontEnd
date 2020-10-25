<template>
  <svg height="1000" width="1200" id="blockComponentsSandBox">
    <foreignObject height="45" width="340" y="500">
      <v-btn
        :ripple="false"
        @click="addBlock('LoadingVideoBlock')"
        draggable="true"
        elevation="0"
        class="dragBlock-btn"
        text
      >
        <DragLoadingVideoBlock />
      </v-btn>
    </foreignObject>
    <foreignObject height="45" width="340" y="550">
      <v-btn
        :ripple="false"
        @click="addBlock('DebugBlock')"
        @dragend="dragEnd($event, 'DebugBlock')"
        draggable="true"
        elevation="0"
        class="dragBlock-btn"
        text
      >
        <DragDebugBlock />
      </v-btn>
    </foreignObject>
    <foreignObject height="75" width="340" y="600">
      <v-btn
        :ripple="false"
        @click="addBlock('DefinitionComponentBlock')"
        @dragend="dragEnd($event, 'DefinitionComponentBlock')"
        draggable="true"
        elevation="0"
        class="dragBlock-btn"
        text
      >
        <DragDefinitionComponentBlock />
      </v-btn>
    </foreignObject>
  </svg>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import DragLoadingVideoBlock from '@/components/Organisms/DragLoadingVideoBlock.vue'
import DragDebugBlock from '@/components/Organisms/DragDebugBlock.vue'
import DragDefinitionComponentBlock from '@/components/Organisms/DragDefinitionComponentBlock.vue'
import { blocksModule } from '@/store/Modules/Blocks'
@Component({
  components: {
    DragLoadingVideoBlock,
    DragDebugBlock,
    DragDefinitionComponentBlock
  }
})
export default class BlocksList extends Vue {
  public addBlock (blockType: string) {
    const position = {
      x: 0,
      y: 0
    }
    const context = {
      position,
      blockType
    }
    blocksModule.add(context)
  }

  public dragEnd (event: DragEvent, blockType: string) {
    const position = {
      x: event.clientX,
      y: event.clientY
    }
    const context = {
      position,
      blockType
    }
    blocksModule.add(context)
    event.preventDefault()
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
