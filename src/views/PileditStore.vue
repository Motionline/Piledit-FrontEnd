<template>
  <div id="piledit-store">
    <h1>ストア</h1>
    <v-form>
      <h2>コンポーネントをダウンロードする</h2>
      <p>ストアに公開されているコンポーネントをダウンロードできます</p>
    </v-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { pStoresModule } from '@/store/store'

@Component({})
export default class PileditStore extends Vue {

}
</script>

<style scoped>
#piledit-store {
  color: #898989;
  font-family: tbchibirgothicplusk-pro, sans-serif;
  font-weight: bold;
  font-style: normal;
}
</style>
