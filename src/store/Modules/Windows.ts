import {
  Module,
  VuexModule,
  Mutation,
  Action,
  getModule
} from 'vuex-module-decorators'
import { Vue } from 'vue-property-decorator'
import { VuexMixin } from '@/mixin/vuex'
import { PileditWindow } from '@/@types/piledit'
import store from '@/store/store'

export interface WindowStateIF {
  windows: { [key: string]: PileditWindow };
}

@Module({ dynamic: true, store: store, name: 'Windows', namespaced: true })
class Windows extends VuexModule implements WindowStateIF {
  windows: { [key: string]: PileditWindow } = {}

  @Mutation
  public addWindow (window: PileditWindow) {
    Vue.set(this.windows, window.uuid, window)
  }

  @Mutation
  public removeWindow (uuid: string) {
    Vue.delete(this.windows, uuid)
  }

  @Mutation
  public updateWindow (window: PileditWindow) {
    Vue.set(this.windows, window.uuid, window)
  }

  @Action({ rawError: true })
  public add (context: { windowType: string }) {
    const uuid = VuexMixin.generateUuid()
    const window: PileditWindow = {
      windowType: context.windowType,
      uuid
    }
    this.addWindow(window)
  }

  @Action({ rawError: true })
  public remove (context: { uuid: string }) {
    this.removeWindow(context.uuid)
  }
}

export const windowsModule = getModule(Windows)
