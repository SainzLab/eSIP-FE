<template>
  <div class="flex flex-col gap-6 pb-8">
    
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div>
        <h1 class="text-2xl font-bold text-slate-800 flex items-center gap-3">
          <i class="fa-solid fa-trash-can text-red-500"></i>
          Tong Sampah
        </h1>
        <p class="text-slate-500 text-sm mt-1">Arsip yang dihapus akan tersimpan di sini sebelum dihapus permanen.</p>
      </div>
      
      <div class="flex gap-3 w-full md:w-auto">
        <button 
          @click="confirmEmptyTrash"
          class="flex-1 md:flex-none px-4 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2"
        >
          <i class="fa-solid fa-dumpster"></i> Kosongkan Sampah
        </button>
      </div>
    </div>

    <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
      <div class="relative w-full md:w-80">
        <i class="fa-solid fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"></i>
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Cari arsip terhapus..." 
          class="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-sm transition-all"
        >
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr class="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
              <th class="py-3.5 px-4 font-semibold w-12 text-center">No</th>
              <th class="py-3.5 px-4 font-semibold">Nama Dokumen</th>
              <th class="py-3.5 px-4 font-semibold">Kategori Asal</th>
              <th class="py-3.5 px-4 font-semibold">Tgl Dihapus</th>
              <th class="py-3.5 px-4 font-semibold text-center w-40">Aksi</th>
            </tr>
          </thead>
          <tbody v-if="filteredTrash.length === 0">
            <tr>
              <td colspan="5" class="py-16 text-center">
                <div class="flex flex-col items-center justify-center text-slate-400">
                  <i class="fa-solid fa-trash-arrow-up text-5xl mb-4 opacity-20"></i>
                  <p class="text-lg font-medium">Tong sampah kosong</p>
                  <p class="text-sm">Tidak ada dokumen yang perlu dibersihkan.</p>
                </div>
              </td>
            </tr>
          </tbody>
          <tbody v-else class="text-sm divide-y divide-slate-100">
            <tr v-for="(item, index) in filteredTrash" :key="item.id" class="hover:bg-red-50/30 transition-colors group">
              <td class="py-4 px-4 text-center text-slate-500">{{ index + 1 }}</td>
              <td class="py-4 px-4">
                <div class="flex flex-col">
                  <span class="font-bold text-slate-700">{{ item.nama }}</span>
                  <span class="text-[10px] text-slate-400 uppercase tracking-wider">{{ item.noSurat }}</span>
                </div>
              </td>
              <td class="py-4 px-4">
                <span class="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-medium border border-slate-200">
                  {{ item.kategori }}
                </span>
              </td>
              <td class="py-4 px-4 text-slate-500">{{ item.deletedAt }}</td>
              <td class="py-4 px-4">
                <div class="flex items-center justify-center gap-2">
                  <button 
                    @click="restoreItem(item)"
                    class="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-lg transition-all font-semibold text-xs"
                    title="Pulihkan Dokumen"
                  >
                    <i class="fa-solid fa-rotate-left"></i> Restore
                  </button>
                  <button 
                    @click="deletePermanently(item)"
                    class="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                    title="Hapus Permanen"
                  >
                    <i class="fa-solid fa-circle-xmark"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')

const trashItems = ref([
  { id: 1, nama: 'Draft Undangan Komite', noSurat: '001/KOM/2026', kategori: 'Surat Keluar', deletedAt: '2 jam yang lalu' },
  { id: 2, nama: 'Scan KTP Guru Pensiun', noSurat: '-', kategori: 'Dokumen Guru', deletedAt: 'Kemarin, 14:20' },
  { id: 3, nama: 'Laporan Kantin Januari', noSurat: '04/KANTIN/26', kategori: 'Keuangan', deletedAt: '3 hari yang lalu' },
])

const filteredTrash = computed(() => {
  return trashItems.value.filter(item => 
    item.nama.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    item.kategori.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const restoreItem = (item) => {
  alert(`Memulihkan: ${item.nama}`)
}

const deletePermanently = (item) => {
  if(confirm('Hapus permanen? Data tidak bisa dikembalikan lagi.')) {
    trashItems.value = trashItems.value.filter(i => i.id !== item.id)
  }
}

const confirmEmptyTrash = () => {
  if(confirm('Kosongkan semua sampah? Tindakan ini tidak dapat dibatalkan.')) {
    trashItems.value = []
  }
}
</script>