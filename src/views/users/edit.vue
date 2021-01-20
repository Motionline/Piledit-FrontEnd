<template>
  <div id="userEdit">
    <h1>ユーザーの編集</h1>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { DB } from '@/firebase/db'

@Component
export default class UserEdit extends Vue {
}
</script>

<style scoped>
#userEdit {
  font-family: tbchibirgothicplusk-pro, sans-serif;
  font-style: normal;
  color: #898989;
}
</style>
