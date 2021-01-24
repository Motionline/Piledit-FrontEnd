<template>
  <v-dialog :value="magicProjectDialog" @click:outside.prevent="turnOffMagicProjectDialog">
    <v-card>
      <v-card-title>Magic Project</v-card-title>
      <v-card-text>
        Magic Projectは、データをインターネットに公開し、複数人で同時編集できる機能です。<br />
        友人に次のトークンを共有して、ワクワクするような編集を体験しよう！<br/>
      </v-card-text>
      <v-card-text>
        <v-text-field
            readonly
            outlined
            dense
            color="#898989"
            label="トークン"
            :value="token"
            append-icon="mdi-content-copy"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="copyToken">コピーする</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'

@Component({})
export default class MagicProjectDialog extends Vue {
  @Prop({ required: true })
  public magicProjectDialog: boolean

  @Prop({ required: true })
  public token: string

  @Emit('turnOffMagicProjectDialog')
  public turnOffMagicProjectDialog () {
    return true
  }

  @Emit('copyToken')
  public copyToken () {
    return this.token
  }
}
</script>

<style scoped>

</style>
