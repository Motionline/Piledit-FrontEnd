<template>
  <div id="userEdit">
    <h1>ユーザーの編集</h1>
    <v-form @submit.prevent="update">
      <v-text-field label="ユーザーネーム" v-model="name" />
      <v-btn type="submit">更新する</v-btn>
    </v-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { usersModule } from '@/store/store'

@Component
export default class UserEdit extends Vue {
  public name = ''

  public mounted () {
    this.name = usersModule.name
  }

  public update () {
    usersModule.updateUserName({ name: this.name })
  }
}
</script>

<style scoped>
#userEdit {
  font-family: tbchibirgothicplusk-pro, sans-serif;
  font-style: normal;
  color: #898989;
}
</style>
