<template>
  <v-tabs vertical hide-slider color="black" grow align-with-title left>
    <v-tab to="/" :ripple="false" class="applicationTab--tab">
      タイムライン
    </v-tab>
    <v-tab
      v-for="(tab, key) in tabs"
      :key="key"
      :to="getUrl(tab)"
      :ripple="false"
      @click="updateCurrentViewingTabUuid(tab.uuid)"
      class="applicationTab--tab"
    >
      {{ getText(tab) }}
      <v-btn
        icon
        x-small
        @click.prevent="deleteTab(tab.uuid)"
        :ripple="false"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-tab>
  </v-tabs>
</template>

<style lang="scss">
.applicationTab--tab {
  height: 30px !important;
  font-size: 12px !important;
}
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { tabsModule } from '@/store/Modules/Tabs'
import { PTab } from '@/@types/piledit'

@Component
export default class ApplicationTab extends Vue {
  get tabs () {
    return tabsModule.tabs
  }

  get currentViewingTabUuid () {
    return tabsModule.currentViewingTabUuid
  }

  mounted () {
    if (this.$route.path !== '/') {
      this.$router.push('/')
    }
  }

  public updateCurrentViewingTabUuid (uuid: string) {
    tabsModule.updateCurrentViewingTabUuid({ uuid })
  }

  public getUrl (tab: PTab) {
    const name = tab.name
    if (name === 'componentsEditor') {
      return `/components_edit/${tab.uuid}`
    }
  }

  public getText (tab: PTab) {
    const name = tab.name
    if (name === 'componentsEditor') {
      return 'コンポーネントエディタ'
    }
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
}
</script>
