import Vue from 'vue'
import Vuex from 'vuex'
import { BlocksStateIF } from '@/store/Modules/Blocks'
import { ComponentsStateIF } from '@/store/Modules/Components'
import { ClipsStateIF } from '@/store/Modules/Clips'
import { TabStateIF } from '@/store/Modules/Tabs'

Vue.use(Vuex)

export interface State {
  blocks: BlocksStateIF;
  components: ComponentsStateIF;
  clips: ClipsStateIF;
  tabs: TabStateIF;
}
export default new Vuex.Store<State>({})
