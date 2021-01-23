<template>
  <div class="magicOpen">
    <h1>Magic Projectにアクセスする</h1>
    <v-form class="magicOpen__form">
      <v-alert type="error" dense outlined v-show="errorConnectMagicProject">
        「{{ showInvalidToken }}」は不正なトークンです。
      </v-alert>
      <v-text-field color="#898989" label="トークンを入力" outlined v-model="token"></v-text-field>
      <v-btn :disabled="token === ''" @click="connect">接続</v-btn>
    </v-form>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { magicProjectsModule } from '@/store/store'

@Component
export default class MagicOpenProject extends Vue {
  public token = ''
  public showInvalidToken = ''
  public errorConnectMagicProject = false

  public async connect () {
    const isExist = await magicProjectsModule.isExistMagicProject({ uuid: this.token })
    if (!isExist) {
      this.errorConnectMagicProject = true
      this.showInvalidToken = this.token
    } else {
      await magicProjectsModule.connectMagicProject({ uuid: this.token })
    }
  }
}
</script>

<style scoped lang="scss">
.magicOpen {
  font-family: tbchibirgothicplusk-pro, sans-serif;
  font-style: normal;
  color: #898989;
  padding: 50px;

  &__form {
    margin-top: 40px;
  }
}
</style>
