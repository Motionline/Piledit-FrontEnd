import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import store, { blocksModule, clipsModule, componentsModule, projectsModule } from '@/store/store'
import firebase from 'firebase'
import { DB } from '@/firebase/db'
import { PProject, PProjects } from '@/@types/piledit'
import { VuexMixin } from '@/mixin/vuex'

export interface MagicProjectsStateIF {
  magicProjectDialog: boolean;
}

@Module({ store: store, name: 'MagicProjectsModule', namespaced: true })
export default class MagicProjects extends VuexModule implements MagicProjectsStateIF {
  magicProjectDialog = false

  @Mutation
  public setMagicProjectDialog (condition: boolean) {
    this.magicProjectDialog = condition
  }

  @Action({ rawError: true })
  public updateMagicProjectDialog ({ condition }: { condition: boolean }) {
    this.setMagicProjectDialog(condition)
  }

  @Action({ rawError: true })
  public async publishMagicProject () {
    const projectUuid = projectsModule.currentViewingProjectUuid
    const project = Object.assign({}, projectsModule.projects[projectUuid])
    project.isMagicProject = true
    projectsModule.update(project)
    const clips = await clipsModule.getFilteredClips({ projectUuid })
    const components = await componentsModule.getFilteredComponents({ projectUuid })
    const blocks = await blocksModule.getFilteredBlocks({ projectUuid })
    const magicProjectRef = DB.collection('magicProjects').doc(projectUuid)
    await magicProjectRef.set({
      ...project,
      clips: JSON.parse(JSON.stringify(clips)),
      components: JSON.parse(JSON.stringify(components)),
      blocks: JSON.parse(JSON.stringify(blocks)),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true })
  }

  @Action({ rawError: true })
  public async updateMagicProject () {
    const projectUuid = projectsModule.currentViewingProjectUuid
    const project = Object.assign({}, projectsModule.projects[projectUuid])
    projectsModule.update(project)
    if (project.isMagicProject) {
      console.log('update')
      const clips = await clipsModule.getFilteredClips({ projectUuid })
      const components = await componentsModule.getFilteredComponents({ projectUuid })
      const blocks = await blocksModule.getFilteredBlocks({ projectUuid })
      const magicProjectRef = DB.collection('magicProjects').doc(projectUuid)
      await magicProjectRef.set({
        ...project,
        clips: JSON.parse(JSON.stringify(clips)),
        components: JSON.parse(JSON.stringify(components)),
        blocks: JSON.parse(JSON.stringify(blocks)),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true })
    }
  }
}
