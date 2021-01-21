<template>
  <div class="defineComponentBlockPanel">
    <h3>コンポーネント定義ブロック</h3>
    <v-form class="defineComponentBlockPanel__form">
      <v-text-field
          label="コンポーネント名"
          :value="componentName"
          @change="changeComponentName($event)"
          outlined
          color="#898989"
      ></v-text-field>
    </v-form>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Emit, Vue } from 'vue-property-decorator'
import { TDefineComponentBlock } from '@/@types/piledit'

@Component
export default class DefineComponentBlockPanel extends Vue {
  @Prop({ required: true })
  public block!: TDefineComponentBlock

  public mounted () {
    if (this.block.componentName != null) {
      this.componentName = this.block.componentName
    } else {
      this.componentName = ''
    }
  }

  public componentName = ''

  @Emit('updateBlock')
  public changeComponentName (_componentName: string) {
    this.componentName = _componentName
    // メモ: propsを直接操作しないため
    return {
      ...this.block,
      componentName: _componentName
    }
  }
}
</script>

<style scoped lang="scss">
.defineComponentBlockPanel {
  color: #898989;
  font-family: tbchibirgothicplusk-pro, sans-serif;
  font-style: normal;
  padding: 20px 30px;

  &__form {
    padding-top: 30px;
  }
}
</style>
