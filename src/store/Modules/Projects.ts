import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { Vue } from 'vue-property-decorator'
import { VuexMixin } from '@/mixin/vuex'
import store, { blocksModule, clipsModule, componentsModule, tabsModule, templatesModule } from '@/store/store'
import { remote } from 'electron'
import fs from 'fs'
import moment from 'moment'

import { PBlocks, PClips, PComponents, PProject, PProjects, PTabHistoryKind } from '@/@types/piledit'

export interface ProjectsStateIF {
  projects: PProjects;
  currentViewingProjectUuid: string;
}

@Module({ store: store, name: 'ProjectsModule', namespaced: true })
export default class Projects extends VuexModule implements ProjectsStateIF {
  projects: PProjects = {}
  currentViewingProjectUuid = ''

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

  @Mutation
  public setCurrentViewingProjectUuid (uuid: string) {
    this.currentViewingProjectUuid = uuid
  }

  // -------------------------------------------------------------

  @Action({ rawError: true })
  public async add ({ name }: { name: string }) {
    const uuid = VuexMixin.generateUuid()
    const createdAt = moment()
    const project = new PProject({ name, uuid, createdAt })
    this.addProject(project)
    return uuid
  }

  @Action({ rawError: true })
  public async addByTemplate ({ name, templateUuid }: { name: string; templateUuid: string }) {
    const uuid = VuexMixin.generateUuid()
    const createdAt = moment()
    const project = new PProject({ name, uuid, createdAt })
    const template = Object.assign({}, templatesModule.templates[templateUuid])
    const components = Object.assign({}, template.components)
    const clips = Object.assign({}, template.clips)
    // uuid重複を回避するためにclips, components, blocksのuuidを全て置換する
    const uuidReplaceTable: { [key: string]: string } = {}
    for (const clipUuid of Object.keys(clips)) {
      uuidReplaceTable[clipUuid] = VuexMixin.generateUuid()
    }
    for (const componentUuid of Object.keys(components)) {
      uuidReplaceTable[componentUuid] = VuexMixin.generateUuid()
      const component = components[componentUuid]
      for (const blockUuid of Object.keys(component.blocks)) {
        uuidReplaceTable[blockUuid] = VuexMixin.generateUuid()
      }
    }
    let stringifyComponents: string = JSON.stringify(components)
    let stringifyClips: string = JSON.stringify(clips)
    for (const uuid of Object.keys(uuidReplaceTable)) {
      const reg = new RegExp(uuid, 'g')
      stringifyComponents = stringifyComponents.replace(reg, uuidReplaceTable[uuid])
      stringifyClips = stringifyClips.replace(reg, uuidReplaceTable[uuid])
    }
    // 置換終了
    const processedComponents: PComponents = JSON.parse(stringifyComponents)
    const processedClips: PClips = JSON.parse(stringifyClips)
    for (const componentUuid of Object.keys(processedComponents)) {
      const component = processedComponents[componentUuid]
      component.projectUuid = uuid
      componentsModule.addComponent(component)

      for (const blockUuid of Object.keys(component.blocks)) {
        const block = component.blocks[blockUuid]
        block.projectUuid = uuid
        blocksModule.addBlock(block)
      }
    }
    for (const clipUuid of Object.keys(processedClips)) {
      const clip = processedClips[clipUuid]
      clip.projectUuid = uuid
      clipsModule.addClip(clip)
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

  @Action({ rawError: true })
  public updateCurrentViewingTabUuid ({ uuid, kind }: { uuid?: string; kind: PTabHistoryKind }) {
    const isProjectPage = kind === PTabHistoryKind.Projects || kind === PTabHistoryKind.ProjectHome
    if (isProjectPage && uuid) {
      this.setCurrentViewingProjectUuid(uuid)
    } else {
      this.setCurrentViewingProjectUuid('')
    }
  }

  @Action({ rawError: true })
  public async openProject ({ uuid }: { uuid: string }) {
    const project = this.projects[uuid]
    const path = remote.app.getAppPath() + `/projects/${project.name}.json`
    const projectJson = JSON.parse(fs.readFileSync(path, 'utf8'))
    const components = projectJson.components as PComponents
    const blocks = projectJson.blocks as PBlocks
    const clips = projectJson.clips as PClips
    await componentsModule.addComponents({ components })
    await blocksModule.addBlocks({ blocks })
    await clipsModule.addClips({ clips }) // Mutation
    const url = await tabsModule.openProjectHome({ projectUuid: uuid, title: project.name })
    tabsModule.routerPush({ url })
  }
}
