<template>
  <div id="Home">
    <h3>全てのコンポーネント</h3>
    <div v-for="(_, uuid) in filteredComponents()" :key="uuid">
      <v-btn @click="openComponentEditor(uuid)">{{ getComponentName(uuid) }}を開く</v-btn>
    </div>
    <TimeLineComponent :clips="clips" :components="components" />
  </div>
</template>

<style scoped>
</style>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { componentsModule, clipsModule, blocksModule, tabsModule } from '@/store/store'
import TimeLineComponent from '@/components/Templates/Timeline.vue'
import fs from 'fs'
import { app } from 'electron'
import { PComponents } from '@/@types/piledit'

@Component({
  components: {
    TimeLineComponent
  }
})
export default class TimeLine extends Vue {
  public tabUuid = this.$route.params.tabUuid
  public projectUuid = this.$route.params.projectUuid

  @Watch('$route')
  onUrlsChanged (newRoute: any, _: any) {
    this.tabUuid = newRoute.params.tabUuid
    this.projectUuid = newRoute.params.projectUuid
  }

  public filteredComponents () {
    const filtered: PComponents = {}
    for (const [key, value] of Object.entries(this.components)) {
      if (value.projectUuid === this.projectUuid) {
        filtered[key] = value
      }
    }
    return filtered
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

  public addClip (uuid: string) {
    clipsModule.add(uuid)
  }

  public async openComponentEditor (uuid: string) {
    const url = await tabsModule.addComponentsEditorTab(uuid)
    this.$router.push(url)
  }

  public getComponentName (componentUuid: string) {
    const component = this.components[componentUuid]
    return component.name === '' ? component.defaultName : component.name
  }

  public outputMovieConfigurationFile () {
    for (const key of Object.keys(this.clips)) {
      const clip = this.clips[key]
      const appPath = app.getAppPath()
      const path = appPath + '/JSON'
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path)
      }
      fs.writeFileSync(
        `${path}/${key}.json`,
        JSON.stringify({
          Frame: {
            Begin: clip.position.x,
            End: clip.position.x + clip.width,
            Length: clip.width
          }
        }, undefined, 2), 'utf-8')
    }
  }
}
</script>
