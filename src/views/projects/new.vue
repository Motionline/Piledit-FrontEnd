<template>
  <div class="NewProject">
    <div class="NewProject__container">
      <h1>新しくプロジェクトを作成する</h1>
      <v-form class="NewProject__container__projectForm">
        <v-text-field v-model="name" outlined label="プロジェクト名" color="#898989" :rules="rules()"></v-text-field>
        <v-select
            v-model="selectedTemplateItem"
            :menu-props="{ bottom: true, offsetY: true }"
            outlined
            label="テンプレートから作成する"
            color="#898989"
            return-object
            :items="templatesItem"
        ></v-select>
        <v-btn @click="newProject" :disabled="canSubmit()">作成する</v-btn>
      </v-form>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { projectsModule, tabsModule, templatesModule } from '@/store/store'

@Component({})
export default class NewProject extends Vue {
  public name = ''
  public items = [
    { text: 'Only-Components-Edit（推奨）', value: 'components' },
    { text: 'Clips-Edit', value: 'clips' }
  ]

  public templatesItem = [
    { text: '選択しない', value: 'none' }
  ]

  public selectedTemplateItem = { text: '選択しない', value: 'none' }

  public rules () {
    let duplicate = false
    for (const projectUuid in this.projects) {
      const project = this.projects[projectUuid]
      if (project.name === this.name) {
        duplicate = true
        break
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return [_ => !duplicate || 'プロジェクト名が重複しています']
  }

  get templates () {
    return templatesModule.templates
  }

  get projects () {
    return projectsModule.projects
  }

  public mounted () {
    for (const uuid in this.templates) {
      this.templatesItem.push({
        text: this.templates[uuid].name,
        value: uuid
      })
    }
  }

  public async newProject () {
    if (this.selectedTemplateItem.value === 'none') {
      const url = await tabsModule.toProjectHomePage({ name: this.name })
      tabsModule.routerPush({ url })
    } else {
      const url = await tabsModule.toProjectByTemplateHomePage({ name: this.name, templateUuid: this.selectedTemplateItem.value })
      tabsModule.routerPush({ url })
    }
  }

  public canSubmit () {
    return this.name === ''
  }
}
</script>

<style lang="scss" scoped>
.NewProject {
  height: calc(100vh - 96px);
  font-family: tbchibirgothicplusk-pro, sans-serif !important;
  font-style: normal;
  padding: 50px;
  color: #898989;

  &__container {
    h1 {
      font-weight: bold;
    }

    &__projectForm {
      padding-top: 40px;
    }
  }
}
</style>
