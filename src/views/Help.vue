<template>
  <div class="help">
    <h1>ヘルプ</h1>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({})
export default class Help extends Vue {
}
</script>

<style scoped lang="scss">
.help {
  font-family: tbchibirgothicplusk-pro, sans-serif;
  font-style: normal;
  color: #898989;
  padding: 50px;
}
</style>
