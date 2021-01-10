<template>
  <div id="Home">
    <ApplicationTab />
    <ComponentsEditor :tab-uuid="tabUuid" />
  </div>
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator'
import ComponentsEditor from '@/components/Templates/ComponentsEditor.vue'
import ApplicationTab from '@/components/Organisms/ApplicationTab.vue'

@Component({
  components: {
    ComponentsEditor,
    ApplicationTab
  }
})
export default class ComponentsEdit extends Vue {
  public tabUuid = this.$route.params.uuid

  @Watch('$route')
  onUrlsChanged (newRoute: any, _: any) {
    this.tabUuid = newRoute.params.uuid
  }
}
</script>
