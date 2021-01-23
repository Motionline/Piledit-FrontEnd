<template>
  <div class="openProject">
    <h1>プロジェクトを開く</h1>
    <div class="openProject__projectsList">
      <v-card
          class="mx-auto"
          tile
          v-if="existProject"
      >
        <v-list-item two-line v-for="(project, uuid) in projects" :key="uuid">
          <v-list-item-content>
            <v-list-item-title>
              <a @click="openProject(uuid)">{{ project.name }}</a>
            </v-list-item-title>
            <v-list-item-subtitle>最終更新: {{ formatTime(project.updatedAt) }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-card>
      <div v-else>
        <p>作成されたプロジェクトはありません。</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { projectsModule } from '@/store/store'
import moment from 'moment'

@Component({})
export default class OpenProject extends Vue {
  get projects () {
    return projectsModule.projects
  }

  get existProject () {
    return Object.keys(this.projects).length !== 0
  }

  public openProject (uuid: string) {
    projectsModule.openProject({ uuid })
  }

  public formatTime (time: moment.Moment) {
    if (!time) return
    return time.format('YYYY年MM月DD日 HH:mm')
  }
}
</script>

<style scoped lang="scss">
.openProject {
  font-family: tbchibirgothicplusk-pro, sans-serif;
  font-style: normal;
  color: #898989;
  padding: 50px;

  &__projectsList {
    padding-top: 40px;
  }
}
</style>
