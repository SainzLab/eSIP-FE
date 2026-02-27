<template>
  <div 
    v-if="isOpen" 
    @click="isOpen = false" 
    class="fixed inset-0 bg-slate-900/50 z-40 md:hidden transition-opacity"
  ></div>

  <aside
    :class="[
      isOpen ? 'w-64' : 'w-0 md:w-20',
      'fixed md:relative z-50 h-screen transition-all duration-300 shrink-0'
    ]"
  >
    <div class="w-full h-full bg-white border-r border-slate-200 flex flex-col overflow-hidden">
      <div class="h-16 flex items-center px-4 border-b border-slate-200 shrink-0 whitespace-nowrap">
        <div class="font-bold text-2xl flex items-center gap-3 w-full" :class="!isOpen && 'md:justify-center'">
          <div class="bg-blue-600 text-white min-w-[32px] w-8 h-8 flex items-center justify-center rounded-lg shadow-sm">
            <i class="fa-solid fa-box-archive text-sm"></i>
          </div>
          <span v-show="isOpen" class="text-blue-600 transition-opacity duration-300">eSIP</span>
        </div>
      </div>

      <nav class="flex-1 px-3 py-6 overflow-y-auto overflow-x-hidden">
        
        <div class="space-y-1">
          <router-link
            v-for="(item, index) in mainMenu"
            :key="'main-'+index"
            :to="item.path"
            custom
            v-slot="{ href, navigate, isActive }"
          >
            <a
              :href="href"
              @click="navigate"
              :class="[
                isActive ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600',
                'flex items-center px-3 py-3 rounded-lg font-medium transition-all duration-200 group whitespace-nowrap'
              ]"
              :title="!isOpen ? item.name : ''"
            >
              <div class="flex items-center justify-center min-w-[24px]">
                <i :class="[item.icon, isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-600', 'text-lg transition-colors duration-200']"></i>
              </div>
              <span v-show="isOpen" class="ml-3 transition-opacity duration-300">{{ item.name }}</span>
            </a>
          </router-link>
        </div>

        <div class="mt-6 mb-2 border-t border-slate-100 pt-4">
          <div v-show="isOpen" class="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 transition-opacity duration-300">
            Control Admin
          </div>
        </div>

        <div class="space-y-1">
          <router-link
            v-for="(item, index) in adminMenu"
            :key="'admin-'+index"
            :to="item.path"
            custom
            v-slot="{ href, navigate, isActive }"
          >
            <a
              :href="href"
              @click="navigate"
              :class="[
                isActive ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600',
                'flex items-center px-3 py-3 rounded-lg font-medium transition-all duration-200 group whitespace-nowrap'
              ]"
              :title="!isOpen ? item.name : ''"
            >
              <div class="flex items-center justify-center min-w-[24px]">
                <i :class="[item.icon, isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-600', 'text-lg transition-colors duration-200']"></i>
              </div>
              <span v-show="isOpen" class="ml-3 transition-opacity duration-300">{{ item.name }}</span>
            </a>
          </router-link>
        </div>

      </nav>
    </div>

    <button
      @click="toggleSidebar"
      class="absolute -right-3 top-5 bg-white border border-slate-200 text-slate-400 hover:text-blue-600 rounded-full w-6 h-6 flex items-center justify-center shadow-sm z-50 transition-colors cursor-pointer"
    >
      <i class="fa-solid text-xs" :class="isOpen ? 'fa-chevron-left' : 'fa-chevron-right'"></i>
    </button>
  </aside>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isOpen = ref(true)

onMounted(() => {
  if (window.innerWidth < 768) {
    isOpen.value = false
  }
})

const toggleSidebar = () => {
  isOpen.value = !isOpen.value
}

const mainMenu = ref([
  { name: 'Dashboard', icon: 'fa-solid fa-house', path: '/' },
  { name: 'Manajemen Arsip', icon: 'fa-solid fa-folder-open', path: '/manajemen-arsip' },
  { name: 'Kategori', icon: 'fa-solid fa-layer-group', path: '/kategori' },
  { name: 'Disposisi', icon: 'fa-solid fa-share-nodes', path: '/disposisi' },
  { name: 'Tongsampah', icon: 'fa-solid fa-trash-can', path: '/tongsampah' },
  { name: 'Gemini', icon: 'fa-solid fa-wand-magic-sparkles', path: '/gemini' },
])

const adminMenu = ref([
  { name: 'Manajemen Kategori', icon: 'fa-solid fa-layer-group', path: '/admin-kategori' },
  { name: 'Manajemen Pengguna', icon: 'fa-solid fa-users-gear', path: '/pengguna' },
])
</script>