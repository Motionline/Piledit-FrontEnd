import Vue from 'vue'
import Vuex from 'vuex'
import Blocks from '@/store/Modules/Blocks'
import Components from '@/store/Modules/Components'
import Clips from '@/store/Modules/Clips'
import Tabs from '@/store/Modules/Tabs'
import Projects from '@/store/Modules/Projects'
import MagicProjects from '@/store/Modules/MagicProjects'
import Sessions from '@/store/Modules/Sessions'
import Users from '@/store/Modules/Users'
import PStores from '@/store/Modules/PStores'
import Templates from '@/store/Modules/Templates'
import Topics from '@/store/Modules/Topics'
import Comments from '@/store/Modules/Comments'
import Signatures from '@/store/Modules/Signatures'
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
    TemplatesModule: Templates,
    MagicProjectsModule: MagicProjects,
    TopicsModule: Topics,
    CommentsModule: Comments,
    SignaturesModule: Signatures
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
export const magicProjectsModule = getModule(MagicProjects, store)
export const topicsModule = getModule(Topics, store)
export const commentsModule = getModule(Comments, store)
export const signaturesModule = getModule(Signatures, store)
