<template>
  <div class="propBlockPanel">
    <h3>Prop定義ブロック</h3>
    <v-form class="propBlockPanel__form">
      <v-text-field
          label="Prop名"
          :value="propName"
          @change="changePropName($event)"
          outlined
          color="#898989"
      />
      <v-select
          v-model="selectedPropTypeItem"
          :menu-props="{ bottom: true, offsetY: true }"
          label="Propの型"
          outlined
          color="#898989"
          return-object
          :items="propTypeItem"
      ></v-select>
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

  public propTypeItem = [
    { text: '動画パス', value: 'moviePath' }
  ]

  public selectedPropTypeItem = { text: '動画パス', value: 'moviePath' }

  public mounted () {
    if (this.block.propName != null) {
      this.propName = this.block.propName
    } else {
      this.propName = ''
    }
  }

  public propName = ''

  @Emit('updateBlock')
  public changePropName (_propName: string) {
    this.propName = _propName
    // メモ: propsを直接操作しないため
    return {
      ...this.block,
      propName: _propName
    }
  }
}
</script>

<style scoped lang="scss">
.propBlockPanel {
  color: #898989;
  font-family: tbchibirgothicplusk-pro, sans-serif;
  font-style: normal;
  padding: 20px 30px;

  &__form {
    padding-top: 30px;
  }
}
</style>
