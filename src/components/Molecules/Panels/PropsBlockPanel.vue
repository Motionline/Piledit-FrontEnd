<template>
  <div class="propsBlockPanel">
    <h3>Propsセクションブロック</h3>
    <v-form class="propsBlockPanel__form">
      <p>props</p>
    </v-form>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Emit, Vue } from 'vue-property-decorator'
import { TPropBlock } from '@/@types/piledit'

@Component
export default class PropBlockPanel extends Vue {
  @Prop({ required: true })
  public block!: TPropBlock

  public mounted () {
    console.log('mounted props')
  }
}
</script>

<style scoped lang="scss">
.propsBlockPanel {
  color: #898989;
  font-family: tbchibirgothicplusk-pro, sans-serif;
  font-style: normal;
  padding: 20px 30px;

  &__form {
    padding-top: 30px;
  }
}
</style>
