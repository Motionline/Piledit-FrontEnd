import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  { path: '/preferences' }, // アプリの設定
  { path: '/:tabUuid/login', name: 'UserLogin', component: () => import('../views/sessions/new.vue') },
  { path: '/:tabUuid/users/new', name: 'UserRegister', component: () => import('../views/users/new.vue') },
  { path: '/:tabUuid/users/edit', name: 'UserEdit', component: () => import('../views/users/edit.vue') },
  { path: '/:tabUuid/store', name: 'PileditStore', component: () => import('../views/PileditStore.vue') },
  { path: '/:tabUuid/projects/new', name: 'ProjectCreate', component: () => import('../views/projects/new.vue') },
  { path: '/:tabUuid/projects/magicNew', name: 'ProjectMagicOpen', component: () => import('../views/projects/magicOpen.vue') },
  { path: '/:tabUuid/projects/open', name: 'ProjectOpen', component: () => import('../views/projects/open.vue') },
  { path: '/:tabUuid/projects/:projectUuid/components/:componentUuid', name: 'ComponentsEdit', component: () => import('../views/ComponentsEdit.vue') },
  { path: '/:tabUuid/projects/:projectUuid', name: 'TimeLine', component: () => import('../views/TimeLine.vue') },
  { path: '/:tabUuid/learn', name: 'LearnIndex', component: () => import('../views/learn/index.vue') },
  { path: '/:tabUuid/forum', name: 'ForumIndex', component: () => import('../views/forum/index.vue') },
  { path: '/:tabUuid/about', name: 'About', component: () => import('../views/About.vue') },
  { path: '/:tabUuid/help', name: 'Help', component: () => import('../views/Help.vue') },
  { path: '/:tabUuid', name: 'Home', component: () => import('../views/Home.vue') }
]

const router = new VueRouter({
  mode: 'hash',
  routes
})

export default router
