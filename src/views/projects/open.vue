<template>
  <div id="openProject">
    <h1>プロジェクトを開く</h1>
    <div v-if="existProject">
      <div v-for="(project, uuid) in projects" :key="uuid">
        <a @click="openProject(uuid)">{{ project.name }}</a>
      </div>
    </div>
    <div v-else>
      <p>作成されたプロジェクトはありません。</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { projectsModule } from '@/store/store'

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
}
</script>

<style scoped>
#openProject {
  font-family: tbchibirgothicplusk-pro, sans-serif;
  font-style: normal;
  color: #898989
}
</style>
