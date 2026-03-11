import { createRouter, createWebHistory } from 'vue-router'
import pb from './pb.js' // Import koneksi PocketBase untuk cek status login

import Dashboard from './components/Dashboard.vue'
import ManajemenArsip from './components/ManajemenArsip.vue'
import Kategori from './components/Kategori.vue'
import DetailKategori from './components/DetailKategori.vue'
import Disposisi from './components/Disposisi.vue'
import TongSampah from './components/TongSampah.vue'
// import ChatAI from './components/ChatAI.vue'
import AdminKategori from './components/AdminKategori.vue'
import ManajemenUser from './components/ManajemenUser.vue'
import Login from './components/Login.vue'
import Statistik from './components/Statistik.vue'

const routes = [
  // --- HALAMAN UMUM (Semua yang sudah login bisa akses) ---
  { path: '/', name: 'Dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/manajemen-arsip', name: 'ManajemenArsip', component: ManajemenArsip, meta: { requiresAuth: true } },
  { path: '/kategori', name: 'Kategori', component: Kategori, meta: { requiresAuth: true } },
  { path: '/kategori/:slug', name: 'DetailKategori', component: DetailKategori, meta: { requiresAuth: true } },
  { path: '/disposisi', name: 'Disposisi', component: Disposisi, meta: { requiresAuth: true } },
  { path: '/tongsampah', name: 'TongSampah', component: TongSampah, meta: { requiresAuth: true } },
  // { path: '/gemini', name: 'ChatAi', component: ChatAI, meta: { requiresAuth: true } },
  
  { 
    path: '/admin-kategori', 
    name: 'AdminKategori', 
    component: AdminKategori, 
    meta: { requiresAuth: true, requiresAdmin: true } 
  },
  { 
    path: '/pengguna', 
    name: 'ManajemenUser', 
    component: ManajemenUser, 
    meta: { requiresAuth: true, requiresAdmin: true } 
  },

  {
    path: '/statistik',
    name: 'Statistik',
    component: Statistik,
    meta: { requiresAuth: true } 
  },

  // --- HALAMAN LOGIN (Hanya untuk yang belum login) ---
  { 
    path: '/login', 
    name: 'Login', 
    component: Login,
    meta: { requiresGuest: true }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// LOGIKA PENJAGA PINTU (ROUTE GUARD)
router.beforeEach((to, from, next) => {
  // Cek validitas token login langsung dari PocketBase
  const isLoggedIn = pb.authStore.isValid
  
  // Cek jabatan/role dari LocalStorage
  const userRole = localStorage.getItem('user_role')

  // Aturan 1: Jika halaman butuh login, TAPI user belum login
  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/login') // Tendang ke halaman login
  } 
  
  // Aturan 2: Jika halaman khusus tamu (Login), TAPI user sudah login
  else if (to.meta.requiresGuest && isLoggedIn) {
    next('/') // Arahkan kembali ke Dashboard
  } 
  
  // Aturan 3: Jika halaman butuh akses Admin, TAPI yang login bukan Petugas Arsip/Arsiparis
  else if (to.meta.requiresAdmin && userRole !== 'Petugas Arsip' && userRole !== 'Arsiparis') {
    alert('Akses Ditolak! Anda tidak memiliki izin untuk melihat halaman ini.')
    next('/') // Kembalikan ke Dashboard
  } 
  
  // Aturan 4: BLOKIR KEPALA SEKOLAH KE TONG SAMPAH
  else if (to.path === '/tongsampah' && userRole === 'Kepala Sekolah') {
    alert('Akses Ditolak! Anda tidak memiliki izin untuk melihat halaman ini.')
    next('/') // Tendang kembali ke Dashboard
  }

  // Jika semua pengecekan lolos, izinkan masuk ke halaman yang dituju
  else {
    next()
  }
})

export default router