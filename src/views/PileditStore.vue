<template>
  <div id="piledit-store">
    <h1>ストア</h1>
    <h2>コンポーネントをダウンロードする</h2>
    <p>ストアに公開されているコンポーネントをダウンロードできます</p>
    <v-card v-for="(component, uuid, index) in components" :key="`${index}-${uuid}`">
      <v-card-title>{{ component.name || component.defaultName }}</v-card-title>
      <v-card-subtitle>{{ component.uuid }}</v-card-subtitle>
      <v-card-text>コンポーネント</v-card-text>
      <v-card-actions>
        <v-btn :disabled="disabledDownloadButton[uuid]" @click="download(component)">
          ダウンロードする
        </v-btn>
        <v-snackbar
            v-model="showErrorSnackbar[uuid]"
            shaped
        >
          既にダウンロード済みのコンポーネントのようです。
          <template v-slot:action="{ attrs }">
            <v-btn
                color="white"
                text
                v-bind="attrs"
                @click="showErrorSnackbar[uuid] = false"
            >
              閉じる
            </v-btn>
          </template>
        </v-snackbar>
        <v-snackbar
            v-model="showSuccessSnackbar[uuid]"
            shaped
        >
          コンポーネント「{{ component.defaultName }}」をダウンロードしました！
          <template v-slot:action="{ attrs }">
            <v-btn
                color="white"
                text
                v-bind="attrs"
                @click="showSuccessSnackbar[uuid] = false"
            >
              閉じる
            </v-btn>
          </template>
        </v-snackbar>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { pStoresModule, componentsModule } from '@/store/store'
import { PComponent } from '@/@types/piledit'

@Component({})
export default class PileditStore extends Vue {
  public disabledDownloadButton: { [key: string]: boolean } = {}
  public showSuccessSnackbar: { [key: string]: boolean } = {}
  public showErrorSnackbar: { [key: string]: boolean } = {}
  get components () {
    return pStoresModule.components
  }

  public beforeMount () {
    pStoresModule.getComponentsFromFireStore()
    for (const uuid of Object.keys(this.components)) {
      this.isAlreadyDownloaded(uuid)
    }
  }

  public async download (component: PComponent) {
    try {
      await componentsModule.addGlobal({ component })
      this.$set(this.showSuccessSnackbar, component.uuid, true)
      this.$set(this.disabledDownloadButton, component.uuid, true)
    } catch (e) {
      this.$set(this.showErrorSnackbar, component.uuid, true)
    }
  }

  public async isAlreadyDownloaded (uuid: string) {
    const disabled = await componentsModule.isAlreadyDownloaded({ uuid })
    this.$set(this.disabledDownloadButton, uuid, disabled)
  }
}
</script>

<style scoped>
#piledit-store {
  color: #898989;
  font-family: tbchibirgothicplusk-pro, sans-serif;
  font-weight: bold;
  font-style: normal;
  padding: 50px;
}
</style>
