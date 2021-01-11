import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  { path: '/', name: 'Home', component: () => import('../views/Home.vue') },
  { path: '/preferences' }, // アプリの設定
  { path: '/users/:userId' }, // ユーザー表示
  { path: '/users/settings' }, // ユーザー編集
  { path: '/projects/new', name: 'NewProject', component: () => import('../views/NewProject.vue') },
  { path: '/projects/:project_uuid/components_edit/:tabUuid', name: 'ComponentsEdit', component: () => import('../views/ComponentsEdit.vue') },
  { path: '/projects/:project_uuid', name: 'TimeLine', component: () => import('../views/TimeLine.vue') }
]

const router = new VueRouter({
  mode: 'hash',
  routes
})

export default router
