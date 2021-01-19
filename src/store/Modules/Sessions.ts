import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
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
  public updateLogInState ({ loggedIn }: { loggedIn: boolean }) {
    this.setLogInState(loggedIn)
  }
}
