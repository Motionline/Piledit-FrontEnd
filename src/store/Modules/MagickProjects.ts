import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import store from '@/store/store'
import { PProjects } from '@/@types/piledit'

export interface MagickProjectsStateIF {
  projects: PProjects;
}

@Module({ store: store, name: 'MagickProjectsModule', namespaced: true })
export default class MagickProjects extends VuexModule implements MagickProjectsStateIF {
  projects: PProjects = {}
}
