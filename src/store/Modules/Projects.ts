import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { Vue } from 'vue-property-decorator'
import { VuexMixin } from '@/mixin/vuex'
import store from '@/store/store'

import {
  PProject,
  PProjects
} from '@/@types/piledit'

export interface ProjectsStateIF {
  projects: PProjects;
}

@Module({ store: store, name: 'ProjectsModule', namespaced: true })
export default class Projects extends VuexModule implements ProjectsStateIF {
  projects: PProjects = {}

  @Mutation
  public addProject (project: PProject) {
    Vue.set(this.projects, project.uuid, project)
  }

  @Mutation
  public removeProject (uuid: string) {
    Vue.delete(this.projects, uuid)
  }

  @Mutation
  public updateProject (project: PProject) {
    Vue.set(this.projects, project.uuid, project)
  }

  @Action({ rawError: true })
  public async add (context: { name: string }) {
    const uuid = VuexMixin.generateUuid()
    const project: PProject = {
      name: context.name,
      uuid
    }
    this.addProject(project)
    return uuid
  }

  @Action({ rawError: true })
  public remove (uuid: string) {
    this.removeProject(uuid)
  }

  @Action({ rawError: true })
  public update (project: PProject) {
    this.updateProject(project)
  }
}
