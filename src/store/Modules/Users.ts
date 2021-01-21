import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import store from '@/store/store'
import firebase from 'firebase'
import { DB } from '@/firebase/db'

export interface UserStateIF {
  name: string;
}

@Module({ store: store, name: 'UsersModule', namespaced: true })
export default class Users extends VuexModule implements UserStateIF {
  name = ''
  email = ''

  @Mutation
  public setName (name: string) {
    this.name = name
  }

  @Mutation
  public setEmail (email: string) {
    this.email = email
  }

  @Action({ rawError: true })
  public updateEmail ({ email }: { email: string }) {
    this.setEmail(email)
  }

  @Action({ rawError: true })
  public async updateUserName ({ name }: { name: string }) {
    const userRef = DB.collection('users').doc(this.email)
    await userRef.set({
      name,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true })
    this.setName(name)
  }
}
