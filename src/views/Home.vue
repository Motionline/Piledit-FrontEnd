<template>
  <div id="Home">
    <ApplicationTab />
    <h2>タイムライン(svgで作る)</h2>
    <v-btn @click="outputMovieConfigurationFile">出力する</v-btn>
    <h3>全てのコンポーネント</h3>
    <div v-for="(_, key) in allComponents" :key="key">
      <v-btn @click="addComponentObject({ payload: { key } })">{{ key }}</v-btn>
    </div>
    <Timeline :componentObjects="componentObjects" />
  </div>
</template>

<style scoped>
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { componentsModule } from '@/store/Modules/Components'
import { timelineModule } from '@/store/Modules/Timeline'
import Timeline from '@/components/Templetes/Timeline.vue'
import ApplicationTab from '@/components/Organisms/ApplicationTab.vue'
import * as fs from 'fs'
import electron from 'electron'
const app = electron.remote.app
@Component({
  components: {
    Timeline,
    ApplicationTab
  }
})
export default class Home extends Vue {
  get allComponents () {
    return componentsModule.allComponents
  }

  get componentObjects () {
    return timelineModule.componentObjects
  }

  // public addComponentObject ({ payload }) {
  //   this.$store.dispatch('Timeline/add', payload)
  // }

  public outputMovieConfigurationFile () {
    for (const key of Object.keys(this.componentObjects)) {
      const componentObject = this.componentObjects[key]
      const path = `${app.getAppPath()}/JSON`
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path)
      }
      fs.writeFileSync(
        `${path}/${key}.json`,
        JSON.stringify({
          Frame: {
            Begin: componentObject.position.x,
            End: componentObject.position.x + componentObject.width,
            Length: componentObject.width
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
