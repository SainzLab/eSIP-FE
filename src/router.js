import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from './components/Dashboard.vue'
import ManajemenArsip from './components/ManajemenArsip.vue'
import Kategori from './components/Kategori.vue'
import DetailKategori from './components/DetailKategori.vue'
import Disposisi from './components/Disposisi.vue'
import TongSampah from './components/TongSampah.vue'
import ChatAI from './components/ChatAI.vue'
import AdminKategori from './components/AdminKategori.vue'
import ManajemenUser from './components/ManajemenUser.vue'
import { compile } from 'vue'

const routes = [
  { path: '/', name: 'Dashboard', component: Dashboard },
  { path: '/manajemen-arsip', name: 'ManajemenArsip', component: ManajemenArsip },
  { path: '/kategori', name: 'Kategori', component: Kategori },
  { path: '/kategori/:slug', name: 'DetailKategori', component: DetailKategori },
  { path: '/disposisi', name: 'Disposisi', component: Disposisi },
  { path: '/tongsampah', name: 'TongSampah', component: TongSampah },
  { path: '/gemini', name: 'ChatAi', component: ChatAI},
  { path: '/admin-kategori', name: 'AdminKategori', component: AdminKategori},
  { path: '/pengguna', name: 'ManajemenUser', component: ManajemenUser}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router