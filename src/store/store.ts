import Vue from 'vue'
import Vuex from 'vuex'
import { IBlockState } from '@/store/Modules/Blocks'
Vue.use(Vuex)

export interface State {
  blocks: IBlockState
}
export default new Vuex.Store<State>({})
