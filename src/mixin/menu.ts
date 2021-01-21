import Vue from 'vue'
import router from '@/router'
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
  static menu: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'View',
      submenu: [
        {
          id: 'About',
          label: 'About Piledit',
          click: async () => { await MenuMixin.about() }
        }
      ]
    },
    {
      label: 'File',
      submenu: [
        {
          id: 'save',
          label: 'Save',
          accelerator: 'CmdOrCtrl+S',
          click: async () => { await MenuMixin.save() }
        }
      ]
    },
    {
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
    },
    {
      label: 'Movie',
      submenu: [
        {
          id: 'encode',
          label: 'Encode',
          accelerator: 'CmdOrCtrl+E',
          click: async () => { await MenuMixin.encode() }
        }
      ]
    },
    {
      label: 'Components',
      submenu: [
        {
          id: 'componentPublish',
          label: 'Publish',
          click: async () => { await MenuMixin.publishComponent() }
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
              id: 'openTimeline',
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
              click: async () => { await MenuMixin.addComponentsEditorTab() }
            },
            {
              id: 'openScriptingEditor',
              label: 'Scripting Editor',
              accelerator: 'CmdOrCtrl+Option+S',
              enabled: false
            },
            {
              id: 'openPluginEditor',
              label: 'Plugin Editor',
              accelerator: 'CmdOrCtrl+Option+P',
              enabled: false
            }
          ]
        }
      ]
    }
  ]

  static getMenu () {
    return Menu.buildFromTemplate(MenuMixin.menu)
  }

  static updateMenuHome () {
    const menu = Menu.getApplicationMenu()
    if (menu) {
      menu.getMenuItemById('save').enabled = false
      menu.getMenuItemById('openComponentsEditor').enabled = false
      menu.getMenuItemById('componentPublish').enabled = false
      menu.getMenuItemById('openScriptingEditor').enabled = false
      menu.getMenuItemById('openPluginEditor').enabled = false
      menu.getMenuItemById('encode').enabled = false
    }
  }

  static updateTimeline () {
    const menu = Menu.getApplicationMenu()
    if (menu) {
      menu.getMenuItemById('save').enabled = true
      menu.getMenuItemById('openComponentsEditor').enabled = true
      menu.getMenuItemById('openScriptingEditor').enabled = false
      menu.getMenuItemById('openPluginEditor').enabled = false
      menu.getMenuItemById('componentPublish').enabled = false
      menu.getMenuItemById('encode').enabled = true
    }
  }

  static updateComponentEditor () {
    const menu = Menu.getApplicationMenu()
    if (menu) {
      menu.getMenuItemById('save').enabled = true
      menu.getMenuItemById('openComponentsEditor').enabled = true
      menu.getMenuItemById('openScriptingEditor').enabled = false
      menu.getMenuItemById('openPluginEditor').enabled = false
      menu.getMenuItemById('componentPublish').enabled = true
      menu.getMenuItemById('encode').enabled = true
    }
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
    // await componentsModule.updatePublishComponentUuid({ componentUuid: '' })
    const dialog = remote.dialog
    const currentWindow = remote.getCurrentWindow()
    await dialog.showMessageBox(currentWindow, {
      type: 'info',
      title: '完了',
      message: 'Piledit Storeで公開しました',
      detail: `あなたのコンポーネント、 ${component.name || component.defaultName} (ID: ${component.uuid}は、Piledit Storeに公開されました。)`
      // TODO: 外部コンポーネントをコピーして上書きしますか？
    })
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

  static async addComponentsEditorTab () {
    const url = await tabsModule.addComponentsEditorTab()
    await router.push(url)
  }

  static async about () {
    const url = await tabsModule.addAboutTab()
    await router.push(url)
  }
}
