<template>
  <h1>ログインする</h1>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator'
import { Auth } from '@/firebase/auth'
import { tabsModule } from '@/store/store'

export default class Login extends Vue {
  public email = ''
  public password = ''
  public errors: object[]

  get tabs () {
    return tabsModule.tabs
  }

  get currentViewingTabUuid () {
    return tabsModule.currentViewingTabUuid
  }

  public login (event: any) {
    Auth.signInWithEmailAndPassword(this.email, this.password)
      .then(() => this.$router.push(`/${this.tabs[this.currentViewingTabUuid]}`))
      .catch(err => this.errors.push(err.message))
  }
}
</script>

<style scoped>

</style>
