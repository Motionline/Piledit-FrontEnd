<template>
  <div>
    <p>新しくプロジェクトを作成する</p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  head: {
    script: [
      { type: 'text/javascript', src: '@/assets/adobefont.js', async: true }
    ]
  }
})
export default class NewProject extends Vue {
}
</script>

<style scoped>

</style>
