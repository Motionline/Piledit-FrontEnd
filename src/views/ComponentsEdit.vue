<template>
  <div id="Home">
    <ComponentsEditor
        :component-uuid="componentUuid"
        :tab-uuid="tabUuid"
        :project-uuid="projectUuid"
    />
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
  public projectUuid = this.$route.params.projectUuid

  @Watch('$route')
  onUrlsChanged (newRoute: any, _: any) {
    this.componentUuid = newRoute.params.componentUuid
    this.tabUuid = newRoute.params.tabUuid
    this.projectUuid = newRoute.params.projectUuid
  }
}
</script>

<style lang="scss">
#Home {
  height: calc(100vh - 96px);
}
</style>
