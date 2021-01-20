<template>
  <div id="Home">
    <div class="Home__wrapper">
      <v-snackbar
          v-model="snackbar"
          shaped
      >
        ログアウトしました
        <template v-slot:action="{ attrs }">
          <v-btn
              color="white"
              text
              v-bind="attrs"
              @click="snackbar = false"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
      <img src="../assets/piledit.png" alt="piledit-logo" width="395px" />
      <h2>Simple, Componentable, Expandable</h2>
      <p v-if="isLoggedIn">ようこそ、{{ email }}さん！</p>
      <div class="Home__wrapper--links">
        <v-row>
          <div>
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
              <h3>アカウント</h3>
              <div v-if="isLoggedIn">
                <a @click="logout">ログアウト</a>
              </div>
              <div v-else>
                <div>
                  <a @click="toRegister">アカウントを作成する</a>
                </div>
                <div>
                  <a @click="toLogin">ログイン</a>
                </div>
              </div>
            </div>
            <div class="Home__wrapper--links--group">
              <h3>Pileditについて学ぶ</h3>
            </div>
            <div class="Home__wrapper--links--group">
              <h3>ヘルプ</h3>
            </div>
          </div>
          <div>
            <div class="Home__wrapper--links--group">
              <h3>ストア</h3>
              <div>
                <a @click="toStore">ストア</a>
              </div>
            </div>
          </div>
        </v-row>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { tabsModule, sessionsModule } from '@/store/store'
import { PTabHistoryKind } from '@/@types/piledit'
import { Auth } from '@/firebase/auth'

@Component({})
export default class Home extends Vue {
  get isLoggedIn () {
    return sessionsModule.loggedIn
  }

  get email () {
    return sessionsModule.email
  }

  public snackbar = false

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

  toStore () {
    const uuid = tabsModule.currentViewingTabUuid
    const url = `/${uuid}/store`
    this.$router.push(url)
    tabsModule.addPage({
      kind: PTabHistoryKind.General,
      projectUuid: '',
      title: 'プロジェクトを作成する',
      url
    })
  }

  toLogin () {
    const uuid = tabsModule.currentViewingTabUuid
    const url = `/${uuid}/login`
    this.$router.push(url)
    tabsModule.addPage({
      kind: PTabHistoryKind.General,
      projectUuid: '',
      title: 'ログインする',
      url
    })
  }

  toRegister () {
    const uuid = tabsModule.currentViewingTabUuid
    const url = `/${uuid}/users/new`
    this.$router.push(url)
    tabsModule.addPage({
      kind: PTabHistoryKind.General,
      projectUuid: '',
      title: 'アカウントを作成する',
      url
    })
  }

  logout () {
    Auth.signOut().then(() => {
      Auth.onAuthStateChanged(() => {
        const homePath = `/${tabsModule.currentViewingTabUuid}`
        if (this.$router.currentRoute.path !== homePath) {
          this.$router.push(homePath)
          tabsModule.addPage({
            kind: PTabHistoryKind.General,
            projectUuid: '',
            title: '新しいタブ',
            url: homePath
          })
        }
        this.snackbar = true
      })
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

  .Home__wrapper {
    width: 50%;
    &--links {
      margin-top: 40px;

      &--group {
        margin-top: 20px;
      }
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
