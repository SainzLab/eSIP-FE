<template>
  <div v-if="showTimeoutModal" class="fixed inset-0 z-[99999] flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
    <div class="relative bg-white w-full max-w-sm rounded-3xl shadow-2xl p-8 text-center animate-in fade-in zoom-in-95 duration-300">
      <div class="w-20 h-20 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl border-4 border-amber-100">
        <i class="fa-solid fa-clock-rotate-left"></i>
      </div>
      <h3 class="font-black text-slate-800 text-2xl mb-2">Sesi Berakhir</h3>
      <p class="text-slate-500 text-sm mb-8 leading-relaxed">
        Sistem logout otomatis karena tidak mendeteksi adanya aktivitas selama <b>2 menit</b> terakhir demi keamanan data.
      </p>
      <button @click="closeTimeoutModal" class="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2">
        <i class="fa-solid fa-right-to-bracket"></i> Login Kembali
      </button>
    </div>
  </div>

  <div class="md:hidden fixed inset-0 z-[9999] bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
    <div class="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 w-full max-w-sm">
      <div class="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-5 text-2xl">
        <i class="fa-solid fa-desktop"></i>
      </div>
      
      <h2 class="text-xl font-bold text-slate-800 mb-2">Resolusi Tidak Didukung</h2>
      <p class="text-slate-500 text-sm mb-8 leading-relaxed">
        Sistem eSip ini dirancang khusus untuk layar besar agar pengelolaan data lebih maksimal. Mohon akses menggunakan <b>Tablet</b> atau <b>Desktop</b>.
      </p>
      
      <div class="flex items-center justify-center gap-5 text-slate-400">
        <div class="relative">
          <i class="fa-solid fa-mobile-screen text-2xl text-slate-300"></i>
          <i class="fa-solid fa-ban absolute -bottom-1 -right-2 text-red-500 text-lg bg-white rounded-full"></i>
        </div>
        <i class="fa-solid fa-arrow-right text-sm"></i>
        <i class="fa-solid fa-tablet-screen-button text-2xl text-blue-600"></i>
        <i class="fa-solid fa-laptop text-2xl text-blue-600"></i>
      </div>
    </div>
  </div>

  <div v-if="$route.name === 'Login'" class="hidden md:block min-h-screen bg-slate-50">
    <router-view></router-view>
  </div>

  <div v-else class="hidden md:flex h-screen overflow-hidden">
    <Sidebar />

    <div class="flex-1 flex flex-col relative overflow-y-auto overflow-x-hidden bg-background">
      <Header />
      
      <main class="p-4 md:p-8">
        <router-view></router-view>
      </main>

      <OllamaWidget/>
      
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Sidebar from './components/Sidebar.vue'
import Header from './components/Header.vue'
import OllamaWidget from './components/OllamaWidget.vue'
import pb from './pb.js'

const router = useRouter()
const route = useRoute()

const showTimeoutModal = ref(false)

const TIMEOUT_DURATION = 2 * 6000 * 100000
let timeoutId = null

const autoLogout = () => {
  if (route.name !== 'Login' && pb.authStore.isValid) {
    pb.authStore.clear()
    localStorage.clear() 
    showTimeoutModal.value = true
  
    if (timeoutId) clearTimeout(timeoutId)
  }
}

const closeTimeoutModal = () => {
  showTimeoutModal.value = false
  router.push('/login')
}

const resetTimer = () => {
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
  
  if (pb.authStore.isValid && route.name !== 'Login') {
    timeoutId = setTimeout(autoLogout, TIMEOUT_DURATION)
  }
}

const setupActivityListeners = () => {
  const events = ['mousemove', 'mousedown', 'keypress', 'touchmove', 'scroll', 'click']
  
  events.forEach(event => {
    window.addEventListener(event, resetTimer)
  })
  
  resetTimer()
}

const removeActivityListeners = () => {
  const events = ['mousemove', 'mousedown', 'keypress', 'touchmove', 'scroll', 'click']
  events.forEach(event => {
    window.removeEventListener(event, resetTimer)
  })
  if (timeoutId) clearTimeout(timeoutId)
}

onMounted(() => {
  setupActivityListeners()
})

onUnmounted(() => {
  removeActivityListeners()
})
</script>