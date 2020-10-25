import {
  Module,
  VuexModule,
  Mutation,
  Action,
  getModule
} from 'vuex-module-decorators'
import { Vue } from 'vue-property-decorator'
import store from '@/store/store'
import { BlockComponent } from '@/@types/piledit'

export interface BlockComponentsStateIF {
  allBlockComponents: { [key: string]: BlockComponent };
}

@Module({ dynamic: true, store: store, name: 'BlockComponents', namespaced: true })
class BlockComponents extends VuexModule implements BlockComponentsStateIF {
  allBlockComponents: { [key: string]: BlockComponent } = {}

  @Mutation
  public addComponent (component: BlockComponent) {
    Vue.set(this.allBlockComponents, component.componentUniqueKey, component)
    console.log(this.allBlockComponents)
  }

  @Mutation
  public removeComponent (componentUniqueKey: string) {
    Vue.delete(this.allBlockComponents, componentUniqueKey)
  }

  @Mutation
  public updateComponent (component: BlockComponent) {
    Vue.set(this.allBlockComponents, component.componentUniqueKey, component)
  }

  @Action({ rawError: true })
  public add (component: BlockComponent) {
    this.addComponent(component)
  }

  @Action({ rawError: true })
  public remove (componentUniqueKey: string) {
    this.removeComponent(componentUniqueKey)
  }

  @Action({ rawError: true })
  public update (component: BlockComponent) {
    this.updateComponent(component)
  }
}

export const blockComponentsModule = getModule(BlockComponents)
