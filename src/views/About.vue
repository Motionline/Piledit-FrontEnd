<template>
  <div id="About">
    <img src="@/assets/piledit.png" width="500px" />
    <h1>About</h1>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator'

export default class About extends Vue {
}
</script>

<style scoped>
#About {
  color: #898989;
  font-family: tbchibirgothicplusk-pro, sans-serif;
  font-weight: bold;
  font-style: normal;
}
</style>
