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
import { tabsModule } from '@/store/store'
import { PTab, PTabHistoryKind } from '@/@types/piledit'

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
    return tab.history.historyContainer[historyIndex][1]
  }

  public getUrl (tab: PTab) {
    const historyIndex = tab.history.historyIndex
    return tab.history.historyContainer[historyIndex][2]
  }

  public deleteTab (uuid: string) {
    if (uuid === this.currentViewingTabUuid) {
      const len = Object.keys(this.tabs).length - 2
      const tuuid = this.tabsArray[len]
      const thistory = this.tabs[tuuid].history
      const url = thistory.historyContainer[thistory.historyIndex][2]
      this.$router.push(url)
      tabsModule.removeOwn({ tabUuid: uuid, nextTabUuid: tuuid })
    } else {
      tabsModule.remove({ uuid })
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
    const url = tab.history.historyContainer[tab.history.historyIndex][2]
    console.log(url)
    this.$router.push(url)
  }

  public backward () {
    tabsModule.backward()
    const tab = this.tabs[this.currentViewingTabUuid]
    const url = tab.history.historyContainer[tab.history.historyIndex][2]
    console.log(url)
    this.$router.push(url)
  }

  public toHome () {
    const tabUuid = this.currentViewingTabUuid
    const url = `/${tabUuid}`
    tabsModule.addPage({ kind: PTabHistoryKind.General, title: '新しいタブ', url })
    this.$router.push(url)
  }

  public async addTab () {
    const uuid = await tabsModule.init()
    await this.$router.push(`/${uuid}`)
  }
}
</script>
