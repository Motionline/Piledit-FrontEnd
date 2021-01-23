import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { Vue } from 'vue-property-decorator'
import { VuexMixin } from '@/mixin/vuex'
import { PTab, PTabHistoryItem, PTabHistoryKind, PTabs } from '@/@types/piledit'
import store, { componentsModule, projectsModule } from '@/store/store'
import router from '@/router'

export interface TabStateIF {
  tabs: PTabs;
  currentViewingTabUuid: string;
}

@Module({ store: store, name: 'TabsModule', namespaced: true })
export default class Tabs extends VuexModule implements TabStateIF {
  tabs: PTabs = {}
  currentViewingTabUuid = ''

  @Mutation
  public addTab ({ tab }: { tab: PTab }) {
    Vue.set(this.tabs, tab.uuid, tab)
  }

  @Mutation
  public removeTab ({ uuid }: { uuid: string }) {
    Vue.delete(this.tabs, uuid)
  }

  @Mutation
  public updateTab ({ tab }: { tab: PTab }) {
    Vue.set(this.tabs, tab.uuid, tab)
  }

  @Mutation
  public forwardTabHistory ({ tab }: { tab: PTab }) {
    if (tab.history.historyIndex === tab.history.historyContainer.length - 1) return
    tab.history.historyIndex += 1
    Vue.set(this.tabs, tab.uuid, tab)
  }

  @Mutation
  public backwardTabHistory ({ tab }: { tab: PTab }) {
    if (tab.history.historyIndex === 0) return
    tab.history.historyIndex -= 1
    Vue.set(this.tabs, tab.uuid, tab)
  }

  @Mutation
  public addPageTabHistory ({ tab, kind, projectUuid, title, url }: { tab: PTab; kind: PTabHistoryKind; projectUuid: string; title: string; url: string }) {
    tab.history.historyContainer.length = tab.history.historyIndex + 1
    const tabHistoryItem = new PTabHistoryItem({ kind, projectUuid, title, url })
    tab.history.historyContainer.push(tabHistoryItem)
    tab.history.historyIndex += 1
    Vue.set(this.tabs, tab.uuid, tab)
  }

  @Mutation
  public setCurrentViewingTabUuid ({ uuid }: { uuid: string }) {
    this.currentViewingTabUuid = uuid
  }

  // -------------------------------------------------------------------------

  @Action({ rawError: true })
  public async init () {
    const uuid = VuexMixin.generateUuid()
    const tab = new PTab({
      uuid,
      kind: PTabHistoryKind.General,
      projectUuid: '',
      title: '新しいタブ',
      url: `/${uuid}`
    })
    this.setCurrentViewingTabUuid({ uuid })
    this.addTab({ tab })
    return uuid
  }

  @Action({ rawError: true })
  public add ({ kind, projectUuid, title, url }: { kind: PTabHistoryKind; projectUuid: string; title: string; url: string }) {
    const uuid = VuexMixin.generateUuid()
    const tab = new PTab({
      uuid, kind, projectUuid, title, url
    })
    this.setCurrentViewingTabUuid({ uuid })
    this.addTab({ tab })
  }

  @Action({ rawError: true })
  public addPage ({ kind, projectUuid, title, url }: { kind: PTabHistoryKind; projectUuid: string; title: string; url: string }) {
    const tab = this.tabs[this.currentViewingTabUuid] as PTab
    this.addPageTabHistory({ tab, kind, projectUuid, title, url })
  }

  @Action({ rawError: true })
  public remove ({ uuid }: { uuid: string }) {
    this.removeTab({ uuid })
  }

  @Action({ rawError: true })
  public removeOwn ({ tabUuid, nextTabUuid }: { tabUuid: string; nextTabUuid: string }) {
    this.setCurrentViewingTabUuid({ uuid: nextTabUuid })
    this.removeTab({ uuid: tabUuid })
  }

  @Action({ rawError: true })
  public updateCurrentViewingTabUuid ({ uuid }: { uuid: string }) {
    this.setCurrentViewingTabUuid({ uuid })
  }

  @Action({ rawError: true })
  public async canOpenComponentsEditorTab (): Promise<boolean> {
    const senderTabUuid = this.currentViewingTabUuid
    const senderTabHistoryContainer = this.tabs[senderTabUuid].history.historyContainer
    const senderTabHistoryIndex = this.tabs[senderTabUuid].history.historyIndex
    const senderTabHistoryKind = senderTabHistoryContainer[senderTabHistoryIndex].kind
    return senderTabHistoryKind === PTabHistoryKind.Projects || senderTabHistoryKind === PTabHistoryKind.ProjectHome
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
    const tab = new PTab({
      uuid: tabUuid,
      kind: PTabHistoryKind.Projects,
      projectUuid: projectUuid,
      title,
      url
    })
    this.setCurrentViewingTabUuid({ uuid: tabUuid })
    this.addTab({ tab })
    return url
  }

  @Action({ rawError: true })
  public async addAboutTab (): Promise<string> {
    const tabUuid = VuexMixin.generateUuid()
    const url = `/${tabUuid}/about`
    const tab = new PTab({
      uuid: tabUuid,
      kind: PTabHistoryKind.Projects,
      projectUuid: '',
      title: 'About',
      url
    })
    this.setCurrentViewingTabUuid({ uuid: tabUuid })
    this.addTab({ tab })
    return url
  }

  @Action({ rawError: true })
  public updateTabName ({ tabUuid, name }: { tabUuid: string; name: string }) {
    // 参照元を直接変更するとリアクティブにならないのでassignする
    const tab = Object.assign({}, this.tabs[tabUuid])
    const projectUuid = projectsModule.currentViewingProjectUuid
    const projectName = projectsModule.projects[projectUuid].name
    const tabHistoryIndex = tab.history.historyIndex
    tab.history.historyContainer[tabHistoryIndex].title = `${name} (${projectName})`
    this.updateTab({ tab })
  }

  @Action({ rawError: true })
  public async toProjectHomePage ({ name }: { name: string }): Promise<string> {
    const tabUuid = this.currentViewingTabUuid
    const tab = this.tabs[tabUuid]
    const projectUuid = await projectsModule.add({ name })
    const url = `/${tabUuid}/projects/${projectUuid}`
    this.addPageTabHistory({ tab, kind: PTabHistoryKind.ProjectHome, projectUuid, title: name, url })
    projectsModule.updateCurrentViewingTabUuid({ uuid: projectUuid, kind: PTabHistoryKind.Projects })
    return url
  }

  @Action({ rawError: true })
  public async toProjectByTemplateHomePage ({ name, templateUuid }: { name: string; templateUuid: string }) {
    const tabUuid = this.currentViewingTabUuid
    const tab = this.tabs[tabUuid]
    const projectUuid = await projectsModule.addByTemplate({ name, templateUuid })
    const url = `/${tabUuid}/projects/${projectUuid}`
    this.addPageTabHistory({ tab, kind: PTabHistoryKind.ProjectHome, projectUuid, title: name, url })
    projectsModule.updateCurrentViewingTabUuid({ uuid: projectUuid, kind: PTabHistoryKind.Projects })
    return url
  }

  @Action({ rawError: true })
  public routerPush ({ url }: { url: string }) {
    // 重複した時にエラーが出るがそれは現状では、放置する
    // TODO: 同じページの場合はreload
    router.push(url, () => { /* ignore */ })
  }
}
