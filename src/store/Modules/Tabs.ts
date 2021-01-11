import {
  Module,
  VuexModule,
  Mutation,
  Action
} from 'vuex-module-decorators'
import { Vue } from 'vue-property-decorator'
import { VuexMixin } from '@/mixin/vuex'
import { PTab, PTabs, PTabHistoryKind } from '@/@types/piledit'
import store, { projectsModule } from '@/store/store'

export interface TabStateIF {
  tabs: PTabs;
  currentViewingTabUuid: string;
}

@Module({ store: store, name: 'TabsModule', namespaced: true })
export default class Tabs extends VuexModule implements TabStateIF {
  tabs: PTabs = {}
  currentViewingTabUuid = ''

  @Mutation
  public addTab (tab: PTab) {
    Vue.set(this.tabs, tab.uuid, tab)
  }

  @Mutation
  public removeTab (uuid: string) {
    Vue.delete(this.tabs, uuid)
  }

  @Action({ rawError: true })
  public addPage ({ kind, title, url }: { kind: PTabHistoryKind; title: string; url: string }) {
    const tab = this.tabs[this.currentViewingTabUuid]
    tab.history.addPage(kind, title, url)
    if (VuexMixin.changeViewingProjectUuid(tab)) {
      // projectsModule.updateCurrentViewingTabUuid({ uuid: })
    }
  }

  @Action({ rawError: true })
  public forward () {
    const tab = this.tabs[this.currentViewingTabUuid]
    tab.history.forward()
  }

  @Action({ rawError: true })
  public backward () {
    const tab = this.tabs[this.currentViewingTabUuid]
    tab.history.backward()
  }

  @Mutation
  public setCurrentViewingTabUuid (uuid: string) {
    this.currentViewingTabUuid = uuid
  }

  @Action({ rawError: true })
  public async init () {
    const uuid = VuexMixin.generateUuid()
    const tab = new PTab(uuid, PTabHistoryKind.General, '新しいタブ', `/${uuid}`)
    this.setCurrentViewingTabUuid(uuid)
    this.addTab(tab)
    return uuid
  }

  @Action({ rawError: true })
  public add ({ kind, title, url }: { kind: PTabHistoryKind; title: string; url: string }) {
    const uuid = VuexMixin.generateUuid()
    const tab = new PTab(uuid, kind, title, url)
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
