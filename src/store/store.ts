import Vue from 'vue'
import Vuex from 'vuex'
import { BlocksStateIF } from '@/store/Modules/Blocks'
import { BlockComponentsStateIF } from '@/store/Modules/Components'
import { TimeLineStateIF } from '@/store/Modules/Timeline'
import { TabStateIF } from '@/store/Modules/Tabs'

Vue.use(Vuex)

export interface State {
  blocks: BlocksStateIF;
  components: BlockComponentsStateIF;
  timeline: TimeLineStateIF;
  tabs: TabStateIF;
}
export default new Vuex.Store<State>({})
