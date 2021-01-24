import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import store from '@/store/store'
import firebase from 'firebase'
import { DB } from '@/firebase/db'
import { PComments } from '@/@types/piledit'

export interface CommentStateIF {
  comments: PComments;
}

@Module({ store: store, name: 'CommentsModule', namespaced: true })
export default class Comments extends VuexModule implements CommentStateIF {
  comments: PComments = {}
}
