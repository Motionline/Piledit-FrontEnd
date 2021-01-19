import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import firebase from 'firebase'
import store from '@/store/store'

export interface SessionStateIF {
  loggedIn: boolean;
}

@Module({ store: store, name: 'SessionsModule', namespaced: true })
export default class Sessions extends VuexModule implements SessionStateIF {
  loggedIn = false

  @Mutation
  public setLogInState (loggedIn: boolean) {
    this.loggedIn = loggedIn
  }

  @Action({ rawError: true })
  public async updateLogInState ({ user }: { user: firebase.User | null }) {
    this.setLogInState(user != null)
    return user != null
  }
}
