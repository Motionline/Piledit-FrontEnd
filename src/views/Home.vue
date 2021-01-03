<template>
  <div id="Home">
    <h1>Pileditへようこそ</h1>
    <v-btn>新規プロジェクト</v-btn>
    <v-btn>プロジェクトを開く</v-btn>
    <p>アカウント設定</p>
    <v-btn>アカウント作成</v-btn>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Home extends Vue {
}
</script>

<style scoped lang="scss">
#Home {
  background-color: #203744;
  color: white;
  height: 100vh;
}
</style>
