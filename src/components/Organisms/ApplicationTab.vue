<template>
  <v-tabs vertical>
    <v-tab to="/">
      Home
    </v-tab>
    <v-tab to="/components_edit">
      コンポーネントエディタ
    </v-tab>
  </v-tabs>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component
export default class ApplicationTab extends Vue {
}
</script>

<style scoped>

</style>
