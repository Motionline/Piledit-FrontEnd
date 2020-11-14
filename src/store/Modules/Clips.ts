import {
  Module,
  VuexModule,
  Mutation,
  Action,
  getModule
} from 'vuex-module-decorators'
import { Vue } from 'vue-property-decorator'
import store from '@/store/store'
import { PClip, PClips, PPosition } from '@/@types/piledit'
import { VuexMixin } from '@/mixin/vuex'

export interface ClipsStateIF {
  clips: PClips;
}

@Module({ dynamic: true, store: store, name: 'Clips', namespaced: true })
class Clips extends VuexModule implements ClipsStateIF {
  clips: PClips = {}

  @Mutation
  public addClip (clip: PClip) {
    Vue.set(this.clips, clip.uuid, clip)
  }

  @Mutation
  public removeClip (uuid: string) {
    Vue.delete(this.clips, uuid)
  }

  @Mutation
  public updateClipPosition (clip: PClip) {
    this.clips[clip.uuid].position = clip.position
  }

  @Mutation
  public updateClipWidth (clip: PClip) {
    this.clips[clip.uuid].width = clip.width
  }

  @Action({ rawError: true })
  public add (context: { componentUuid: string; componentName: string }) {
    const uuid = VuexMixin.generateUuid()
    const clip = new PClip(
      uuid,
      // TODO: コンポーネント名を設定する
      uuid,
      context.componentUuid,
      {
        x: 0,
        y: 1
      },
      200
    )
    this.addClip(clip)
  }

  @Action({ rawError: true })
  public updatePosition (context: { position: PPosition; uuid: string }) {
    const clip = this.clips[context.uuid]
    clip.position = context.position
    this.updateClipPosition(clip)
  }

  @Action({ rawError: true })
  public updateWidth (context: { width: number; uuid: string }) {
    const clip = this.clips[context.uuid]
    clip.width = context.width
    this.updateClipWidth(clip)
  }
}

export const clipsModule = getModule(Clips)
