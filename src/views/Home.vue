<template>
  <div id="Home">
    <div class="Home__wrapper">
      <img src="../assets/piledit.png" alt="piledit-logo"  width="395px" />
      <h2>Simple, Componentable, Expandable</h2>
      <div class="Home__wrapper--links">
        <div class="Home__wrapper--links--group">
          <h3>スタート</h3>
          <div>
            <a @click="toNewProject">新規プロジェクト</a>
          </div>
          <div>
            <a>プロジェクトを開く</a>
          </div>
        </div>
        <div class="Home__wrapper--links--group">
          <h3>直近のプロジェクト</h3>
        </div>
        <div class="Home__wrapper--links--group">
          <h3>アカウント設定</h3>
          <div>
            <a>アカウントを作成する</a>
          </div>
        </div>
        <div class="Home__wrapper--links--group">
          <h3>Pileditについて学ぶ</h3>
        </div>
        <div class="Home__wrapper--links--group">
          <h3>ヘルプ</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { tabsModule } from '@/store/store'
import { PTabHistoryKind } from '@/@types/piledit'

@Component({})
export default class Home extends Vue {
  toNewProject () {
    const uuid = tabsModule.currentViewingTabUuid
    const url = `/${uuid}/projects/new`
    this.$router.push(url)
    tabsModule.addPage({
      kind: PTabHistoryKind.General,
      projectUuid: '',
      title: 'プロジェクトを作成する',
      url
    })
  }
}
</script>

<style scoped lang="scss">
#Home {
  // background-color: #203744;
  color: #898989;
  height: calc(100vh - 96px);
  display: flex;
  align-items: center;
  justify-content: center;

  .Home__wrapper--links {
    margin-top: 40px;

    &--group {
      margin-top: 20px;
    }
  }

  h2, h3, p {
    font-family: tbchibirgothicplusk-pro, sans-serif;

    font-weight: bold;

    font-style: normal;
  }

  a {
    font-family: tbchibirgothicplusk-pro, sans-serif;

    font-weight: normal;

    font-style: normal;
  }
}
</style>
