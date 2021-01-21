<template>
  <div id="piledit-store">
    <h1>ストア</h1>
    <h2>コンポーネントをダウンロードする</h2>
    <p>ストアに公開されているコンポーネントをダウンロードできます</p>
    <ul>
      <li v-for="(component, uuid, index) in components" :key="`${index}-${uuid}`">
        {{ component.defaultName }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { pStoresModule } from '@/store/store'

@Component({})
export default class PileditStore extends Vue {
  get components () {
    return pStoresModule.components
  }

  public mounted () {
    pStoresModule.getComponentsFromFireStore()
  }
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
