import Vue from 'vue'
import {
  blocksModule,
  clipsModule,
  componentsModule,
  projectsModule,
  pStoresModule,
  tabsModule
} from '@/store/store'
import { remote } from 'electron'
import fs from 'fs'
import { PComponent } from '@/@types/piledit'
import axios from 'axios'
const Menu = remote.Menu

export class MenuMixin extends Vue {
  static viewLabel: Electron.MenuItemConstructorOptions = {
    label: 'View',
    submenu: [
      {
        label: 'About'
      }
    ]
  }

  static fileLabel: Electron.MenuItemConstructorOptions = {
    label: 'File',
    submenu: [
      {
        label: 'Save',
        accelerator: 'CmdOrCtrl+S',
        click: async () => { await MenuMixin.save() }
      }
    ]
  }

  static editLabel: Electron.MenuItemConstructorOptions = {
    label: 'Edit',
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
  }

  static movieLabel: Electron.MenuItemConstructorOptions = {
    label: 'Movie',
    submenu: [
      {
        label: 'Encode',
        accelerator: 'CmdOrCtrl+E',
        click: async () => { await MenuMixin.encode() }
      }
    ]
  }

  static componentsLabel: Electron.MenuItemConstructorOptions = {
    label: 'Components',
    submenu: [
      {
        label: 'Publish',
        click: async () => { await MenuMixin.publishComponent() }
      }
    ]
  }

  static windowsLabel: Electron.MenuItemConstructorOptions = {
    label: 'Window',
    submenu: [
      {
        label: 'General Tabs',
        submenu: [
          {
            label: 'TimeLine'
          },
          {
            label: 'Piledit Store'
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
            enabled: !MenuMixin.canOpenComponentsEditorTab(),
            click: () => { MenuMixin.addComponentsEditorTab() }
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
  }

  static getHome () {
    const templateMenu: Electron.MenuItemConstructorOptions[] = [
      this.viewLabel,
      this.fileLabel,
      this.editLabel
    ]
    return Menu.buildFromTemplate(templateMenu)
  }

  static async save () {
    const projectUuid = projectsModule.currentViewingProjectUuid
    const project = projectsModule.projects[projectUuid]
    const components = await componentsModule.getFilteredComponents({ projectUuid })
    const blocks = await blocksModule.getFilteredBlocks({ projectUuid })
    const clips = await clipsModule.getFilteredClips({ projectUuid })
    const saveData = {
      ...project,
      components: {
        ...components
      },
      blocks: {
        ...blocks
      },
      clips: {
        ...clips
      }
    }
    MenuMixin.writeFile(`${project.name}.json`, saveData)
  }

  static writeFile (path: string, data: any) {
    const jsonStr = JSON.stringify(data, null, 2)
    fs.writeFile(path, jsonStr, (err) => {
      if (!err) {
        console.log('success to save!')
      }
    })
  }

  static async publishComponent () {
    const componentUuid = componentsModule.publishComponentUuid
    const component = componentsModule.components[componentUuid]
    const processedComponent: PComponent = {
      ...component,
      projectUuid: ''
    }
    await pStoresModule.publishComponent({ component: processedComponent })
    await componentsModule.updatePublishComponentUuid({ componentUuid: '' })
  }

  static encode () {
    const data = {
      clips: clipsModule.clips,
      components: componentsModule.components
    }
    axios.post('http://localhost:5000/encode', data)
    console.log(JSON.stringify(data, undefined, 2))
    console.log(data)
  }

  static async canOpenComponentsEditorTab () {
    return await tabsModule.canOpenComponentsEditorTab()
  }

  static async addComponentsEditorTab () {
    if (await this.canOpenComponentsEditorTab()) {
      const url = await tabsModule.addComponentsEditorTab()
      // this.$router.push(url)
    }
  }
}
