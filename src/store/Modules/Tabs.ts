import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { Vue } from 'vue-property-decorator'
import { VuexMixin } from '@/mixin/vuex'
import { PTab, PTabHistoryKind, PTabs } from '@/@types/piledit'
import store, { componentsModule, projectsModule } from '@/store/store'

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
    this.setCurrentViewingTabUuid(uuid)
    this.addTab(tab)
  }

  @Action({ rawError: true })
  public addPage ({ kind, title, url }: { kind: PTabHistoryKind; title: string; url: string }) {
    const tab = this.tabs[this.currentViewingTabUuid]
    tab.history.addPage(kind, title, url)
  }

  @Action({ rawError: true })
  public remove (context: { uuid: string }) {
    this.removeTab(context.uuid)
  }

  @Action({ rawError: true })
  public updateCurrentViewingTabUuid (context: { uuid: string }) {
    this.setCurrentViewingTabUuid(context.uuid)
  }

  @Action({ rawError: true })
  public async canOpenComponentsEditorTab (): Promise<boolean> {
    const senderTabUuid = this.currentViewingTabUuid
    const senderTabHistoryContainer = this.tabs[senderTabUuid].history.historyContainer
    const senderTabHistoryIndex = this.tabs[senderTabUuid].history.historyIndex
    console.log(senderTabHistoryContainer)
    console.log(senderTabHistoryIndex)
    console.log(senderTabHistoryContainer[senderTabHistoryIndex][0])
    return senderTabHistoryContainer[senderTabHistoryIndex][0] === PTabHistoryKind.Projects
  }

  @Action({ rawError: true })
  public async addComponentsEditorTab (): Promise<string> {
    const tabUuid = VuexMixin.generateUuid()
    const projectUuid = projectsModule.currentViewingProjectUuid
    const projectName = projectsModule.projects[projectUuid].name
    const componentsUuid = VuexMixin.generateUuid()
    const url = `/${tabUuid}/projects/${projectUuid}/components/${componentsUuid}`
    const title = `${projectName}のコンポーネントエディタ`
    const tab = new PTab(tabUuid, PTabHistoryKind.Projects, title, url)
    componentsModule.add({ uuid: componentsUuid, blocks: {} })
    this.setCurrentViewingTabUuid(tabUuid)
    this.addTab(tab)
    return url
  }
}
