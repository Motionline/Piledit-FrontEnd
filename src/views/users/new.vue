<template>
  <div id="register">
    <h1>アカウント登録する</h1>
    <v-form v-model="valid" novalidate @submit.prevent="signup">
      <ul class="errors">
        <li v-for="error in errors" :key="error" class="error">{{ error }}</li>
      </ul>
      <v-text-field v-model="email" label="メールアドレス" type="email" rounded outlined color="#898989" required />
      <v-text-field v-model="password" label="パスワード" type="password" rounded outlined color="#898989" required />
      <v-btn type="submit" outlined rounded color="#898989">登録する</v-btn>
    </v-form>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Auth } from '@/firebase/auth'
import { tabsModule } from '@/store/store'
import { PTabHistoryKind } from '@/@types/piledit'

@Component({})
export default class UserRegister extends Vue {
  public valid = false
  public email = ''
  public password = ''
  public errors: object[] = []

  get currentViewingTabUuid () {
    return tabsModule.currentViewingTabUuid
  }

  public signup () {
    Auth.createUserWithEmailAndPassword(this.email, this.password)
      .then(() => {
        const url = `/${this.currentViewingTabUuid}`
        tabsModule.routerPush({ url })
        tabsModule.addPage({
          kind: PTabHistoryKind.General,
          projectUuid: '',
          title: '新しいタブ',
          url
        })
      })
      .catch(err => this.errors.push(err.message))
  }
}
</script>

<style scoped>
#register {
  color: #898989;
  font-family: tbchibirgothicplusk-pro, sans-serif;
}
</style>
