<template>
  <v-app id="app" class="ma-0 pa-0" v-cloak>
    <application-tab />
    <router-view />
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import ApplicationTab from '@/components/Organisms/ApplicationTab.vue'
import { remote } from 'electron'
import { MenuMixin } from '@/mixin/menu'
const Menu = remote.Menu

@Component({
  components: { ApplicationTab }
})
export default class App extends Vue {
}
</script>

<style lang="scss">
html {
  visibility: hidden;
}
html.wf-active {
  visibility: visible;
}
</style>
