<template>
  <div class="verifyElectricSignature">
    <h1>改竄チェックする</h1>
    <p>あなたが作成したコンポーネントが第三者に改竄されているかどうかを確かめます</p>
    <v-form class="verifyElectricSignature__form">
      <v-alert type="error" dense outlined v-show="tampering">第三者に改竄されています。</v-alert>
      <v-alert type="info" dense outlined v-show="notTampering">改竄されていません。</v-alert>
      <v-text-field label="署名を入力する" color="#898989" outlined v-model="verifyToken"></v-text-field>
      <v-btn @click="verify" outlined rounded color="#898989">検証</v-btn>
    </v-form>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { signaturesModule } from '@/store/store'
import fs from 'fs'
import { remote } from 'electron'

@Component({})
export default class VerifyElectricSignature extends Vue {
  public verifyToken = ''
  // 検証後に代入されます
  public tampering = false
  public notTampering = false

  public async verify () {
    this.tampering = this.notTampering = false
    fs.readFile(remote.app.getAppPath() + '/.key', 'utf-8', async (err, data) => {
      if (err) throw err
      const res = await signaturesModule.verifyComponentSignature({ key: data, jwt: this.verifyToken })
      if (res) {
        this.notTampering = true
      } else {
        this.tampering = true
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.verifyElectricSignature {
  padding: 50px;
  font-family: tbchibirgothicplusk-pro, sans-serif;
  font-style: normal;

  &__form {
    padding-top: 40px;
  }
}
</style>
