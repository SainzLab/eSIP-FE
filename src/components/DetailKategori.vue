<template>
  <div class="flex flex-col gap-6 relative">
    
    <div class="flex items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <button @click="$router.push('/kategori')" class="w-10 h-10 shrink-0 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all shadow-sm">
        <i class="fa-solid fa-arrow-left"></i>
      </button>
      <div>
        <h1 class="text-2xl font-bold text-slate-800 capitalize">{{ categoryName }}</h1>
        <p class="text-slate-500 text-sm mt-1">Daftar semua dokumen yang termasuk dalam kategori ini.</p>
      </div>
    </div>

    <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-center">
      <div class="relative w-full md:w-80">
        <i class="fa-solid fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"></i>
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Cari surat di kategori ini..." 
          class="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition-shadow"
        >
      </div>
      
      <button class="text-slate-600 hover:text-blue-600 border border-slate-200 hover:border-blue-200 bg-slate-50 hover:bg-blue-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 w-full md:w-auto justify-center">
        <i class="fa-solid fa-file-export"></i> Export Excel
      </button>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr class="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
              <th class="py-3.5 px-4 font-semibold w-12 text-center">No</th>
              <th class="py-3.5 px-4 font-semibold">Nomor Surat</th>
              <th class="py-3.5 px-4 font-semibold">Perihal</th>
              <th class="py-3.5 px-4 font-semibold">Tanggal</th>
              <th class="py-3.5 px-4 font-semibold text-center">File</th>
              <th class="py-3.5 px-4 font-semibold text-center w-28">Aksi</th>
            </tr>
          </thead>
          <tbody v-if="filteredArsip.length === 0">
            <tr>
              <td colspan="6" class="py-12 text-center text-slate-400">
                <i class="fa-solid fa-folder-open text-4xl text-slate-200 mb-3 block"></i>
                Tidak ada dokumen yang ditemukan di kategori ini.
              </td>
            </tr>
          </tbody>
          <tbody v-else class="text-sm divide-y divide-slate-100">
            <tr v-for="(item, index) in filteredArsip" :key="index" class="hover:bg-slate-50 transition-colors group">
              <td class="py-3 px-4 text-center text-slate-500">{{ index + 1 }}</td>
              <td class="py-3 px-4 font-semibold text-slate-800">{{ item.noSurat }}</td>
              <td class="py-3 px-4 text-slate-600">{{ item.perihal }}</td>
              <td class="py-3 px-4 text-slate-500">{{ item.tanggal }}</td>
              <td class="py-3 px-4 text-center">
                <button class="text-slate-300 hover:text-red-500 transition-colors" title="Lihat PDF">
                  <i class="fa-solid fa-file-pdf text-xl"></i>
                </button>
              </td>
              <td class="py-3 px-4">
                <div class="flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button class="w-8 h-8 rounded text-blue-600 hover:bg-blue-100 transition-colors flex items-center justify-center" title="Edit">
                    <i class="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button class="w-8 h-8 rounded text-red-600 hover:bg-red-100 transition-colors flex items-center justify-center" title="Hapus">
                    <i class="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
        <div>Menampilkan <span class="font-medium text-slate-700">{{ filteredArsip.length > 0 ? 1 : 0 }}</span> hingga <span class="font-medium text-slate-700">{{ filteredArsip.length }}</span> dari <span class="font-medium text-slate-700">{{ arsipData.length }}</span> arsip</div>
        <div class="flex gap-1">
          <button class="px-3 py-1.5 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-400 cursor-not-allowed" disabled>Prev</button>
          <button class="px-3 py-1.5 bg-blue-600 text-white rounded-md font-medium shadow-sm">1</button>
          <button class="px-3 py-1.5 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-400 cursor-not-allowed" disabled>Next</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const searchQuery = ref('')

const categoryName = computed(() => {
  const slug = route.params.slug || ''
  return slug.split('-').join(' ')
})

const arsipData = ref([
  { noSurat: `001/${categoryName.value.toUpperCase().replace(/\s/g, '')}/II/2026`, perihal: 'Dokumen Penting 1', tanggal: '26 Feb 2026' },
  { noSurat: `002/${categoryName.value.toUpperCase().replace(/\s/g, '')}/II/2026`, perihal: 'Laporan Triwulan', tanggal: '25 Feb 2026' },
  { noSurat: `003/${categoryName.value.toUpperCase().replace(/\s/g, '')}/II/2026`, perihal: 'Undangan Rapat Internal', tanggal: '20 Feb 2026' },
])

const filteredArsip = computed(() => {
  return arsipData.value.filter(item => {
    return item.noSurat.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
           item.perihal.toLowerCase().includes(searchQuery.value.toLowerCase())
  })
})
</script>