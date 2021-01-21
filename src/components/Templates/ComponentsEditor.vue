<template>
  <div class="componentsEditor__container">
    <SandBox
        :blocks="filteredBlocks()"
        :component-uuid="componentUuid"
        :tab-uuid="tabUuid"
        :project-uuid="projectUuid"
        @openingMenu="openingMenu"
        class="componentsEditor__container--sandbox"
    />
    <div class="componentsEditor__container--detail">
      <div class="componentsEditor__container--detail--preview">
        <video-player  class="video-player-box"
                       ref="videoPlayer"
                       :options="playerOptions"
                       :playsinline="true"
                       customEventName="customstatechangedeventname"

                       @play="onPlayerPlay($event)"
                       @pause="onPlayerPause($event)"
                       @ended="onPlayerEnded($event)"
                       @waiting="onPlayerWaiting($event)"
                       @playing="onPlayerPlaying($event)"
                       @loadeddata="onPlayerLoadeddata($event)"
                       @timeupdate="onPlayerTimeupdate($event)"
                       @canplay="onPlayerCanplay($event)"
                       @canplaythrough="onPlayerCanplaythrough($event)"

                       @statechanged="playerStateChanged($event)"
                       @ready="playerReadied">
        </video-player>
      </div>
      <BlockDetailedPanel
          :block="getBlock(blockUuid)"
          :component-uuid="componentUuid"
          :tab-uuid="tabUuid"
          :project-uuid="projectUuid"
      />
    </div>
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
  public playerOptions = {
    // videojs options
    muted: true,
    language: 'ja',
    // height: '230',
    width: window.parent.screen.width * 0.30,
    playbackRates: [0.7, 1.0, 1.5, 2.0],
    sources: [{
      type: 'video/mp4',
      src: 'https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm'
    }],
    poster: '/static/images/author.jpg'
  }

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

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public onPlayerPlay (event: any) {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public onPlayerPause (event: any) {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public onPlayerEnded (event: any) {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public onPlayerWaiting (event: any) {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public onPlayerPlaying (event: any) {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public onPlayerLoadeddata (event: any) {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public onPlayerTimeupdate (event: any) {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public onPlayerCanplay (event: any) {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public onPlayerCanplaythrough (event: any) {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public playerStateChanged (event: any) {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public playerReadied () {}
}
</script>

<style scoped lang="scss">
.componentsEditor__container {
  height: calc(100vh - 96px);
  display: flex;
  width: 100vw;

  &--sandbox {
    width: 70vw;
  }

  &--detail {
    width: 30vw;

    &--preview {
      height: 30%;
    }
  }
}
.vjs-tech:focus {
  outline: none !important;
}
</style>
