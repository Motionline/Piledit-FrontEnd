<template>
  <div class="learnIndex">
    <h1>Piledit チュートリアル</h1>
    <p>
      Pileditの概念について説明していきます。
    </p>
    <h2>Component</h2>
    <h2>Prop</h2>
    <p>
      コンポーネントはパラメータを受け取ることができます。これをPropと呼びます。
    </p>
    <h2>Magic Project</h2>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({})
export default class LearnIndex extends Vue {

}
</script>

<style scoped lang="scss">
.learnIndex {
  font-family: tbchibirgothicplusk-pro, sans-serif;
  font-style: normal;
  color: #898989;
  padding: 50px;
}
</style>
