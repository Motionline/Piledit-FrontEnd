import {
  Module,
  VuexModule,
  Mutation,
  Action
} from 'vuex-module-decorators'
import { Vue } from 'vue-property-decorator'
import { PClips, PComponents, PTemplate, PTemplates } from '@/@types/piledit'
import store from '@/store/store'
import { VuexMixin } from '@/mixin/vuex'

export interface TemplatesStateIF {
  templates: PTemplates;
}

@Module({ store: store, name: 'TemplatesModule', namespaced: true })
export default class Templates extends VuexModule implements TemplatesStateIF {
  templates: PTemplates = {}

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

  @Action({ rawError: true })
  public add ({ clips, components }: { clips: PClips; components: PComponents }) {
    const uuid = VuexMixin.generateUuid()
    const template = new PTemplate({ uuid, clips, components })
    this.addTemplate(uuid, template)
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
}
