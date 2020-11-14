import {
  Module,
  VuexModule,
  Mutation,
  Action,
  getModule
} from 'vuex-module-decorators'
import { Vue } from 'vue-property-decorator'
import store from '@/store/store'
import { PComponent, PComponents } from '@/@types/piledit'

export interface ComponentsStateIF {
  components: PComponents;
}

@Module({ dynamic: true, store: store, name: 'Components', namespaced: true })
class Components extends VuexModule implements ComponentsStateIF {
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
    this.components[component.uuid] = component
  }

  @Action({ rawError: true })
  public add (component: PComponent) {
    this.addComponent(component)
  }

  @Action({ rawError: true })
  public remove (uuid: string) {
    this.removeComponent(uuid)
  }

  @Action({ rawError: true })
  public update (component: PComponent) {
    this.updateComponent(component)
  }
}

export const componentsModule = getModule(Components)
