<template>
  <v-snackbar
      :value="successCopyToken"
      @input="disappearSelfSnackbar"
      shaped
  >
    トークンをコピーしました！
    <template v-slot:action="{ attrs }">
      <v-btn
          color="white"
          text
          v-bind="attrs"
          @click="disappearSelfSnackbar"
      >
        閉じる
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'

@Component({})
export default class SuccessCopyTokenSnackbar extends Vue {
  @Prop({ required: true })
  public successCopyToken: boolean

  @Emit('disappearSelfSnackbar')
  public disappearSelfSnackbar () {
    return false
  }
}
</script>

<style scoped>

</style>
