<template>
  <div class="flex flex-col gap-6 pb-8">
    
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">Kategori Arsip</h1>
        <p class="text-slate-500 text-sm mt-1">Jelajahi dan temukan dokumen berdasarkan kelompok kategorinya.</p>
      </div>
      
      <div class="relative w-full md:w-80 shrink-0">
        <i class="fa-solid fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"></i>
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Cari kategori..." 
          class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition-all"
        >
      </div>
    </div>

    <div v-if="isLoading" class="flex flex-col items-center justify-center py-12">
      <i class="fa-solid fa-circle-notch fa-spin text-4xl text-blue-500 mb-4"></i>
      <p class="text-slate-500 font-medium">Sinkronisasi data kategori...</p>
    </div>

    <div v-else>
      <div v-if="filteredSystem.length === 0 && filteredCustom.length === 0" class="bg-white p-12 rounded-xl shadow-sm border border-slate-200 text-center flex flex-col items-center justify-center mt-4">
        <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
          <i class="fa-solid fa-folder-open text-3xl text-slate-300"></i>
        </div>
        <h3 class="text-lg font-bold text-slate-700 mb-1">Kategori Tidak Ditemukan</h3>
        <p class="text-slate-500 text-sm">Tidak ada kategori yang cocok dengan kata kunci "{{ searchQuery }}".</p>
        <button @click="searchQuery = ''" class="mt-4 text-blue-600 hover:text-blue-800 text-sm font-semibold">
          Reset Pencarian
        </button>
      </div>

      <div v-if="filteredSystem.length > 0" class="mt-2">
        <div class="flex items-center gap-2 mb-4 px-1">
          <i class="fa-solid fa-layer-group text-blue-500 text-lg"></i>
          <h2 class="text-lg font-bold text-slate-700">Kategori Sistem</h2>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div 
            v-for="kat in filteredSystem" 
            :key="kat.id"
            @click="goToDetail(kat)"
            class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-300 transition-all group cursor-pointer flex flex-col h-full"
          >
            <div class="flex justify-between items-start mb-4">
              <div :class="getDesign(kat.nama, true).bgClass" class="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300">
                <i :class="[getDesign(kat.nama, true).icon, getDesign(kat.nama, true).textClass, 'text-xl']"></i>
              </div>
              <span class="bg-slate-50 text-slate-500 px-3 py-1 rounded-full text-xs font-bold border border-slate-100 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                {{ kat.count || 0 }} Dokumen
              </span>
            </div>
            <div class="flex-1">
              <h3 class="font-bold text-slate-800 text-lg mb-1 group-hover:text-blue-600 transition-colors">{{ kat.nama }}</h3>
              <p class="text-slate-500 text-sm leading-relaxed line-clamp-2">{{ kat.deskripsi }}</p>
            </div>
            <div class="mt-6 pt-4 border-t border-slate-100 flex items-center text-sm font-semibold text-slate-400 group-hover:text-blue-600 transition-colors">
              Lihat Arsip <i class="fa-solid fa-arrow-right ml-2 transform group-hover:translate-x-1 transition-transform"></i>
            </div>
          </div>
        </div>
      </div>

      <hr v-if="filteredSystem.length > 0 && filteredCustom.length > 0" class="border-slate-200 my-8 border-dashed">

      <div v-if="filteredCustom.length > 0" class="mt-2">
        <div class="flex justify-between items-center mb-4 px-1">
          <div class="flex items-center gap-2">
            <i class="fa-solid fa-folder-tree text-emerald-500 text-lg"></i>
            <h2 class="text-lg font-bold text-slate-700">Kategori Kustom</h2>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div 
            v-for="kat in filteredCustom" 
            :key="kat.id"
            @click="goToDetail(kat)"
            class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-emerald-300 transition-all group cursor-pointer flex flex-col h-full relative overflow-hidden"
          >
            <div class="flex justify-between items-start mb-4">
              <div class="bg-slate-100 w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300">
                <i class="fa-solid fa-folder-open text-slate-600 text-xl"></i>
              </div>
              <span class="bg-slate-50 text-slate-500 px-3 py-1 rounded-full text-xs font-bold border border-slate-100 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                {{ kat.count || 0 }} Dokumen
              </span>
            </div>
            <div class="flex-1">
              <h3 class="font-bold text-slate-800 text-lg mb-1 group-hover:text-emerald-600 transition-colors">{{ kat.nama }}</h3>
              <p class="text-slate-500 text-sm leading-relaxed line-clamp-2">{{ kat.deskripsi || 'Tidak ada deskripsi' }}</p>
            </div>
            <div class="mt-6 pt-4 border-t border-slate-100 flex items-center text-sm font-semibold text-slate-400 group-hover:text-emerald-600 transition-colors">
              Lihat Arsip <i class="fa-solid fa-arrow-right ml-2 transform group-hover:translate-x-1 transition-transform"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import pb from '../pb.js'

const router = useRouter()
const searchQuery = ref('')
const isLoading = ref(true)

const userRole = ref(localStorage.getItem('user_role') || 'Staff')
const userBidang = ref(localStorage.getItem('user_bidang') || 'Tata Usaha')

const allCategories = ref([])

const getDesign = (nama, isSystem) => {
  const t = nama.toLowerCase()
  if (isSystem) {
    if (t.includes('masuk')) return { icon: 'fa-solid fa-inbox', bgClass: 'bg-blue-50', textClass: 'text-blue-600' }
    if (t.includes('keluar')) return { icon: 'fa-solid fa-paper-plane', bgClass: 'bg-green-50', textClass: 'text-green-600' }
    if (t.includes('keputusan') || t.includes('sk')) return { icon: 'fa-solid fa-file-signature', bgClass: 'bg-purple-50', textClass: 'text-purple-600' }
    if (t.includes('perintah')) return { icon: 'fa-solid fa-briefcase', bgClass: 'bg-orange-50', textClass: 'text-orange-600' }
    if (t.includes('keuangan') || t.includes('nota')) return { icon: 'fa-solid fa-money-bill-wave', bgClass: 'bg-emerald-50', textClass: 'text-emerald-600' }
    if (t.includes('edaran')) return { icon: 'fa-solid fa-bullhorn', bgClass: 'bg-red-50', textClass: 'text-red-600' }
    if (t.includes('acara')) return { icon: 'fa-solid fa-handshake', bgClass: 'bg-indigo-50', textClass: 'text-indigo-600' }

    return { icon: 'fa-solid fa-folder', bgClass: 'bg-slate-100', textClass: 'text-slate-600' }
  }
}

const fetchAllData = async () => {
  isLoading.value = true
  try {
    const katRecords = await pb.collection('kategori').getFullList({
      sort: '-is_system,created'
    })

    let filterArsip = 'is_deleted != true'
    
    if (userRole.value !== 'Arsiparis' && userRole.value !== 'Kepala Sekolah' && userRole.value !== 'Petugas Arsip') {
      filterArsip += ` && bidang = "${userBidang.value}"`
    }

    const arsipRecords = await pb.collection('arsip').getFullList({
      filter: filterArsip,
      fields: 'id,kategori_id'
    })

    allCategories.value = katRecords.map(kat => {
      const totalDocs = arsipRecords.filter(arsip => arsip.kategori_id === kat.id).length
      return {
        ...kat,
        count: totalDocs
      }
    })

  } catch (error) {
    console.error("Gagal sinkronisasi data:", error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchAllData()
})

const goToDetail = (kat) => {
  router.push(`/kategori/${kat.id}`)
}

const filteredSystem = computed(() => {
  let sys = allCategories.value.filter(k => k.is_system)
  if (!searchQuery.value) return sys
  
  const q = searchQuery.value.toLowerCase()
  return sys.filter(k => k.nama.toLowerCase().includes(q) || (k.deskripsi && k.deskripsi.toLowerCase().includes(q)))
})

const filteredCustom = computed(() => {
  let cust = allCategories.value.filter(k => !k.is_system)
  if (!searchQuery.value) return cust
  
  const q = searchQuery.value.toLowerCase()
  return cust.filter(k => k.nama.toLowerCase().includes(q) || (k.deskripsi && k.deskripsi.toLowerCase().includes(q)))
})
</script>