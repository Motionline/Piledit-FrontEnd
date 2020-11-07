import {
  Module,
  VuexModule,
  Mutation,
  Action,
  getModule
} from 'vuex-module-decorators'
import { Vue } from 'vue-property-decorator'
import store from '@/store/store'
import { Clip, Position } from '@/@types/piledit'
import { VuexMixin } from '@/mixin/vuex'

export interface ClipsStateIF {
  clips: { [key: string]: Clip };
}

@Module({ dynamic: true, store: store, name: 'Clips', namespaced: true })
class Clips extends VuexModule implements ClipsStateIF {
  clips: { [key: string]: Clip } = {}

  @Mutation
  public addClip (clip: Clip) {
    Vue.set(this.clips, clip.uuid, clip)
  }

  @Mutation
  public removeClip (uuid: string) {
    Vue.delete(this.clips, uuid)
  }

  @Mutation
  public updateClipPosition (clip: Clip) {
    this.clips[clip.uuid].position = clip.position
  }

  @Mutation
  public updateClipWidth (clip: Clip) {
    this.clips[clip.uuid].width = clip.width
  }

  @Action({ rawError: true })
  public add (componentUuid: string) {
    const uuid = VuexMixin.generateUuid()
    const clip: Clip = {
      uuid,
      componentUuid,
      position: {
        x: 0,
        y: 1
      },
      width: 200,
      // TODO: コンポーネント名を設定する
      name: uuid
    }
    this.addClip(clip)
  }

  @Action({ rawError: true })
  public updatePosition (context: { position: Position; uuid: string }) {
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
