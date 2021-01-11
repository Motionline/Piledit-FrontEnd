<template>
  <div style="height:100%;">
    <p>新しくプロジェクトを作成する</p>
    <v-text-field placeholder="プロジェクト名" v-model="name"></v-text-field>
    <v-btn @click="newProject" :disabled="canSubmit()">作成する</v-btn>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { projectsModule, tabsModule } from '@/store/store'
import { PTabHistoryKind } from '@/@types/piledit'

@Component({
  // head: {
  //   script: [
  //     { type: 'text/javascript', src: '@/assets/adobefont.js', async: true }
  //   ]
  // }
})
export default class NewProject extends Vue {
  public name = ''

  public async newProject () {
    const projectUuid = await projectsModule.add({ name: this.name })
    const tabUuid = tabsModule.currentViewingTabUuid
    const url = `/${projectUuid}/projects/${tabUuid}`
    await this.$router.push(url)
    tabsModule.addPage({ kind: PTabHistoryKind.Projects, title: this.name, url })
  }

  public canSubmit () {
    return this.name === ''
  }
}
</script>

<style scoped>

</style>
