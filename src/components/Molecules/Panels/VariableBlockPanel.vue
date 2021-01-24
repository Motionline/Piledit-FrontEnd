<template>
  <div class="variableBlockPanel">
    <h3>変数定義ブロック</h3>
    <v-form class="variableBlockPanel__form">
      <p>変数</p>
    </v-form>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Emit, Vue } from 'vue-property-decorator'
import { TVariableBlock } from '@/@types/piledit'

@Component
export default class VariableBlockPanel extends Vue {
  @Prop({ required: true })
  public block!: TVariableBlock

  public mounted () {
    console.log('mounted variable block')
  }
}
</script>

<style scoped lang="scss">
.variableBlockPanel {
  color: #898989;
  font-family: tbchibirgothicplusk-pro, sans-serif;
  font-style: normal;
  padding: 20px 30px;

  &__form {
    padding-top: 30px;
  }
}
</style>
