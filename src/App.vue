<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { remote } from 'electron'
import { tabsModule } from '@/store/Modules/Tabs'
const Menu = remote.Menu

@Component
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
}
</script>
