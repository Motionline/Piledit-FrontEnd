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

  @Mutation
  public updateTab (tab: PTab) {
    Vue.set(this.tabs, tab.uuid, tab)
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
  public removeOwn ({ tabUuid, nextTabUuid }: { tabUuid: string; nextTabUuid: string }) {
    this.setCurrentViewingTabUuid(nextTabUuid)
    this.removeTab(tabUuid)
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
    return senderTabHistoryContainer[senderTabHistoryIndex][0] === PTabHistoryKind.Projects
  }

  @Action({ rawError: true })
  public async addComponentsEditorTab (componentsUuid?: string): Promise<string> {
    const tabUuid = VuexMixin.generateUuid()
    const projectUuid = projectsModule.currentViewingProjectUuid
    const projectName = projectsModule.projects[projectUuid].name
    if (componentsUuid == null) {
      componentsUuid = await componentsModule.add()
    }
    const url = `/${tabUuid}/projects/${projectUuid}/components/${componentsUuid}`
    const component = componentsModule.components[componentsUuid]
    const title = component.name === '' ? `${component.defaultName} (${projectName})` : `${component.name} (${projectName})`
    const tab = new PTab(tabUuid, PTabHistoryKind.Projects, title, url)
    this.setCurrentViewingTabUuid(tabUuid)
    this.addTab(tab)
    return url
  }

  @Action({ rawError: true })
  public updateTabName ({ tabUuid, name }: { tabUuid: string; name: string }) {
    // 参照元を直接変更するとリアクティブにならないのでassignする
    const tab = Object.assign({}, this.tabs[tabUuid])
    const projectUuid = projectsModule.currentViewingProjectUuid
    const projectName = projectsModule.projects[projectUuid].name
    const tabHistoryIndex = tab.history.historyIndex
    tab.history.historyContainer[tabHistoryIndex][1] = `${name} (${projectName})`
    this.updateTab(tab)
  }

  @Action({ rawError: true })
  public async toProjectHomePage ({ name }: { name: string }): Promise<string> {
    const tabUuid = this.currentViewingTabUuid
    const tab = this.tabs[tabUuid]
    const projectUuid = await projectsModule.add({ name })
    const url = `/${tabUuid}/projects/${projectUuid}`
    tab.history.addPage(PTabHistoryKind.Projects, name, url)
    projectsModule.updateCurrentViewingTabUuid({ uuid: projectUuid, kind: PTabHistoryKind.Projects })
    return url
  }
}
