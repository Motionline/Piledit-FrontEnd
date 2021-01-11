<template>
  <div id="Home">
    <h1>Pileditへようこそ</h1>
    <v-btn @click="toNewProject">新規プロジェクト</v-btn>
    <v-btn>プロジェクトを開く</v-btn>
    <p>アカウント設定</p>
    <v-btn>アカウント作成</v-btn>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { tabsModule } from '@/store/store'

@Component({
// ずっとエラー起こるから解決したら使う
//   head: {
//     script: [
//       { type: 'text/javascript', src: '@/assets/adobefont.js', async: true }
//     ]
//   }
})
export default class Home extends Vue {
  toNewProject () {
    const uuid = tabsModule.currentViewingTabUuid
    const url = `/${uuid}/projects/new`
    this.$router.push(url)
    tabsModule.addPage({ title: 'プロジェクトを作成する', url })
  }
}
</script>

<style scoped lang="scss">
#Home {
  background-color: #203744;
  color: white;
  height: 100vh;

  h1 {
    font-family: a-otf-futo-go-b101-pr6n, sans-serif;
    font-weight: bold;
  }
}
</style>
