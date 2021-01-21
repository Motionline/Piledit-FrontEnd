import Vue from 'vue'
import { blocksModule, clipsModule, componentsModule, projectsModule } from '@/store/store'
import { remote } from 'electron'
import fs from 'fs'
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
}
