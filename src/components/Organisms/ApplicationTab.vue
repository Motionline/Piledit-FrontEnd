<template>
  <v-tabs vertical hide-slider align-with-title fixed-tabs color="red" grow>
    <v-tab to="/" :ripple="false">
      タイムライン
    </v-tab>
    <v-tab
      v-for="(tab, key) in tabs"
      :key="key"
      :to="getUrl(tab)"
      :ripple="false"
      @click="updateCurrentViewingTabUuid(tab.uuid)"
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
#applicationTab {
  text-align: left !important;
}
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { tabsModule } from '@/store/Modules/Tabs'
import { Tab } from '@/@types/piledit'

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

  public getUrl (tab: Tab) {
    const name = tab.name
    if (name === 'componentsEditor') {
      return `/components_edit/${tab.uuid}`
    }
  }

  public getText (tab: Tab) {
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
