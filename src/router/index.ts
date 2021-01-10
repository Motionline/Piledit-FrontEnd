import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import TimeLine from '@/views/TimeLine.vue'
import ComponentsEdit from '@/views/ComponentsEdit.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  { path: '/', name: 'Home', component: () => import('../views/Home.vue') },
  { path: '/preferences' }, // アプリの設定
  { path: '/users/:userId' }, // ユーザー表示
  { path: '/users/settings' }, // ユーザー編集
  { path: '/newProject', name: 'NewProject', component: () => import('../views/NewProject.vue') },
  { path: '/timeline/:projectUuid', name: 'TimeLine', component: () => import('../views/TimeLine.vue') },
  { path: '/components_edit/:projectUuid/:tabUuid', name: 'ComponentsEdit', component: () => import('../views/ComponentsEdit.vue') }
]

const router = new VueRouter({
  routes
})

export default router
