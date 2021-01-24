import { ProjectOptions } from '@vue/cli-service'

const options: ProjectOptions = {
  transpileDependencies: [
    'vuetify'
  ],
  pluginOptions: {
    electronBuilder: {
      // nodeIntegration: true
      nodeIntegration: false
    }
  }
}

export default options
