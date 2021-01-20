import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import firebase from 'firebase'
import store from '@/store/store'

export interface SessionStateIF {
  loggedIn: boolean;
  email: string;
}

@Module({ store: store, name: 'SessionsModule', namespaced: true })
export default class Sessions extends VuexModule implements SessionStateIF {
  loggedIn = false
  email = ''

  @Mutation
  public setLogInState (loggedIn: boolean) {
    this.loggedIn = loggedIn
  }

  @Mutation
  public setEmail (email: string) {
    this.email = email
  }

  @Action({ rawError: true })
  public async updateLogInState ({ user }: { user: firebase.User | null }) {
    this.setLogInState(user != null)
    if (user != null && user.email != null) {
      this.setEmail(user.email)
    }
    console.log(user)
    return user != null
  }
}
