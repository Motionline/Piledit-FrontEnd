import {
  Module,
  VuexModule,
  Mutation,
  Action
} from 'vuex-module-decorators'
import { PTemplates } from '@/@types/piledit'
import store from '@/store/store'

export interface TemplatesStateIF {
  templates: PTemplates;
}

@Module({ store: store, name: 'TemplatesModule', namespaced: true })
export default class Templates extends VuexModule implements TemplatesStateIF {
  templates: PTemplates = {}
}
