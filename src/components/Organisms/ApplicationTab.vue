<template>
  <v-tabs vertical hide-slider light>
    <v-tab
      v-for="(tab, key) in tabs"
      :key="key"
      :to="getUrl(tab)"
      :ripple="false"
    >
      {{ getText(tab) }}
      <v-btn
        icon
        x-small
        @click.prevent="deleteWindow(tab.uuid)"
        :ripple="false"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-tab>
  </v-tabs>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { tabsModule } from '@/store/Modules/Tabs'
import { Tab } from '@/@types/piledit'

@Component
export default class ApplicationTab extends Vue {
  get tabs () {
    return tabsModule.tabs
  }

  mounted () {
    const tabsCount = Object.keys(tabsModule.tabs).length
    if (tabsCount === 0) {
      tabsModule.add({ name: 'TimeLine' })
    }
  }

  public getUrl (tab: Tab) {
    const name = tab.name
    if (name === 'TimeLine') {
      return '/'
    } else if (name === 'componentsEditor') {
      return `/components_edit/${tab.uuid}`
    }
  }

  public getText (tab: Tab) {
    const name = tab.name
    if (name === 'TimeLine') {
      return 'タイムライン'
    } else if (name === 'componentsEditor') {
      return 'コンポーネントエディタ'
    }
  }

  public addWindow () {
    const context = {
      name: 'test'
    }
    tabsModule.add(context)
  }

  public deleteWindow (uuid: string) {
    const context = {
      uuid
    }
    tabsModule.remove(context)
  }
}
</script>
