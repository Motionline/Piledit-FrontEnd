<template>
  <div></div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { TDebugBlock } from '@/@types/piledit'

@Component
export default class DebugBlockPanel extends Vue {
 @Prop({ required: true })
 public block!: TDebugBlock

 // eslint-disable-next-line @typescript-eslint/no-empty-function
 public mounted () {}
}
</script>

<style scoped>

</style>
