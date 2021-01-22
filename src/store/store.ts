import Vue from 'vue'
import Vuex from 'vuex'
import Blocks from '@/store/Modules/Blocks'
import Components from '@/store/Modules/Components'
import Clips from '@/store/Modules/Clips'
import Tabs from '@/store/Modules/Tabs'
import Projects from '@/store/Modules/Projects'
import Sessions from '@/store/Modules/Sessions'
import Users from '@/store/Modules/Users'
import PStores from '@/store/Modules/PStores'
import Templates from '@/store/Modules/Templates'
import { getModule } from 'vuex-module-decorators'
import VuexPersistence from 'vuex-persist'

Vue.use(Vuex)

const vuexLocal = new VuexPersistence({
  storage: window.localStorage
})

const store = new Vuex.Store({
  modules: {
    BlocksModule: Blocks,
    ComponentsModule: Components,
    ClipsModule: Clips,
    TabsModule: Tabs,
    ProjectsModule: Projects,
    SessionsModule: Sessions,
    UsersModule: Users,
    PStoresModule: PStores,
    TemplatesModule: Templates
  },
  plugins: [vuexLocal.plugin]
})

export default store
export const blocksModule = getModule(Blocks, store)
export const componentsModule = getModule(Components, store)
export const clipsModule = getModule(Clips, store)
export const tabsModule = getModule(Tabs, store)
export const projectsModule = getModule(Projects, store)
export const sessionsModule = getModule(Sessions, store)
export const usersModule = getModule(Users, store)
export const pStoresModule = getModule(PStores, store)
export const templatesModule = getModule(Templates, store)
