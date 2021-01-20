import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import store from '@/store/store'
import { PComponent, PComponents } from '@/@types/piledit'
import { DB } from '@/firebase/db'

export interface PStoreIF {
  components: PComponents;
}

@Module({ store: store, name: 'PStoresModule', namespaced: true })
export default class PStores extends VuexModule implements PStoreIF {
  components: PComponents = {}

  @Action({ rawError: true })
  public async publishComponent ({ component }: { component: PComponent }) {
    const componentsRef = DB.collection('components').doc(component.uuid)
    await componentsRef.set({
      ...component
    }, { merge: true })
  }
}
