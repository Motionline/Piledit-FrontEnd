import Vue from 'vue'
import Vuex from 'vuex'
import { IBlockState } from '@/store/Modules/Blocks'
import { ComponentsStateIF } from '@/store/Modules/Components'
import { TimeLineStateIF } from '@/store/Modules/Timeline'

Vue.use(Vuex)

export interface State {
  blocks: IBlockState;
  components: ComponentsStateIF;
  timeline: TimeLineStateIF;
}
export default new Vuex.Store<State>({})
