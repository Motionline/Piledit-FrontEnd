<template>
  <div id="Home">
    {{ components }}
    {{ blocks }}
    <ComponentsEditor :tab-uuid="tabUuid" />
  </div>
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator'
import ComponentsEditor from '@/components/Templates/ComponentsEditor.vue'
import { blocksModule } from '@/store/Modules/Blocks'
import { componentsModule } from '@/store/Modules/Components'

@Component({
  components: {
    ComponentsEditor
  }
})
export default class ComponentsEdit extends Vue {
  public tabUuid = this.$route.params.uuid

  get blocks () {
    return blocksModule.blocks
  }

  get components () {
    return componentsModule.components
  }

  @Watch('$route')
  onUrlsChanged (newRoute: any, _: any) {
    this.tabUuid = newRoute.params.uuid
  }
}
</script>
