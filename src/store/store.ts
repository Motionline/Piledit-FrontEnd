import Vue from 'vue'
import Vuex from 'vuex'
import { BlockStateIF } from '@/store/Modules/Blocks'
import { BlockComponentsStateIF } from '@/store/Modules/BlockComponents'
import { TimeLineStateIF } from '@/store/Modules/Timeline'
import { TabStateIF } from '@/store/Modules/Tabs'

Vue.use(Vuex)

export interface State {
  blocks: BlockStateIF;
  components: BlockComponentsStateIF;
  timeline: TimeLineStateIF;
  tabs: TabStateIF;
}
export default new Vuex.Store<State>({})
