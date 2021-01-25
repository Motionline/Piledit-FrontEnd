import Vue from 'vue'
import {
  blocksModule,
  clipsModule,
  componentsModule,
  magicProjectsModule,
  projectsModule,
  pStoresModule, signaturesModule,
  tabsModule,
  templatesModule
} from '@/store/store'
import { remote } from 'electron'
import fs from 'fs'
import pathModule from 'path'
import { PComponent } from '@/@types/piledit'
import mkdirp from 'mkdirp'
import moment from 'moment'
import axios from 'axios'
import { VuexMixin } from '@/mixin/vuex'
axios.defaults.baseURL = 'http://localhost:5000/api'
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
      paste: 'Paste',
      movie: 'Movie',
      publishMagicProject: 'Publish Magic Project',
      components: 'Components',
      signature: 'Give Electric Signature'
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
      paste: 'ペースト',
      movie: '動画',
      publishMagicProject: 'Magic Projectとして公開する',
      components: 'コンポーネント',
      signature: '電子署名を与える'
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
      label: MenuMixin.i18nDict[MenuMixin.language].movie,
      submenu: [
        {
          id: 'encode',
          label: 'Encode',
          accelerator: 'CmdOrCtrl+E',
          click: async () => { await MenuMixin.encode() }
        },
        {
          label: MenuMixin.i18nDict[MenuMixin.language].publishMagicProject,
          accelerator: 'CmdOrCtrl+Option+M',
          click: async () => { await MenuMixin.publishMagicProject() }
        }
      ]
    },
    {
      label: MenuMixin.i18nDict[MenuMixin.language].components,
      submenu: [
        {
          id: 'componentPublish',
          label: 'Publish',
          click: async () => { await MenuMixin.publishComponent() }
        },
        {
          id: 'componentsSignature',
          label: MenuMixin.i18nDict[MenuMixin.language].signature,
          accelerator: 'CmdOrCtrl+Option+E',
          click: async () => { await MenuMixin.giveComponentSignature() }
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
    const project = Object.assign({}, projectsModule.projects[projectUuid])
    project.updatedAt = moment()
    projectsModule.updateProject(project)
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
    MenuMixin.writeFile(`/projects/${project.name}.json`, saveData)
  }

  static writeFile (path: string, data: any) {
    const jsonStr = JSON.stringify(data, null, 2)
    const getDirName = pathModule.dirname
    const appDirPath = remote.app.getAppPath() + getDirName(path)
    const appPath = remote.app.getAppPath() + path
    mkdirp(appDirPath)
    fs.writeFile(appPath, jsonStr, (err) => {
      if (!err) {
        console.log('success to save!')
      }
    })
  }

  static async giveComponentSignature () {
    const componentUuid = componentsModule.publishComponentUuid
    const component = componentsModule.components[componentUuid]
    if (fs.existsSync(remote.app.getAppPath() + '/.key')) {
      fs.readFile(remote.app.getAppPath() + '/.key', 'utf-8', async (err, data) => {
        if (err) throw err
        const key = data
        const jwt = await signaturesModule.giveComponentSignature({ key, payload: component })
        fs.writeFile(remote.app.getAppPath() + `/signatures/${component.name}.jwt`, jwt, (err) => {
          if (!err) {
            console.log('success to save!')
          }
        })
      })
    } else {
      const key = VuexMixin.generateUuid()
      fs.writeFile(remote.app.getAppPath() + '/.key', key, async (err) => {
        if (!err) {
          console.log('success to save!')
        }
      })
      const jwt = await signaturesModule.giveComponentSignature({ key, payload: component })
      fs.writeFile(remote.app.getAppPath() + `/signatures/${component.name}.jwt`, jwt, (err) => {
        if (!err) {
          console.log('success to save!')
        }
      })
    }
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

  static async publishMagicProject () {
    await magicProjectsModule.publishMagicProject()
    await magicProjectsModule.updateMagicProjectDialog({ condition: true })
  }

  static async encode () {
    const projectUuid = projectsModule.currentViewingProjectUuid
    const project = Object.assign({}, projectsModule.projects[projectUuid])
    project.updatedAt = moment()
    projectsModule.updateProject(project)
    const components = await componentsModule.getFilteredComponents({ projectUuid })
    const blocks = await blocksModule.getFilteredBlocks({ projectUuid })
    const clips = await clipsModule.getFilteredClips({ projectUuid })
    const data = {
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
    const debugData = {
      name: 'main2',
      uuid: '40925085-0bf0-4809-b38b-5f24915b4f5e'
    }
    await axios.post('/Project', debugData).then(function (response) {
      // 送信成功時の処理
      console.log(response)
    })
    await axios.post('/Timeline', data).then(function (response) {
      // 送信成功時の処理
      console.log(response)
    })
    const outputDebug = { uuid: '40925085-0bf0-4809-b38b-5f24915b4f5e', extention: '.mp4', fourCC: 'mp4s' }
    await axios.post('/Output', outputDebug).then(function (response) {
      // 送信成功時の処理
      console.log(response)
    })
  }

  static async addComponentsEditorTab () {
    const url = await tabsModule.addComponentsEditorTab()
    tabsModule.routerPush({ url })
  }

  static async addTemplate () {
    templatesModule.updateShowNewTemplateDialog({ condition: true })
  }

  static async about () {
    const url = await tabsModule.addAboutTab()
    tabsModule.routerPush({ url })
  }
}
