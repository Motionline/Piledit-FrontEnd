<template>
  <v-dialog :value="showNewTemplateDialog" @click:outside.prevent="turnOffDialog">
    <v-card rounded>
      <v-card-title>テンプレートを作成する</v-card-title>
      <v-card-text>
        現在のプロジェクトを基にテンプレートを作成することができます。<br />
        テンプレートを用いてプロジェクトを開始することで、何度も作成するような動画の編集作業を楽にできます。
      </v-card-text>
      <v-card-text v-show="errorCreatingTemplateMessage">
        <v-alert type="error" dense outlined>
          空プロジェクトからテンプレートを作成することはできません。
          最低1つ以上のコンポーネントまたはクリップを設置してください。
        </v-alert>
      </v-card-text>
      <v-card-text>
        <v-form>
          <v-text-field label="テンプレート名" outlined color="#898989" v-model="templateName"></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="turnOffDialog">閉じる</v-btn>
        <v-btn @click="createTemplate" :disabled="templateName === ''">作成する</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'

@Component({})
export default class NewTemplateDialog extends Vue {
  @Prop({ required: true })
  public showNewTemplateDialog: boolean

  @Prop({ required: true })
  public errorCreatingTemplateMessage = false

  public templateName = ''

  @Emit('turnOffDialog')
  public turnOffDialog () {
    return true
  }

  @Emit('createTemplate')
  public createTemplate () {
    return true
  }
}
</script>

<style scoped>

</style>
