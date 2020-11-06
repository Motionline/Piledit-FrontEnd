import {
  Module,
  VuexModule,
  Mutation,
  Action,
  getModule
} from 'vuex-module-decorators'
import { Vue } from 'vue-property-decorator'
import { VuexMixin } from '@/mixin/vuex'
import { Tab } from '@/@types/piledit'
import store from '@/store/store'

export interface TabStateIF {
  tabs: { [key: string]: Tab };
  currentViewingTabUuid: string;
}

@Module({ dynamic: true, store: store, name: 'Tabs', namespaced: true })
class Tabs extends VuexModule implements TabStateIF {
  tabs: { [key: string]: Tab } = {}
  currentViewingTabUuid = ''

  @Mutation
  public addTab (tab: Tab) {
    Vue.set(this.tabs, tab.uuid, tab)
  }

  @Mutation
  public removeTab (uuid: string) {
    Vue.delete(this.tabs, uuid)
  }

  @Mutation
  public setCurrentViewingTabUuid (uuid: string) {
    this.currentViewingTabUuid = uuid
  }

  @Action({ rawError: true })
  public add (context: { name: string }) {
    const uuid = VuexMixin.generateUuid()
    const tab: Tab = {
      name: context.name,
      uuid
    }
    this.addTab(tab)
  }

  @Action({ rawError: true })
  public remove (context: { uuid: string }) {
    this.removeTab(context.uuid)
  }

  @Action({ rawError: true })
  public updateCurrentViewingTabUuid (context: { uuid: string }) {
    this.setCurrentViewingTabUuid(context.uuid)
  }
}

export const tabsModule = getModule(Tabs)
