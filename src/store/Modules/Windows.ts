import {
  Module,
  VuexModule,
  Mutation,
  Action,
  getModule
} from 'vuex-module-decorators'
import { Vue } from 'vue-property-decorator'
import store from '@/store/store'

type Window = {
  windowType: string
  uuid: string
}

export interface WindowStateIF {
  windows: { [key: string]: Window };
}

@Module({ dynamic: true, store: store, name: 'Windows', namespaced: true })
class Windows extends VuexModule implements WindowStateIF {
  windows: { [key: string]: Window } = {}
}

export const windowsModule = getModule(Windows)
