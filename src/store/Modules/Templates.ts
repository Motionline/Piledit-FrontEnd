import {
  Module,
  VuexModule,
  Mutation,
  Action
} from 'vuex-module-decorators'
import { Vue } from 'vue-property-decorator'
import { PClips, PComponents, PTemplate, PTemplates } from '@/@types/piledit'
import store, { clipsModule, componentsModule, projectsModule } from '@/store/store'
import { VuexMixin } from '@/mixin/vuex'

export interface TemplatesStateIF {
  templates: PTemplates;
  showNewTemplateDialog: boolean;
}

@Module({ store: store, name: 'TemplatesModule', namespaced: true })
export default class Templates extends VuexModule implements TemplatesStateIF {
  templates: PTemplates = {}
  showNewTemplateDialog = false

  @Mutation
  public addTemplate (uuid: string, template: PTemplate) {
    Vue.set(this.templates, uuid, template)
  }

  @Mutation
  public removeTemplate (uuid: string) {
    Vue.delete(this.templates, uuid)
  }

  @Mutation
  public updateTemplate (template: PTemplate) {
    Vue.set(this.templates, template.uuid, template)
  }

  @Mutation
  public setShowNewTemplateDialog (condition: boolean) {
    this.showNewTemplateDialog = condition
  }

  @Action({ rawError: true })
  public async add (): Promise<string> {
    const uuid = VuexMixin.generateUuid()
    const projectUuid = projectsModule.currentViewingProjectUuid
    const components = await componentsModule.getFilteredComponents({ projectUuid })
    const clips = await clipsModule.getFilteredClips({ projectUuid })
    const template = new PTemplate({ uuid, clips, components })
    this.addTemplate(uuid, template)
    return uuid
  }

  @Action({ rawError: true })
  public remove ({ uuid }: { uuid: string }) {
    this.removeTemplate(uuid)
  }

  @Action({ rawError: true })
  public update ({ uuid, clips, components }: { uuid: string; clips: PClips; components: PComponents }) {
    const template = Object.assign({}, this.templates[uuid])
    template.clips = clips
    template.components = components
    this.updateTemplate(template)
  }

  @Action({ rawError: true })
  public updateShowNewTemplateDialog ({ condition }: { condition: boolean }) {
    this.setShowNewTemplateDialog(condition)
  }
}
