<template>
  <div id="Home">
    <h3>全てのコンポーネント</h3>
    <div v-for="(_, uuid) in components" :key="uuid">
      <v-btn @click="openComponentEditor(uuid)">{{ uuid }}を開く</v-btn>
    </div>
    <TimeLineComponent :clips="clips" :components="components" />
  </div>
</template>

<style scoped>
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { componentsModule, clipsModule, blocksModule, tabsModule } from '@/store/store'
import TimeLineComponent from '@/components/Templates/Timeline.vue'
import fs from 'fs'
import { app } from 'electron'

@Component({
  components: {
    TimeLineComponent
  }
})
export default class TimeLine extends Vue {
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
