<template>
  <div id="Home">
    <magic-project-dialog
        :magic-project-dialog="magicProjectDialog"
        :token="token"
        @turnOffMagicProjectDialog="turnOffMagicProjectDialog"
        @copyToken="copyToken"
    />
    <success-copy-token-snackbar
        :success-copy-token="successCopyClipboard"
        @disappearSelfSnackbar="disappearSuccessCopySnackbar"
    />
    <new-template-dialog
        :show-new-template-dialog="showNewTemplateDialog"
        :error-creating-template-message="errorCreatingTemplateMessage"
        @turnOffDialog="turnOffDialog"
        @createTemplate="createTemplate"
    />
    <v-snackbar
        v-model="successCreatingTemplateSnackBar"
        shaped
    >
      テンプレートを作成しました
      <template v-slot:action="{ attrs }">
        <v-btn
            color="white"
            text
            v-bind="attrs"
            @click="successCreatingTemplateSnackBar = false"
        >
          閉じる
        </v-btn>
      </template>
    </v-snackbar>
    <h3>全てのコンポーネント</h3>
    <div v-for="(component, uuid) in filteredComponents()" :key="uuid">
      <v-btn @click="openComponentEditor(component)">{{ getComponentName(uuid) }}を開く {{ uuid }}</v-btn>
    </div>
    <TimeLineComponent :clips="filteredClips()" :components="filteredComponents()" />
  </div>
</template>

<style scoped>
</style>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import {
  componentsModule,
  clipsModule,
  blocksModule,
  tabsModule,
  templatesModule,
  magicProjectsModule
} from '@/store/store'
import TimeLineComponent from '@/components/Templates/Timeline.vue'
import MagicProjectDialog from '@/components/Organisms/Dialogs/MagicProjectDialog.vue'
import SuccessCopyTokenSnackbar from '@/components/Organisms/Snackbars/SuccessCopyTokenSnackbar.vue'
import NewTemplateDialog from '@/components/Organisms/Dialogs/NewTemplateDialog.vue'
import { remote } from 'electron'
import { PComponents, PClips, PComponent } from '@/@types/piledit'
import { MenuMixin } from '@/mixin/menu'
const dialog = remote.dialog
const Menu = remote.Menu

@Component({
  components: {
    TimeLineComponent,
    MagicProjectDialog,
    SuccessCopyTokenSnackbar,
    NewTemplateDialog
  }
})
export default class TimeLine extends Vue {
  public tabUuid = this.$route.params.tabUuid
  public projectUuid = this.$route.params.projectUuid
  public successCopyClipboard = false
  public successCreatingTemplateSnackBar = false
  public errorCreatingTemplateMessage = false
  public templateName = ''
  public token = this.$route.params.projectUuid

  public copyToken () {
    this.successCopyClipboard = true
    this.turnOffMagicProjectDialog()
    this.$copyText(this.token).then(function (_) {
      console.log('copy')
    }, function (_) {
      console.log('not copy')
    })
  }

  public mounted () {
    MenuMixin.updateTimeline()
  }

  public turnOnDialog () {
    templatesModule.updateShowNewTemplateDialog({ condition: true })
  }

  public turnOffDialog () {
    templatesModule.updateShowNewTemplateDialog({ condition: false })
  }

  public turnOnMagicProjectDialog () {
    magicProjectsModule.updateMagicProjectDialog({ condition: true })
  }

  public turnOffMagicProjectDialog () {
    magicProjectsModule.updateMagicProjectDialog({ condition: false })
  }

  public disappearSuccessCopySnackbar () {
    this.successCopyClipboard = false
  }

  public async createTemplate () {
    try {
      await templatesModule.add({ name: this.templateName })
      this.successCreatingTemplateSnackBar = true
      this.errorCreatingTemplateMessage = false
      this.turnOffDialog()
    } catch (e) {
      this.errorCreatingTemplateMessage = true
    }
  }

  @Watch('$route')
  onUrlsChanged (newRoute: any, _: any) {
    this.tabUuid = newRoute.params.tabUuid
    this.projectUuid = newRoute.params.projectUuid
  }

  public filteredComponents () {
    const filtered: PComponents = {}
    for (const [key, value] of Object.entries(this.components)) {
      if (value.projectUuid === this.projectUuid || value.isExternal) {
        filtered[key] = value
      }
    }
    return filtered
  }

  public filteredClips () {
    const filtered: PClips = {}
    for (const [key, value] of Object.entries(this.clips)) {
      if (value.projectUuid === this.projectUuid) {
        filtered[key] = value
      }
    }
    return filtered
  }

  get showNewTemplateDialog () {
    return templatesModule.showNewTemplateDialog
  }

  get magicProjectDialog () {
    return magicProjectsModule.magicProjectDialog
  }

  get components () {
    return componentsModule.components
  }

  get clips () {
    return clipsModule.clips
  }

  get blocks () {
    return blocksModule.blocks
  }

  public async openComponentEditor (component: PComponent) {
    if (component.isExternal) {
      const currentWindow = remote.getCurrentWindow()
      await dialog.showMessageBox(currentWindow, {
        type: 'warning',
        title: '注意',
        message: '外部コンポーネントは編集できません',
        detail: 'ストアから入手したコンポーネントを編集する事はできません。'
        // TODO: 外部コンポーネントをコピーして上書きしますか？
      })
    } else {
      const url = await tabsModule.addComponentsEditorTab(component.uuid)
      tabsModule.routerPush({ url })
    }
  }

  public getComponentName (componentUuid: string) {
    const component = this.components[componentUuid]
    return component.name || component.defaultName
  }
}
</script>
