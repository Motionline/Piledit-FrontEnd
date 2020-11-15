<template>
  <v-app id="app" class="ma-0 pa-0">
    <v-row class="flex-nowrap ma-0 pa-0">
      <v-col cols="2" id="applicationTab" class="ma-0 pa-0">
        <application-tab />
      </v-col>
      <v-col cols="12" class="ma-0 pa-0">
        <router-view />
      </v-col>
    </v-row>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { remote } from 'electron'
import { tabsModule, clipsModule, componentsModule } from '@/store/store'
import ApplicationTab from '@/components/Organisms/ApplicationTab.vue'
const Menu = remote.Menu

@Component({
  components: {
    ApplicationTab
  }
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
                click: () => { this.addTab('componentsEditor') }
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

  public addTab (name: string) {
    const context = {
      name
    }
    tabsModule.add(context)
  }

  public encode () {
    const data = {
      clips: clipsModule.clips,
      components: componentsModule.components
    }
    console.log(data)
  }
}
</script>

<style>
  #applicationTab {
    border-right: 2px black solid;
  }
</style>
