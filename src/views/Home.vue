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
      <p v-if="isLoggedIn">{{ greeting }}</p>
      <div class="Home__wrapper--links">
        <v-row>
          <div class="Home__wrapper--links--row">
            <div class="Home__wrapper--links--row--group">
              <h3>スタート</h3>
              <div>
                <a @click="toNewProject">新規プロジェクト</a>
              </div>
              <div>
                <a @click="toOpenProject">プロジェクトを開く</a>
              </div>
              <div>
                <a @click="toMagicOpenProject">Magic Projectにアクセスする</a>
              </div>
            </div>
            <div class="Home__wrapper--links--row--group">
              <h3>Pileditについて学ぶ</h3>
            </div>
            <div class="Home__wrapper--links--row--group">
              <h3>ヘルプ</h3>
            </div>
          </div>
          <div class="Home__wrapper--links--row">
            <div class="Home__wrapper--links--row--group">
              <h3>ストア</h3>
              <div>
                <a @click="toStore">ストア</a>
              </div>
              <div>
                <span>ダウンロードの管理</span>
              </div>
            </div>
            <div class="Home__wrapper--links--row--group">
              <h3>アカウント</h3>
              <div v-if="isLoggedIn">
                <div>
                  <a @click="toUserEdit">ユーザーを編集する</a>
                </div>
                <div>
                  <a @click="logout">ログアウト</a>
                </div>
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
            <div class="Home__wrapper--links--row--group">
              <h3>フォーラム</h3>
              <div>
                <a @click="toForumIndex">フォーラム</a>
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
import { tabsModule, sessionsModule, usersModule } from '@/store/store'
import { PTabHistoryKind } from '@/@types/piledit'
import { Auth } from '@/firebase/auth'
import { MenuMixin } from '@/mixin/menu'

@Component({})
export default class Home extends Vue {
  public mounted () {
    MenuMixin.updateMenuHome()
  }

  get isLoggedIn () {
    return sessionsModule.loggedIn
  }

  get name () {
    return usersModule.name
  }

  get email () {
    return usersModule.email
  }

  get greeting () {
    if (this.name === '') {
      return 'Pileditへようこそ！'
    } else {
      return `ようこそ、${this.name}さん！`
    }
  }

  public snackbar = false

  toNewProject () {
    const uuid = tabsModule.currentViewingTabUuid
    const url = `/${uuid}/projects/new`
    tabsModule.routerPush({ url })
    tabsModule.addPage({
      kind: PTabHistoryKind.General,
      projectUuid: '',
      title: 'プロジェクトを作成する',
      url
    })
  }

  toMagicOpenProject () {
    const uuid = tabsModule.currentViewingTabUuid
    const url = `/${uuid}/projects/magicNew`
    tabsModule.routerPush({ url })
    tabsModule.addPage({
      kind: PTabHistoryKind.General,
      projectUuid: '',
      title: 'Magic Projectにアクセスする',
      url
    })
  }

  toOpenProject () {
    const uuid = tabsModule.currentViewingTabUuid
    const url = `/${uuid}/projects/open`
    tabsModule.routerPush({ url })
    tabsModule.addPage({
      kind: PTabHistoryKind.General,
      projectUuid: '',
      title: 'プロジェクトを開く',
      url
    })
  }

  toStore () {
    const uuid = tabsModule.currentViewingTabUuid
    const url = `/${uuid}/store`
    tabsModule.routerPush({ url })
    tabsModule.addPage({
      kind: PTabHistoryKind.General,
      projectUuid: '',
      title: 'Piledit Store',
      url
    })
  }

  toForumIndex () {
    const uuid = tabsModule.currentViewingTabUuid
    const url = `/${uuid}/forum`
    tabsModule.routerPush({ url })
    tabsModule.addPage({
      kind: PTabHistoryKind.General,
      projectUuid: '',
      title: 'Piledit Forum',
      url
    })
  }

  toLogin () {
    const uuid = tabsModule.currentViewingTabUuid
    const url = `/${uuid}/login`
    tabsModule.routerPush({ url })
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
    tabsModule.routerPush({ url })
    tabsModule.addPage({
      kind: PTabHistoryKind.General,
      projectUuid: '',
      title: 'アカウントを作成する',
      url
    })
  }

  toUserEdit () {
    const uuid = tabsModule.currentViewingTabUuid
    const url = `/${uuid}/users/edit`
    tabsModule.routerPush({ url })
    tabsModule.addPage({
      kind: PTabHistoryKind.General,
      projectUuid: '',
      title: 'ユーザーを編集する',
      url
    })
  }

  logout () {
    Auth.signOut().then(() => {
      Auth.onAuthStateChanged(() => {
        const homePath = `/${tabsModule.currentViewingTabUuid}`
        if (this.$router.currentRoute.path !== homePath) {
          tabsModule.routerPush({ url: homePath })
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

      &--row {
        padding: 0 20px;
        &--group {
          margin-top: 20px;
        }
      }
    }
  }

  h2, h3, p {
    font-family: tbchibirgothicplusk-pro, sans-serif;

    font-weight: bold;

    font-style: normal;
  }

  a, span {
    font-family: tbchibirgothicplusk-pro, sans-serif;

    font-weight: normal;

    font-style: normal;
  }
}
</style>
