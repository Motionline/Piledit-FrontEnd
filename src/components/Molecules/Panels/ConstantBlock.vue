<template>
  <div class="constantBlockPanel">
    <h3>定数定義ブロック</h3>
    <v-form class="constantBlockPanel__form">
      <p>定数</p>
    </v-form>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Emit, Vue } from 'vue-property-decorator'
import { TConstantBlock } from '@/@types/piledit'

@Component
export default class ConstantBlockPanel extends Vue {
  @Prop({ required: true })
  public block!: TConstantBlock

  public mounted () {
    console.log('mounted constant block')
  }
}
</script>

<style scoped lang="scss">
.constantBlockPanel {
  color: #898989;
  font-family: tbchibirgothicplusk-pro, sans-serif;
  font-style: normal;
  padding: 20px 30px;

  &__form {
    padding-top: 30px;
  }
}
</style>
