<template>
  <div>
    <v-tabs color="black" left>
      <v-tab
          v-for="(tab, key, index) in tabs"
          :key="key"
          :to="getUrl(tab)"
          :ripple="false"
          :id="`applicationTab--${index}`"
          @click="updateCurrentViewingTabUuid(tab.uuid)"
          class="applicationTab--tab"
      >
        {{ getTitle(tab) }}
        <v-btn
            icon
            x-small
            @click.prevent="deleteTab(tab.uuid)"
            :ripple="false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-tab>
      <v-tab :ripple="false" @click="addTab()">
        <v-btn icon :ripple="false">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-tab>
    </v-tabs>
    <v-tabs hide-slider color="black" left>
      <v-tab :ripple="false" :disabled="backwardDisabled()" @click="backward()">
        <v-btn icon :ripple="false">
          <v-icon>mdi-arrow-left-thick</v-icon>
        </v-btn>
      </v-tab>
      <v-tab :ripple="false" :disabled="forwardDisabled()" @click="forward()">
        <v-btn icon :ripple="false">
          <v-icon>mdi-arrow-right-thick</v-icon>
        </v-btn>
      </v-tab>
      <v-tab :ripple="false" @click.prevent="toHome()">
        <v-btn icon :ripple="false" :plain="true">
          <v-icon>mdi-home</v-icon>
        </v-btn>
      </v-tab>
      <v-tab :ripple="false">
        <v-text-field :value="getCurrentPath()" style="width: 2400px;"></v-text-field>
      </v-tab>
    </v-tabs>
  </div>
</template>

<style lang="scss">
.applicationTab--tab {
  font-size: 12px !important;
}
.selected-tab {
  background-color: red;
}
.v-tab:hover {
  background-color: white !important;
}
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { projectsModule, tabsModule } from '@/store/store'
import { PProject, PTab, PTabHistoryKind } from '@/@types/piledit'
import { remote } from 'electron'

const dialog = remote.dialog

@Component
export default class ApplicationTab extends Vue {
  get tabs () {
    return tabsModule.tabs
  }

  get tabsArray () {
    const tabsArr = []
    for (const tab in this.tabs) {
      tabsArr.push(tab)
    }
    return tabsArr
  }

  get currentViewingTabUuid () {
    return tabsModule.currentViewingTabUuid
  }

  get projects () {
    return projectsModule.projects
  }

  get currentViewingProjectUuid () {
    return projectsModule.currentViewingProjectUuid
  }

  async beforeMount () {
    if (Object.keys(this.tabs).length === 0) {
      const uuid = await tabsModule.init()
      await this.$router.push(`/${uuid}`)
    }
  }

  public getCurrentPath () {
    return this.$route.path
  }

  public updateCurrentViewingTabUuid (uuid: string) {
    tabsModule.updateCurrentViewingTabUuid({ uuid })
  }

  public getTitle (tab: PTab) {
    const historyIndex = tab.history.historyIndex
    return tab.history.historyContainer[historyIndex].title
  }

  public getUrl (tab: PTab) {
    const historyIndex = tab.history.historyIndex
    return tab.history.historyContainer[historyIndex].url
  }

  public async deleteTab (uuid: string) {
    const project: PProject = this.projects[this.currentViewingProjectUuid]
    const tab = this.tabs[uuid]
    const tabHistoryIndex = tab.history.historyIndex
    const isProjectHome = tab.history.historyContainer[tabHistoryIndex].kind === PTabHistoryKind.ProjectHome
    if (isProjectHome) {
      const options: Electron.MessageBoxSyncOptions = {
        type: 'question',
        title: project.name,
        message: `プロジェクト ${project.name} を保存しますか？`,
        detail: 'この時点での編集結果が保存されます。保存しない場合は破棄されます。',
        buttons: ['保存する', '保存しない'],
        cancelId: -1
      }
      const selectedOption = dialog.showMessageBoxSync(options)
      if (selectedOption === -1) {
        // escで選択をキャンセルしたらタブを消さない
        return
      } else if (selectedOption === 0) {
        // this.save()
        console.log('キャンセル')
      }
    }
    const tabsLen = Object.keys(this.tabs).length - 1
    let currentViewingTabIndex = 0
    for (const index in this.tabsArray) {
      if (this.tabsArray[index] === uuid) {
        break
      }
      currentViewingTabIndex++
    }
    if (tabsLen === 0) {
      const url = await tabsModule.init()
      this.$router.push(url)
      tabsModule.remove({ uuid })
    } else if (currentViewingTabIndex === 0 && uuid === this.currentViewingTabUuid) {
      // 消したタブが0番目のタブの場合
      const nextTabUuid = this.tabsArray[currentViewingTabIndex + 1]
      const nextTabHistory = this.tabs[nextTabUuid].history
      const url = nextTabHistory.historyContainer[nextTabHistory.historyIndex].url
      this.$router.push(url)
      tabsModule.removeOwn({ tabUuid: uuid, nextTabUuid })
    } else if (uuid === this.currentViewingTabUuid) {
      const nextTabUuid = this.tabsArray[currentViewingTabIndex - 1]
      const nextTabHistory = this.tabs[nextTabUuid].history
      const url = nextTabHistory.historyContainer[nextTabHistory.historyIndex].url
      this.$router.push(url)
      tabsModule.removeOwn({ tabUuid: uuid, nextTabUuid })
    } else {
      tabsModule.remove({ uuid })
    }
    if (isProjectHome) {
      for (const tabUuid in this.tabs) {
        const tab: PTab = this.tabs[tabUuid]
        const tabHistoryIndex = tab.history.historyIndex
        const projectUuid = tab.history.historyContainer[tabHistoryIndex].projectUuid
        if (projectUuid === this.currentViewingProjectUuid) {
          tabsModule.remove({ uuid: tab.uuid })
        }
      }
      const tabsLen = Object.keys(this.tabs).length - 1
      if (tabsLen === 0) {
        const url = await tabsModule.init()
        this.$router.push(url)
      } else {
        const nextTabUuid = this.tabsArray[currentViewingTabIndex - 1]
        const nextTabHistory = this.tabs[nextTabUuid].history
        const url = nextTabHistory.historyContainer[nextTabHistory.historyIndex].url
        this.$router.push(url)
      }
    }
  }

  public backwardDisabled () {
    const tab = this.tabs[this.currentViewingTabUuid]
    return tab.history.historyIndex === 0
  }

  public forwardDisabled () {
    const tab = this.tabs[this.currentViewingTabUuid]
    return tab.history.historyContainer.length - 1 === tab.history.historyIndex
  }

  public forward () {
    tabsModule.forward()
    const tab = this.tabs[this.currentViewingTabUuid]
    const url = tab.history.historyContainer[tab.history.historyIndex].url
    this.$router.push(url)
  }

  public backward () {
    tabsModule.backward()
    const tab = this.tabs[this.currentViewingTabUuid]
    const url = tab.history.historyContainer[tab.history.historyIndex].url
    this.$router.push(url)
  }

  public toHome () {
    const tabUuid = this.currentViewingTabUuid
    const url = `/${tabUuid}`
    tabsModule.addPage({ kind: PTabHistoryKind.General, projectUuid: '', title: '新しいタブ', url })
    this.$router.push(url)
  }

  public async addTab () {
    const uuid = await tabsModule.init()
    await this.$router.push(`/${uuid}`)
  }
}
</script>
