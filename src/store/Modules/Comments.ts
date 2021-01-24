import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import store, { usersModule } from '@/store/store'
import firebase from 'firebase'
import { DB } from '@/firebase/db'
import { PComment, PComments } from '@/@types/piledit'
import { Vue } from 'vue-property-decorator'
import { VuexMixin } from '@/mixin/vuex'

export interface CommentStateIF {
  comments: PComments;
}

@Module({ store: store, name: 'CommentsModule', namespaced: true })
export default class Comments extends VuexModule implements CommentStateIF {
  comments: PComments = {}

  @Mutation
  public addComment ({ comment }: { comment: PComment }) {
    Vue.set(this.comments, comment.uuid, comment)
  }

  @Action({ rawError: true })
  public async add ({ content, topicUuid }: { content: string; topicUuid: string }) {
    const uuid = VuexMixin.generateUuid()
    const commentRef = DB.collection('comments').doc(uuid)
    const comment = new PComment({
      uuid,
      content,
      topicUuid,
      userUuid: usersModule.email
    })
    await commentRef.set({
      ...comment,
      updateAt: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true })
    this.addComment({ comment })
  }
}
