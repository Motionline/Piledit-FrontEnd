import {
  Module,
  VuexModule,
  Mutation,
  Action,
  getModule
} from 'vuex-module-decorators'
import { Vue } from 'vue-property-decorator'
import store from '@/store/store'
import { Component, Components as TComponents } from '@/@types/piledit'

export interface ComponentsStateIF {
  components: TComponents;
}

@Module({ dynamic: true, store: store, name: 'Components', namespaced: true })
class Components extends VuexModule implements ComponentsStateIF {
  components: TComponents = {}

  @Mutation
  public addComponent (component: Component) {
    Vue.set(this.components, component.uuid, component)
  }

  @Mutation
  public removeComponent (uuid: string) {
    Vue.delete(this.components, uuid)
  }

  @Mutation
  public updateComponent (component: Component) {
    console.log(component)
    this.components[component.uuid] = component
  }

  @Action({ rawError: true })
  public add (component: Component) {
    this.addComponent(component)
  }

  @Action({ rawError: true })
  public remove (uuid: string) {
    this.removeComponent(uuid)
  }

  @Action({ rawError: true })
  public update (component: Component) {
    this.updateComponent(component)
  }
}

export const componentsModule = getModule(Components)
