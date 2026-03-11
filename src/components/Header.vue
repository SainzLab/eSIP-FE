<template>
  <header class="h-16 bg-white flex items-center justify-between px-4 sm:px-6 border-b border-slate-200 z-10 w-full shrink-0 relative">
    
    <div class="text-slate-500 text-sm font-medium pl-8 sm:pl-6 hidden sm:block truncate">
      SMP NEGERI 1 PABUARAN
    </div>
    
    <div class="flex items-center gap-2 sm:gap-4 ml-auto">
      
      <div class="h-6 w-px bg-slate-200 mx-1"></div>
      
      <div class="relative">
        <div @click="isProfileOpen = !isProfileOpen" class="flex items-center gap-3 cursor-pointer group pl-2">
          <img :src="currentUser.avatar" alt="Profile" class="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-slate-100 object-cover group-hover:border-blue-200 transition-colors">
          <div class="hidden sm:flex items-center gap-2 text-sm font-semibold text-slate-600 group-hover:text-blue-600 transition-colors">
            {{ currentUser.name }} 
            <i :class="isProfileOpen ? 'fa-chevron-up' : 'fa-chevron-down'" class="fa-solid text-[10px] text-slate-400 transition-all"></i>
          </div>
        </div>

        <div v-if="isProfileOpen" @click="isProfileOpen = false" class="fixed inset-0 z-40"></div>

        <div v-if="isProfileOpen" class="absolute right-0 mt-4 w-64 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200 origin-top-right">
          
          <div class="px-5 py-3 border-b border-slate-100">
            <p class="text-sm font-bold text-slate-800 truncate">{{ currentUser.name }}</p>
            <p class="text-xs text-slate-500 truncate">{{ currentUser.email }}</p>
          </div>
          
          <div class="px-5 py-3 border-b border-slate-100 space-y-3">
            <div>
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Peran</p>
              <span class="inline-block bg-purple-100 text-purple-700 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-tight">
                {{ currentUser.role }}
              </span>
            </div>
            <div>
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Bidang / Bagian</p>
              <span class="inline-block text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md">
                {{ currentUser.bidang }}
              </span>
            </div>
          </div>
          
          <div class="p-2">
            <button @click="handleLogout" class="w-full text-left px-3 py-2 text-sm text-red-600 font-bold hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2">
              <i class="fa-solid fa-right-from-bracket"></i> Keluar Sistem
            </button>
          </div>
        </div>
      </div>

    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import pb from '../pb.js'

const router = useRouter()
const isProfileOpen = ref(false)

const currentUser = ref({
  name: 'Memuat...',
  email: '',
  role: '',
  bidang: '',
  avatar: 'https://ui-avatars.com/api/?name=User&background=eff6ff&color=2563eb'
})

onMounted(() => {
  if (pb.authStore.isValid && pb.authStore.model) {
    const user = pb.authStore.model
    
    let avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=eff6ff&color=2563eb`
    
    if (user.avatar) {
      avatarUrl = `${pb.baseUrl}/api/files/${user.collectionId}/${user.id}/${user.avatar}`
    }

    currentUser.value = {
      name: user.name || user.username,
      email: user.email,
      role: user.role || 'Staff',
      bidang: user.bidang || '-',
      avatar: avatarUrl
    }
  }
})

const handleLogout = () => {
  isProfileOpen.value = false
  
  pb.authStore.clear()
  
  localStorage.removeItem('user_role')
  localStorage.removeItem('user_bidang')
  localStorage.removeItem('user_name')
  
  router.push('/login')
}
</script>