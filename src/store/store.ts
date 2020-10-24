import Vue from 'vue'
import Vuex from 'vuex'
import { IBlockState } from '@/store/Modules/Blocks'
import { IComponentsState } from '@/store/Modules/Components'
import { ITimeLineState } from '@/store/Modules/Timeline'

Vue.use(Vuex)

export interface State {
  blocks: IBlockState,
  components: IComponentsState,
  timeline: ITimeLineState
}
export default new Vuex.Store<State>({})
