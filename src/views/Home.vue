<template>
  <div id="Home">
    <h2>タイムライン(svgで作る)</h2>
    <v-btn @click="outputBC"></v-btn>
    <v-btn @click="outputMovieConfigurationFile">出力する</v-btn>
    <h3>全てのコンポーネント</h3>
    <div v-for="(_, key) in components" :key="key">
      <v-btn @click="addBlockComponentObject(key)">{{ key }}</v-btn>
    </div>
    <Timeline :clips="clips" />
  </div>
</template>

<style scoped>
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { componentsModule } from '@/store/Modules/Components'
import { clipsModule } from '@/store/Modules/Clips'
import Timeline from '@/components/Templates/Timeline.vue'
import fs from 'fs'
import { app } from 'electron'
@Component({
  components: {
    Timeline
  }
})
export default class Home extends Vue {
  get components () {
    return componentsModule.components
  }

  get clips () {
    return clipsModule.clips
  }

  public outputBC () {
    console.log(this.components)
  }

  public addBlockComponentObject (uuid: string) {
    clipsModule.add(uuid)
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

<!--<template>-->
<!--  <v-content>-->
<!--    <v-container>-->
<!--      <v-file-input @change="loadImage">画像読み込み</v-file-input>-->
<!--      <p>元画像path: {{ path }}</p>-->
<!--      <v-text-field label="処理後path" v-model="afterPath"></v-text-field>-->
<!--      <v-btn @click="grayscale">グレースケール</v-btn>-->
<!--    </v-container>-->
<!--  </v-content>-->
<!--</template>-->

<!--<script>-->
<!--import axios from 'axios'-->
<!--import { app } from 'electron'-->
<!--export default {-->
<!--  name: 'Home',-->
<!--  components: {-->
<!--  },-->
<!--  data () {-->
<!--    return {-->
<!--      path: '',-->
<!--      afterPath: ''-->
<!--    }-->
<!--  },-->
<!--  methods: {-->
<!--    loadImage ($event) {-->
<!--      this.path = $event.path-->
<!--      this.afterPath = this.path-->
<!--      console.log(app.getAppPath())-->
<!--    },-->
<!--    grayscale () {-->
<!--      const path = this.replaceSlashToColon(this.path)-->
<!--      const afterPath = this.replaceSlashToColon(this.afterPath)-->
<!--      axios.get(`http://localhost:8000/grayscale/${path}/${afterPath}`)-->
<!--    },-->
<!--    replaceSlashToColon (path) {-->
<!--      return path.replace(/\//g, ':')-->
<!--    }-->
<!--  }-->
<!--}-->
<!--</script>-->
