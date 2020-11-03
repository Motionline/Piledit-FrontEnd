<template>
  <v-tabs vertical>
    <v-tab to="/">
      Home
    </v-tab>
    <v-tab to="/components_edit">
      コンポーネントエディタ
    </v-tab>
    <v-tab
      v-for="(window, key) in windows"
      :key="key"
      :to="getUrl(window)"
    >
      {{ window.uuid }}
    </v-tab>
    {{ uuid1 }}
    <v-btn @click="addWindow">test</v-btn>
    <v-text-field v-model="uuid1"></v-text-field>
    <v-btn @click="deleteWindow">delete</v-btn>
  </v-tabs>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { windowsModule } from '@/store/Modules/Windows'
import { PileditWindow } from '@/@types/piledit'

@Component
export default class ApplicationTab extends Vue {
  public uuid1 = ''

  get windows () {
    return windowsModule.windows
  }

  public getUrl (pileditWindow: PileditWindow) {
    if (pileditWindow.windowType === 'test') {
      return '/components_edit'
    }
  }

  public addWindow () {
    const context = {
      windowType: 'test'
    }
    windowsModule.add(context)
  }

  public deleteWindow () {
    const context = {
      uuid: this.uuid1
    }
    windowsModule.remove(context)
  }
}
</script>

<style scoped>

</style>
