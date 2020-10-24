import {
  Module,
  VuexModule,
  Mutation,
  Action,
  getModule
} from 'vuex-module-decorators'
import { Vue } from 'vue-property-decorator'
import store from '@/store/store'
import { ComponentObject } from '@/@types/piledit'

export interface TimeLineStateIF {
  componentObjects: { [key: string]: ComponentObject };
}

@Module({ dynamic: true, store: store, name: 'Components', namespaced: true })
class TimeLine extends VuexModule implements TimeLineStateIF {
  componentObjects: { [key: string]: ComponentObject } = {}

  @Mutation
  public addComponentObject (componentObject: ComponentObject) {
    Vue.set(this.componentObjects, componentObject.componentObjectUniqueKey, componentObject)
  }

  @Mutation
  public updateComponentObjectPosition (componentObject: ComponentObject) {
    this.componentObjects[componentObject.componentObjectUniqueKey].position = componentObject.position
  }

  @Mutation
  public updateComponentObjectWidth (componentObject: ComponentObject) {
    this.componentObjects[componentObject.componentObjectUniqueKey].width = componentObject.width
  }

  @Action({})
  public add (componentUniqueKey: string) {
    const componentObjectUniqueKey = this.generateUuid()
    const componentObject: ComponentObject = {
      componentObjectUniqueKey,
      componentUniqueKey: componentUniqueKey,
      position: {
        x: 0,
        y: 1
      },
      width: 200
    }
    this.addComponentObject(componentObject)
  }

  @Action({})
  public updatePosition (componentObject: ComponentObject) {
    this.updateComponentObjectPosition(componentObject)
  }

  @Action({})
  public updateWidth (componentObject: ComponentObject) {
    this.updateComponentObjectWidth(componentObject)
  }

  public generateUuid () {
    const material = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.split('')
    for (let i = 0, len = material.length; i < len; i++) {
      if (material[i] === 'x') {
        material[i] = Math.floor(Math.random() * 16).toString(16)
      } else if (material[i] === 'y') {
        material[i] = (Math.floor(Math.random() * 4) + 8).toString(16)
      }
    }
    return material.join('')
  }
}

export const timelineModule = getModule(TimeLine)
