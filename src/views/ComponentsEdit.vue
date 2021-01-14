<template>
  <div id="Home">
    <ComponentsEditor :component-uuid="componentUuid" />
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

  @Watch('$route')
  onUrlsChanged (newRoute: any, _: any) {
    this.componentUuid = newRoute.params.componentUuid
  }
}
</script>

<style lang="scss">
#Home {
  height: 100%;
}
</style>
