import {
  Module,
  VuexModule,
  Mutation,
  Action
} from 'vuex-module-decorators'
import { Vue } from 'vue-property-decorator'
import store from '@/store/store'
import { PBlocks, PComponent, PComponents } from '@/@types/piledit'
import { VuexMixin } from '@/mixin/vuex'

export interface ComponentsStateIF {
  components: PComponents;
}

@Module({ store: store, name: 'ComponentsModule', namespaced: true })
export default class Components extends VuexModule implements ComponentsStateIF {
  components: PComponents = {}

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

  @Action({ rawError: true })
  public async add () {
    const uuid = VuexMixin.generateUuid()
    const component = new PComponent(uuid)
    this.addComponent(component)
    return uuid
  }

  @Action({ rawError: true })
  public remove (uuid: string) {
    this.removeComponent(uuid)
  }

  @Action({ rawError: true })
  public updateBlocks ({ uuid, blocks }: { uuid: string; blocks: PBlocks }) {
    const component = this.components[uuid]
    component.blocks = blocks
    this.updateComponent(component)
  }

  @Action({ rawError: true })
  public updateExportBlocks ({ uuid, exportBlocks }: { uuid: string; exportBlocks: PBlocks }) {
    const component = this.components[uuid]
    component.exportBlocks = exportBlocks
    this.updateComponent(component)
  }
}
