<template>
  <div>
    <v-tabs color="black" left>
      <v-tab
          v-for="(tab, key) in tabs"
          :key="key"
          :to="getUrl(tab)"
          :ripple="false"
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
      <v-tab>
        <v-text-field></v-text-field>
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
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { tabsModule } from '@/store/store'
import { PTab } from '@/@types/piledit'

// tabs、ここでどうにか処理するのではなくて
// Storeの時点でリンクを持っておいて、よしなにするべきじゃないか
// しかも、historyも各自で持っておくと尚更良い
// 戻る + 進むを実装する

@Component
export default class ApplicationTab extends Vue {
  get tabs () {
    return tabsModule.tabs
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
    const context = {
      uuid
    }
    if (uuid === this.currentViewingTabUuid) {
      this.$router.push('/')
    }
    tabsModule.remove(context)
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
    const url = tab.history.historyContainer[tab.history.historyIndex][1]
    this.$router.push(url)
  }

  public backward () {
    tabsModule.backward()
    const tab = this.tabs[this.currentViewingTabUuid]
    const url = tab.history.historyContainer[tab.history.historyIndex][1]
    this.$router.push(url)
  }

  public async addTab () {
    const uuid = await tabsModule.init()
    await this.$router.push(`/${uuid}`)
  }
}
</script>
