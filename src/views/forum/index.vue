<template>
  <div class="forumIndex">
    <h1>フォーラム</h1>
    <v-divider />
    <v-form class="forumIndex__form">
      <v-text-field v-model="title" outlined label="タイトル" color="#898989"></v-text-field>
      <v-textarea v-model="content" label="内容" outlined color="#898989"></v-textarea>
      <v-btn outlined color="#898989" @click="publishTopic">投稿する</v-btn>
    </v-form>
    <v-card>
      <v-list>
        <v-list-item v-for="(topic, uuid) in topics" :key="uuid">
          <v-list-item-content>
            <v-list-item-title>{{ topic.title }}</v-list-item-title>
            <v-spacer />
            <v-divider />
            <v-spacer />
            <v-list-item-subtitle>{{ topic.content }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { topicsModule } from '@/store/store'

@Component({})
export default class ForumIndex extends Vue {
  public title = ''
  public content = ''

  get topics () {
    return topicsModule.topics
  }

  public async publishTopic () {
    await topicsModule.add({ title: this.title, content: this.content })
    this.title = ''
    this.content = ''
  }
}
</script>

<style scoped lang="scss">
.forumIndex {
  font-family: tbchibirgothicplusk-pro, sans-serif;
  font-style: normal;
  color: #898989;
  padding: 50px;

  &__form {
    padding: 40px 0;
  }
}
</style>
