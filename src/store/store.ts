import Vue from 'vue'
import Vuex from 'vuex'
import { BlockStateIF } from '@/store/Modules/Blocks'
import { BlockComponentsStateIF } from '@/store/Modules/BlockComponents'
import { TimeLineStateIF } from '@/store/Modules/Timeline'

Vue.use(Vuex)

export interface State {
  blocks: BlockStateIF;
  components: BlockComponentsStateIF;
  timeline: TimeLineStateIF;
}
export default new Vuex.Store<State>({})
