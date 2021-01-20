import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import store from '@/store/store'

export interface PStoreIF {
  components: { [key: string]: string };
}

@Module({ store: store, name: 'PileditStoreModule', namespaced: true })
export default class PStores extends VuexModule implements PStoreIF {
  components = {}
}
