<template>
  <v-app id="app" class="ma-0 pa-0">
    <application-tab />
    <router-view />
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { remote } from 'electron'
import { clipsModule, componentsModule, tabsModule, projectsModule, blocksModule } from '@/store/store'
import ApplicationTab from '@/components/Organisms/ApplicationTab.vue'
import axios from 'axios'
import { PBlocks, PComponents } from '@/@types/piledit'

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
          },
          {
            label: 'Save',
            accelerator: 'CmdOrCtrl+S',
            click: () => { this.save() }
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
                id: 'openComponentsEditor',
                label: 'Components Editor',
                accelerator: 'CmdOrCtrl+Option+C',
                enabled: !this.canOpenComponentsEditorTab(),
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

  async updated () {
    const menu = Menu.getApplicationMenu()
    if (menu) {
      const item = menu.getMenuItemById('openComponentsEditor')
      item.enabled = await this.canOpenComponentsEditorTab()
    }
  }

  public async canOpenComponentsEditorTab () {
    return await tabsModule.canOpenComponentsEditorTab()
  }

  public async addComponentsEditorTab () {
    if (await this.canOpenComponentsEditorTab()) {
      const url = await tabsModule.addComponentsEditorTab()
      this.$router.push(url)
    }
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

  public save () {
    console.log('saved!')
    const projectUuid = projectsModule.currentViewingProjectUuid
    const project = projectsModule.projects[projectUuid]
    const filteredComponents = this.filteredComponents(componentsModule.components, projectUuid)
    console.log(project)
    console.log(filteredComponents)
    const filteredBlocks = this.filteredBlocks(blocksModule.blocks, projectUuid)
    console.log(filteredBlocks)
  }

  public filteredComponents (components: PComponents, projectUuid: string): PComponents {
    const filtered: PComponents = {}
    for (const [key, value] of Object.entries(components)) {
      if (value.projectUuid === projectUuid) {
        filtered[key] = value
      }
    }
    return filtered
  }

  public filteredBlocks (blocks: PBlocks, projectUuid: string): PBlocks {
    const filtered: PBlocks = {}
    for (const [key, value] of Object.entries(blocks)) {
      if (value.projectUuid === projectUuid) {
        filtered[key] = value
      }
    }
    return filtered
  }
}
</script>

<style lang="scss">
html {
  visibility: hidden;
}
html.wf-active {
  visibility: visible;
}
</style>
