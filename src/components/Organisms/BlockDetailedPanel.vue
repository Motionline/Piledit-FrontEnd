<template>
  <div class="BlockDetailedPanel">
    <p>詳細</p>
    <v-text-field label="設定だとか云々"></v-text-field>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class BlockDetailedPanel extends Vue {

}
</script>

<style scoped>
.BlockDetailedPanel {
  border: 2px solid black;
  width: 100%;
  height: 40vh;
}
</style>
