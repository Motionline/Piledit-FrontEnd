import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import store, { usersModule } from '@/store/store'
import firebase from 'firebase'
import { DB } from '@/firebase/db'
import { PTopic, PTopics } from '@/@types/piledit'
import { VuexMixin } from '@/mixin/vuex'
import { Vue } from 'vue-property-decorator'

export interface TopicStateIF {
  topics: PTopics;
}

@Module({ store: store, name: 'TopicsModule', namespaced: true })
export default class Topics extends VuexModule implements TopicStateIF {
  topics: PTopics = {}

  @Mutation
  public addTopic ({ topic }: { topic: PTopic }) {
    Vue.set(this.topics, topic.uuid, topic)
  }

  @Action({ rawError: true })
  public async add ({ title, content }: { title: string; content: string }) {
    const uuid = VuexMixin.generateUuid()
    const topicRef = DB.collection('topics').doc(uuid)
    const topic = new PTopic({
      uuid,
      title,
      content,
      userUuid: usersModule.email
    })
    await topicRef.set({
      ...topic,
      updateAt: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true })
    this.addTopic({ topic })
  }
}
