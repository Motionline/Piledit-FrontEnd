import {
  Module,
  VuexModule,
  Mutation,
  Action,
  getModule
} from 'vuex-module-decorators'
import { Vue } from 'vue-property-decorator'
import store from '@/store/store'

type Component = {
  componentUniqueKey: string;
}

export interface ComponentsStateIF {
  allComponents: { [key: string]: Component };
}

@Module({ dynamic: true, store: store, name: 'Components', namespaced: true })
class Components extends VuexModule implements ComponentsStateIF {
  allComponents: { [key: string]: Component } = {}

  @Mutation
  public addComponent (component: Component) {
    Vue.set(this.allComponents, component.componentUniqueKey, component)
  }

  @Mutation
  public removeComponent (componentUniqueKey: string) {
    Vue.delete(this.allComponents, componentUniqueKey)
  }

  @Mutation
  public updateComponent (component: Component) {
    Vue.set(this.allComponents, component.componentUniqueKey, component)
  }

  @Action
  public add (component: Component) {
    this.addComponent(component)
  }

  @Action
  public remove (componentUniqueKey: string) {
    this.removeComponent(componentUniqueKey)
  }

  @Action
  public update (component: Component) {
    this.updateComponent(component)
  }
}

export const componentsModule = getModule(Components)
