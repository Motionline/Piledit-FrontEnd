<template>
  <v-content>
    <v-container>
      <v-file-input @change="loadImage">画像読み込み</v-file-input>
      <p>元画像path: {{ path }}</p>
      <v-text-field label="処理後path" v-model="afterPath"></v-text-field>
      <v-btn @click="grayscale">グレースケール</v-btn>
    </v-container>
  </v-content>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Home',
  components: {
  },
  data () {
    return {
      path: '',
      afterPath: ''
    }
  },
  methods: {
    loadImage ($event) {
      this.path = $event.path
      this.afterPath = this.path
    },
    grayscale () {
      const path = this.replaceSlashToColon(this.path)
      const afterPath = this.replaceSlashToColon(this.afterPath)
      axios.get(`http://localhost:8000/grayscale/${path}/${afterPath}`)
    },
    replaceSlashToColon (path) {
      return path.replace(/\//g, ':')
    }
  }
}
</script>
