import {
  Module,
  VuexModule,
  Mutation,
  Action
} from 'vuex-module-decorators'
import { Vue } from 'vue-property-decorator'
import store, { componentsModule } from '@/store/store'
import { PClip, PClips, PPosition } from '@/@types/piledit'
import { VuexMixin } from '@/mixin/vuex'

export interface ClipsStateIF {
  clips: PClips;
}

@Module({ store: store, name: 'ClipsModule', namespaced: true })
export default class Clips extends VuexModule implements ClipsStateIF {
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
  public add (context: { componentUuid: string; projectUuid: string }) {
    const uuid = VuexMixin.generateUuid()
    const component = componentsModule.components[context.componentUuid]
    const componentName = component.name === '' ? component.defaultName : component.name
    const clip = new PClip(
      uuid,
      componentName,
      context.componentUuid,
      context.projectUuid,
      {
        x: 0,
        y: 1
      },
      200
    )
    this.addClip(clip)
  }

  @Action({ rawError: true })
  public async getFilteredClips ({ projectUuid }: { projectUuid: string }): Promise<PClips> {
    const filtered: PClips = {}
    for (const uuid in this.clips) {
      const clip = this.clips[uuid]
      if (clip.projectUuid === projectUuid || clip.isExternal) {
        filtered[uuid] = clip
      }
    }
    return filtered
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
