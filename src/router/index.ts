import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  { path: '/preferences' }, // アプリの設定
  { path: '/users/:userId' }, // ユーザー表示
  { path: '/users/settings' }, // ユーザー編集
  { path: '/:tabUuid/login', name: 'UserLogin', component: () => import('../views/sessions/new.vue') },
  { path: '/:tabUuid/users/new', name: 'UserRegister', component: () => import('../views/users/new.vue') },
  { path: '/:tabUuid/users/edit', name: 'UserEdit', component: () => import('../views/users/edit.vue') },
  { path: '/:tabUuid/store', name: 'PileditStore', component: () => import('../views/PileditStore.vue') },
  { path: '/:tabUuid/projects/new', name: 'NewProject', component: () => import('../views/NewProject.vue') },
  { path: '/:tabUuid/projects/:projectUuid/components/:componentUuid', name: 'ComponentsEdit', component: () => import('../views/ComponentsEdit.vue') },
  { path: '/:tabUuid/projects/:projectUuid', name: 'TimeLine', component: () => import('../views/TimeLine.vue') },
  { path: '/:tabUuid', name: 'Home', component: () => import('../views/Home.vue') }
]

const router = new VueRouter({
  mode: 'hash',
  routes
})

export default router
