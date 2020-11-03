<template>
  <v-tabs vertical>
    <v-tab
      v-for="(window, key) in windows"
      :key="key"
      :to="getUrl(window)"
      :ripple="false"
    >
      {{ getText(window) }}
      <v-btn
        icon
        x-small
        @click.prevent="deleteWindow(window.uuid)"
        :ripple="false"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-tab>
  </v-tabs>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { windowsModule } from '@/store/Modules/Windows'
import { PileditWindow } from '@/@types/piledit'

@Component
export default class ApplicationTab extends Vue {
  get windows () {
    return windowsModule.windows
  }

  mounted () {
    const tabsCount = Object.keys(windowsModule.windows).length
    if (tabsCount === 0) {
      windowsModule.add({ windowType: 'TimeLine' })
    }
  }

  public getUrl (pileditWindow: PileditWindow) {
    const windowType = pileditWindow.windowType
    if (windowType === 'TimeLine') {
      return '/'
    } else if (pileditWindow.windowType === 'componentsEditor') {
      return '/components_edit'
    }
  }

  public getText (pileditWindow: PileditWindow) {
    const windowType = pileditWindow.windowType
    if (windowType === 'TimeLine') {
      return 'タイムライン'
    } else if (pileditWindow.windowType === 'componentsEditor') {
      return 'コンポーネントエディタ'
    }
  }

  public addWindow () {
    const context = {
      windowType: 'test'
    }
    windowsModule.add(context)
  }

  public deleteWindow (uuid: string) {
    const context = {
      uuid
    }
    windowsModule.remove(context)
  }
}
</script>

<style scoped>

</style>
