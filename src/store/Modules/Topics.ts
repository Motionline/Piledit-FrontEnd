import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import store from '@/store/store'
import firebase from 'firebase'
import { DB } from '@/firebase/db'
import { PTopics } from '@/@types/piledit'

export interface TopicStateIF {
  topics: PTopics;
}

@Module({ store: store, name: 'TopicsModule', namespaced: true })
export default class Topics extends VuexModule implements TopicStateIF {
  topics: PTopics = {}
}
