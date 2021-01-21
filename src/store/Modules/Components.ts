import {
  Module,
  VuexModule,
  Mutation,
  Action
} from 'vuex-module-decorators'
import { Vue } from 'vue-property-decorator'
import store, { projectsModule, tabsModule } from '@/store/store'
import { PBlocks, PComponent, PComponents } from '@/@types/piledit'
import { VuexMixin } from '@/mixin/vuex'

export interface ComponentsStateIF {
  components: PComponents;
  componentsCount: { [key: string]: number };
  publishComponentUuid: string;
}

@Module({ store: store, name: 'ComponentsModule', namespaced: true })
export default class Components extends VuexModule implements ComponentsStateIF {
  components: PComponents = {}
  componentsCount: { [key: string]: number } = {}
  publishComponentUuid = ''

  @Mutation
  public addComponent (component: PComponent) {
    Vue.set(this.components, component.uuid, component)
  }

  @Mutation
  public removeComponent (uuid: string) {
    Vue.delete(this.components, uuid)
  }

  @Mutation
  public updateComponent (component: PComponent) {
    Vue.set(this.components, component.uuid, component)
  }

  @Mutation
  public nextComponentCount (projectUuid: string) {
    const currentCount = this.componentsCount[projectUuid] == null ? 1 : this.componentsCount[projectUuid]
    Vue.set(this.componentsCount, projectUuid, currentCount + 1)
  }

  @Mutation
  public setPublishComponentUuid (uuid: string) {
    this.publishComponentUuid = uuid
  }

  @Action({ rawError: true })
  public async add () {
    const componentUuid = VuexMixin.generateUuid()
    const projectUuid = projectsModule.currentViewingProjectUuid
    const currentCount = this.componentsCount[projectUuid] == null ? 1 : this.componentsCount[projectUuid]
    const defaultName = `コンポーネント${currentCount}`
    const component = new PComponent(componentUuid, defaultName, projectUuid)
    this.nextComponentCount(projectUuid)
    this.addComponent(component)
    return componentUuid
  }

  @Action({ rawError: true })
  public async addGlobal ({ component }: { component: PComponent }) {
    if (component.uuid in this.components) {
      throw new Error('既にダウンロードしているコンポーネントです')
    } else {
      this.addComponent(component)
    }
  }

  @Action({ rawError: true })
  public async getFilteredComponents ({ projectUuid }: { projectUuid: string }): Promise<PComponents> {
    const filtered: PComponents = {}
    for (const uuid in this.components) {
      const component = this.components[uuid]
      if (component.projectUuid === projectUuid || component.isExternal) {
        filtered[uuid] = component
      }
    }
    return filtered
  }

  @Action({ rawError: true })
  public async isAlreadyDownloaded ({ uuid }: { uuid: string }): Promise<boolean> {
    return uuid in this.components
  }

  @Action({ rawError: true })
  public remove (uuid: string) {
    this.removeComponent(uuid)
  }

  @Action({ rawError: true })
  public updateBlocks ({ componentUuid, blocks }: { componentUuid: string; blocks: PBlocks }) {
    const component = Object.assign({}, this.components[componentUuid])
    component.blocks = blocks
    this.updateComponent(component)
  }

  @Action({ rawError: true })
  public updateComponentName ({ componentUuid, name }: { componentUuid: string; name: string }) {
    const component = Object.assign({}, this.components[componentUuid])
    component.name = name
    this.updateComponent(component)
    const tabUuid = tabsModule.currentViewingTabUuid
    const title = name === '' ? component.defaultName : component.name
    tabsModule.updateTabName({ tabUuid, name: title })
  }

  @Action({ rawError: true })
  public updatePublishComponentUuid ({ componentUuid }: { componentUuid: string }) {
    this.setPublishComponentUuid(componentUuid)
  }
}
