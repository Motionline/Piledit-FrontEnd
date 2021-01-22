<template>
  <div id="Home">
    <v-dialog :value="showNewTemplateDialog" @click:outside.prevent="turnOffDialog">
      <v-card rounded>
        <v-card-title>テンプレートを作成する</v-card-title>
        <v-card-text>
          現在のプロジェクトを基にテンプレートを作成することができます。<br />
          テンプレートを用いてプロジェクトを開始することで、何度も作成するような動画の編集作業を楽にできます。
        </v-card-text>
        <v-card-text>
          <v-form>
            <v-text-field label="テンプレート名" outlined color="#898989"></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="turnOffDialog">閉じる</v-btn>
          <v-btn @click="createTemplate">作成する</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <h3>全てのコンポーネント</h3>
    <div v-for="(component, uuid) in filteredComponents()" :key="uuid">
      <v-btn @click="openComponentEditor(component)">{{ getComponentName(uuid) }}を開く</v-btn>
    </div>
    <TimeLineComponent :clips="filteredClips()" :components="filteredComponents()" />
  </div>
</template>

<style scoped>
</style>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { componentsModule, clipsModule, blocksModule, tabsModule, templatesModule } from '@/store/store'
import TimeLineComponent from '@/components/Templates/Timeline.vue'
import { remote } from 'electron'
import { PComponents, PClips, PComponent } from '@/@types/piledit'
import { MenuMixin } from '@/mixin/menu'
const dialog = remote.dialog
const Menu = remote.Menu

@Component({
  components: {
    TimeLineComponent
  }
})
export default class TimeLine extends Vue {
  public tabUuid = this.$route.params.tabUuid
  public projectUuid = this.$route.params.projectUuid

  public mounted () {
    MenuMixin.updateTimeline()
  }

  public turnOnDialog () {
    templatesModule.updateShowNewTemplateDialog({ condition: true })
  }

  public turnOffDialog () {
    templatesModule.updateShowNewTemplateDialog({ condition: false })
  }

  public async createTemplate () {
    const _ = await templatesModule.add()
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
      this.$router.push(url)
    }
  }

  public getComponentName (componentUuid: string) {
    const component = this.components[componentUuid]
    return component.name || component.defaultName
  }
}
</script>
