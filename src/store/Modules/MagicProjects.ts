import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import store, { blocksModule, clipsModule, componentsModule, projectsModule, tabsModule } from '@/store/store'
import firebase from 'firebase'
import { DB } from '@/firebase/db'
import { PBlocks, PClips, PComponents, PProject, PProjects } from '@/@types/piledit'
import { VuexMixin } from '@/mixin/vuex'
import moment from 'moment'

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
  public isExistMagicProject ({ uuid }: { uuid: string }): Promise<boolean> {
    const magicProjectRef = DB.collection('magicProjects').doc(uuid)
    return magicProjectRef.get().then((doc: any) => {
      return !!doc.exists
    })
  }

  @Action({ rawError: true })
  public async connectMagicProject ({ uuid }: { uuid: string }) {
    const magicProjectDoc = await DB.collection('magicProjects').doc(uuid).get()
    if (magicProjectDoc.exists) {
      const magicProject = magicProjectDoc.data()
      const clips = magicProject!.clips as PClips
      const components = magicProject!.components as PComponents
      const blocks = magicProject!.blocks as PBlocks
      for (const uuid in clips) {
        const clip = clips[uuid]
        clipsModule.addClip(clip)
      }
      for (const uuid in components) {
        const component = components[uuid]
        componentsModule.addComponent(component)
      }
      for (const uuid in blocks) {
        const block = blocks[uuid]
        blocksModule.addBlock(block)
      }
      const url = await tabsModule.openProjectHome({ projectUuid: uuid, title: magicProject!.name })
      tabsModule.routerPush({ url })
      await DB.collection('magicProjects').doc(uuid).onSnapshot((doc: any) => {
        const updatedMagicProject = doc.data()
        const clips = updatedMagicProject!.clips as PClips
        const components = updatedMagicProject!.components as PComponents
        const blocks = updatedMagicProject!.blocks as PBlocks
        for (const uuid in clips) {
          const clip = clips[uuid]
          clipsModule.addClip(clip)
        }
        for (const uuid in components) {
          const component = components[uuid]
          componentsModule.addComponent(component)
        }
        for (const uuid in blocks) {
          const block = blocks[uuid]
          blocksModule.addBlock(block)
        }
      })
    }
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
      createdAt: (project.createdAt.toString()),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true })
    await DB.collection('magicProjects').doc(projectUuid).onSnapshot((doc: any) => {
      console.log('updated')
      const updatedMagicProject = doc.data()
      const clips = updatedMagicProject!.clips as PClips
      const components = updatedMagicProject!.components as PComponents
      const blocks = updatedMagicProject!.blocks as PBlocks
      for (const uuid in clips) {
        const clip = clips[uuid]
        clipsModule.addClip(clip)
      }
      for (const uuid in components) {
        const component = components[uuid]
        componentsModule.addComponent(component)
      }
      for (const uuid in blocks) {
        const block = blocks[uuid]
        blocksModule.addBlock(block)
      }
    })
  }

  @Action({ rawError: true })
  public async updateMagicProject () {
    const projectUuid = projectsModule.currentViewingProjectUuid
    const project = Object.assign({}, projectsModule.projects[projectUuid])
    projectsModule.update(project)
    if (project.isMagicProject) {
      const clips = await clipsModule.getFilteredClips({ projectUuid })
      const components = await componentsModule.getFilteredComponents({ projectUuid })
      const blocks = await blocksModule.getFilteredBlocks({ projectUuid })
      const magicProjectRef = DB.collection('magicProjects').doc(projectUuid)
      await magicProjectRef.set({
        ...project,
        clips: JSON.parse(JSON.stringify(clips)),
        components: JSON.parse(JSON.stringify(components)),
        blocks: JSON.parse(JSON.stringify(blocks)),
        createdAt: (project.createdAt.toString()),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true })
    }
  }
}
