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
import { VuexMixin } from '@/mixin/vuex'

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

  @Action({ rawError: true })
  public add (componentUniqueKey: string) {
    const componentObjectUniqueKey = VuexMixin.generateUuid()
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

  @Action({ rawError: true })
  public updatePosition (componentObject: ComponentObject) {
    this.updateComponentObjectPosition(componentObject)
  }

  @Action({ rawError: true })
  public updateWidth (componentObject: ComponentObject) {
    this.updateComponentObjectWidth(componentObject)
  }
}

export const timelineModule = getModule(TimeLine)
