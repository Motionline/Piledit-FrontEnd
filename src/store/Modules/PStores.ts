import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import store from '@/store/store'
import { PComponent, PComponents } from '@/@types/piledit'
import { DB } from '@/firebase/db'
import { VuexMixin } from '@/mixin/vuex'

export interface PStoreIF {
  components: PComponents;
}

@Module({ store: store, name: 'PStoresModule', namespaced: true })
export default class PStores extends VuexModule implements PStoreIF {
  components: PComponents = {}

  @Mutation
  public setComponents (components: PComponents) {
    this.components = components
  }

  @Action({ rawError: true })
  public async publishComponent ({ component }: { component: PComponent }) {
    // uuid重複を回避するためにcomponent, blocksのuuidを全て置換する
    const uuidReplaceTable: { [key: string]: string } = {}
    uuidReplaceTable[component.uuid] = VuexMixin.generateUuid()
    component.isExternal = true
    for (const blockUuid in component.blocks) {
      uuidReplaceTable[blockUuid] = VuexMixin.generateUuid()
    }
    let stringifyComponent: string = JSON.stringify(component)
    for (const uuid in uuidReplaceTable) {
      const reg = new RegExp(uuid, 'g')
      stringifyComponent = stringifyComponent.replace(reg, uuidReplaceTable[uuid])
    }
    // 置換終了
    const pureObject: object = JSON.parse(stringifyComponent)
    const componentsRef = DB.collection('components').doc(uuidReplaceTable[component.uuid])
    await componentsRef.set({
      ...pureObject
    }, { merge: true })
  }

  @Action({ rawError: true })
  public async getComponentsFromFireStore () {
    // TODO: firestoreの返り値をPComponentに "型安全に" 整形する
    const components: PComponents = {}
    const componentsQuery = await DB.collection('components').get()
    componentsQuery.forEach((componentQuery) => {
      const uuid: string = componentQuery.data().uuid
      components[uuid] = componentQuery.data() as PComponent
    })
    this.setComponents(components)
  }
}
