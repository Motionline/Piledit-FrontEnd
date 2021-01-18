<template>
  <div id="Home">
    <ComponentsEditor :component-uuid="componentUuid" :tab-uuid="tabUuid" />
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
  public componentUuid = this.$route.params.componentUuid
  public tabUuid = this.$route.params.tabUuid

  @Watch('$route')
  onUrlsChanged (newRoute: any, _: any) {
    this.componentUuid = newRoute.params.componentUuid
    this.tabUuid = newRoute.params.tabUuid
  }
}
</script>

<style lang="scss">
#Home {
  height: calc(100vh - 96px);
}
</style>
