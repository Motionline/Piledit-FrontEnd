import Vue from 'vue'
import Vuex from 'vuex'
import { IBlockState } from '@/store/Modules/Blocks'
import { IComponentsState } from '@/store/Modules/Components'

Vue.use(Vuex)

export interface State {
  blocks: IBlockState,
  components: IComponentsState
}
export default new Vuex.Store<State>({})
