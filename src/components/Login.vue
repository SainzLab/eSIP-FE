<template>
  <div class="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans">
    
    <div class="bg-white w-full max-w-5xl rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] flex overflow-hidden relative z-10">
      
      <div class="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 p-12 flex-col justify-between relative overflow-hidden group">
        <div class="absolute top-[-20%] left-[-10%] w-96 h-96 bg-blue-400/20 rounded-full blur-3xl transition-transform duration-700 group-hover:scale-110"></div>
        <div class="absolute bottom-[-10%] right-[-10%] w-72 h-72 bg-indigo-400/30 rounded-full blur-3xl transition-transform duration-700 group-hover:-translate-y-10"></div>
        <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')] opacity-30"></div>

        <div class="relative z-10">
          <!-- <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md text-white mb-6 border border-white/20 shadow-xl">
            <i class="fa-solid fa-box-archive text-3xl"></i>
          </div> -->
          <h1 class="text-4xl font-black text-white tracking-tight mb-4 leading-tight">
            Sistem Informasi<br>Pengelolaan Arsip
          </h1>
          <p class="text-blue-100/80 text-lg font-medium max-w-sm">
            Platform digitalisasi dan manajemen arsip terpadu untuk efisiensi administrasi sekolah.
          </p>
        </div>

        <div class="relative z-10">
          <div class="flex items-center gap-4 bg-white/10 backdrop-blur-sm border border-white/10 p-4 rounded-2xl w-fit">
            <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold text-xl shadow-inner">
              <i class="fa-solid fa-school"></i>
            </div>
            <div>
              <h3 class="text-white font-bold text-sm">SMPN 1 Pabuaran</h3>
              <p class="text-blue-200 text-xs">Subang, Jawa Barat</p>
            </div>
          </div>
        </div>
      </div>

      <div class="w-full md:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-white">
        
        <div class="md:hidden text-center mb-8">
          <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200 mb-4">
            <i class="fa-solid fa-box-archive text-2xl"></i>
          </div>
          <h2 class="text-2xl font-black text-slate-800 tracking-tight">eSIP SMPN 1 Pabuaran</h2>
          <p class="text-sm text-slate-500 mt-2 font-medium">Sistem Informasi Pengelolaan Arsip</p>
        </div>

        <div class="hidden md:block mb-8">
          <h2 class="text-3xl font-black text-slate-800 tracking-tight">Selamat Datang</h2>
          <p class="text-sm text-slate-500 mt-2 font-medium">Silakan masuk menggunakan akun Anda.</p>
        </div>

        <div v-if="errorMessage" class="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
          <i class="fa-solid fa-circle-exclamation text-red-500 mt-0.5"></i>
          <p class="text-sm text-red-600 font-medium">{{ errorMessage }}</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          
          <div>
            <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Email / Username</label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                <i class="fa-solid fa-user"></i>
              </div>
              <input 
                v-model="email" 
                type="text" 
                class="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-700 font-medium placeholder:font-normal" 
                placeholder="Masukkan email Anda"
                required
              >
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Password</label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                <i class="fa-solid fa-lock"></i>
              </div>
              <input 
                v-model="password" 
                :type="showPassword ? 'text' : 'password'" 
                class="block w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-700 font-medium placeholder:font-normal" 
                placeholder="••••••••"
                required
              >
              <button 
                type="button" 
                @click="showPassword = !showPassword" 
                class="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-blue-600 focus:outline-none transition-colors"
              >
                <i :class="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between mt-2">
            <label class="flex items-center gap-2 cursor-pointer group">
              <div class="relative flex items-center">
                <input type="checkbox" class="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer transition-all">
              </div>
              <span class="text-sm font-medium text-slate-500 group-hover:text-slate-800 transition-colors">Ingat Saya</span>
            </label>
            <button 
              type="button" 
              @click="showForgotModal = true" 
              class="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
            >
              Lupa Password?
            </button>
          </div>

          <div class="pt-4">
            <button 
              type="submit" 
              :disabled="isLoading"
              class="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-600/20 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 hover:shadow-blue-600/40 hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-blue-600/20"
            >
              <i v-if="isLoading" class="fa-solid fa-circle-notch fa-spin"></i>
              <span>{{ isLoading ? 'Memeriksa Data...' : 'Masuk ke Sistem' }}</span>
              <i v-if="!isLoading" class="fa-solid fa-arrow-right-to-bracket ml-1"></i>
            </button>
          </div>
        </form>
        
        <div class="mt-auto pt-10 text-center">
          <p class="text-xs font-medium text-slate-400">
            &copy;2026 SMP NEGERI 1 Pabuaran.<br class="sm:hidden"> Support By <span class="text-slate-600 font-bold"><br>Capstone Project Unsub</span>.
          </p>
        </div>

      </div>
    </div>

    <Transition name="fade">
      <div v-if="showForgotModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" @click="showForgotModal = false"></div>
        
        <div class="relative bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden p-8 text-center transform transition-all animate-in fade-in zoom-in-95 duration-200">
          <div class="w-20 h-20 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl border-[6px] border-amber-100/50">
            <i class="fa-solid fa-shield-halved"></i>
          </div>
          
          <h3 class="font-black text-slate-800 text-xl mb-3">Lupa Password?</h3>
          <p class="text-slate-500 text-sm mb-8 leading-relaxed">
            Sistem keamanan kami mencegah reset password secara mandiri. Silakan hubungi <b class="text-slate-700">Petugas Arsip (Arsiparis)</b> atau Administrator untuk mereset akun Anda.
          </p>
          
          <button @click="showForgotModal = false" class="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors focus:ring-4 focus:ring-slate-200">
            Saya Mengerti
          </button>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import pb from '../pb.js' 

const router = useRouter()
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

const showForgotModal = ref(false)

const handleLogin = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const authData = await pb.collection('users').authWithPassword(email.value, password.value)

    localStorage.setItem('user_role', authData.record.role)
    localStorage.setItem('user_bidang', authData.record.bidang)
    localStorage.setItem('user_name', authData.record.name)

    router.push('/') 
    
  } catch (error) {
    errorMessage.value = 'Email atau password yang Anda masukkan salah.'
    console.error("Login Error:", error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>