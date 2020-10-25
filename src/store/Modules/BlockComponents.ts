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
    Vue.set(this.allBlockComponents, component.blockComponentUniqueKey, component)
    console.log(this.allBlockComponents)
  }

  @Mutation
  public removeComponent (blockComponentUniqueKey: string) {
    Vue.delete(this.allBlockComponents, blockComponentUniqueKey)
  }

  @Mutation
  public updateComponent (component: BlockComponent) {
    Vue.set(this.allBlockComponents, component.blockComponentUniqueKey, component)
  }

  @Action({ rawError: true })
  public add (component: BlockComponent) {
    this.addComponent(component)
  }

  @Action({ rawError: true })
  public remove (blockComponentUniqueKey: string) {
    this.removeComponent(blockComponentUniqueKey)
  }

  @Action({ rawError: true })
  public update (component: BlockComponent) {
    this.updateComponent(component)
  }
}

export const blockComponentsModule = getModule(BlockComponents)
