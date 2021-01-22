import Vue from 'vue'
import router from '@/router'
import {
  blocksModule,
  clipsModule,
  componentsModule,
  projectsModule,
  pStoresModule,
  tabsModule,
  templatesModule
} from '@/store/store'
import { remote } from 'electron'
import fs from 'fs'
import { PComponent } from '@/@types/piledit'
import axios from 'axios'
const Menu = remote.Menu
const dialog = remote.dialog

export class MenuMixin extends Vue {
  static language = 'ja'
  static i18nDict: { [key: string]: { [key: string]: string }} = {
    en: {
      aboutPiledit: 'About Piledit',
      checkForUpdates: 'Check for Updates',
      preference: 'Preference',
      quit: 'Quit Piledit',
      file: 'File',
      newProject: 'New Project',
      newTab: 'New Tab',
      newComponent: 'New Component',
      newTemplate: 'New Template',
      save: 'Save',
      edit: 'Edit',
      reload: 'Reload',
      copy: 'Copy',
      paste: 'Paste'
    },
    ja: {
      aboutPiledit: 'Piledit について',
      checkForUpdates: 'アップデートを確認する',
      preference: '環境設定',
      quit: 'Piledit を終了する',
      file: 'ファイル',
      newProject: '新規プロジェクト',
      newTab: '新しいタブ',
      newComponent: '新しいコンポーネント',
      newTemplate: '新規テンプレート',
      save: '保存する',
      edit: '編集する',
      reload: '再読み込み',
      copy: 'コピー',
      paste: 'ペースト'
    }
  }

  static menu: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'View',
      submenu: [
        {
          id: 'about',
          label: MenuMixin.i18nDict[MenuMixin.language].aboutPiledit,
          click: async () => { await MenuMixin.about() }
        },
        {
          id: 'checkForUpdates',
          label: MenuMixin.i18nDict[MenuMixin.language].checkForUpdates,
          enabled: false
        },
        { type: 'separator' },
        {
          id: 'preference',
          label: MenuMixin.i18nDict[MenuMixin.language].preference,
          accelerator: 'CmdOrCtrl+,'
        },
        { type: 'separator' },
        {
          id: 'quit',
          label: MenuMixin.i18nDict[MenuMixin.language].quit,
          accelerator: 'CmdOrCtrl+Q'
        }
      ]
    },
    {
      label: MenuMixin.i18nDict[MenuMixin.language].file,
      submenu: [
        {
          id: 'newTab',
          label: MenuMixin.i18nDict[MenuMixin.language].newTab,
          accelerator: 'CmdOrCtrl+T'
        },
        {
          id: 'newProject',
          label: MenuMixin.i18nDict[MenuMixin.language].newProject,
          accelerator: 'CmdOrCtrl+Option+P'
        },
        {
          id: 'newComponent',
          label: MenuMixin.i18nDict[MenuMixin.language].newComponent,
          accelerator: 'CmdOrCtrl+Option+C',
          click: async () => { await MenuMixin.addComponentsEditorTab() }
        },
        {
          id: 'newTemplate',
          label: MenuMixin.i18nDict[MenuMixin.language].newTemplate,
          accelerator: 'CmdOrCtrl+Option+T',
          click: async () => { await MenuMixin.addTemplate() }
        },
        { type: 'separator' },
        {
          id: 'save',
          label: MenuMixin.i18nDict[MenuMixin.language].save,
          accelerator: 'CmdOrCtrl+S',
          click: async () => { await MenuMixin.save() }
        }
      ]
    },
    {
      label: MenuMixin.i18nDict[MenuMixin.language].edit,
      submenu: [
        {
          label: MenuMixin.i18nDict[MenuMixin.language].reload,
          accelerator: 'CmdOrCtrl+R',
          click: function (item, focusedWindow) {
            if (focusedWindow) { focusedWindow.reload() }
          }
        },
        {
          label: MenuMixin.i18nDict[MenuMixin.language].copy,
          accelerator: 'CmdOrCtrl+C',
          role: 'copy'
        },
        {
          label: MenuMixin.i18nDict[MenuMixin.language].paste,
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
        },
        {
          id: 'addTemplate',
          label: 'Add Template'
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
      menu.getMenuItemById('newComponent').enabled = false
      menu.getMenuItemById('newTemplate').enabled = false
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
      menu.getMenuItemById('newComponent').enabled = true
      menu.getMenuItemById('newTemplate').enabled = true
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
      menu.getMenuItemById('newComponent').enabled = true
      menu.getMenuItemById('newTemplate').enabled = false
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

  static async addTemplate () {
    templatesModule.updateShowNewTemplateDialog({ condition: true })
  }

  static async about () {
    const url = await tabsModule.addAboutTab()
    await router.push(url)
  }
}
