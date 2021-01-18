<template>
  <v-app id="app" class="ma-0 pa-0">
    <application-tab @save="save" />
    <router-view />
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { remote } from 'electron'
import { blocksModule, clipsModule, componentsModule, projectsModule, tabsModule } from '@/store/store'
import ApplicationTab from '@/components/Organisms/ApplicationTab.vue'
import axios from 'axios'
import { filteredByProjectUuidObject, PBlocks, PClips, PComponents } from '@/@types/piledit'
import fs from 'fs'

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
    const projectUuid = projectsModule.currentViewingProjectUuid
    const project = projectsModule.projects[projectUuid]
    const filteredComponents = this.filteredComponents(componentsModule.components, projectUuid)
    const filteredBlocks = this.filteredBlocks(blocksModule.blocks, projectUuid)
    const filteredClips = this.filteredClips(clipsModule.clips, projectUuid)
    const saveData = {
      ...project,
      components: {
        ...filteredComponents
      },
      blocks: {
        ...filteredBlocks
      },
      clips: {
        ...filteredClips
      }
    }
    this.writeFile(`${project.name}.json`, saveData)
  }

  public writeFile (path: string, data: any) {
    const jsonStr = JSON.stringify(data, null, 2)
    fs.writeFile(path, jsonStr, (err) => {
      if (!err) {
        console.log('success to save!')
      }
    })
  }

  public filteredPileditObject (objects: filteredByProjectUuidObject, projectUuid: string): filteredByProjectUuidObject {
    const filtered: filteredByProjectUuidObject = {}
    for (const [key, value] of Object.entries(objects)) {
      if (value.projectUuid === projectUuid) {
        filtered[key] = value
      }
    }
    return filtered
  }

  public filteredComponents (components: PComponents, projectUuid: string) {
    return this.filteredPileditObject(components, projectUuid)
  }

  public filteredBlocks (blocks: PBlocks, projectUuid: string) {
    return this.filteredPileditObject(blocks, projectUuid)
  }

  public filteredClips (clips: PClips, projectUuid: string) {
    return this.filteredPileditObject(clips, projectUuid)
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
