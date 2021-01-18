import {
  Module,
  VuexModule,
  Mutation,
  Action
} from 'vuex-module-decorators'
import { Vue } from 'vue-property-decorator'
import store, { tabsModule } from '@/store/store'
import { PBlocks, PComponent, PComponents } from '@/@types/piledit'
import { VuexMixin } from '@/mixin/vuex'

export interface ComponentsStateIF {
  components: PComponents;
  componentsCount: number;
}

@Module({ store: store, name: 'ComponentsModule', namespaced: true })
export default class Components extends VuexModule implements ComponentsStateIF {
  components: PComponents = {}
  componentsCount = 1

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
  public incrementComponentCount () {
    this.componentsCount += 1
  }

  @Action({ rawError: true })
  public async add () {
    const uuid = VuexMixin.generateUuid()
    const component = new PComponent(uuid, `コンポーネント${this.componentsCount}`)
    this.incrementComponentCount()
    this.addComponent(component)
    return uuid
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
}
