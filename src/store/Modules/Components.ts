import {
  Module,
  VuexModule,
  Mutation,
  Action,
  getModule
} from 'vuex-module-decorators'
import { Vue } from 'vue-property-decorator'
import store from '@/store/store'
import { Component } from '@/@types/piledit'

export interface ComponentsStateIF {
  components: { [key: string]: Component };
}

@Module({ dynamic: true, store: store, name: 'Components', namespaced: true })
class Components extends VuexModule implements ComponentsStateIF {
  components: { [key: string]: Component } = {}

  @Mutation
  public addComponent (component: Component) {
    Vue.set(this.components, component.uuid, component)
    console.log(this.components)
  }

  @Mutation
  public removeComponent (uuid: string) {
    Vue.delete(this.components, uuid)
  }

  @Mutation
  public updateComponent (component: Component) {
    Vue.set(this.components, component.uuid, component)
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

export const blockComponentsModule = getModule(Components)
