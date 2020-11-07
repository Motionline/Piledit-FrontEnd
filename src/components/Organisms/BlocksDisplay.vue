<template>
  <svg id="blocksDisplay" x="60vw">
    <DebugBlock
      @click="addBlock('DebugBlock')"
      @newBlockGenerate="newBlockGenerate"
      @newBlockMove="newBlockMove"
      :new-block-uuid="newBlockUuid"
      :sample-block="true"
      :block="sampleBlock"
      class="dragBlock-btn"
      transform="translate(1,20)"
    />
    <DefineComponentBlock
      @click="addBlock('DefineComponentBlock')"
      :sample-block="true"
      :block="sampleBlock2"
      class="dragBlock-btn"
      transform="translate(1,50)"
    />
  </svg>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { blocksModule } from '@/store/Modules/Blocks'
import { Block, Position } from '@/@types/piledit'
import DebugBlock from '@/components/Molecules/DebugBlock.vue'
import DefineComponentBlock from '@/components/Molecules/DefineComponentBlock.vue'

@Component({
  components: {
    DebugBlock,
    DefineComponentBlock
  }
})
export default class BlocksDisplay extends Vue {
  @Prop({ required: true })
  public tabUuid!: string

  public newBlockUuid = ''

  public sampleBlock: Block = {
    uuid: 'sampleBlock',
    name: 'sampleBlock',
    topUuid: '',
    childUuid: '',
    parentUuid: '',
    tabUuid: '',
    shadow: false,
    position: {
      x: 0,
      y: 100
    }
  }

  public sampleBlock2: Block = {
    uuid: 'sampleBlock',
    name: 'sampleBlock',
    topUuid: '',
    childUuid: '',
    parentUuid: '',
    tabUuid: '',
    shadow: false,
    position: {
      x: 0,
      y: 300
    }
  }

  get blocks () {
    return blocksModule.blocks
  }

  public async newBlockGenerate (context: { position: Position; name: string }) {
    this.newBlockUuid = await blocksModule.add({ position: context.position, name: context.name, tabUuid: this.tabUuid })
  }

  public newBlockMove (context: { position: Position; uuid: string }) {
    const block = this.blocks[context.uuid]
    block.position = context.position
    blocksModule.updateBlock(block)
  }

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
  #blocksDisplay {
    border: 2px black solid;
  }
  .dragBlock-btn::before {
    color: transparent;
  }

  .dragBlock-btn:hover {
    color: red;
  }
</style>
