<template>
  <div id="Home">
    <ComponentsEditor :tab-uuid="tabUuid" />
  </div>
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator'
import ComponentsEditor from '@/components/Templates/ComponentsEditor.vue'

@Component({
  components: {
    ComponentsEditor
  }
})
export default class ComponentsEdit extends Vue {
  public tabUuid = this.$route.params.tabUuid

  @Watch('$route')
  onUrlsChanged (newRoute: any, _: any) {
    this.tabUuid = newRoute.params.uuid
  }
}
</script>

<style lang="scss">
#Home {
  height: 100%;
}
</style>
