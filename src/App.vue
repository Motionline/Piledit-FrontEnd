<template>
  <v-app id="app" class="ma-0 pa-0">
    <application-tab />
    <router-view />
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { remote } from 'electron'
import { clipsModule, componentsModule, projectsModule, tabsModule } from '@/store/store'
import ApplicationTab from '@/components/Organisms/ApplicationTab.vue'
import axios from 'axios'
import { PTabHistoryKind } from '@/@types/piledit'

const Menu = remote.Menu

@Component({
  components: { ApplicationTab }
})
export default class App extends Vue {
  mounted () {
    const templateMenu: Electron.MenuItemConstructorOptions[] = [
      {
        label: 'View',
        submenu: [
          {
            label: 'Reload',
            accelerator: 'CmdOrCtrl+R',
            click: function (item, focusedWindow) {
              if (focusedWindow) { focusedWindow.reload() }
            }
          },
          {
            label: 'Copy',
            accelerator: 'CmdOrCtrl+C',
            role: 'copy'
          },
          {
            label: 'Paste',
            accelerator: 'CmdOrCtrl+V',
            role: 'paste'
          }
        ]
      },
      {
        label: 'Movie',
        submenu: [
          {
            label: 'Encode',
            accelerator: 'CmdOrCtrl+E',
            click: () => { this.encode() }
          }
        ]
      },
      {
        label: 'Window',
        submenu: [
          {
            label: 'General Tabs',
            submenu: [
              {
                label: 'TimeLine Window'
              },
              {
                label: 'Store Window'
              }
            ]
          },
          {
            label: 'Editor Tabs',
            submenu: [
              {
                label: 'Components Editor',
                accelerator: 'CmdOrCtrl+Option+C',
                click: () => { this.addComponentsEditorTab() }
              },
              {
                label: 'Scripting Editor',
                accelerator: 'CmdOrCtrl+Option+S'
              },
              {
                label: 'Plugin Editor',
                accelerator: 'CmdOrCtrl+Option+P'
              }
            ]
          }
        ]
      },
      {
        label: 'none'
      }
    ]
    const menu = Menu.buildFromTemplate(templateMenu)
    Menu.setApplicationMenu(menu)
  }

  public addComponentsEditorTab () {
    const tabUuid = tabsModule.currentViewingTabUuid
    const projectUuid = projectsModule.currentViewingProjectUuid
    const projectName = projectsModule.projects[projectUuid].name
    const url = `/${tabUuid}/projects/${projectUuid}/components_edit`
    tabsModule.add({ kind: PTabHistoryKind.Projects, title: `${projectName}のコンポーネントエディタ`, url })
  }

  public encode () {
    const data = {
      clips: clipsModule.clips,
      components: componentsModule.components
    }
    axios.post('http://localhost:5000/encode', data)
    console.log(JSON.stringify(data, undefined, 2))
    console.log(data)
  }
}
</script>

<style>
</style>
